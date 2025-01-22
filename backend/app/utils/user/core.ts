/*************************
 *
 * Copyright 2025 @Qreater
 * Licensed under the Apache License, Version 2.0.
 * See: http://www.apache.org/licenses/LICENSE-2.0
 *
 *************************/

import jwt from 'jsonwebtoken'
import { createQueue, createWorker, redis } from '../database/redis'

import { IUserDocument, User } from '../../models/user'
import { createEntity, readEntity } from '../database/mongo'
import { APIError } from '../responses/error'
import { config } from '../settings/config'
import { sendMail } from '../mailer'
import { Job, Queue, Worker } from 'bullmq'

/**
 * CORE Utility Functions
 *
 * These functions are the core utility functions that are used by the user module.
 *
 */

export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000)
}

export const storeOTP = async (email: string, otp: string) => {
    await redis.setex(`otp:${email}:${otp}`, config.redisOtpExp, otp)
}

export const sendOTP = async (
    email: string,
    otp: string,
    username: string,
    expiry: number,
) => {
    await sendMail(
        email,
        '[Bingoals] A Login Attempt Was Made to Your Account',
        'otp_email',
        { otp: otp.split(''), otpString: otp, username, expiry: expiry / 60 },
    )
}

export const verifyOTP = async (email: string, otp: string) => {
    const storedOTP = await redis.get(`otp:${email}:${otp}`)
    return storedOTP === otp.toString()
}

export const generateToken = async (email: string) => {
    const user = await readEntity<IUserDocument>(User, { email })
    if (!user) {
        throw APIError.notFound('User', email)
    }

    const token = jwt.sign({ username: user.username }, config.jwtSecret, {
        expiresIn: '7d',
    })

    return token
}

/**
 * OTP Queue and Worker
 *
 * These functions are used to create the OTP Queue and Worker.
 * The OTP Queue and Worker are created only once and are reused.
 *
 */

let otpQueue: Queue
let otpWorker: Worker

export const getOTPQueue = async () => {
    if (!otpQueue) {
        otpQueue = await createQueue('otpQueue')
        console.log('OTP Queue Started')
    }
    return otpQueue
}

export const getOTPWorker = async () => {
    if (!otpWorker) {
        otpWorker = await createWorker('otpQueue', processOTPJob)
        console.log('OTP Worker Started')
    }
    return otpWorker
}

const processOTPJob = async (job: Job) => {
    const { email, otp, username, expiry } = job.data

    await storeOTP(email, otp)
    await sendOTP(email, otp.toString(), username, expiry)
}

/**
 * API Core Functions
 *
 * These functions are the core functions that are used by the user module.
 *
 */

export const registerCore = async (username: string, email: string) => {
    const user = await createEntity<IUserDocument>(User, {
        username,
        email,
    })

    return user
}

export const loginCore = async (email: string) => {
    const user = await readEntity<IUserDocument>(User, { email })
    const otp = generateOTP()

    await getOTPWorker()
    const otpQueueInstance = await getOTPQueue()

    await otpQueueInstance.add('otp', {
        email,
        otp,
        username: user ? user.username : 'User',
        expiry: config.redisOtpExp,
    })
    return
}

export const verifyOTPCore = async (email: string, otp: string) => {
    const isVerified = await verifyOTP(email, otp)

    if (!isVerified) {
        throw APIError.unauthorized()
    }

    const token = await generateToken(email)
    return { token }
}

export const lookupCore = async (_username: string, _email: string) => {}
