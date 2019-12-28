// import axios from 'axios'
import { ObjectId } from 'bson'
import { injectable } from 'tsyringe'
import { Group } from '../domain/group/Group'
import { ProfileClient } from '../data/clients/ProfileClient'
import { PaginatedQueryResult } from '@nindoo/mongodb-data-layer'
import { BlobStorageClient } from '../data/clients/BlobStorageClient'
import { GroupRepository } from '../data/repositories/GroupRepository'
import { CreateGroupData } from '../domain/group/structures/CreateGroupData'
import { UserNotFoundError } from '../domain/group/errors/UserNotFoundError'
import { GroupNotFoundError } from '../domain/group/errors/GroupNotFoundError'
import { FounderNotFoundError } from '../domain/group/errors/FounderNotFoundError'
import { OrganizerNotFoundError } from '../domain/group/errors/OrganizerNotFoundError'
import { GroupAlreadyExistsError } from '../domain/group/errors/GroupAlreadyExistsError'
import { InvalidDeleteError } from '../domain/group/errors/InvalidDeleteError'

enum UserTypes {
  USER,
  ORGANIZER,
  FOUNDER
}

@injectable()
export class GroupService {
  constructor (
    private readonly userClient: ProfileClient,
    private readonly repository: GroupRepository,
    private readonly blobStorageClient: BlobStorageClient
  ) { }

  async uploadBase64 (base64: string) {
    const url = await this.blobStorageClient.uploadBase64(base64, 'image/*')
    if (!url)
      throw Error() //TODO: throw better error handler
    return url
  }

  async create (creationData: CreateGroupData): Promise<Group> {
    if (await this.repository.existsByName(creationData.name)) throw new GroupAlreadyExistsError(creationData.name)

    await this.findUser(creationData.founder as string, UserTypes.FOUNDER)

    if (creationData.organizers) {
      await Promise.all(creationData.organizers.map(id => this.findUser(id as string, UserTypes.ORGANIZER)))
    }
    if (creationData.pictures && creationData.pictures.banner)
      creationData.pictures.banner = await this.uploadBase64(creationData.pictures.banner)
    if (creationData.pictures && creationData.pictures.profile)
      creationData.pictures.profile = await this.uploadBase64(creationData.pictures.profile)

    const group = Group.create(new ObjectId(), creationData)

    return this.repository.save(group)
  }

  async searchByFollowedUser (userId: string, page: number = 0, size: number = 10) {
    const user = await this.findUser(userId, UserTypes.USER)

    const communityIds = user.groups.map((groupId: string) => new ObjectId(groupId))
    return this.repository.findManyById(communityIds, page, size)
  }

  async searchByOrganizerOrFounder (userId: string, page: number = 0, size: number = 10) {
    const user = await this.findUser(userId, UserTypes.USER)
    const userObjId = new ObjectId(user.id)
    return this.repository.search({ $or: [{ founder: userObjId }, { organizers: { $in: [userObjId] } }], deletedAt: null }, page, size)
  }

  private async findUser (userId: string, userType: UserTypes) {
    const user = await this.userClient.findUserById(userId)

    if (!user) {
      switch (userType) {
        case UserTypes.USER:
          throw new UserNotFoundError(userId)
        case UserTypes.FOUNDER:
          throw new FounderNotFoundError(userId)
        case UserTypes.ORGANIZER:
          throw new OrganizerNotFoundError(userId)
      }
    }

    return user
  }

  async update (id: string, dataToUpdate: Partial<CreateGroupData>): Promise<Group> {
    const currentGroup = await this.repository.findById(id)
    if (!currentGroup) throw new GroupNotFoundError(id)

    if (dataToUpdate.pictures && dataToUpdate.pictures.banner)
      dataToUpdate.pictures.banner = await this.uploadBase64(dataToUpdate.pictures.banner)
    if (dataToUpdate.pictures && dataToUpdate.pictures.profile)
      dataToUpdate.pictures.banner = await this.uploadBase64(dataToUpdate.pictures.profile)

    const newGroup = {
      ...currentGroup,
      ...dataToUpdate
    }

    currentGroup.update(newGroup)

    return this.repository.save(currentGroup)
  }

  async delete (id: string, userId: string): Promise<void> {
    const group = await this.repository.findById(id)
    if (!group) return

    if (!group.founder.equals(userId)) throw new InvalidDeleteError()

    group.delete()
    await this.repository.save(group)
  }

  async find (idOrSlug: string): Promise<Group> {
    const group = ObjectId.isValid(idOrSlug)
      ? await this.repository.findById(idOrSlug)
      : await this.repository.findBySlug(idOrSlug)

    if (!group) throw new GroupNotFoundError(idOrSlug)
    return group
  }

  async listAll (page: number = 0, size: number = 10): Promise<PaginatedQueryResult<Group>> {
    return this.repository.getAll(page, size)
  }
}
