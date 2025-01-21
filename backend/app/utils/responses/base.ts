/*************************
 *
 * Copyright 2025 @Qreater
 * Licensed under the Apache License, Version 2.0.
 * See: http://www.apache.org/licenses/LICENSE-2.0
 *
 *************************/

import { Request, Response } from 'express'

import {
    Status,
    MetaData,
    ListData,
    BaseResponse,
    CreateResponse,
    ReadResponse,
    UpdateResponse,
    DeleteResponse,
    ListResponse,
    ErrorData,
    SuccessResponse,
    FailureResponse,
} from '../interfaces/common'
import { ErrorType } from './error'

export const createMetaData = (
    page: number,
    limit: number,
    total: number,
): MetaData => ({
    page,
    limit,
    total,
})

export const createBaseResponse = (
    status: Status,
    message?: string,
): BaseResponse => ({
    status,
    message,
})

export const createSuccessResponse = <T>(
    status: Status,
    data: T,
    message?: string,
): SuccessResponse<T> => ({
    status,
    message,
    data,
})

export const createFailureResponse = (
    status: Status,
    errors: ErrorData,
    message?: string,
): FailureResponse => ({
    status,
    message,
    errors,
})

export const createCreateResponse = <T>(
    data: T,
    message?: string,
): CreateResponse<T> => ({
    status: Status.SUCCESS,
    message: message || 'Resource Created Successfully',
    data,
})

export const createReadResponse = <T>(
    data: T,
    message?: string,
): ReadResponse<T> => ({
    status: Status.SUCCESS,
    message: message || 'Resource Retrieved Successfully',
    data,
})

export const createUpdateResponse = <T>(
    data: T,
    message?: string,
): UpdateResponse<T> => ({
    status: Status.SUCCESS,
    message: message || 'Resource Updated Successfully',
    data,
})

export const createDeleteResponse = <T>(
    data: T,
    message?: string,
): DeleteResponse<T> => ({
    status: Status.SUCCESS,
    message: message || 'Resource Deleted Successfully',
    data,
})

export const createListResponse = <T>(
    results: T[],
    page: number,
    limit: number,
    total: number,
    message?: string,
): ListResponse<T> => {
    const meta = createMetaData(page, limit, total)
    const listData: ListData<T> = { results, meta }
    return {
        status: Status.SUCCESS,
        message: message || 'Resource Retrieved Successfully',
        data: listData,
    }
}

const defaultMeta = createMetaData(1, 10, 0)

export const responseHandler = <T>(
    req: Request,
    res: Response,
    kwargs: {
        data?: T
        message?: string
        errors?: ErrorData
        meta?: MetaData
    },
) => {
    const { message, meta = defaultMeta } = kwargs

    const requestMethod = req.method as keyof typeof responseMapper
    const successStatusCodes: { [key: string]: number } = {
        GET: 200,
        POST: 201,
        PUT: 200,
        DELETE: 204,
    }

    const responseMapper: Record<
        string,
        (args: typeof kwargs) => BaseResponse | ListResponse<T>
    > = {
        GET: ({ data }) =>
            Array.isArray(data)
                ? createListResponse(
                      data,
                      meta.page,
                      meta.limit,
                      meta.total,
                      message,
                  )
                : createReadResponse(data, message),
        POST: ({ data }) => createCreateResponse(data, message),
        PUT: ({ data }) => createUpdateResponse(data, message),
        DELETE: ({ data }) => createDeleteResponse(data, message),
    }

    const response =
        responseMapper[requestMethod]?.(kwargs) ||
        createFailureResponse(
            Status.FAILURE,
            {
                type: ErrorType.VALIDATION,
                message: 'Unsupported method',
            },
            'Unsupported method',
        )

    const statusCode = successStatusCodes[requestMethod] ?? 400

    res.status(statusCode).json(response)
}
