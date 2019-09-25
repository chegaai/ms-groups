import { MongodbRepository, PaginatedQueryResult } from '@nindoo/mongodb-data-layer'
import { IGroup, ISerializedGroup } from '../../domain/group/structures'
import { ObjectId } from 'bson'
import { inject, injectable } from 'tsyringe'
import { Db } from 'mongodb'

@injectable()
export class GroupRepository extends MongodbRepository<IGroup, ISerializedGroup> {
  static collection = 'groups'
  constructor (@inject('MongodbConnection') connection: Db) {
    super(connection.collection(GroupRepository.collection))
  }

  serialize (entity: IGroup) {
    return {
      _id: entity.id,
      name: entity.name,
      founder: entity.founder,
      organizers: entity.organizers,
      pictures: {
          profile: entity.pictures.profile,
          banner: entity.pictures.banner
      },
      socialNetworks:{
        facebook: entity.socialNetworks.facebook,
        linkedin: entity.socialNetworks.linkedin,
        twitter: entity.socialNetworks.twitter,
        medium: entity.socialNetworks.medium,
        speakerDeck: entity.socialNetworks.speakerDeck,
        pinterest: entity.socialNetworks.pinterest,
        instagram: entity.socialNetworks.instagram,
        others: entity.socialNetworks.others
      },
      followers: entity.followers,
      tags: entity.tags,
      events: entity.events,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt
    }
  }

  deserialize (data: ISerializedGroup) {
    return {
      id: data._id,
      name: data.name,
      founder: data.founder,
      organizers: data.organizers,
      pictures: {
          profile: data.pictures.profile,
          banner: data.pictures.banner
      },
      socialNetworks:{
        facebook: data.socialNetworks.facebook,
        linkedin: data.socialNetworks.linkedin,
        twitter: data.socialNetworks.twitter,
        medium: data.socialNetworks.medium,
        speakerDeck: data.socialNetworks.speakerDeck,
        pinterest: data.socialNetworks.pinterest,
        instagram: data.socialNetworks.instagram,
        others: data.socialNetworks.others
      },
      followers: data.followers,
      tags: data.tags,
      events: data.events,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt
    }
  }

  async existsByName (name: string): Promise<boolean> {
    return this.existsBy({ name, deletedAt: null })
  }

  async delete (id: string | ObjectId): Promise<boolean | null> {
    return this.deleteById(id)
  }

  async getAll (): Promise<PaginatedQueryResult<IGroup>> {
    return this.runPaginatedQuery({ deletedAt: null })
  }
}
