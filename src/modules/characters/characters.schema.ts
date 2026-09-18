import z from 'zod';

export const CharactersSchema = z.object({
  avatar_id: z.number().int().nullable().default(null),
  first_name: z.string(),
  second_name: z.string().nullable().default(null),
  gender: z.string().nullable().default(null),
  age: z.number().int().nullable().default(null),
  appearance: z.string().nullable().default(null),
  history: z.string().nullable().default(null),
});

export type CreateCharacterBody = z.infer<typeof CharactersSchema>;

export const CharacterIDParamsSchema = z.object({
  characterID: z.coerce.number(),
});
