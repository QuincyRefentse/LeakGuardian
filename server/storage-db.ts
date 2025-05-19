import { 
  users, type User, type InsertUser,
  leaks, type Leak, type InsertLeak,
  comments, type Comment, type InsertComment,
  LEAK_STATUS
} from "@shared/schema";
import { db } from "./db";
import { IStorage } from "./storage";
import { eq, desc, and } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        createdAt: new Date(),
      })
      .returning();
    return user;
  }

  // Leak methods
  async getLeaks(): Promise<Leak[]> {
    return db
      .select()
      .from(leaks)
      .orderBy(desc(leaks.createdAt));
  }

  async getLeak(id: number): Promise<Leak | undefined> {
    const [leak] = await db
      .select()
      .from(leaks)
      .where(eq(leaks.id, id));
    return leak;
  }

  async getLeaksByUserId(userId: number): Promise<Leak[]> {
    return db
      .select()
      .from(leaks)
      .where(eq(leaks.userId, userId))
      .orderBy(desc(leaks.createdAt));
  }

  async createLeak(insertLeak: InsertLeak | any, userId?: number): Promise<Leak> {
    const now = new Date();
    
    // Ensure all required fields have values
    const leakData = {
      title: insertLeak.title || "Untitled Leak Report",
      description: insertLeak.description || "No description provided",
      userId: userId || null,
      location: insertLeak.location || "Unknown Location",
      coordinates: insertLeak.coordinates || { lat: 40.7128, lng: -74.0060 },
      status: insertLeak.status || "pending",
      leakType: insertLeak.leakType || "other",
      severity: insertLeak.severity || 3,
      images: insertLeak.images || [],
      isValidated: false,
      createdAt: now,
      updatedAt: now
    };
    
    const [leak] = await db
      .insert(leaks)
      .values(leakData)
      .returning();
    
    return leak;
  }

  async updateLeakStatus(id: number, status: string): Promise<Leak | undefined> {
    const [updatedLeak] = await db
      .update(leaks)
      .set({ 
        status, 
        updatedAt: new Date() 
      })
      .where(eq(leaks.id, id))
      .returning();
    
    return updatedLeak;
  }

  async updateLeakValidation(id: number, isValidated: boolean): Promise<Leak | undefined> {
    const [updatedLeak] = await db
      .update(leaks)
      .set({ 
        isValidated, 
        updatedAt: new Date() 
      })
      .where(eq(leaks.id, id))
      .returning();
    
    return updatedLeak;
  }

  // Comment methods
  async getCommentsByLeakId(leakId: number): Promise<Comment[]> {
    return db
      .select()
      .from(comments)
      .where(eq(comments.leakId, leakId))
      .orderBy(comments.createdAt);
  }

  async createComment(insertComment: InsertComment | any): Promise<Comment> {
    const [comment] = await db
      .insert(comments)
      .values({
        leakId: insertComment.leakId,
        userId: insertComment.userId || null,
        content: insertComment.content || "",
        createdAt: new Date()
      })
      .returning();
    
    return comment;
  }
}