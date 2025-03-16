/*************************
 *
 * Copyright 2025 @Qreater
 * Licensed under the Apache License, Version 2.0.
 * See: http://www.apache.org/licenses/LICENSE-2.0
 *
 *************************/

import dotenv from 'dotenv'

dotenv.config()

export enum Environment {
    Development = 'development',
    Production = 'production',
    Staging = 'staging',
    Test = 'test',
}

interface Config {
    port: number
    environment: Environment
    mongodbUri: string
    redisUri: string
    redisOtpExp: number
    jwtSecret: string
    emailUser: string
    emailPass: string
}

const ENV_MAPPING: Readonly<Record<keyof Config, string>> = Object.freeze({
    environment: 'NODE_ENV',
    port: 'PORT',
    mongodbUri: 'MONGODB_URI',
    redisUri: 'REDIS_URI',
    redisOtpExp: 'REDIS_OTP_EXP',
    jwtSecret: 'JWT_SECRET',
    emailUser: 'EMAIL_USER',
    emailPass: 'EMAIL_PASS',
})

const validateConfig = (config: Config): void => {
    validateRequiredKeys(config)
    validateNumericValues(config)
    validateUris(config)
}

const validateRequiredKeys = (config: Config): void => {
    const requiredKeys: (keyof Config)[] = [
        'mongodbUri',
        'redisUri',
        'jwtSecret',
        'emailUser',
        'emailPass',
    ]
    const missingKeys = requiredKeys.filter((key) => !config[key])

    if (missingKeys.length) {
        const missingEnvVars = missingKeys
            .map((key) => ENV_MAPPING[key])
            .join(', ')
        throw new Error(`Missing environment variables: ${missingEnvVars}`)
    }
}

const validateNumericValues = (config: Config): void => {
    if (!isValidPort(config.port)) {
        throw new Error(
            `${ENV_MAPPING.port} must be a valid number between 1 and 65535`,
        )
    }
    if (!isValidPositiveNumber(config.redisOtpExp)) {
        throw new Error(`${ENV_MAPPING.redisOtpExp} must be a positive number`)
    }
}

const validateUris = (config: Config): void => {
    const uriPattern = /^[a-zA-Z][a-zA-Z+.-]*:\/\/[^/]+(?:\/.*)?$/
    const uriKeys: (keyof Config)[] = ['mongodbUri', 'redisUri']

    uriKeys.forEach((key) => {
        const value = config[key]
        if (typeof value !== 'string' || !uriPattern.test(value)) {
            throw new Error(`${ENV_MAPPING[key]} must be a valid URI`)
        }
    })
}

const isValidPort = (port: number): boolean =>
    Number.isInteger(port) && port >= 1 && port <= 65535
const isValidPositiveNumber = (value: number): boolean =>
    Number.isFinite(value) && value > 0

export const config: Config = {
    environment:
        (process.env.NODE_ENV as Environment) || Environment.Development,
    port: parseInt(process.env.PORT || '8000'),
    mongodbUri: process.env.MONGODB_URI || '',
    redisUri: process.env.REDIS_URI || '',
    redisOtpExp: parseInt(process.env.REDIS_OTP_EXP || '300'),
    jwtSecret: process.env.JWT_SECRET || '',
    emailUser: process.env.EMAIL_USER || '',
    emailPass: process.env.EMAIL_PASS || '',
}

validateConfig(config)
