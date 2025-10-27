import { UUID } from 'crypto';

export interface ITokenBody {
  userID: number;
  sessionID: UUID;
}
