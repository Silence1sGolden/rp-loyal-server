import { Config, JsonDB } from 'node-json-db';
import { TMessage, TRoles } from './types';
import { UUID } from 'crypto';

const rolesDB = new JsonDB(new Config('./src/db/roles/db', true, false, '/'));

export const getRoles = async (): Promise<TRoles[]> => {
  return await rolesDB.getData('/roles');
};

export const setRoles = async (roles: TRoles[]): Promise<void> => {
  return await rolesDB.push('/roles', roles);
};

export const createRoles = async (role: TRoles): Promise<void> => {
  return await getRoles().then(async (roles) => {
    return await setRoles([...roles, role]);
  });
};

export const getRolesByID = async (id: UUID): Promise<TRoles | undefined> => {
  return await getRoles().then((roles) =>
    roles.find((role) => role._id === id),
  );
};

export const writeMessage = async (
  id: UUID,
  message: TMessage,
): Promise<void> => {
  return await getRoles().then(async (roles) => {
    const role = await getRolesByID(id);

    if (role) {
      const newRoles = roles.filter((item) => item._id !== id);
      role.messages.push(message);
      return await setRoles([...newRoles, role]);
    }
  });
};

export const deleteRoles = async (id: UUID): Promise<void> => {
  return await getRoles().then(async (roles) => {
    await setRoles([...roles.filter((role) => role._id !== id)]);
  });
};

export const updateRoles = async (id: UUID, data: TRoles): Promise<void> => {
  return await getRoles().then(async (roles) => {
    const role = await getRolesByID(id);

    if (role) {
      const newRoles = roles.filter((item) => item._id !== id);
      role.rolesImage = data.rolesImage;
      role.title = data.title;
      role.description = data.description;
      role.tags = data.tags;
      return await setRoles([...newRoles, role]);
    }
  });
};
