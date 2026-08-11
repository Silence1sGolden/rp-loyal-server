import { RowDataPacket } from 'mysql2';

export type TCodeBody = {
  email: string;
  code: string;
};

export type TConfirmCodeMailProps = {
  code: string;
};

export type TConfirmLinkMailProps = {
  base_url: string;
  jwtlink: string;
};

export type TConfirmUserMailProps = {
  hash: string;
};

export type TCodeRow = RowDataPacket & TCode;
export type TCode = {
  user_id: number;
  code: string;
  expires_at: string;
};

export type TTempltesProps = {
  code: TConfirmCodeMailProps;
  link: TConfirmLinkMailProps;
};

export type TTemplates = keyof TTempltesProps;
