import 'reflect-metadata'
import { ObjectId } from 'mongodb'
import { Group } from '../../src/domain/group/Group'

const VALID_GROUP_OBJECT_ID = '5ddbe5c06ddc7900103b72e9'

const validGroup = new Group() 
validGroup.id= new ObjectId('5ddbe5c06ddc7900103b72e9'),
validGroup.name= 'typescriptbr',
validGroup.description= 'sadsadsa',
validGroup.founder = new ObjectId('5ddbe2b325f79200107a080e'),
validGroup.organizers= [],
validGroup.slug= 'typescriptbr',
validGroup.pictures = {
    profile: 'https=//chegaai.blob.core.windows.net/groups/5ddbe5bfe791c25971081cba',
    banner: 'https=//chegaai.blob.core.windows.net/groups/5ddbe5bee791c25971081cb9'
},
validGroup.socialNetworks= [],
validGroup.tags= [],
validGroup.location = {
    city: 'São Paulo',
    state: 'São Paulo',
    country: 'Brazil'
},
validGroup.createdAt= new Date(),
validGroup.updatedAt= new Date(),
validGroup.deletedAt= null


const createGroupData = {
  name: validGroup.name,
  description: validGroup.description,
  founder: validGroup.founder,
  pictures: {
    profile:'base64',
    banner: 'base64'
  },
  socialNetworks: validGroup.socialNetworks,
  tags: validGroup.tags,
  organizers: validGroup.organizers,
  location: validGroup.location
}

export { validGroup, createGroupData, VALID_GROUP_OBJECT_ID }

