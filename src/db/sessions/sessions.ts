import { Config, JsonDB } from 'node-json-db';
import { TSession, TSessionTokens } from './types';

const sessionsDB = new JsonDB(
  new Config('./src/db/sessions/db', true, false, '/'),
);

export const getSessions = async (): Promise<TSession> => {
  return await sessionsDB.getData('/sessions');
};

export const setSessions = async (sessions: TSession): Promise<void> => {
  await sessionsDB.push('/sessions', sessions);
};

export const getSessionByID = async (
  id: string,
): Promise<TSessionTokens | undefined> => {
  return await getSessions().then((sessions) => {
    return sessions[id];
  });
};

export const createSession = async (
  id: string,
  accessToken: string,
  refreshToken: string,
): Promise<void> => {
  return await getSessions().then(async (sessions) => {
    sessions[id] = { accessToken: accessToken, refreshToken: refreshToken };
    return await setSessions(sessions);
  });
};

export const deleteSession = async (id: string): Promise<void> => {
  return await getSessions().then(async (sessions) => {
    delete sessions[id];
    return await setSessions(sessions);
  });
};

export const updateSession = async (
  id: string,
  data: TSessionTokens,
): Promise<void> => {
  return await getSessions().then(async (sessions) => {
    sessions[id] = data;
  });
};
