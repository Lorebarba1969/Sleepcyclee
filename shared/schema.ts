import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Tabella degli utenti esistente
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Relazioni degli utenti
export const usersRelations = relations(users, ({ many }) => ({
  sleepEntries: many(sleepEntries),
}));

// Tabella per registrare le ore di sonno
export const sleepEntries = pgTable("sleep_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  bedtime: varchar("bedtime", { length: 5 }).notNull(), // Formato "HH:MM"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relazioni delle sleep entries
export const sleepEntriesRelations = relations(sleepEntries, ({ one }) => ({
  user: one(users, {
    fields: [sleepEntries.userId],
    references: [users.id],
  }),
}));

// Tabella per i risultati di calcolo del sonno
export const sleepResults = pgTable("sleep_results", {
  id: serial("id").primaryKey(),
  entryId: integer("entry_id").references(() => sleepEntries.id).notNull(),
  wakeupTime: varchar("wakeup_time", { length: 5 }).notNull(), // Formato "HH:MM"
  cycles: integer("cycles").notNull(),
  hours: integer("hours").notNull(), // Ore convertite in minuti (es. 7.5 ore = 450 minuti)
  label: text("label"),
});

// Relazioni dei risultati del sonno
export const sleepResultsRelations = relations(sleepResults, ({ one }) => ({
  sleepEntry: one(sleepEntries, {
    fields: [sleepResults.entryId],
    references: [sleepEntries.id],
  }),
}));

// Schema per l'inserimento degli utenti
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Schema per l'inserimento delle sleep entries
export const insertSleepEntrySchema = createInsertSchema(sleepEntries).pick({
  userId: true,
  bedtime: true,
});

// Schema per l'inserimento dei risultati del sonno
export const insertSleepResultSchema = createInsertSchema(sleepResults).pick({
  entryId: true,
  wakeupTime: true,
  cycles: true,
  hours: true,
  label: true,
});

// Tipi per l'insert
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertSleepEntry = z.infer<typeof insertSleepEntrySchema>;
export type InsertSleepResult = z.infer<typeof insertSleepResultSchema>;

// Tipi per il select
export type User = typeof users.$inferSelect;
export type SleepEntry = typeof sleepEntries.$inferSelect;
export type SleepResult = typeof sleepResults.$inferSelect;
