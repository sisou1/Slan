import { pool } from "../db/client.js";
import type {
  Activity,
  ActivityDetails,
  CreateActivityInput,
  Participant,
  UpdateActivityInput,
} from "../types.js";

export async function listActivities(): Promise<Activity[]> {
  const result = await pool.query(
    `
      SELECT
        a.id,
        a.name,
        a.description,
        a.created_at,
        COUNT(ap.id)::int AS participants_count
      FROM activities a
      LEFT JOIN activity_participants ap ON ap.activity_id = a.id
      GROUP BY a.id
      ORDER BY a.created_at DESC
    `,
  );
  return result.rows;
}

export async function getActivityById(activityId: number): Promise<ActivityDetails | null> {
  const result = await pool.query(
    `SELECT id, name, description, created_at FROM activities WHERE id = $1`,
    [activityId],
  );
  return result.rows[0] ?? null;
}

export async function createActivity({
  name,
  description,
}: CreateActivityInput): Promise<ActivityDetails> {
  const result = await pool.query(
    `
      INSERT INTO activities (name, description)
      VALUES ($1, $2)
      RETURNING id, name, description, created_at
    `,
    [name, description ?? null],
  );
  return result.rows[0];
}

export async function updateActivity(
  activityId: number,
  { name, description }: UpdateActivityInput,
): Promise<ActivityDetails | null> {
  const result = await pool.query(
    `
      UPDATE activities
      SET name = $1, description = $2
      WHERE id = $3
      RETURNING id, name, description, created_at
    `,
    [name, description ?? null, activityId],
  );
  return result.rows[0] ?? null;
}

export async function deleteActivity(activityId: number): Promise<{ id: number } | null> {
  const result = await pool.query(
    `DELETE FROM activities WHERE id = $1 RETURNING id`,
    [activityId],
  );
  return result.rows[0] ?? null;
}

export async function listParticipants(activityId: number): Promise<Participant[]> {
  const result = await pool.query(
    `
      SELECT id, activity_id, nickname, joined_at
      FROM activity_participants
      WHERE activity_id = $1
      ORDER BY joined_at ASC
    `,
    [activityId],
  );
  return result.rows;
}

export async function joinActivity(activityId: number, nickname: string): Promise<Participant> {
  const result = await pool.query(
    `
      INSERT INTO activity_participants (activity_id, nickname)
      VALUES ($1, $2)
      RETURNING id, activity_id, nickname, joined_at
    `,
    [activityId, nickname],
  );
  return result.rows[0];
}
