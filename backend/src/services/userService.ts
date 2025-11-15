import { store } from "./dataStore";
import { LeaderboardEntry, User } from "../types";

export const getAllUsers = (): User[] => {
  return store.listUsers();
};

export const getUserById = (id: string): User | undefined => {
  return store.getUser(id);
};

export const createUser = (userData: Pick<User, "name" | "email"> & Partial<User>): User => {
  return store.createUser({
    name: userData.name,
    email: userData.email,
    avatar: userData.avatar,
    points: userData.points ?? 0,
    xp: userData.xp ?? 0,
    trustScore: userData.trustScore ?? 60,
    level: userData.level ?? "Scout",
    badges: userData.badges ?? [],
    createdPins: userData.createdPins ?? 0,
    verifiedPins: userData.verifiedPins ?? 0,
    submittedReports: userData.submittedReports ?? 0,
    resolvedPins: userData.resolvedPins ?? 0,
  } as Omit<User, "id">);
};

export const updateUser = (user: User): User => {
  store.upsertUser(user);
  return user;
};

export const getLeaderboard = (): LeaderboardEntry[] => {
  return store
    .listUsers()
    .sort((a, b) => b.points - a.points)
    .map((user) => ({
      userId: user.id,
      name: user.name,
      points: user.points,
      level: user.level,
      badges: user.badges,
    }));
};
