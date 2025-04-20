import { UUID } from 'crypto';

export type TSession = {
  id: UUID;
  sessionID: UUID;
  key: UUID;
  deathTime: number;
};

export type TAccessTokenBody = {
  id: UUID;
  sessionID: UUID;
};
