import { RowDataPacket } from 'mysql2';

export type Tag = {
  slug: string;
  name_en: string;
};

export type TagRow = RowDataPacket & Tag;
