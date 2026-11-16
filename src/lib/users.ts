import { db } from "./db";

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

type UserRow = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
};

export type StoredUser = PublicUser & { passwordHash: string };

function mapUser(row: UserRow): StoredUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    createdAt: row.created_at,
  };
}

export function publicUser(user: StoredUser): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

export function findUserByEmail(email: string): StoredUser | null {
  const row = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email.toLowerCase()) as UserRow | undefined;
  return row ? mapUser(row) : null;
}

export function findUserById(id: string): StoredUser | null {
  const row = db.prepare("SELECT * FROM users WHERE id = ?").get(id) as
    | UserRow
    | undefined;
  return row ? mapUser(row) : null;
}

export function createUser(input: {
  name: string;
  email: string;
  passwordHash: string;
}): StoredUser {
  const user: StoredUser = {
    id: crypto.randomUUID(),
    name: input.name,
    email: input.email.toLowerCase(),
    passwordHash: input.passwordHash,
    createdAt: new Date().toISOString(),
  };

  db.prepare(
    "INSERT INTO users (id, name, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)",
  ).run(user.id, user.name, user.email, user.passwordHash, user.createdAt);

  return user;
}

export function getCompletedLessonIds(userId: string): string[] {
  const rows = db
    .prepare(
      "SELECT lesson_id FROM progress WHERE user_id = ? ORDER BY completed_at",
    )
    .all(userId) as { lesson_id: string }[];
  return rows.map((row) => row.lesson_id);
}

export function setLessonCompleted(
  userId: string,
  lessonId: string,
  completed: boolean,
): boolean {
  const exists = db
    .prepare("SELECT id FROM lessons WHERE id = ?")
    .get(lessonId) as { id: string } | undefined;
  if (!exists) return false;

  if (completed) {
    db.prepare(
      "INSERT INTO progress (user_id, lesson_id, completed_at) VALUES (?, ?, ?) ON CONFLICT(user_id, lesson_id) DO NOTHING",
    ).run(userId, lessonId, new Date().toISOString());
  } else {
    db.prepare("DELETE FROM progress WHERE user_id = ? AND lesson_id = ?").run(
      userId,
      lessonId,
    );
  }
  return true;
}

export function mergeCompletedLessons(userId: string, lessonIds: string[]) {
  const statement = db.prepare(
    "INSERT INTO progress (user_id, lesson_id, completed_at) SELECT ?, id, ? FROM lessons WHERE id = ? ON CONFLICT(user_id, lesson_id) DO NOTHING",
  );
  const now = new Date().toISOString();
  db.exec("BEGIN");
  try {
    for (const lessonId of lessonIds) {
      statement.run(userId, now, lessonId);
    }
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
  return getCompletedLessonIds(userId);
}
