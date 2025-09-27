/*************************
 * 
 * Copyright 2025 @Qreater
 * Licensed under the Apache License, Version 2.0.
 * See: http://www.apache.org/licenses/LICENSE-2.0
 * 
 *************************/


import { Schema, model, Document } from 'mongoose'

export interface ITask extends Document {
    description: string
    points: number
    createdAt: Date
    updatedAt: Date
}

const TaskSchema: Schema = new Schema(
    {
        description: { type: String, required: true },
        points: { type: Number, default: 10 },
    },
    { timestamps: true },
)

export const Task = model<ITask>('Task', TaskSchema)
