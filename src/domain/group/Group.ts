import { ObjectId } from 'bson'
import { BaseEntity, BaseEntityData } from '../BaseEntity'
import { CreateGroupData } from './structures/CreateGroupData'

export type PictureObject = {
  profile: string
  banner: string
}

export type SocialNetworkObject = { name: string, link: string }

export class Group extends BaseEntity {
  id: ObjectId = new ObjectId()
  name: string = ''
  founder: ObjectId = new ObjectId()
  organizers: ObjectId[] = []
  pictures: PictureObject = {
    profile: '',
    banner: ''
  }
  socialNetworks: SocialNetworkObject[] = []
  followers: ObjectId[] = []
  tags: string[] = []
  events: ObjectId[] = []

  static create (id: ObjectId, data: CreateGroupData & BaseEntityData): Group {
    const group = new Group()
    group.id = id
    group.name = data.name
    group.founder = new ObjectId(data.founder)
    group.organizers = data.organizers ? data.organizers.map(organizer => new ObjectId(organizer)) : []
    group.pictures = data.pictures
    group.socialNetworks = data.socialNetworks
    group.followers = []
    group.tags = []
    group.events = []

    if (data.createdAt) group.createdAt = data.createdAt
    if (data.updatedAt) group.updatedAt = data.updatedAt
    if (data.deletedAt) group.deletedAt = data.deletedAt

    return group
  }

  update (dataToUpdate: CreateGroupData) {
    this.name = dataToUpdate.name
    this.founder = new ObjectId(dataToUpdate.founder)
    this.organizers = dataToUpdate.organizers ? dataToUpdate.organizers.map(organizer => new ObjectId(organizer)) : []
    this.pictures = dataToUpdate.pictures
    this.socialNetworks = dataToUpdate.socialNetworks
    this.followers = []
    this.tags = []
    this.events = []
    this.updatedAt = new Date()
    return this
  }

  toObject () {
    return {
      _id: this.id,
      name: this.name,
      founder: this.founder,
      organizers: this.organizers,
      pictures: {
        profile: this.pictures.profile,
        banner: this.pictures.banner
      },
      socialNetworks: this.socialNetworks,
      followers: this.followers,
      tags: this.tags,
      events: this.events,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt
    }
  }
}
