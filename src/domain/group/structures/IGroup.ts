import { ObjectId } from 'bson'

export interface IGroup {
  id: ObjectId,
  name: string,
  founder: ObjectId
  organizers: ObjectId[],
  pictures: {
      profile: string,
      banner: string
  },
  socialNetworks:{
    facebook: string,
    linkedin: string,
    twitter: string,
    medium: string,
    speakerDeck: string,
    pinterest: string,
    instagram: string,
    others: [{
      name: string,
      link: string 
    }]
  },
  followers: ObjectId[],
  tags: string[],
  events: string[],
  createdAt: Date | null,
  updatedAt: Date | null,
  deletedAt: Date | null
}
