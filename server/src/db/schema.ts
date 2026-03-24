import { pgTable, serial, varchar, text, date, timestamp, integer } from 'drizzle-orm/pg-core';


export const clients = pgTable('clients', {
  id: serial('id').primaryKey(),
  companyName: varchar('company_name', { length: 255 }).notNull(),
  country: varchar('country', { length: 255 }).notNull(),
  entityType: varchar('entity_type', { length: 255 }).notNull(),
});

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  clientId: integer('client_id').notNull().references(() => clients.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 255 }).notNull(),
  dueDate: date('due_date').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('Pending'),
  priority: varchar('priority', { length: 50 }).notNull().default('Medium'),
  createdAt: timestamp('created_at').defaultNow(),
});