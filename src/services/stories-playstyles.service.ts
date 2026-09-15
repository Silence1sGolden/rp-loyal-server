import { db } from '@/db.js';
import { Playstyles } from '@/models/stories.js';
import { customParse } from '@/utils/service.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export async function createStoryPlaystyle(
  story_id: number,
  play_style: Playstyles[],
): Promise<number> {
  const flatPlaystyles = play_style.flatMap((i) => [story_id, i]);
  const placeholder = Array.from({ length: play_style.length })
    .map(() => '(?, ?)')
    .join(', ');
  const [result] = await db.execute<ResultSetHeader>(
    `
        INSERT INTO play_style (story_id, play_style)
        VALUES ${placeholder}
    `,
    [flatPlaystyles],
  );

  return result.affectedRows;
}

export async function getStoryPlaystyle(
  story_id: number,
): Promise<Playstyles[]> {
  const [play_styles] = await db.execute<(Playstyles & RowDataPacket)[]>(
    `
        SELECT play_style
        FROM story_play_styles
        WHERE story_play_styles.story_id = ?
    `,
    [story_id],
  );

  return play_styles;
}

export async function getStoriesPlaystyle(
  story_ids: number[],
): Promise<{ story_id: number; play_style: Playstyles[] }[]> {
  const [play_styles] = await db.execute<
    ({ story_id: number; play_style: string } & RowDataPacket)[]
  >(
    `
        SELECT
            story_play_styles.story_id,
            JSON_ARRAYAGG(story_play_styles.play_style) AS play_style
        FROM story_play_styles
        WHERE story_play_styles.story_id IN (?)
        GROUP BY story_play_styles.story_id;
    `,
    [story_ids],
  );

  return play_styles.map((t) => ({
    story_id: t.story_id,
    play_style: customParse(t.play_style),
  }));
}
