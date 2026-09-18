export type AuthTokenPayload = { user_id: number };
export type RefreshTokenPayload = { session_id: number };

export type UsersSchema = {
  id: number;
  username: string;
  email: string;
  is_activated: boolean;
  created_at: string;
};

export type PasswordsSchema = {
  user_id: number;
  pass_hash: string;
};

export type CodesSchema = {
  user_id: number;
  code: string;
  expires_at: string;
};

export type SessionsSchema = {
  id: number;
  user_id: number;
  expires_at: string;
};
