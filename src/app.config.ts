import env from 'sugar-env'
import { LogLevel } from '@opentelemetry/core'
import { IServerConfig } from '@expresso/server'
import { IExpressoConfigOptions } from '@expresso/app'
import { IMongoParams } from '@nindoo/mongodb-data-layer'
import { IExpressoTracerConfig } from '@expresso/tracing/dist/types'

export interface IAppConfig extends IExpressoConfigOptions {
  name: string,
  database: {
    mongodb: IMongoParams
  },
  server?: IServerConfig['server'],
  microServices: {
    profile: {
      url: string
    }
  },
  azure: {
    storage: {
      accountName: string,
      accountAccessKey: string,
      containerName: string,
      timeOut: number
    }
  },
  tracing: IExpressoTracerConfig
}

const APP_NAME = 'ms-groups'

export const config: IAppConfig = {
  name: APP_NAME,
  server: {
    printOnListening: true,
  },
  database: {
    mongodb: {
      uri: env.get('DATABASE_MONGODB_URI', ''),
      dbName: env.get('DATABASE_MONGODB_DBNAME', 'group'),
      maximumConnectionAttempts: 5,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    }
  },
  microServices: {
    profile: {
      url: env.get('MICROSERVICE_PROFILE_URL', '')
    }
  },
  azure: {
    storage: {
      accountName: env.get('AZURE_STORAGE_ACCOUNT_NAME', 'chegaai'),
      accountAccessKey: env.get('AZURE_STORAGE_ACCOUNT_ACCESS_KEY', ''),
      containerName: env.get('AZURE_STORAGE_CONTAINER_NAME', 'groups'),
      timeOut: env.get('AZURE_STORAGE_TIMEOUT', 60000)
    }
  },
  tracing: {
    jaeger: {
      serviceName: APP_NAME,
      host: env.get('JAEGER_AGENT_HOST', '')
    },
    tracer: {
      logLevel: LogLevel.ERROR
    }
  }
}
