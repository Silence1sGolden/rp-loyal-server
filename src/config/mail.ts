import nodemailer from 'nodemailer';

export const SITE_URL = process.env.SITE_URL || 'http://localhost:5173';
const MAIL_EMAIL = process.env.EMAIL;
const MAIL_PASSWORD = process.env.EMAIL_PASSWORD;
export const MAIL_FROM = '"RP-loyal.official" <rployal.official@mail.ru>';

export const transporter = nodemailer.createTransport({
  host: 'smtp.mail.ru',
  port: 465,
  secure: true,
  auth: {
    user: MAIL_EMAIL,
    pass: MAIL_PASSWORD,
  },
});
