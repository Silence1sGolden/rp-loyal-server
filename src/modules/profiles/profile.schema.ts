import z from 'zod';

export const ProfileIDParamsSchema = z.object({
  profileID: z.coerce.number().min(1),
});
