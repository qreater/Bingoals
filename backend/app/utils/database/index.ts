/*************************
 *
 * Copyright 2025 @Qreater
 * Licensed under the Apache License, Version 2.0.
 * See: http://www.apache.org/licenses/LICENSE-2.0
 *
 *************************/

import { connectMongoDB } from './mongo'
import { connectRedis } from './redis'

export const makeDBConnections = async () => {
    await connectMongoDB()
    await connectRedis()
}
