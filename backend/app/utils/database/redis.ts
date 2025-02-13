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
    if (redis) return redis
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error('Redis connection timeout'))
        }, 30000)

        const checkConnection = setInterval(() => {
            if (redis) {
                clearTimeout(timeout)
                clearInterval(checkConnection)
                resolve(redis)
            }
        }, 100)
    })
}

export const createQueue = async (
    queueName: string,
    options?: QueueOptions,
) => {
    await getRedis()
    return new Queue(queueName, {
        connection: redis,
        defaultJobOptions: {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000,
            },
        },
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
        if (job && job.attemptsMade < (job.opts.attempts || 3)) {
            logger.warn(
                `[RS-WORKER]: Job ${job.id} in ${queueName} failed, retrying in ${typeof job.opts.backoff === 'number' ? job.opts.backoff : job.opts.backoff?.delay || 1000}ms`,
                err,
            )
        } else if (job) {
            logger.error(
                `[RS-WORKER]: Job ${job.id} in ${queueName} permanently failed after ${job.attemptsMade} attempts`,
                err,
            )
        } else {
            logger.error(`[RS-WORKER]: Job in ${queueName} failed`, err)
        }
    })

    return worker
}

export { redis }
