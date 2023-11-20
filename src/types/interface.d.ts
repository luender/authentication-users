import { type Router, type Request, type Response, type NextFunction } from 'express'

import { type Container } from './core'

/* HTTP Interface */
export type HttpRouter = Router
export type HttpRequest = Request
export type HttpResponse = Response
export type HttpNext = NextFunction

export interface IHttpInterface {
  serve: () => void
}

export interface HttpControllerConfig {
  // eslint-disable-next-line no-undef
  validator: typeof import('../interface/http/middleware/validator').validator
  coreContainer: Container
}

export interface IHttpRoute {
  // eslint-disable-next-line no-unused-vars
  register: (router: HttpRouter) => void
}
