import { CreateSession } from '@/services/users/sessions.service';
import { CustomError, CustomResponse } from '@/utils/response';
import { createAuthToken, createRefreshToken } from '@/utils/tokens';
import { RequestHandler } from 'express';

export const authController: RequestHandler = async (req, res) => {
  const user_id = req.userId;

  if (!user_id) {
    throw new Error('The user ID is missing.');
  }

  try {
    const session_id = await CreateSession(user_id);

    if (!session_id) {
      throw new Error('Error creating session.');
    }

    const authToken = createAuthToken(user_id);
    const refreshToken = createRefreshToken(session_id);

    // Устанавливаем новые куки
    res.cookie('auth_token', authToken, { sameSite: true });
    res.cookie('refresh_token', refreshToken, { sameSite: true });

    CustomResponse(res, { code: 200, message: 'Success' });
  } catch (error) {
    CustomError(res, { code: 500, logger: error });
  }
};
