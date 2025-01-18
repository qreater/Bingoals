/*************************
 *
 * Copyright 2025 @Qreater
 * Licensed under the Apache License, Version 2.0.
 * See: http://www.apache.org/licenses/LICENSE-2.0
 *
 *************************/

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

export interface BaseResponse<T> {
    status: Status
    message?: string
    data?: T
    errors?: any
}

export interface CreateResponse<T> extends BaseResponse<T> {
    data: T
}

export interface ReadResponse<T> extends BaseResponse<T> {
    data: T
}

export interface UpdateResponse<T> extends BaseResponse<T> {
    data: T
}

export interface DeleteResponse<T> extends BaseResponse<T> {
    data: T
}

export interface ListResponse<T> extends BaseResponse<ListData<T>> {
    data: ListData<T>
}
