import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
});

// Define leak statuses
export const LEAK_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  RESOLVED: "resolved",
  REJECTED: "rejected",
} as const;

// Define leak types
export const LEAK_TYPE = {
  WATER_MAIN: "water_main",
  FIRE_HYDRANT: "fire_hydrant",
  PIPE: "pipe",
  INFRASTRUCTURE: "infrastructure",
  OTHER: "other",
} as const;

export const leaks = pgTable("leaks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  userId: integer("user_id").references(() => users.id),
  location: text("location").notNull(),
  coordinates: json("coordinates").notNull(), // { lat: number, lng: number }
  status: text("status").notNull().default(LEAK_STATUS.PENDING),
  leakType: text("leak_type").notNull().default(LEAK_TYPE.OTHER),
  severity: integer("severity").default(1), // 1-5 scale
  images: json("images").notNull(), // Array of image URLs
  isValidated: boolean("is_validated").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertLeakSchema = createInsertSchema(leaks)
  .omit({ id: true, userId: true, isValidated: true, createdAt: true, updatedAt: true })
  .extend({
    // Override coordinates to ensure proper structure
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
    // Override images to ensure it's an array of strings
    images: z.array(z.string()),
  });

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  leakId: integer("leak_id").references(() => leaks.id).notNull(),
  userId: integer("user_id").references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Leak = typeof leaks.$inferSelect;
export type InsertLeak = z.infer<typeof insertLeakSchema>;

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

// Add validation functions for leak form
export const leakFormSchema = insertLeakSchema.extend({
  files: z.array(z.instanceof(File)),
});

export type LeakFormData = z.infer<typeof leakFormSchema>;
