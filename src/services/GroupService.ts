// import axios from 'axios'
import { ObjectId } from 'bson'
import { injectable } from 'tsyringe'
// import { config } from '../app.config'
import { PaginatedQueryResult } from '@nindoo/mongodb-data-layer'
import { IGroup, IGroupParams } from '../domain/group/structures'
import { GroupRepository } from '../data/repositories/GroupRepository'
import { GroupNotFoundError } from '../domain/group/errors/GroupNotFoundError'
// import { FounderNotFoundError } from '../domain/group/errors/FounderNotFoundError'
import { GroupAlreadyExistsError } from '../domain/group/errors/GroupAlreadyExistsError'

@injectable()
export class GroupService {
  constructor (
    private readonly repository: GroupRepository
  ) { }

  async create (creationData: IGroupParams): Promise<IGroup> {
    if (await this.repository.existsByName(creationData.name)) throw new GroupAlreadyExistsError(creationData.name)
    
    // TODO: send the images to cloud
    // TODO: validate the founderId
    // axios.get(`${config.microServices.user.url}/${creationData.founderId}`)
    // .then(({ data }) => console.log(data))
    // .catch (error => {
    //   if (error.status === 404) {
    //     throw new FounderNotFoundError(creationData.founderId)
    //   }
    //   throw new Error(error.response.data.error.message)
    // })
  
    const group: IGroup = {
      id: new ObjectId(),
      name: creationData.name,
      founder: new ObjectId(creationData.founderId),
      organizers: [],
      pictures: {
          profile: creationData.pictures.profile,
          banner: creationData.pictures.banner
      },
      socialNetworks:{
        facebook: creationData.socialNetworks.facebook,
        linkedin: creationData.socialNetworks.linkedin,
        twitter: creationData.socialNetworks.twitter,
        medium: creationData.socialNetworks.medium,
        speakerDeck: creationData.socialNetworks.speakerDeck,
        pinterest: creationData.socialNetworks.pinterest,
        instagram: creationData.socialNetworks.instagram,
        others: creationData.socialNetworks.others
      },
      followers: [],
      tags: creationData.tags,
      events: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    }

    return this.repository.save(group)
  }

  async update (id: string, dataToUpdate: Partial<IGroupParams>): Promise<IGroup> {
    const currentGroup = await this.repository.findById(id)
    if (!currentGroup) throw new GroupNotFoundError(id)

    const newGroup: IGroup = {
      ...currentGroup,
      ...dataToUpdate,
      id: new ObjectId(id),
      updatedAt: new Date()
    }

    return this.repository.save(newGroup)
  }

  async delete (id: string): Promise<void> {
    const group = await this.repository.findById(id)
    if (!group) return
    group.deletedAt = new Date()

    await this.repository.save(group)
  }

  async find (id: string): Promise<IGroup> {
    const group = await this.repository.findById(id)

    if (!group) throw new GroupNotFoundError(id)
    return group
  }

  async listAll (): Promise<PaginatedQueryResult<IGroup>> {
    return this.repository.getAll()
  }
}
