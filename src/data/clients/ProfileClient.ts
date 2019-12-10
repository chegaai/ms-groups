import { inject, injectable } from 'tsyringe'
import { IAppConfig } from '../../app.config'
import axios, { AxiosInstance } from 'axios'
import { ObjectId } from 'bson'
import { UnresponsiveServiceError } from '../errors/UnresponsiveServiceError'
import { ServiceError } from '../errors/ServiceError'

@injectable()
export class ProfileClient {

  private readonly client: AxiosInstance

  constructor (@inject('ProfileServiceConnection') connectionData: IAppConfig['microServices']['profile']) {
    this.client = axios.create({ baseURL: connectionData.url })
  }

  async findUserById (id: ObjectId | string) {
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
