import { ObjectId } from 'bson'
import { SocialNetworkObject } from '../Group'
import { Nullable } from '../../../utils/Nullable'

export interface SerializedGroup {
  _id: ObjectId
  name: string
  founder: ObjectId
  organizers: ObjectId[]
  pictures: {
    profile: string
    banner: string
  }
  socialNetworks: SocialNetworkObject[]
  followers: ObjectId[]
  tags: string[]
  events: ObjectId[]
  createdAt: Date
  updatedAt: Date
  deletedAt: Nullable<Date>
}
