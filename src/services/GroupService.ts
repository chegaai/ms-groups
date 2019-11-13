// import axios from 'axios'
import { ObjectId } from 'bson'
import { injectable } from 'tsyringe'
import { PaginatedQueryResult } from '@nindoo/mongodb-data-layer'
import { GroupRepository } from '../data/repositories/GroupRepository'
import { GroupNotFoundError } from '../domain/group/errors/GroupNotFoundError'
import { GroupAlreadyExistsError } from '../domain/group/errors/GroupAlreadyExistsError'
import { CreateGroupData } from '../domain/group/structures/CreateGroupData'
import { Group } from '../domain/group/Group'
import { UserClient } from '../data/clients/UserClient'
import { BlobStorageClient } from '../data/clients/BlobStorageClient'
import { FounderNotFoundError } from '../domain/group/errors/FounderNotFoundError'
import { OrganizerNotFoundError } from '../domain/group/errors/OrganizerNotFoundError'
import { UserNotFoundError } from '../domain/group/errors/UserNotFoundError'

@injectable()
export class GroupService {
  constructor (
    private readonly userClient: UserClient,
    private readonly repository: GroupRepository,
    private readonly blobStorageClient: BlobStorageClient
  ) { }

  async create (creationData: CreateGroupData): Promise<Group> {
    if (await this.repository.existsByName(creationData.name)) throw new GroupAlreadyExistsError(creationData.name)

    await this.findFounder(creationData.founder as string)

    if (creationData.organizers) {
      await Promise.all(creationData.organizers.map(id => this.findOrganizer(id as string)))
    }
    if(creationData.pictures && creationData.pictures.banner)
      creationData.pictures.banner = await this.blobStorageClient.uploadBase64(creationData.pictures.banner)
    if(creationData.pictures && creationData.pictures.profile)
      creationData.pictures.banner = await this.blobStorageClient.uploadBase64(creationData.pictures.profile)

    const group = Group.create(new ObjectId(), creationData)

    return this.repository.save(group)
  }

  async searchByFollowedUser (userId: string, page: number = 0, size: number = 10) {
    const user = await this.findUser(userId)
    const communityIds = user.groups.map((groupId: string) => new ObjectId(groupId))
    return this.repository.findManyById(communityIds, page, size)
  }

  private async findOrganizer (organizerId: string) {
    const organizer = await this.userClient.findUserById(organizerId)
    if (!organizer) throw new OrganizerNotFoundError(organizerId)
    return organizer
  }

  private async findFounder (founderId: string) {
    const founder = await this.userClient.findUserById(founderId)
    if (!founder) throw new FounderNotFoundError(founderId)
    return founder
  }

  private async findUser (userId: string) {
    const user = await this.userClient.findUserById(userId)
    if (!user) throw new UserNotFoundError(userId)
    return user
  }

  async update (id: string, dataToUpdate: Partial<CreateGroupData>): Promise<Group> {
    const currentGroup = await this.repository.findById(id)
    if (!currentGroup) throw new GroupNotFoundError(id)

    if(dataToUpdate.pictures && dataToUpdate.pictures.banner)
      dataToUpdate.pictures.banner = await this.blobStorageClient.uploadBase64(dataToUpdate.pictures.banner)
    if(dataToUpdate.pictures && dataToUpdate.pictures.profile)
      dataToUpdate.pictures.banner = await this.blobStorageClient.uploadBase64(dataToUpdate.pictures.profile)

    const newGroup = {
      ...currentGroup,
      ...dataToUpdate
    }

    currentGroup.update(newGroup)

    return this.repository.save(currentGroup)
  }

  async delete (id: string): Promise<void> {
    const group = await this.repository.findById(id)
    if (!group) return

    group.delete()

    await this.repository.save(group)
  }

  async find (id: string): Promise<Group> {
    const group = await this.repository.findById(id)

    if (!group) throw new GroupNotFoundError(id)
    return group
  }

  async listAll (page: number = 0, size: number = 10): Promise<PaginatedQueryResult<Group>> {
    return this.repository.getAll(page, size)
  }
}
