import { SocialNetworkObject } from '../Group'
import { ObjectId } from 'bson'

export interface CreateGroupData {
  name: string,
  description: string,
  founder: string | ObjectId
  pictures?: {
    profile: string
    banner: string
  }
  socialNetworks: SocialNetworkObject[]
  location: LocationObject
  tags?: string[]
  organizers?: (string | ObjectId)[]
}

export interface LocationObject {
  city: string
  country: string
  state: string
}
