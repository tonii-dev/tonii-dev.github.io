import { pgTable, text, serial, integer, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  template: text("template").notNull(), // 'cartesian' or 'inclined'
  dataEntries: jsonb("data_entries").notNull().default('[]'),
  forces: jsonb("forces").notNull().default('[]'),
  createdAt: text("created_at").notNull().default('now()'),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

// Physics data types
export const physicsDataSchema = z.object({
  id: z.number(),
  type: z.enum(['velocity', 'acceleration', 'mass', 'force', 'position', 'time', 'angle']),
  value: z.number(),
  x: z.number().optional(),
  y: z.number().optional(),
  direction: z.number().optional(),
  name: z.string().optional(),
  color: z.string().optional(),
});

export const forceSchema = z.object({
  id: z.number(),
  type: z.literal('force'),
  value: z.number(),
  direction: z.number(),
  name: z.string(),
  color: z.string(),
});

export type PhysicsData = z.infer<typeof physicsDataSchema>;
export type Force = z.infer<typeof forceSchema>;
