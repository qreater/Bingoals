/*************************
 *
 * Copyright 2025 @Qreater
 * Licensed under the Apache License, Version 2.0.
 * See: http://www.apache.org/licenses/LICENSE-2.0
 *
 *************************/

import mongoose, { Model, Document, FilterQuery, QueryOptions } from 'mongoose'
import { config } from '../settings/config'
import { logger } from '../tools/logger'
import { APIError } from '../responses/error'

export const connectMongoDB = async (): Promise<void> => {
    try {
        await mongoose.connect(config.mongodbUri)
        logger.info('Established MongoDB Connection')
    } catch (error) {
        logger.error('MongoDB Connection Aborted:', error)
        process.exit(1)
    }
}

export const mongoErrorHandler = (error: unknown): void => {
    if (error instanceof APIError) {
        throw error
    } else if (error instanceof mongoose.Error) {
        throw APIError.validation('Database', error.message)
    } else if (error instanceof Error) {
        throw APIError.server(error)
    } else {
        throw APIError.server(new Error('MongoDB Operation Error'))
    }
}

export const createEntity = async <T extends Document>(
    model: Model<T>,
    data: Partial<T>,
): Promise<T | undefined> => {
    try {
        const result = await model.create(data)
        return result
    } catch (error) {
        mongoErrorHandler(error)
    }
}

export const readEntity = async <T extends Document>(
    model: Model<T>,
    query: FilterQuery<T>,
    options?: QueryOptions,
): Promise<T | undefined> => {
    try {
        const result = await model.findOne(query, {}, options)

        if (!result) {
            throw APIError.notFound(model.modelName, JSON.stringify(query))
        }

        return result
    } catch (error) {
        mongoErrorHandler(error)
    }
}

export const updateEntity = async <T extends Document>(
    model: Model<T>,
    query: FilterQuery<T>,
    data: Partial<T>,
): Promise<T | undefined> => {
    try {
        const result = await model.findOneAndUpdate(query, data, {
            new: true,
            runValidators: true,
        })

        if (!result) {
            throw APIError.notFound(model.modelName, JSON.stringify(query))
        }

        return result
    } catch (error) {
        mongoErrorHandler(error)
    }
}

export const deleteEntity = async <T extends Document>(
    model: Model<T>,
    query: FilterQuery<T>,
): Promise<void> => {
    try {
        const result = await model.deleteOne(query)

        if (!result.deletedCount) {
            throw APIError.notFound(model.modelName, JSON.stringify(query))
        }
    } catch (error) {
        mongoErrorHandler(error)
    }
}

export const listEntities = async <T extends Document>(
    model: Model<T>,
    query: FilterQuery<T>,
    options?: QueryOptions,
): Promise<T[] | undefined> => {
    try {
        const result = await model.find(query, {}, options)
        return result
    } catch (error) {
        mongoErrorHandler(error)
    }
}
