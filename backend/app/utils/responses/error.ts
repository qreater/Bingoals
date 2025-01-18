/*************************
 *
 * Copyright 2025 @Qreater
 * Licensed under the Apache License, Version 2.0.
 * See: http://www.apache.org/licenses/LICENSE-2.0
 *
 *************************/

import { Status, BaseResponse } from '../../interfaces/common'

export enum ErrorType {
    CONFLICT = 'conflict_error',
    NOT_FOUND = 'not_found_error',
    VALIDATION = 'validation_error',
    UNAUTHORIZED = 'unauthorized_error',
    SERVER_ERROR = 'server_error',
}

export const createErrorResponse = (
    errorType: ErrorType,
    detail: string,
    statusCode: Status = Status.FAILURE,
    additionalInfo?: any,
): BaseResponse<any> => ({
    status: statusCode,
    errors: {
        type: errorType,
        message: detail,
        ...(additionalInfo && { additionalInfo }),
    },
})

export class APIError extends Error {
    public statusCode: number
    public errorType: ErrorType
    public additionalInfo?: any

    constructor(
        errorType: ErrorType,
        message: string,
        statusCode: number,
        additionalInfo?: any,
    ) {
        super(message)
        this.statusCode = statusCode
        this.errorType = errorType
        this.additionalInfo = additionalInfo

        Object.setPrototypeOf(this, APIError.prototype)
    }

    static conflict(entity: string, key: string): APIError {
        const response = createErrorResponse(
            ErrorType.CONFLICT,
            `${entity} already exists with '${key}'!`,
        )
        return new APIError(
            ErrorType.CONFLICT,
            response.errors.message,
            409,
            response.errors.additionalInfo,
        )
    }

    static notFound(entity: string, key: string): APIError {
        const response = createErrorResponse(
            ErrorType.NOT_FOUND,
            `${entity} not found with '${key}'!`,
        )
        return new APIError(
            ErrorType.NOT_FOUND,
            response.errors.message,
            404,
            response.errors.additionalInfo,
        )
    }

    static validation(field: string, extraInfo: string = ''): APIError {
        const response = createErrorResponse(
            ErrorType.VALIDATION,
            `Invalid ${field}! ${extraInfo}`,
        )
        return new APIError(
            ErrorType.VALIDATION,
            response.errors.message,
            422,
            response.errors.additionalInfo,
        )
    }

    static unauthorized(): APIError {
        const response = createErrorResponse(
            ErrorType.UNAUTHORIZED,
            'Please verify credentials!',
        )
        return new APIError(
            ErrorType.UNAUTHORIZED,
            response.errors.message,
            401,
        )
    }

    static server(e: Error): APIError {
        const response = createErrorResponse(
            ErrorType.SERVER_ERROR,
            `Internal Server Error: ${e.message}`,
        )
        return new APIError(
            ErrorType.SERVER_ERROR,
            response.errors.message,
            500,
        )
    }
}
