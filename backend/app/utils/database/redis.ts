/*************************
 *
 * Copyright 2025 @Qreater
 * Licensed under the Apache License, Version 2.0.
 * See: http://www.apache.org/licenses/LICENSE-2.0
 *
 *************************/

import Redis from 'ioredis'
import { Job, Queue, QueueOptions, Worker } from 'bullmq'

import { config } from '../settings/config'
import { logger } from '../tools/logger'

let redis: Redis

export const connectRedis = async () => {
    if (!redis) {
        redis = new Redis(config.redisUri, {
            maxRetriesPerRequest: null,
        })

        redis.on('connect', () => {
            logger.info('Established Redis Connection')
        })

        redis.on('error', (error: Error) => {
            logger.error('Error connecting to Redis:', error)
        })
    }
    await new Promise<void>((resolve, reject) => {
        redis.on('connect', () => resolve())
        redis.on('error', (error: Error) => reject(error))
    })
}

export const getRedis = async (): Promise<Redis> => {
    while (!redis) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
    }
    return redis
}

export const createQueue = async (
    queueName: string,
    options?: QueueOptions,
) => {
    await getRedis()
    return new Queue(queueName, {
        connection: redis,
        ...options,
    })
}

export const createWorker = async (
    queueName: string,
    processor: (job: Job) => Promise<void>,
    options?: WorkerOptions,
) => {
    await getRedis()
    const worker = new Worker(queueName, processor, {
        connection: redis,
        ...options,
    })

    worker.on('completed', (job) => {
        logger.info(`[RS-WORKER]: Job ${job.id} in ${queueName} completed`)
    })

    worker.on('failed', (job, err: Error) => {
        logger.error(`[RS-WORKER]: Job ${job?.id} in ${queueName} failed:`, err)
    })

    return worker
}

export { redis }
