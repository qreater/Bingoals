/*************************
 *
 * Copyright 2025 @Qreater
 * Licensed under the Apache License, Version 2.0.
 * See: http://www.apache.org/licenses/LICENSE-2.0
 *
 *************************/

import { Document, Schema, model } from 'mongoose'

export interface IUser {
    username: string
    email: string
    createdAt?: Date
    updatedAt?: Date
}

export interface IUserDocument extends IUser, Document {}

const schemaOptions = {
    timestamps: true,
    collation: {
        locale: 'en',
        strength: 2,
    },
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: (_: IUserDocument, ret: Partial<IUserDocument>) => {
            ret.id = ret._id
            delete ret._id
        },
    },
    toObject: {
        virtuals: true,
        versionKey: false,
        transform: (_: IUserDocument, ret: Partial<IUserDocument>) => {
            ret.id = ret._id
            delete ret._id
        },
    },
}

export const userSchema = new Schema<IUserDocument>(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
        },
    },
    schemaOptions,
)

export const User = model<IUserDocument>('User', userSchema)

const indexOptions = {
    collation: { locale: 'en', strength: 2 },
    partialFilterExpression: {
        $and: [{ $exists: true }, { $type: 'string' }],
    },
}

userSchema.index(
    { username: 1 },
    {
        ...indexOptions,
        name: 'username_unique_idx',
    },
)

userSchema.index(
    { email: 1 },
    {
        ...indexOptions,
        name: 'email_unique_idx',
    },
)
