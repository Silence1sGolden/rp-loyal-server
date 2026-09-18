import { StoryIDParamsSchema } from '@/modules/stories/stories.schema.js';
import z from 'zod';

export const ApplicationIDParamsSchema = StoryIDParamsSchema.extend({
  applicationID: z.coerce.number(),
});

export const ApplicationDecisionBodySchema = z.object({
  decision: z.enum(['accept', 'reject']),
});
