import z from 'zod';

export const TagSchema = z.object({
  slug: z.string().trim().min(1),
  name_en: z.string().trim().min(1),
});
