import { inject, injectable } from 'tsyringe'
import { IAppConfig } from '../../app.config'
import axios, { AxiosInstance } from 'axios'
import { ObjectId } from 'bson'
import { UnresponsiveServiceError } from '../errors/UnresponsiveServiceError'
import { ServiceError } from '../errors/ServiceError'

@injectable()
export class UserClient {

  private readonly client: AxiosInstance

  constructor (@inject('UserServiceConnection') connectionData: IAppConfig['microServices']['user']) {
    this.client = axios.create({ baseURL: connectionData.url })
  }

  async findUserById (id: ObjectId | string) {
    try {
      return this.client.get(`/users/${new ObjectId(id).toHexString()}`)
    } catch (error) {
      if (!error.response) throw new UnresponsiveServiceError('users')
      if (error.response.status === 404) return null
      throw new ServiceError(error.response)
    }
  }
}
