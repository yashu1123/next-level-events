// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const reviews = sqliteTable('reviews', { id: text('id').primaryKey(), name: text('name').notNull(), event: text('event').notNull(), rating: integer('rating').notNull(), message: text('message').notNull(), created: integer('created').notNull() });
