import { store } from "./dataStore";
import { LeaderboardEntry, User } from "../types";

export interface UserStats {
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  points: number;
  xp: number;
  level: string;
  trustScore: number;
  badges: string[];
  stats: {
    createdPins: number;
    verifiedPins: number;
    submittedReports: number;
    resolvedPins: number;
  };
  recentActivity?: {
    lastPinCreated?: string;
    lastVerification?: string;
    lastReportSubmitted?: string;
  };
}

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

export const getUserStats = (userId: string): UserStats | undefined => {
  const user = store.getUser(userId);
  if (!user) {
    return undefined;
  }

  // Get all pins created by this user
  const createdPins = store.listPins().filter((pin) => pin.userId === userId);
  const createdPinsCount = createdPins.length;
  const resolvedPinsCount = createdPins.filter((pin) => pin.status === "resolved").length;

  // Get all verifications by this user
  const verifications = store.listVerificationsForUser(userId);
  const verifiedPinsCount = verifications.length;

  // Get all confirmations/reports by this user
  const confirmations = store.listConfirmationsForUser(userId);
  const submittedReportsCount = confirmations.filter(
    (c) => c.reportType === "official-report"
  ).length;

  // Get recent activity timestamps
  const lastPinCreated = createdPins.length > 0
    ? createdPins.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0].createdAt
    : undefined;

  const lastVerification = verifications.length > 0
    ? verifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0].createdAt
    : undefined;

  const lastReportSubmitted = confirmations.length > 0
    ? confirmations
        .filter((c) => c.reportType === "official-report")
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]?.createdAt
    : undefined;

  return {
    userId: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    points: user.points,
    xp: user.xp,
    level: user.level,
    trustScore: user.trustScore,
    badges: user.badges,
    stats: {
      createdPins: createdPinsCount,
      verifiedPins: verifiedPinsCount,
      submittedReports: submittedReportsCount,
      resolvedPins: resolvedPinsCount,
    },
    recentActivity: {
      lastPinCreated,
      lastVerification,
      lastReportSubmitted,
    },
  };
};
