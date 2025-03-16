/*************************
 *
 * Copyright 2025 @Qreater
 * Licensed under the Apache License, Version 2.0.
 * See: http://www.apache.org/licenses/LICENSE-2.0
 *
 *************************/

import { Express } from 'express'
import userRouter from './user'

const combineRouters = (app: Express) => {
    app.use('/user', userRouter)
}

export default combineRouters
