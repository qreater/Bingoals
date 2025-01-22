/*************************
 *
 * Copyright 2025 @Qreater
 * Licensed under the Apache License, Version 2.0.
 * See: http://www.apache.org/licenses/LICENSE-2.0
 *
 *************************/

import dotenv from 'dotenv'

dotenv.config()

interface Config {
    port: number
    mongodbUri: string
    redisUri: string
    redisOtpExp: number
    jwtSecret: string
    emailUser?: string
    emailPass?: string
}

export const config: Config = {
    port: parseInt(process.env.PORT || '8000'),
    mongodbUri: process.env.MONGODB_URI || '',
    redisUri: process.env.REDIS_URI || '',
    redisOtpExp: parseInt(process.env.REDIS_OTP_EXP || '300'),
    jwtSecret: process.env.JWT_SECRET || '',
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS,
}
