/*************************
 *
 * Copyright 2025 @Qreater
 * Licensed under the Apache License, Version 2.0.
 * See: http://www.apache.org/licenses/LICENSE-2.0
 *
 *************************/

import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'
import path from 'path'
import { config } from '../settings/config'

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: config.emailUser,
        pass: config.emailPass,
    },
})

transporter.use(
    'compile',
    hbs({
        viewEngine: {
            extname: '.hbs',
            layoutsDir: path.join(__dirname, '../../../assets/email/'),
            defaultLayout: 'otp_email',
        },
        viewPath: path.join(__dirname, '../../../assets/email/'),
        extName: '.hbs',
    }),
)

export const sendMail = async (
    to: string,
    subject: string,
    template: string,
    context: unknown,
) => {
    const mailOptions = {
        from: `"Qreater Support" <${config.emailUser}>`,
        to,
        subject,
        template,
        context,
    }

    try {
        await transporter.sendMail(mailOptions)
    } catch (error) {
        console.error('Error sending email:', error)
        throw error
    }
}
