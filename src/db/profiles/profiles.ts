import { Config, JsonDB } from 'node-json-db';
import {
  TBannedProfile,
  TDeletedProfile,
  TProfile,
  TProfileForChange,
} from './types';
import { UUID } from 'crypto';

const profilesDB = new JsonDB(
  new Config('./src/db/profiles/db', true, false, '/'),
);

export const getProfiles = async (): Promise<TProfile[]> => {
  return await profilesDB.getData('/profiles');
};

export const setProfiles = async (users: TProfile[]): Promise<void> => {
  return await profilesDB.push('/profiles', users);
};

export const getDeleted = async (): Promise<TDeletedProfile[]> => {
  return await profilesDB.getData('/deleted');
};

export const setDeleted = async (users: TDeletedProfile[]): Promise<void> => {
  return await profilesDB.push('/deleted', users);
};

export const getDeletedByID = async (
  id: UUID,
): Promise<TDeletedProfile | undefined> => {
  const deleted = await getDeleted();
  return deleted.find((item) => item._id === id);
};

export const getBanned = async (): Promise<TBannedProfile[]> => {
  return await profilesDB.getData('/deleted');
};

export const setBanned = async (users: TBannedProfile[]): Promise<void> => {
  return await profilesDB.push('/deleted', users);
};

export const getBannedByID = async (
  id: UUID,
): Promise<TBannedProfile | undefined> => {
  const banned = await getBanned();
  return banned.find((item) => item._id === id);
};

export const getProfileByID = async (
  id: UUID,
): Promise<TProfile | undefined> => {
  const profiles = await getProfiles();
  return profiles.find((item) => item._id === id);
};

export const createProfile = async (user: TProfile): Promise<void> => {
  const profiles = await getProfiles();
  if (Boolean(...profiles)) {
    await setProfiles([...profiles, user]);
  } else {
    await setProfiles([user]);
  }
};

export const deleteProfile = async (
  id: UUID,
  reason?: string,
): Promise<void> => {
  const profiles = await getProfiles();
  const profile = await getProfileByID(id);
  const deletedProfiles = await getDeleted();

  if (profile) {
    const deletedProfile = {
      _id: id,
      profile: profile,
      deleteAt: Date.now(),
      reason: reason,
    };
    await setProfiles([...profiles.filter((item) => item._id !== id)]);
    await setDeleted([...deletedProfiles, deletedProfile]);
  }
};

export const banProfile = async (id: UUID, reason: string): Promise<void> => {
  const profiles = await getProfiles();
  const profile = await getProfileByID(id);
  const bannedProfiles = await getBanned();

  if (profile) {
    const bannedProfile = {
      _id: id,
      profile: profile,
      bannedAt: Date.now(),
      reason: reason,
    };
    await setProfiles([...profiles.filter((item) => item._id !== id)]);
    await setBanned([...bannedProfiles, bannedProfile]);
  }
};

export const updateProfile = async (
  id: UUID,
  profile: TProfileForChange,
): Promise<void> => {
  const profiles = await getProfiles();
  const newProfile = profiles.find((item) => item._id === id);

  if (newProfile) {
    newProfile.about = profile.about;
    newProfile.likesTags = profile.likesTags;
    newProfile.profileIMG = profile.profileIMG;
    newProfile.status = profile.status;
    newProfile.username = profile.username;

    await setProfiles([
      ...profiles.filter((item) => item._id !== id),
      newProfile,
    ]);
  }
};
