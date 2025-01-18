/*************************
 *
 * Copyright 2025 @Qreater
 * Licensed under the Apache License, Version 2.0.
 * See: http://www.apache.org/licenses/LICENSE-2.0
 *
 *************************/

import express from 'express'

import { corsMiddleware } from './cors'
import { loggingMiddleware } from './logging'

export const applyMiddlewares = (app: any) => {
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(corsMiddleware)
    app.use(loggingMiddleware)
}
