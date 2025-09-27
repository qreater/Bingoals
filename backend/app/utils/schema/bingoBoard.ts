/*************************
 * 
 * Copyright 2025 @Qreater
 * Licensed under the Apache License, Version 2.0.
 * See: http://www.apache.org/licenses/LICENSE-2.0
 * 
 *************************/



import { Schema, model, Document, Types } from 'mongoose'

export interface IBingoBoard extends Document {
    userId: Types.ObjectId
    weekStartDate: Date
    grid: { taskId: Types.ObjectId; isCompleted: boolean }[][]
    isCompleted: boolean
    completedAt?: Date
    createdAt: Date
    updatedAt: Date
}

const BingoBoardSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        weekStartDate: { type: Date, required: true },
        grid: {
            type: [
                [
                    {
                        taskId: {
                            type: Schema.Types.ObjectId,
                            ref: 'Task',
                            required: true,
                        },
                        isCompleted: { type: Boolean, default: false },
                    },
                ],
            ],
            required: true,
        },
        isCompleted: { type: Boolean, default: false },
        completedAt: { type: Date },
    },
    { timestamps: true },
)

BingoBoardSchema.index({ userId: 1, weekStartDate: 1 }, { unique: true })

export const BingoBoard = model<IBingoBoard>('BingoBoard', BingoBoardSchema)
