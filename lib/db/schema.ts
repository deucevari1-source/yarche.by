import { pgTable, uuid, text, timestamp, jsonb, index, uniqueIndex } from 'drizzle-orm/pg-core';

export const sessions = pgTable(
  'sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    visitorId: text('visitor_id').notNull(),
    startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
    lastSeen: timestamp('last_seen', { withTimezone: true }).notNull().defaultNow(),
    userAgent: text('user_agent'),
    ipHash: text('ip_hash'),
    firstReferrer: text('first_referrer'),
    firstUtmSource: text('first_utm_source'),
    firstUtmMedium: text('first_utm_medium'),
    firstUtmCampaign: text('first_utm_campaign'),
  },
  (t) => [
    index('sessions_visitor_idx').on(t.visitorId),
    index('sessions_last_seen_idx').on(t.lastSeen),
  ],
);

export const events = pgTable(
  'events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    ts: timestamp('ts', { withTimezone: true }).notNull().defaultNow(),
    sessionId: uuid('session_id')
      .notNull()
      .references(() => sessions.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    path: text('path'),
    meta: jsonb('meta'),
  },
  (t) => [
    index('events_ts_idx').on(t.ts),
    index('events_session_idx').on(t.sessionId),
    index('events_type_idx').on(t.type),
  ],
);

export const leads = pgTable(
  'leads',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    ts: timestamp('ts', { withTimezone: true }).notNull().defaultNow(),
    sessionId: uuid('session_id').references(() => sessions.id, { onDelete: 'set null' }),
    name: text('name'),
    email: text('email'),
    phone: text('phone'),
    message: text('message'),
    source: text('source'),
    status: text('status').notNull().default('new'),
    meta: jsonb('meta'),
  },
  (t) => [index('leads_ts_idx').on(t.ts), index('leads_status_idx').on(t.status)],
);

export const adminUsers = pgTable(
  'admin_users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    telegramId: text('telegram_id').notNull(),
    name: text('name').notNull(),
    username: text('username'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex('admin_users_telegram_id_idx').on(t.telegramId)],
);

export const adminSessions = pgTable('admin_sessions', {
  token: text('token').primaryKey(),
  adminUserId: uuid('admin_user_id')
    .notNull()
    .references(() => adminUsers.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});
