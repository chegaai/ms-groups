import { SocialNetworkObject } from '../Group'
import { ObjectId } from 'bson'

export interface CreateGroupData {
  name: string,
  founder: string | ObjectId
  pictures: {
    profile: string
    banner: string
  }
  socialNetworks: SocialNetworkObject[]
  tags: string[]
  organizers?: (string | ObjectId)[]
}
