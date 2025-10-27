import { Secret } from 'jsonwebtoken';

export const BASE_URL = process.env.BASE_URL ?? 'http://192.168.1.100:3000';
export const EMAIL = process.env.EMAIL;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
export const SECRET: Secret = process.env.SECRET ?? 'secret';
export const JWT_KEY: string = process.env.JWT_KEY ?? 'JWT_KEY';
