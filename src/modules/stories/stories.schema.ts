import z from 'zod';
import { TagSchema } from '../tags/tags.schema.js';

export const StoryIDParamsSchema = z.object({
  storyID: z.coerce.number().min(1),
});

export const PlayTypeSchema = z.enum(['1v1', 'group']);
export const PlayStyleSchema = z.enum([
  'one-line',
  'semi-para',
  'para+',
  'novella',
]);

export const StoryBodySchema = z.object({
  title: z.string().trim().min(3).max(200),
  description: z.string().trim().min(1).max(1000).nullable(),
  preview_id: z.number().int().positive().nullable(),
  play_type: PlayTypeSchema,
  play_style: z
    .array(PlayStyleSchema)
    .min(1)
    .refine((arr) => new Set(arr).size === arr.length, {
      message: 'Стили не должны повторяться',
    }),
  tags: z.array(TagSchema).max(10),
});
