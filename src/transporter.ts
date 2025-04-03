import nodemailer, { SentMessageInfo } from 'nodemailer';
import 'dotenv/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const EMAIL = process.env.EMAIL;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  host: 'smtp.mail.ru',
  port: 465,
  secure: true,
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
  },
});

export async function sendVerifyMail(
  to: string[],
): Promise<void | SMTPTransport.SentMessageInfo> {
  const number: number = Math.round(Math.random() * (999999 - 100000) + 100000);

  const info = await transporter
    .sendMail({
      from: '"RP-loyal.official" <rployal.official@mail.ru>',
      to: to.join(' '),
      subject: 'Подтверждение аккаунта',
      text: 'Пожалуйста, подтвердите ваш аккаунт.',
      html: `
    <h1>Код подтверждения</h1>
    <p style="color: #990099">Никому не сообщайте данный код подтверждения.</p>
    <h2>${number}</h2>
    `,
    })
    .catch((err) => console.log(err));

  return info;
}
