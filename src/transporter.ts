import nodemailer from 'nodemailer';
import 'dotenv/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import {
  BASE_URL,
  EMAIL,
  EMAIL_PASSWORD,
  getRandomCode,
} from './utils/service';

const transporter = nodemailer.createTransport({
  host: 'smtp.mail.ru',
  port: 465,
  secure: true,
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
  },
});

export async function sendRegMailWithToken(
  to: string[],
  token: string,
): Promise<void | SMTPTransport.SentMessageInfo> {
  return await transporter.sendMail({
    from: '"RP-loyal.official" <rployal.official@mail.ru>',
    to: to.join(' '),
    subject: 'Подтверждение аккаунта',
    text: 'Пожалуйста, подтвердите ваш аккаунт.',
    html: `
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title></title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Piazzolla:ital,opsz,wght@0,8..30,100..900;1,8..30,100..900&display=swap');

      * {
        margin: 0px;
        padding: 0px;
        border: none;
        box-sizing: border-box;
        color: black;
        font-family: 'Piazzolla', serif;
        font-weight: 400;
        background-color: #171717;
      }

      .table {
        width: 100%;
      }

      .title {
        font-size: 34px;
        font-weight: 800;
      }

      .subtitle {
        font-size: 24px;
      }

      .link {
        text-decoration: none;
        text-align: center;
        transition: color 0.3s;
      }

      .link:hover {
        cursor: pointer;
        color: red;
      }

      .img {
        margin-top: auto;
        object-fit: contain;
        object-position: center;
        width: 50px;
        height: 50px;
        border-radius: 100px;
        box-shadow: 0px 0px 10px #ffffff;
      }
      .message {
        font-size: 14px;
        font-weight: 200;
        color: #cccccc;
        padding: 5px;
        border: 1px solid #39393939;
        border-radius: 5px;
      }

      .message:nth-child(even) {
        margin: 10px 0px;
      }
    </style>
  </head>
  <body>
    <table class="table">
      <tbody>
        <tr align="center">
          <td style="border-bottom: 1px solid #cccccc" colspan="2">
            <h1 class="title">RP-Royal</h1>
          </td>
        </tr>
        <tr>
          <td align="left">
            <img
              class="img"
              width="50"
              height="50"
              src="https://i.pinimg.com/736x/80/7a/48/807a48790f4cab320ebcec6a33614d33.jpg"
              alt="mute"
            />
          </td>
          <td align="right">
            <p class="message">
              Привет! Я - mute, и я с радостью поздравляю тебя со вступлением в
              нашу дружную семью.
            </p>
            <p class="message">
              А перед началом, лучше всего подтвердить свою почту, чтоб у тебя
              появилась возможность восстановить свой аккаунт или изменить
              пароль в будущем.
            </p>
            <p class="message">Вдруг что-то произойдёт...</p>
          </td>
        </tr>
        <tr>
          <td>
            <p class="message">Ох уж эта дурацкая тема с подтверждением...</p>
          </td>
          <td>
            <img
              class="img"
              width="50"
              height="50"
              src="https://i.pinimg.com/736x/bd/e9/81/bde981ce4d24ffdea7b177c549566c43.jpg"
              alt="kitty"
            />
          </td>
        </tr>
        <tr>
          <td>
            <img
              class="img"
              width="50"
              height="50"
              src="https://i.pinimg.com/736x/80/7a/48/807a48790f4cab320ebcec6a33614d33.jpg"
              alt="mute"
            />
          </td>
          <td>
            <p class="message">
              Это не конец света, так что
              <a class="vlink" href="${BASE_URL}/api/v/r/${token}">подтверди</a>
              свою почту и гуляй смело, зато после ещё спасибо скажешь)
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>

    `,
  });
}

export async function sendAuthVerifyMail(
  to: string[],
  code: number,
): Promise<void | SMTPTransport.SentMessageInfo> {
  return await transporter.sendMail({
    from: '"RP-loyal.official" <rployal.official@mail.ru>',
    to: to.join(' '),
    subject: 'Авторизация',
    text: 'Код авторизации.',
    html: `
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title></title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Piazzolla:ital,opsz,wght@0,8..30,100..900;1,8..30,100..900&display=swap');

      * {
        margin: 0px;
        padding: 0px;
        border: none;
        box-sizing: border-box;
        color: black;
        font-family: 'Piazzolla', serif;
        font-weight: 400;
        background-color: #171717;
      }
    </style>
  </head>
  <body>
    <p>Если это не вы, то, пожалуйста, обратитесь в поддержку незамедлительно!</p>
    <h2>${code}</h2>
  </body>
</html>
    `,
  });
}
