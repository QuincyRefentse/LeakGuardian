import { 
  users, type User, type InsertUser,
  leaks, type Leak, type InsertLeak,
  comments, type Comment, type InsertComment,
  LEAK_STATUS
} from "@shared/schema";

// Modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Leak methods
  getLeaks(): Promise<Leak[]>;
  getLeak(id: number): Promise<Leak | undefined>;
  getLeaksByUserId(userId: number): Promise<Leak[]>;
  createLeak(leak: InsertLeak | any, userId?: number): Promise<Leak>;
  updateLeakStatus(id: number, status: string): Promise<Leak | undefined>;
  updateLeakValidation(id: number, isValidated: boolean): Promise<Leak | undefined>;
  
  // Comment methods
  getCommentsByLeakId(leakId: number): Promise<Comment[]>;
  createComment(comment: InsertComment | any): Promise<Comment>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private leaks: Map<number, Leak>;
  private comments: Map<number, Comment>;
  private userIdCounter: number;
  private leakIdCounter: number;
  private commentIdCounter: number;

  constructor() {
    this.users = new Map();
    this.leaks = new Map();
    this.comments = new Map();
    this.userIdCounter = 1;
    this.leakIdCounter = 1;
    this.commentIdCounter = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      id,
      username: insertUser.username,
      password: insertUser.password,
      isAdmin: insertUser.isAdmin ?? false,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }

  // Leak methods
  async getLeaks(): Promise<Leak[]> {
    return Array.from(this.leaks.values()).sort((a, b) => {
      // Sort by created date (newest first)
      return new Date(b.createdAt || Date.now()).getTime() - new Date(a.createdAt || Date.now()).getTime();
    });
  }

  async getLeak(id: number): Promise<Leak | undefined> {
    return this.leaks.get(id);
  }

  async getLeaksByUserId(userId: number): Promise<Leak[]> {
    return Array.from(this.leaks.values())
      .filter(leak => leak.userId === userId)
      .sort((a, b) => {
        // Sort by created date (newest first)
        return new Date(b.createdAt || Date.now()).getTime() - new Date(a.createdAt || Date.now()).getTime();
      });
  }

  async createLeak(insertLeak: InsertLeak | any, userId?: number): Promise<Leak> {
    const id = this.leakIdCounter++;
    const now = new Date();
    
    // Ensure all required fields have values
    const leak: Leak = {
      id,
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
    
    this.leaks.set(id, leak);
    return leak;
  }

  async updateLeakStatus(id: number, status: string): Promise<Leak | undefined> {
    const leak = this.leaks.get(id);
    if (!leak) return undefined;
    
    const updatedLeak: Leak = {
      ...leak,
      status: status || leak.status,
      updatedAt: new Date()
    };
    this.leaks.set(id, updatedLeak);
    return updatedLeak;
  }

  async updateLeakValidation(id: number, isValidated: boolean): Promise<Leak | undefined> {
    const leak = this.leaks.get(id);
    if (!leak) return undefined;
    
    const updatedLeak: Leak = {
      ...leak,
      isValidated,
      updatedAt: new Date()
    };
    this.leaks.set(id, updatedLeak);
    return updatedLeak;
  }

  // Comment methods
  async getCommentsByLeakId(leakId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.leakId === leakId)
      .sort((a, b) => {
        // Sort by created date (oldest first for comments)
        return new Date(a.createdAt || Date.now()).getTime() - new Date(b.createdAt || Date.now()).getTime();
      });
  }

  async createComment(insertComment: InsertComment | any): Promise<Comment> {
    const id = this.commentIdCounter++;
    const now = new Date();
    const comment: Comment = {
      id,
      leakId: insertComment.leakId,
      userId: insertComment.userId || null,
      content: insertComment.content || "",
      createdAt: now
    };
    this.comments.set(id, comment);
    return comment;
  }
}

export const storage = new MemStorage();
