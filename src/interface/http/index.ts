import bodyParser from 'body-parser'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import express from 'express'

import { validator } from './middleware/validator'
import { errorHandler } from './middleware/errorHandler'
import { UserController } from './controller/user'
import { NotFoundError } from '../../util/http'
import Logger from '../../util/logger'
import { type env } from '../../util/env'

import { type Container } from '../../types/core'

import { type IHttpRoute, type IHttpInterface } from '../../types/interface'

interface Config {
  env: typeof env
  coreContainer: Container
}

export class HttpInterface implements IHttpInterface {
  private app?: express.Application
  private readonly coreContainer: Config['coreContainer']
  private readonly env: Config['env']

  constructor (config: Config) {
    Logger.debug({
      class: 'HttpInterface',
      classType: 'IHttpInterface',
      coreContainer: config.coreContainer !== undefined,
      env: config.env !== undefined
    })

    this.coreContainer = config.coreContainer
    this.env = config.env
  }

  initApp () {
    this.app = express()

    this.app.use(
      helmet(),
      cors(),
      compression(),
      bodyParser.json({
        limit: this.env.httpBodyLimit
      })
    )

    this.setupRoutes()
    this.setupNotFound()

    this.app.use(errorHandler)
  }

  setupRoutes () {
    [
      new UserController({
        coreContainer: this.coreContainer,
        validator
      })
    ].forEach((route: IHttpRoute) => {
      const router = express.Router({ mergeParams: true })
      route.register(router)
      this.app?.use(router)
    })

    Logger.debug('setupRoutes ended')
  }

  setupNotFound () {
    this.app?.use(
      '*',
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        next(new NotFoundError('Page not found'))
      }
    )
  }

  serve (): void {
    this.initApp()

    this.app?.listen(this.env.httpPort)

    Logger.info('http interface listening')
  }
}
