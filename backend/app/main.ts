/*************************
 *
 * Copyright 2025 @Qreater
 * Licensed under the Apache License, Version 2.0.
 * See: http://www.apache.org/licenses/LICENSE-2.0
 *
 *************************/

import dotenv from 'dotenv'
dotenv.config()

import express, { Request, Response } from 'express'
import mongoose from 'mongoose'

import { applyMiddlewares } from './utils/middleware'
import { errorHandlingMiddleware } from './utils/middleware/error'

import { responseHandler } from './utils/responses/base'
import { logger } from './utils/tools/logger'

const app = express()
const PORT = process.env.PORT || 8000
const MONGODB_URI = process.env.MONGODB_URI || ''

applyMiddlewares(app)

app.get('/', (req: Request, res: Response) => {
    responseHandler(req, res, {
        message: 'Welcome to Bingoals API!',
    })
})

app.use(errorHandlingMiddleware)

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        app.listen(PORT, () => {
            logger.info(`Server Listening in PORT: ${PORT}`)
        })
    })
    .catch((error) => {
        logger.error(`MongoDB Connection Aborted: ${error}`)
        process.exit(1)
    })
