import 'source-map-support/register'
import 'dotenv/config'

import Agendash from 'agendash'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { express as voyagerMiddleware } from 'graphql-voyager/middleware'
import { createServer } from 'http'
import next from 'next'
import path from 'path'
import R from 'ramda'
import { parse } from 'url'

import logger from '@boiler/logger'

import { getAgenda, startAgenda } from './agenda'
import { STAGE } from './constants'
import { createConnection } from './db'
import { createApolloServer } from './graphql'
import restapi from './restapi'

const PORT = 3000

async function bootstrap() {
  logger.info(`Stage "${STAGE}" is initializing...`)

  const app = express()
  const server = createServer(app)
  const apolloServer = createApolloServer()

  const client = next({
    dev: process.env.NODE_ENV !== 'production',
    dir: path.resolve('./src/client'),
    conf: require('./client/next.config.js'),
  })

  const render = client.getRequestHandler()

  await Promise.all([
    createConnection().then(() => startAgenda()),
    client.prepare(),
  ])

  app.get('/health', (req, res) => res.send('ok'))

  app.use(cors())
  app.use(bodyParser.json())
  app.use(cookieParser())

  apolloServer.applyMiddleware({
    app,
  })
  apolloServer.installSubscriptionHandlers(server)

  app.use('/api', restapi)

  app.use('/agendash', Agendash(getAgenda()))
  app.use('/voyager', voyagerMiddleware({ endpointUrl: '/graphql' }))

  app.get('*', (req, res) => render(req, res, parse(req.url, true)))

  server.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`)
  })
}

bootstrap()
