import { TCodeBody } from '@/models/mail/types.js';
import { CheckCode } from '@/services/users/codes.service.js';
import { CreateSession } from '@/services/users/sessions.service.js';
import { GetUserByEmail } from '@/services/users/users.service.js';
import { CustomError, CustomResponse } from '@/utils/response/index.js';
import { createAuthToken, createRefreshToken } from '@/utils/tokens/index.js';
import { RequestHandler } from 'express';

export const authController: RequestHandler = async (req, res) => {
  const data: TCodeBody | undefined = res.locals.code;

  if (!data) {
    throw new Error('Code body is missing.');
  }

  const { email, code } = data;

  try {
    const user = await GetUserByEmail(email);

    if (!user) {
      return CustomError(res, { code: 400 });
    }

    const check = await CheckCode(user.user_id, code);

    if (!check) {
      return CustomError(res, { code: 400 });
    }

    const session_id = await CreateSession(user.user_id);

    if (!session_id) {
      throw new Error('Error creating session.');
    }

    const authToken = createAuthToken(user.user_id);
    const refreshToken = createRefreshToken(session_id);

    // Устанавливаем новые куки
    res.cookie('auth_token', authToken, {
      sameSite: 'strict',
      secure: true,
      httpOnly: true,
    });
    res.cookie('refresh_token', refreshToken, {
      sameSite: 'strict',
      secure: true,
      httpOnly: true,
    });

    CustomResponse(res);
  } catch (error) {
    CustomError(res, { code: 500, logger: error });
  }
};
