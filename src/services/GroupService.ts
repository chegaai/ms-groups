// import axios from 'axios'
import { ObjectId } from 'bson'
import { injectable } from 'tsyringe'
import { PaginatedQueryResult } from '@nindoo/mongodb-data-layer'
import { GroupRepository } from '../data/repositories/GroupRepository'
import { GroupNotFoundError } from '../domain/group/errors/GroupNotFoundError'
import { GroupAlreadyExistsError } from '../domain/group/errors/GroupAlreadyExistsError'
import { CreateGroupData } from '../domain/group/structures/CreateGroupData'
import { Group } from '../domain/group/Group'

@injectable()
export class GroupService {
  constructor (
    private readonly repository: GroupRepository
  ) { }

  async create (creationData: CreateGroupData): Promise<Group> {
    if (await this.repository.existsByName(creationData.name)) throw new GroupAlreadyExistsError(creationData.name)

    const group = Group.create(new ObjectId, creationData)

    return this.repository.save(group)
  }

  async update (id: string, dataToUpdate: Partial<CreateGroupData>): Promise<Group> {
    const currentGroup = await this.repository.findById(id)
    if (!currentGroup) throw new GroupNotFoundError(id)

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

  async listAll (): Promise<PaginatedQueryResult<Group>> {
    return this.repository.getAll()
  }
}
