import { PointsAction, PointsAward, User } from "../types";
import { getUserById, updateUser } from "./userService";

const POINT_RULES: Record<PointsAction, number> = {
  create_pin: 10,
  verify_pin: 10,
  submit_report: 40,
  upload_confirmation: 80,
  mark_resolved: 15,
};

const LEVELS = [
  { label: "Scout", threshold: 0 },
  { label: "Ranger", threshold: 100 },
  { label: "Inspector", threshold: 200 },
  { label: "Guardian", threshold: 400 },
];

const BADGES = [
  { label: "Rapid Responder", requirement: (user: User) => user.createdPins >= 5 },
  { label: "Top Verifier", requirement: (user: User) => user.verifiedPins >= 10 },
  { label: "Data Steward", requirement: (user: User) => user.submittedReports >= 3 },
  { label: "Guardian", requirement: (user: User) => user.points >= 400 },
  { label: "Neighborhood Watch", requirement: (user: User) => user.points >= 150 },
];

const TRUST_INCREMENTS: Record<PointsAction, number> = {
  create_pin: 0.5,
  verify_pin: 1,
  submit_report: 1.5,
  upload_confirmation: 2,
  mark_resolved: 1,
};

type UserMetric = "createdPins" | "verifiedPins" | "submittedReports" | "resolvedPins";

const ACTION_COUNTERS: Record<PointsAction, UserMetric> = {
  create_pin: "createdPins",
  verify_pin: "verifiedPins",
  submit_report: "submittedReports",
  upload_confirmation: "submittedReports",
  mark_resolved: "resolvedPins",
};

const resolveLevel = (xp: number) => {
  const tier = [...LEVELS].reverse().find((level) => xp >= level.threshold);
  return tier ? tier.label : LEVELS[0].label;
};

const computeBadges = (user: User): string[] => {
  const earned = BADGES.filter((badge) => badge.requirement(user)).map((badge) => badge.label);
  return Array.from(new Set([...earned]));
};

export const getPointRules = () => POINT_RULES;

export const awardPoints = (userId: string, action: PointsAction): PointsAward => {
  const user = getUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const amount = POINT_RULES[action] ?? 0;
  user.points += amount;
  user.xp += amount;
  user.level = resolveLevel(user.xp);
  user.trustScore = Math.min(100, user.trustScore + (TRUST_INCREMENTS[action] ?? 0.5));

  const counterKey = ACTION_COUNTERS[action];
  user[counterKey] = (user[counterKey] ?? 0) + 1;
  user.badges = computeBadges(user);

  updateUser(user);

  return {
    action,
    amount,
    totalPoints: user.points,
    level: user.level,
  };
};
