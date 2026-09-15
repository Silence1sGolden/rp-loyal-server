import { db } from '@/db.js';
import { EditableStoryParams } from '@/models/stories.js';
import { ResultSetHeader } from 'mysql2';
import { createStoryTags } from '../stories-tags.service.js';
import { createStoryPlaystyle } from '../stories-playstyles.service.js';

export async function createStory(
  author_id: number,
  story: EditableStoryParams,
): Promise<boolean> {
  const { title, description, preview, play_type } = story;
  const [result] = await db.execute<ResultSetHeader>(
    `
        INSERT INTO stories (author_id, title, description, preview_id, play_type)
        VALUES (?, ?, ?, ?, ?)
    `,
    [author_id, title, description || null, preview || null, play_type],
  );

  if (!result.insertId) {
    throw new Error('Error in craete story, returned wrong insertId');
  }

  await createStoryTags(result.insertId, story.tags);
  await createStoryPlaystyle(result.insertId, story.play_style);

  return result.affectedRows > 0;
}
