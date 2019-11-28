import { MongodbRepository, PaginatedQueryResult } from '@nindoo/mongodb-data-layer'
import { ObjectId } from 'bson'
import { inject, injectable } from 'tsyringe'
import { Db } from 'mongodb'
import { SerializedGroup } from '../../domain/group/structures/SerializedGroup'
import { Group } from '../../domain/group/Group'

@injectable()
export class GroupRepository extends MongodbRepository<Group, SerializedGroup> {
  static collection = 'groups'
  constructor (@inject('MongodbConnection') connection: Db) {
    super(connection.collection(GroupRepository.collection))
  }

  serialize (entity: Group) {
    return entity.toObject()
  }

  deserialize (data: SerializedGroup): Group {
    const { _id, ...groupData } = data
    return Group.create(_id, groupData)
  }

  async existsByName (name: string): Promise<boolean> {
    return this.existsBy({ name, deletedAt: null })
  }

  async getAll (page: number, size: number): Promise<PaginatedQueryResult<Group>> {
    return this.runPaginatedQuery({ deletedAt: null }, page, size)
  }

  async search (query: any, page: number, size: number) {
    return this.runPaginatedQuery(query, page, size)
  }

  async findManyById (communityIds: ObjectId[], page: number, size: number): Promise<PaginatedQueryResult<Group>> {
    return this.runPaginatedQuery({ _id: { $in: communityIds }, deletedAt: null }, page, size)
  }

  async findBySlug (slug: string) {
    return this.findOneBy({ slug })
  }
}
