import { 
  users, 
  sleepEntries, 
  sleepResults,
  type User, 
  type InsertUser, 
  type SleepEntry, 
  type InsertSleepEntry,
  type SleepResult,
  type InsertSleepResult
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Sleep entry operations
  createSleepEntry(entry: InsertSleepEntry): Promise<SleepEntry>;
  getSleepEntriesByUser(userId: number): Promise<SleepEntry[]>;
  getSleepEntry(id: number): Promise<SleepEntry | undefined>;
  
  // Sleep results operations
  createSleepResult(result: InsertSleepResult): Promise<SleepResult>;
  getSleepResultsByEntry(entryId: number): Promise<SleepResult[]>;
}

// Database Storage implementation
export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // Sleep entry operations
  async createSleepEntry(entry: InsertSleepEntry): Promise<SleepEntry> {
    const [sleepEntry] = await db.insert(sleepEntries).values(entry).returning();
    return sleepEntry;
  }
  
  async getSleepEntriesByUser(userId: number): Promise<SleepEntry[]> {
    return await db
      .select()
      .from(sleepEntries)
      .where(eq(sleepEntries.userId, userId))
      .orderBy(sleepEntries.createdAt);
  }
  
  async getSleepEntry(id: number): Promise<SleepEntry | undefined> {
    const [entry] = await db.select().from(sleepEntries).where(eq(sleepEntries.id, id));
    return entry;
  }
  
  // Sleep results operations
  async createSleepResult(result: InsertSleepResult): Promise<SleepResult> {
    const [sleepResult] = await db.insert(sleepResults).values(result).returning();
    return sleepResult;
  }
  
  async getSleepResultsByEntry(entryId: number): Promise<SleepResult[]> {
    return await db
      .select()
      .from(sleepResults)
      .where(eq(sleepResults.entryId, entryId))
      .orderBy(sleepResults.cycles);
  }
}

export const storage = new DatabaseStorage();
