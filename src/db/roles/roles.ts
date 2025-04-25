import { Config, JsonDB } from 'node-json-db';
import { TRoles, TRolesForChange, TSearchParams } from './types';
import { UUID } from 'crypto';

const rolesDB = new JsonDB(new Config('./src/db/roles/db', true, false, '/'));

export const getRoles = async (): Promise<TRoles[]> => {
  return await rolesDB.getData('/roles');
};

export const setRoles = async (rooms: TRoles[]): Promise<void> => {
  return await rolesDB.push('/roles', rooms);
};

export const getRolesWithFilter = async (
  id: UUID,
  filter: TSearchParams,
): Promise<TRoles[]> => {
  const roles = await getRoles();

  return roles
    .filter((role) => {
      if (filter.tags && filter.tags.length) {
        return role.tags.every((item) => filter.tags!.includes(item));
      } else {
        return true;
      }
    })
    .filter((role) => {
      if (filter.ganre && filter.ganre.length) {
        return role.ganre.every((item) => filter.ganre!.includes(item));
      } else {
        return true;
      }
    })
    .filter((role) => {
      if (filter.likes) {
        if (role.author.stats.likes.includes(id)) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    });
};

export const getRolesByID = async (id: UUID): Promise<TRoles | undefined> => {
  const roles = await getRoles();

  return roles.find((role) => role._id === id);
};

export const createRoles = async (role: TRoles): Promise<void> => {
  const roles = await getRoles();

  await setRoles([...roles, role]);
};

export const deleteRoles = async (id: UUID): Promise<void> => {
  const roles = await getRoles();

  await setRoles(roles.filter((role) => role._id !== id));
};

export const updateRoles = async (
  id: UUID,
  data: TRolesForChange,
): Promise<void> => {
  const roles = await getRoles();
  const role = await getRolesByID(id);

  if (role) {
    role.about = data.about;
    role.ganre = data.ganre;
    role.rolesIMG = data.rolesIMG;
    role.tags = data.tags;
    role.title = data.title;

    await setRoles([...roles.filter((item) => item._id !== id), role]);
  }
};
