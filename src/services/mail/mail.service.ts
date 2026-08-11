import path from 'path';
import fs from 'fs';
import Handlebars from 'handlebars';
import { TTemplates, TTempltesProps } from '@/models/mail/types.js';
import Mail from 'nodemailer/lib/mailer/index.js';
import SMTPTransport from 'nodemailer/lib/smtp-transport/index.js';
import { MAIL_FROM, SITE_URL, transporter } from '@/config/mail.js';

function getTemplate<T extends TTemplates>(
  template: T,
  props: TTempltesProps[T],
): string {
  const templatePath = path.join(
    import.meta.dirname,
    `../../utils/templates/${template}.html`,
  );
  const templateSource = fs.readFileSync(templatePath, 'utf-8');

  const compiledTemplate =
    Handlebars.compile<TTempltesProps[T]>(templateSource);

  return compiledTemplate(props);
}

async function sendMail(options?: SMTPTransport.Options): Promise<boolean> {
  try {
    await transporter.sendMail({
      ...options,
      from: MAIL_FROM,
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
  code: string,
): Promise<boolean> {
  const html = getTemplate('code', { code });

  return await sendMail({
    to: email,
    subject: 'Код авторизации',
    text: 'Ваш код для входа',
    html: html,
  });
}

export async function sendLinkMail(
  email: string | Mail.Address | (string | Mail.Address)[],
  jwtlink: string,
): Promise<boolean> {
  const html = getTemplate('link', {
    jwtlink: jwtlink,
    base_url: SITE_URL,
  });

  return await sendMail({
    to: email,
    subject: 'Подтверждение аккаунта',
    text: 'Ссылка на подтверждение аккаунта.',
    html: html,
  });
}

export async function sendAlertMail(
  to: string[],
): Promise<void | SMTPTransport.SentMessageInfo> {
  return await transporter.sendMail({
    from: '"RP-loyal.official" <rployal.official@mail.ru>',
    to: to,
    subject: 'Попытка авторизации',
    text: 'Предупреждение',
    html: ``,
  });
}
