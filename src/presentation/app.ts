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

  const services = container.resolve(Services)

  app.get('/:groupId', routes.find(services.group))
  app.get('/', routes.listAll(services.group))
  app.post('/', routes.create(services.group))
  app.put('/:groupId', routes.update(services.group))
  app.delete('/:groupId', routes.remove(services.group))

  app.use(errors(environment))
})
