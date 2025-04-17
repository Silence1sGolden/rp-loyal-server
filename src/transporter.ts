import nodemailer from 'nodemailer';
import 'dotenv/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { BASE_URL, EMAIL, EMAIL_PASSWORD } from './utils/service';

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
    to: to,
    subject: 'Подтверждение аккаунта',
    text: 'Пожалуйста, подтвердите ваш аккаунт.',
    html: `<!doctype html>
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
        color: #cccccc;
        font-family: 'Piazzolla', serif;
        font-weight: 200;
        background-color: #171717;
      }

      .table {
        margin: auto;
        padding: 5px 10px;
        border-radius: 5px;
        border: 1px solid #292929;
        max-width: 450px;
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
        background-color: transparent;
        color: rgb(52, 214, 52);
        text-decoration: none;
        text-align: center;
        transition:
          color 0.3s,
          text-shadow 0.3s;
      }

      .link:hover {
        cursor: pointer;
        text-shadow: 0px 0px 10px rgb(52, 214, 52);
      }

      .td {
        position: relative;
        padding: 10px 10px;
      }

      .message {
        font-size: 14px;
        font-weight: 200;
        color: #cccccc;
        padding: 10px;
        border-radius: 15px;
        background-color: #292929;
      }

      .message_first {
        padding-top: 0px;
        border-top-left-radius: 0px;
        border-top-right-radius: 0px;
      }

      .author {
        font-size: 14px;
        width: 100%;
        padding: 3px 7px;
        padding-bottom: 0px;
        color: #d14d4d;
        background-color: #292929;
        border-top-left-radius: 15px;
        border-top-right-radius: 15px;
      }

      .t_left {
        text-align: start;
      }

      .t_right {
        text-align: end;
      }

      .msg {
        width: 100%;
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

      .vertical {
        vertical-align: bottom;
      }
    </style>
  </head>
  <body>
    <table class="table">
      <tbody class="tbody">
        <tr align="center">
          <td style="border-bottom: 1px solid #cccccc" colspan="3">
            <h1 class="title">RP-Royal</h1>
          </td>
        </tr>
        <tr>
          <td width="50" class="vertical">
            <img
              class="img img_l"
              width="50"
              height="50"
              src="https://i.pinimg.com/736x/80/7a/48/807a48790f4cab320ebcec6a33614d33.jpg"
              alt="mute"
            />
          </td>
          <td align="left" class="td" colspan="2">
            <table class="msg msg_r">
              <tbody>
                <tr>
                  <td>
                    <p class="author t_left">Mute</p>
                    <p class="message message_first t_left">
                      Привет! Я - mute, и я с радостью поздравляю тебя со
                      вступлением в нашу дружную семью.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p class="message t_left">
                      А перед началом, лучше всего подтвердить свою почту, чтоб
                      у тебя появилась возможность восстановить свой аккаунт или
                      изменить пароль в будущем.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p class="message t_left">Вдруг что-то произойдёт...</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td class="td" colspan="2" align="right">
            <table class="msg msg_l">
              <tbody>
                <tr>
                  <td>
                    <p class="author t_right">Пользователь</p>
                    <p class="message message_first t_right">
                      Ох уж эта дурацкая тема с подтверждением...
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
          <td align="right" width="50" class="vertical">
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
          <td align="left" width="50" class="vertical">
            <img
              class="img img_l"
              width="50"
              height="50"
              src="https://i.pinimg.com/736x/80/7a/48/807a48790f4cab320ebcec6a33614d33.jpg"
              alt="mute"
            />
          </td>
          <td class="td" colspan="2" align="left">
            <table class="msg msg_r">
              <tbody>
                <tr>
                  <td>
                    <p class="author t_left">Mute</p>
                    <p class="message message_first t_left">
                      Это не конец света, так что
                      <a class="link" href="${BASE_URL}/api/v/r/${token}"
                        >подтверди</a
                      >
                      свою почту и гуляй смело, зато после ещё спасибо скажешь)
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
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
    to: to,
    subject: 'Авторизация',
    text: 'Код авторизации.',
    html: `<!doctype html>
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
        margin: auto;
        padding: 5px 10px;
        border-radius: 5px;
        border: 1px solid #292929;
        max-width: 450px;
        width: 100%;
      }

      .title {
        padding: 5px 0px;
        text-align: center;
        color: #ccc;
        font-size: 30px;
        font-weight: 300;
        border-bottom: 1px solid #ccc;
      }

      .t {
        padding: 10px 0px;
        color: #fff;
        font-size: 14px;
        font-weight: 300;
        text-align: center;
      }

      .code {
        margin: 0 auto;
        width: fit-content;
        position: relative;
        text-align: center;
        color: #fff;
      }

      .code::after {
        opacity: 1;
        z-index: 2;
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: aqua;
        transition: opacity 0.5s;
        animation: codeAnim 5s infinite linear;
      }

      .code:hover::after {
        opacity: 0;
      }

      @keyframes codeAnim {
        from {
          background-color: #fff;
        }

        50% {
          background-color: #000;
        }

        to {
          background-color: #fff;
        }
      }
    </style>
  </head>
  <body>
    <table class="table">
      <tbody>
        <tr>
          <td>
            <h1 class="title">RP-loyal</h1>
          </td>
        </tr>
        <tr>
          <td>
            <p class="t">
              Если это не вы,<br />
              то, пожалуйста, сообщите об этом в поддержку!
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding: 30px">
            <h2 class="code">${code}</h2>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>

    `,
  });
}
