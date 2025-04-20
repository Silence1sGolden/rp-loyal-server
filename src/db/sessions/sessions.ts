import { Config, JsonDB } from 'node-json-db';
import { TSession } from './types';
import { UUID } from 'crypto';

const sessionsDB = new JsonDB(
  new Config('./src/db/sessions/db', true, false, '/'),
);

export const getSessions = async (): Promise<TSession[]> => {
  return await sessionsDB.getData('/sessions');
};

export const setSessions = async (sessions: TSession[]): Promise<void> => {
  await sessionsDB.push('/sessions', sessions);
};

export const getSession = async (
  sessionID: UUID,
): Promise<TSession | undefined> => {
  return await getSessions().then((sessions) => {
    return sessions.find((session) => session.sessionID === sessionID);
  });
};

export const createSession = async (data: TSession): Promise<void> => {
  return await getSessions().then(async (sessions) => {
    return await setSessions([...sessions, data]);
  });
};

export const deleteSession = async (sessionID: UUID): Promise<void> => {
  return await getSessions().then(async (sessions) => {
    return await setSessions(
      sessions.filter((session) => session.sessionID !== sessionID),
    );
  });
};

export const updateSession = async (
  sessionID: UUID,
  data: TSession,
): Promise<void> => {
  return await getSessions().then(async (sessions) => {
    return await setSessions([
      ...sessions.filter((session) => session.sessionID !== sessionID),
      data,
    ]);
  });
};
