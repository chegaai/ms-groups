export interface IGroupParams {
  name: string,
  founderId: string
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
  tags: string[]
}
