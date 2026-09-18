import { db } from '@/db.js';
import { attachAuthTokens } from '@/middleware/auth.helper.js';
import {
  CheckOnHasCode,
  DeleteCode,
  CreateCode,
} from '@/modules/auth/codes.service.js';
import { CreateSession } from '@/modules/auth/sessions.service.js';
import {
  CreateUser,
  GetUserByEmail,
  GetUserByID,
  VerifyUser,
} from '@/modules/auth/users.service.js';
import { CustomError, CustomResponse } from '@/utils/response/index.js';
import { CodeLocalsSchema } from '@/utils/schema/user.schema.js';
import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import { sendCodeMail, sendLinkMail } from '@/modules/mail/mail.service.js';
import {
  JWTParamsSchema,
  LoginSchema,
  RegistrationSchema,
} from './auth.schema.js';
import { createVerifyToken, verifyToken } from '@/utils/tokens/index.js';
import { CreateProfile } from '@/modules/profiles/profiles.service.js';
import { withTransaction } from '@/utils/service.js';
import { CreatePassword, GetPasswordByUserID } from './passwords.service.js';
import { AuthTokenPayload } from '@/models/schemas/users.js';

export const VerifyCodeController: RequestHandler = async (req, res) => {
  const locals = CodeLocalsSchema.safeParse(req.body);

  if (!locals.success) {
    return CustomError(res, { code: 400, error: locals.error.message });
  }

  const { email, code } = locals.data;

  try {
    const user = await GetUserByEmail(db, email);

    if (!user) {
      return CustomError(res, { code: 400, error: 'Email wrong' });
    }

    const check = await CheckOnHasCode(db, user.id, code);

    if (!check) {
      return CustomError(res, { code: 404 });
    }

    const result = await withTransaction(db, async (conn) => {
      await DeleteCode(conn, user.id, code);
      const session_id = await CreateSession(conn, user.id);

      if (!session_id) {
        return 'Failed to create session: no insertId generated';
      }

      return session_id;
    });

    if (result) {
      return CustomError(res, { code: 400, error: result });
    }

    await attachAuthTokens(res, user.id, result);

    CustomResponse(res);
  } catch (error) {
    CustomError(res, { logger: error });
  }
};

export const LoginController: RequestHandler = async (req, res) => {
  const body = LoginSchema.safeParse(req.body);

  if (!body.success) {
    return CustomError(res, { code: 400, error: body.error.message });
  }

  const { email, password } = body.data;

  try {
    const user = await GetUserByEmail(db, email);

    if (!user) {
      return CustomError(res, {
        code: 400,
        error: 'Incorrect email or password.',
      });
    }

    if (!user.is_activated) {
      return CustomError(res, { code: 403, error: 'Confirm email required.' });
    }

    const user_password = await GetPasswordByUserID(db, user.id);

    if (!user_password) {
      return CustomError(res, { error: 'User without password' });
    }

    const match = await bcrypt.compare(password, user_password);

    if (!match) {
      return CustomError(res, {
        code: 400,
        error: 'Incorrect email or password.',
      });
    }

    const code = await CreateCode(db, user.id);

    if (!code) {
      throw new Error(`Failed to create code.`);
    }

    const mailStatus = await sendCodeMail([user.email], code);

    if (!mailStatus) {
      throw new Error(`Failed to send email: ${email}`);
    }

    CustomResponse(res);
  } catch (error) {
    CustomError(res, { code: 500, logger: error });
  }
};

export const VerifyAccountController: RequestHandler = async (req, res) => {
  const locals = JWTParamsSchema.safeParse(req.params);

  if (!locals.success) {
    return CustomError(res, { code: 400, error: locals.error.message });
  }

  try {
    const check = verifyToken<AuthTokenPayload>(locals.data.jwtlink, 'verify');

    if (!check) {
      return CustomError(res, { code: 400, error: 'Incorrect token.' });
    }

    const { user_id } = check;

    const user = await GetUserByID(db, user_id);

    if (!user) {
      return CustomError(res, { code: 404 });
    }

    if (user && user.is_activated) {
      return CustomError(res, { code: 400, error: 'User already activated.' });
    }

    const error = await withTransaction(db, async (conn) => {
      const verify = await VerifyUser(conn, user_id);
      if (!verify) {
        return "Can't verify user.";
      }
      const profile = await CreateProfile(conn, user_id, user.username);
      if (!profile) {
        throw new Error("Can't create profile");
      }
    });

    if (error) {
      return CustomError(res, { code: 409 });
    }

    CustomResponse(res, { code: 200 });
  } catch (error) {
    return CustomError(res, { logger: error });
  }
};

export const RegistrationController: RequestHandler = async (req, res) => {
  const body = RegistrationSchema.safeParse(req.body);

  if (!body.success) {
    return CustomError(res, { code: 400, error: body.error.message });
  }

  const { email, password, username } = body.data;

  try {
    const hasUser = await GetUserByEmail(db, email);

    if (hasUser) {
      return CustomError(res, {
        code: 400,
      });
    }

    const result = await withTransaction(db, async (conn) => {
      const user_id = await CreateUser(conn, username, email);

      if (!user_id) {
        return 'Failed to create user: no insertId';
      }

      await CreatePassword(conn, user_id, password);

      return user_id;
    });

    if (typeof result === 'string') {
      return CustomError(res, { code: 400, error: result });
    }

    const jwtlink = createVerifyToken(result);

    await sendLinkMail(email, jwtlink);

    CustomResponse(res);
  } catch (error) {
    CustomError(res, { logger: error });
  }
};
