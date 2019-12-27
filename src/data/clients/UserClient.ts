import { inject, injectable } from 'tsyringe'
import { ObjectId } from 'bson'
import { UnresponsiveServiceError } from '../errors/UnresponsiveServiceError'
import { ServiceError } from '../errors/ServiceError'
import { AxiosInstance } from 'axios'

@injectable()
export class UserClient {

  private readonly client: AxiosInstance

  constructor (@inject('UserAxiosInstance') axios: AxiosInstance) {
    this.client = axios
  }

  async findUserById (id: ObjectId | string) {
    try {
      const { data } = await this.client.get(`/${new ObjectId(id).toHexString()}`)
      return data
    } catch (error) {
      if (!error.response) throw new UnresponsiveServiceError('users')
      if (error.response.status === 404) return null
      throw new ServiceError(error.response.statusText)
    }
  }
}
