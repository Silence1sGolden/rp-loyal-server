import { Config, JsonDB } from 'node-json-db';
import { UUID } from 'crypto';
import { IProfileForChange, TProfile } from '@/models/profile';
import path from 'path';

const profilesDB = new JsonDB(
  new Config(path.join(__dirname, 'profiles.db.json'), true, false, '/'),
);

const getProfiles = async (): Promise<TProfile[]> => {
  return await profilesDB.getData('/profiles');
};

const setProfiles = async (users: TProfile[]): Promise<void> => {
  await profilesDB.push('/profiles', users);
};

export const getProfileByUserID = async (
  id: number,
): Promise<TProfile | undefined> => {
  const profiles = await getProfiles();
  return profiles.find((item) => item.userID === id);
};

export const createProfile = async (user: TProfile): Promise<void> => {
  const profiles = await getProfiles();
  if (profiles.length) {
    await setProfiles([...profiles, user]);
  } else {
    await setProfiles([user]);
  }
};

export const updateProfile = async (
  userID: number,
  profile: IProfileForChange,
): Promise<void> => {
  const profiles = await getProfiles();
  const newProfile = profiles.find((item) => item.userID === userID);

  if (newProfile) {
    newProfile.about = profile.about;
    newProfile.likesTags = profile.likesTags;
    newProfile.avatar = profile.avatar;
    newProfile.background = profile.background;
    newProfile.status = profile.status;
    newProfile.username = profile.username;

    await setProfiles([
      ...profiles.filter((item) => item.userID !== userID),
      newProfile,
    ]);
  }
};

export const likeProfile = async (
  userID: number,
  targetID: UUID,
): Promise<void> => {
  const profile = await getProfileByUserID(userID);

  if (profile) {
    if (profile.stats.likes.find((item) => item === targetID)) {
      profile.stats.likes.filter((item) => item !== targetID);
    } else {
      profile.stats.likes.push(targetID);
    }

    const profiles = await getProfiles();

    await setProfiles([
      ...profiles.filter((item) => item.userID !== userID),
      profile,
    ]);
  }
};

// export const getDeletedByID = async (
//   id: UUID,
// ): Promise<TDeletedProfile | undefined> => {
//   const deleted = await getDeleted();
//   return deleted.find((item) => item._id === id);
// };

// export const getBanned = async (): Promise<TBannedProfile[]> => {
//   return await profilesDB.getData('/deleted');
// };

// export const setBanned = async (users: TBannedProfile[]): Promise<void> => {
//   await profilesDB.push('/deleted', users);
// };

// export const getBannedByID = async (
//   id: UUID,
// ): Promise<TBannedProfile | undefined> => {
//   const banned = await getBanned();
//   return banned.find((item) => item._id === id);
// };

// export const deleteProfile = async (
//   id: UUID,
//   reason?: string,
// ): Promise<void> => {
//   const profiles = await getProfiles();
//   const profile = await getProfileByID(id);
//   const deletedProfiles = await getDeleted();

//   if (profile) {
//     const deletedProfile: TDeletedProfile = {
//       _id: id,
//       profile: profile,
//       deleteAt: Date.now(),
//       reason: reason || 'Without reason',
//     };
//     await setProfiles([...profiles.filter((item) => item._id !== id)]);
//     await setDeleted([...deletedProfiles, deletedProfile]);
//   }
// };

// export const banProfile = async (id: UUID, reason: string): Promise<void> => {
//   const profiles = await getProfiles();
//   const profile = await getProfileByID(id);
//   const bannedProfiles = await getBanned();

//   if (profile) {
//     const bannedProfile = {
//       _id: id,
//       profile: profile,
//       bannedAt: Date.now(),
//       reason: reason,
//     };
//     await setProfiles([...profiles.filter((item) => item._id !== id)]);
//     await setBanned([...bannedProfiles, bannedProfile]);
//   }
// };

// export const getDeleted = async (): Promise<TDeletedProfile[]> => {
//   return await profilesDB.getData('/deleted');
// };

// export const setDeleted = async (users: TDeletedProfile[]): Promise<void> => {
//   await profilesDB.push('/deleted', users);
// };
