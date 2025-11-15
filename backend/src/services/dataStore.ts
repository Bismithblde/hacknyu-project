import { randomUUID, createHash } from "crypto";
import {
  Pin,
  User,
  VerificationVote,
  ReportConfirmation,
  Location,
  HazardCategory,
  Severity,
  PinStatus,
} from "../types";

interface SeedPin {
  description: string;
  severity: Severity;
  category: HazardCategory;
  recommendedAgency: string;
  location: Location;
  photoUrl?: string;
}

class InMemoryStore {
  private users = new Map<string, User>();
  private pins = new Map<string, Pin>();
  private verifications = new Map<string, VerificationVote>();
  private confirmations = new Map<string, ReportConfirmation>();

  constructor() {
    this.seed();
  }

  private seed() {
    const baseUsers: Array<Partial<User>> = [
      {
        id: "guardian-1",
        name: "Avery Ranger",
        email: "avery@belli.city",
        avatar: "https://placehold.co/80x80/1d4ed8/fff?text=AR",
        points: 240,
        xp: 240,
        trustScore: 82,
        level: "Guardian",
        badges: ["Rapid Responder", "Data Steward"],
        createdPins: 4,
        verifiedPins: 11,
        submittedReports: 3,
        resolvedPins: 2,
      },
      {
        id: "scout-9",
        name: "Imani Scout",
        email: "imani@belli.city",
        avatar: "https://placehold.co/80x80/059669/fff?text=IS",
        points: 160,
        xp: 160,
        trustScore: 74,
        level: "Inspector",
        badges: ["Top Verifier"],
        createdPins: 2,
        verifiedPins: 18,
        submittedReports: 1,
        resolvedPins: 1,
      },
      {
        id: "scout-12",
        name: "Leo Scout",
        email: "leo@belli.city",
        avatar: "https://placehold.co/80x80/f97316/fff?text=LS",
        points: 120,
        xp: 120,
        trustScore: 69,
        level: "Ranger",
        badges: ["Neighborhood Watch"],
        createdPins: 3,
        verifiedPins: 9,
        submittedReports: 0,
        resolvedPins: 0,
      },
    ];

    baseUsers.forEach((user) => {
      if (!user.id) return;
      this.users.set(user.id, user as User);
    });

    const samplePins: SeedPin[] = [
      {
        description: "Giant pothole spilling into bike lane on Grand St.",
        severity: "high",
        category: "pothole",
        recommendedAgency: "DOT Street Maintenance",
        location: { lat: 40.718, lng: -73.993, address: "Grand St & Chrystie" },
        photoUrl: "https://placehold.co/400x240/bbdefb/1d4ed8?text=Pothole",
      },
      {
        description: "Storm drain clogged, entire curb flooding when it rains.",
        severity: "medium",
        category: "flooding",
        recommendedAgency: "DEP Sewer",
        location: { lat: 40.705, lng: -73.94, address: "Jackson Ave" },
        photoUrl: "https://placehold.co/400x240/c7d2fe/3730a3?text=Flood",
      },
      {
        description: "Broken streetlight outside PS 245, pitch dark at night.",
        severity: "high",
        category: "streetlight",
        recommendedAgency: "DOT Lighting",
        location: { lat: 40.67, lng: -73.95, address: "PS 245" },
        photoUrl: "https://placehold.co/400x240/fde68a/78350f?text=Light",
      },
    ];

    samplePins.forEach((pin, index) => {
      const id = `pin-${index + 1}`;
      const seeded: Pin = {
        id,
        userId: "guardian-1",
        description: pin.description,
        severity: pin.severity,
        category: pin.category,
        recommendedAgency: pin.recommendedAgency,
        location: pin.location,
        status: "open",
        aiConfidence: 0.78,
        createdAt: new Date(Date.now() - index * 86_400_000).toISOString(),
        verificationStats: { upvotes: 3 + index, downvotes: index, score: 3 },
        hashedImage: pin.photoUrl ? this.hashString(pin.photoUrl) : undefined,
        photoUrl: pin.photoUrl,
        attachments: [],
      };
      this.pins.set(id, seeded);
    });
  }

  listUsers(): User[] {
    return Array.from(this.users.values());
  }

  getUser(id: string): User | undefined {
    return this.users.get(id);
  }

  upsertUser(user: User) {
    this.users.set(user.id, user);
  }

  createUser(user: Omit<User, "id">): User {
    const id = randomUUID();
    const created: User = { ...user, id };
    this.users.set(id, created);
    return created;
  }

  listPins(): Pin[] {
    return Array.from(this.pins.values());
  }

  getPin(id: string): Pin | undefined {
    return this.pins.get(id);
  }

  savePin(pin: Pin): Pin {
    this.pins.set(pin.id, pin);
    return pin;
  }

  createPin(partial: Omit<Pin, "id" | "createdAt" | "verificationStats" | "status"> & { status?: PinStatus }): Pin {
    const id = randomUUID();
    const pin: Pin = {
      ...partial,
      id,
      createdAt: new Date().toISOString(),
      status: partial.status ?? "open",
      verificationStats: { upvotes: 0, downvotes: 0, score: 0 },
    };
    this.pins.set(id, pin);
    return pin;
  }

  addVerification(vote: VerificationVote) {
    this.verifications.set(vote.id, vote);
  }

  listVerificationsForPin(pinId: string) {
    return Array.from(this.verifications.values()).filter((v) => v.pinId === pinId);
  }

  listVerificationsForUser(userId: string) {
    return Array.from(this.verifications.values()).filter((v) => v.userId === userId);
  }

  addConfirmation(confirmation: ReportConfirmation) {
    this.confirmations.set(confirmation.id, confirmation);
  }

  listConfirmations(pinId?: string) {
    const all = Array.from(this.confirmations.values());
    if (!pinId) return all;
    return all.filter((c) => c.pinId === pinId);
  }

  listConfirmationsForUser(userId: string) {
    return Array.from(this.confirmations.values()).filter((c) => c.userId === userId);
  }

  hashString(value: string) {
    return createHash("sha256").update(value).digest("hex");
  }
}

export const store = new InMemoryStore();
