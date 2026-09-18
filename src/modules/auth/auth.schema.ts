import z from 'zod';

export const LoginSchema = z.object({
  email: z.email().trim().toLowerCase().max(255),
  password: z.string().min(8).max(128),
});

export const RegistrationSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3)
    .max(32)
    .regex(/^[a-zA-Z0-9_]+$/),
  email: z.email().trim().toLowerCase().max(255),
  password: z.string().min(8).max(128),
});

export const JWTParamsSchema = z.object({
  jwtlink: z.jwt(),
});
