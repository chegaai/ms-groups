import { inject, injectable } from 'tsyringe'
import { ObjectId } from 'bson'
import { UnresponsiveServiceError } from '../errors/UnresponsiveServiceError'
import { ServiceError } from '../errors/ServiceError'
import { AxiosInstance } from 'axios'

@injectable()
export class ProfileClient {

  private readonly client: AxiosInstance

  constructor (@inject('ProfileAxiosInstance') axios: AxiosInstance) {
    this.client = axios
  }

  async findProfileById (id: ObjectId | string) {
    try {
      const { data } = await this.client.get(`/${new ObjectId(id).toHexString()}`)
      return data
    } catch (error) {
      if (!error.response) throw new UnresponsiveServiceError('profiles')
      if (error.response.status === 404) return null
      throw new ServiceError(error.response.statusText)
    }
  }
}
