import { Config, JsonDB } from 'node-json-db';
import { TRoles, IRolesForChange, ISearchParams } from './types';
import { UUID } from 'crypto';
import { getProfileByID } from '../profiles';

const rolesDB = new JsonDB(new Config('./src/db/roles/db', true, false, '/'));

const getRoles = async (): Promise<TRoles[]> => {
  return await rolesDB.getData('/roles');
};

const setRoles = async (rooms: TRoles[]): Promise<void> => {
  await rolesDB.push('/roles', rooms);
};

export const getRolesWithFilter = async (
  id: UUID,
  filter: ISearchParams,
): Promise<TRoles[]> => {
  const roles = await getRoles();

  return roles
    .filter((role) => {
      if (filter.tags) {
        return filter.tags.every((filterTag) =>
          role.tags.find((roleTag) => roleTag === filterTag),
        );
      } else {
        return true;
      }
    })
    .filter((role) => {
      if (filter.ganre) {
        return filter.ganre.every((filterGanre) =>
          role.ganre.find((roleGanre) => roleGanre === filterGanre),
        );
      } else {
        return true;
      }
    })
    .filter(async (role) => {
      if (filter.likes) {
        const author = await getProfileByID(role.author);

        if (author && author.stats.likes.includes(id)) {
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
  data: IRolesForChange,
): Promise<void> => {
  const roles = await getRoles();
  const role = await getRolesByID(id);

  if (role) {
    role.description = data.description;
    role.ganre = data.ganre;
    role.avatar = data.avatar;
    role.background = data.background;
    role.tags = data.tags;
    role.title = data.title;

    await setRoles([...roles.filter((item) => item._id !== id), role]);
  }
};
