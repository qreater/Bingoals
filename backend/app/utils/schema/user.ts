/*************************
 * 
 * Copyright 2025 @Qreater
 * Licensed under the Apache License, Version 2.0.
 * See: http://www.apache.org/licenses/LICENSE-2.0
 * 
 *************************/


import { Schema, model, Document } from 'mongoose'

export interface IUser extends Document {
    username: string
    email: string
    xp: number
    createdAt: Date
    updatedAt: Date
}

const UserSchema: Schema = new Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        xp: { type: Number, default: 0 },
    },
    { timestamps: true },
)

export const User = model<IUser>('User', UserSchema)
