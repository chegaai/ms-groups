import { ObjectId } from 'bson'
import { BaseEntity, BaseEntityData } from '../BaseEntity'
import { CreateGroupData, LocationObject } from './structures/CreateGroupData'

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
  location: LocationObject = {
    city: '',
    state: '',
    country: ''
  }
  socialNetworks: SocialNetworkObject[] = []
  followers: ObjectId[] = []
  tags: string[] = []

  static create (id: ObjectId, data: CreateGroupData & BaseEntityData): Group {
    const group = new Group()
    group.id = id
    group.name = data.name
    group.founder = new ObjectId(data.founder)
    group.socialNetworks = data.socialNetworks

    if (data.organizers) group.organizers = data.organizers.map(organizer => new ObjectId(organizer))
    if (data.pictures) group.pictures = data.pictures
    if (data.tags) group.tags = data.tags
    if (data.location) group.location = data.location
    if (data.createdAt) group.createdAt = data.createdAt
    if (data.updatedAt) group.updatedAt = data.updatedAt
    if (data.deletedAt) group.deletedAt = data.deletedAt

    return group
  }

  update (dataToUpdate: Partial<CreateGroupData>) {
    this.name = dataToUpdate.name || this.name
    this.founder = dataToUpdate.founder ? new ObjectId(dataToUpdate.founder) : this.founder
    this.organizers = dataToUpdate.organizers ? dataToUpdate.organizers.map(organizer => new ObjectId(organizer)) : this.organizers
    this.pictures = dataToUpdate.pictures ? dataToUpdate.pictures : this.pictures
    this.socialNetworks = dataToUpdate.socialNetworks || this.socialNetworks
    this.location = dataToUpdate.location ? { ...this.location, ...dataToUpdate.location } : this.location
    this.tags = dataToUpdate.tags || this.tags
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
      tags: this.tags,
      location: this.location,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt
    }
  }
}
