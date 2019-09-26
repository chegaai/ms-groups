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
  container.register('UserServiceConnection', { useValue: config.microServices.user })

  const services = container.resolve(Services)

  app.get('/groups/:groupId', routes.find(services.group))
  app.get('/groups', routes.listAll(services.group))
  app.post('/groups', routes.create(services.group))
  app.put('/groups/:groupId', routes.update(services.group))
  app.delete('/groups/:groupId', routes.remove(services.group))
  app.get('/groups/followers/:userId', routes.getFollowers(services.group))

  app.use(errors(environment))
})
