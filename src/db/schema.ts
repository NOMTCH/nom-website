import { pgTable, text, timestamp, uuid, jsonb, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const cvProfiles = pgTable('cv_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  templateId: text('template_id').notNull().default('t1'),
  themeColor: text('theme_color').notNull().default('#00e676'),
  data: jsonb('data').notNull(), // Stores the dynamic form fields (Experience, Education, etc.)
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  category: text('category').notNull(),
  videoUrl: text('video_url'),
  media: jsonb('media').notNull().default('[]'), // Array of { type: 'image'|'video', url: string }
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const promos = pgTable('promos', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  code: text('code'),
  imageUrl: text('image_url'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
