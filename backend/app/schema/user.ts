/*************************
 *
 * Copyright 2025 @Qreater
 * Licensed under the Apache License, Version 2.0.
 * See: http://www.apache.org/licenses/LICENSE-2.0
 *
 *************************/

import { body, query } from 'express-validator'

export const validateUsername = () =>
    body('username')
        .notEmpty()
        .withMessage('Username is required')
        .isString()
        .withMessage('Username must be a string')
        .isLength({ min: 3, max: 20 })
        .withMessage('Username must be between 3 and 20 characters')

export const validateEmail = (field: string = 'email') =>
    body(field)
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email must be a valid email address')

export const validateOTP = () =>
    body('otp')
        .notEmpty()
        .withMessage('OTP is required')
        .isNumeric()
        .withMessage('OTP must be a number')
        .isLength({ min: 6, max: 6 })
        .withMessage('OTP must be exactly 6 digits')

export const validateQueryEmail = (field: string = 'email') =>
    query(field)
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email must be a valid email address')

export const validateQueryUsername = (field: string = 'username') =>
    query(field)
        .notEmpty()
        .withMessage('Username is required')
        .isString()
        .withMessage('Username must be a string')
        .isLength({ min: 3, max: 20 })
        .withMessage('Username must be between 3 and 20 characters')

export const registerSchema = [validateUsername(), validateEmail()]

export const loginSchema = [validateEmail()]

export const verifyOTPSchema = [validateEmail(), validateOTP()]

export const lookupSchema = [validateQueryUsername(), validateQueryEmail()]

export const meSchema = []
