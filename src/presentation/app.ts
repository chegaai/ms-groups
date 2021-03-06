/* eslint-disable @typescript-eslint/no-misused-promises */
import axios from 'axios'
import { routes } from './routes'
import { container } from 'tsyringe'
import expresso from '@expresso/app'
import errors from '@expresso/errors'
import { Services } from '../services'
import { IAppConfig } from '../app.config'
import { createConnection } from '@nindoo/mongodb-data-layer'

export const app = expresso(async (app, config: IAppConfig, environment: string) => {
  const mongodbConnection = await createConnection(config.database.mongodb)

  container.register('MongodbConnection', { useValue: mongodbConnection })
  container.register('BlobStorageConfig', { useValue: config.azure.storage })
  container.register('ProfileAxiosInstance', {
    useValue: axios.create({ baseURL: config.microServices.profile.url })
  })

  const services = container.resolve(Services)

  app.get('/:group', routes.find(services.group))
  app.get('/', routes.listAll(services.group))
  app.post('/', routes.create(services.group))
  app.put('/:groupId', routes.update(services.group))
  app.delete('/:groupId', routes.remove(services.group))
  app.get('/:userId/groups', routes.getUserGroups(services.group))
  app.get('/organizers/:userId/groups', routes.getGroupsByOrganizerOrFounder(services.group))

  app.use(errors(environment))

  return app
})

export default { factory: app }
