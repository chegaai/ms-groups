import { ObjectId } from 'bson'
import { SocialNetworkObject } from '../Group'
import { Nullable } from '../../../utils/Nullable'
import { LocationObject } from './CreateGroupData'

export interface SerializedGroup {
  _id: ObjectId
  name: string
  description: string
  founder: ObjectId
  organizers: ObjectId[]
  pictures: {
    profile: string
    banner: string
  }
  socialNetworks: SocialNetworkObject[]
  location: LocationObject
  tags: string[]
  createdAt: Date
  updatedAt: Date
  deletedAt: Nullable<Date>
}
