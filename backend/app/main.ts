/*************************
 *
 * Copyright 2025 @Qreater
 * Licensed under the Apache License, Version 2.0.
 * See: http://www.apache.org/licenses/LICENSE-2.0
 *
 *************************/

import 'express-async-errors'

import express, { Request, Response } from 'express'

import { config } from './utils/settings/config'
import { logger } from './utils/tools/logger'
import { makeDBConnections } from './utils/database'
import { responseHandler } from './utils/responses/base'

import { applyMiddlewares } from './utils/middleware'
import { errorHandlingMiddleware } from './utils/middleware/error'
import combineRouters from './routes'

const app = express()

applyMiddlewares(app)

app.get('/', (req: Request, res: Response) => {
    responseHandler<null>(req, res, {
        message: 'Welcome to Bingoals API!',
    })
})

combineRouters(app)

app.use(errorHandlingMiddleware)

makeDBConnections()
    .then(() => {
        app.listen(config.port, () => {
            logger.info(`Server Listening on PORT: ${config.port}`)
        })
    })
    .catch((error) => {
        logger.error('Error during startup:', error)
        process.exit(1)
    })
