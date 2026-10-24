import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Operational counters only: no questions, photos or health records are stored.
export const aiUsage = sqliteTable("ai_usage", {
  key: text("key").primaryKey(),
  count: integer("count").notNull().default(0),
});
export const aiSettings = sqliteTable("ai_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});
