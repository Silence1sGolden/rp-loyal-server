import path from 'path';
import fs from 'fs';
import Handlebars from 'handlebars';
import { TConfirmCodeMailProps } from '@/models/mail/types';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export const EMAIL = process.env.EMAIL;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const FROM = '"RP-loyal.official" <rployal.official@mail.ru>';

const transporter = nodemailer.createTransport({
  host: 'smtp.mail.ru',
  port: 465,
  secure: true,
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
  },
});

async function sendMail(options?: SMTPTransport.Options): Promise<boolean> {
  try {
    await transporter.sendMail({
      ...options,
      from: FROM,
    });

    return true;
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error &&
      'code' in error &&
      'command' in error
    ) {
      if (error.code === 'EAUTH') {
        console.error('Authorization error! Check your login and password.');
      }

      if (error.code === 'ECONNECTION') {
        console.error(
          'Failed to connect to the SMTP server. Check the host/port or firewall.',
        );
      }

      if (error.command) {
        console.error(
          `An error occurred during the SMTP command stage: ${error.command}`,
        );
      }
    }

    return false;
  }
}

export async function sendCodeMail(
  email: string | Mail.Address | (string | Mail.Address)[],
  props: TConfirmCodeMailProps,
): Promise<boolean> {
  const templatePath = path.join(
    __dirname,
    '../../utils/templates/confirmCode.html',
  );
  const templateSource = fs.readFileSync(templatePath, 'utf-8');

  const compiledTemplate =
    Handlebars.compile<TConfirmCodeMailProps>(templateSource);

  const finalHtml = compiledTemplate(props);

  return await sendMail({
    to: email,
    subject: 'Код авторизации',
    text: 'Ваш код для входа',
    html: finalHtml,
  });
}

export async function sendRegMailWithToken(
  to: string[],
  token: string,
): Promise<void | SMTPTransport.SentMessageInfo> {
  return await transporter.sendMail({
    from: '"RP-loyal.official" <rployal.official@mail.ru>',
    to: to,
    subject: 'Подтверждение аккаунта',
    text: 'Пожалуйста, подтвердите ваш аккаунт.',
    html: `

`,
  });
}

export async function sendAlertMail(
  to: string[],
  data?: string,
): Promise<void | SMTPTransport.SentMessageInfo> {
  return await transporter.sendMail({
    from: '"RP-loyal.official" <rployal.official@mail.ru>',
    to: to,
    subject: 'Попытка авторизации',
    text: 'Предупреждение',
    html: ``,
  });
}
