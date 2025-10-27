import { Config, JsonDB } from 'node-json-db';
import { UUID } from 'crypto';
import { TSession } from '@/models/types';
import path from 'path';

const sessionsDB = new JsonDB(
  new Config(path.join(__dirname, 'auth.db.json'), true, false, '/'),
);

const getSessionsByUserID = async (
  userID: number,
): Promise<TSession[] | undefined> => {
  return await sessionsDB.getData(`/sessions/${userID}`);
};

const setSessionsByUserID = async (
  userID: number,
  sessions: TSession[],
): Promise<void> => {
  await sessionsDB.push(`/sessions/${userID}`, sessions);
};

export const getSession = async (
  userID: number,
  sessionID: UUID,
): Promise<TSession | undefined> => {
  const sessions = await getSessionsByUserID(userID);
  if (sessions) {
    return sessions.find((item) => item.id === sessionID);
  }
};

export const createSession = async (
  userID: number,
  data: TSession,
): Promise<void> => {
  const prevSessions = await getSessionsByUserID(userID);
  if (prevSessions) {
    await setSessionsByUserID(userID, [data, ...prevSessions]);
  }
};

export const deleteSession = async (
  userID: number,
  sessionID: UUID,
): Promise<void> => {
  const sessions = await getSessionsByUserID(userID);
  if (sessions) {
    setSessionsByUserID(
      userID,
      sessions.filter((item) => item.id !== sessionID),
    );
  }
};
