/*************************
 *
 * Copyright 2025 @Qreater
 * Licensed under the Apache License, Version 2.0.
 * See: http://www.apache.org/licenses/LICENSE-2.0
 *
 *************************/

import { Request } from 'express'

import { IUserDocument } from '../../models/user'
import { ErrorType } from '../responses/error'

export enum Status {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
}

export interface MetaData {
    page: number
    limit: number
    total: number
}

export interface ListData<T> {
    results: T[]
    meta: MetaData
}

export interface ErrorData {
    type: ErrorType
    message: string
    additionalInfo?: string
}

export interface AdvancedRequest extends Request {
    requestId: string
}

export interface AuthRequest extends Request {
    user?: IUserDocument
}

export interface BaseResponse {
    status: Status
    message?: string
}

export interface SuccessResponse<T> extends BaseResponse {
    data: T
}

export interface FailureResponse extends BaseResponse {
    errors: ErrorData
}

export type CreateResponse<T> = SuccessResponse<T>

export type ReadResponse<T> = SuccessResponse<T>

export type UpdateResponse<T> = SuccessResponse<T>

export type DeleteResponse<T> = SuccessResponse<T>

export type ListResponse<T> = SuccessResponse<ListData<T>>
