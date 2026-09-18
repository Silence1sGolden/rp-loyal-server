import z from 'zod';

export const UserIDLocalsSchema = z.object({
  userID: z.coerce.number(),
});

export const ProfileIDParamsSchema = z.object({
  profileID: z.coerce.number(),
});

export const CodeLocalsSchema = z.object({
  email: z.string(),
  code: z.string().length(6),
});
