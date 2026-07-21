/**
 * Pheebs Core - Genesis Database Schema (Drizzle ORM)
 * Tables: businesses, briefs, diagnoses, playbooks, generations
 */

import { pgTable, text, timestamp, integer, jsonb, doublePrecision } from 'drizzle-orm/pg-core';

export const businesses = pgTable('businesses', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  address: text('address').default(''),
  website: text('website').default(''),
  rating: doublePrecision('rating').default(0),
  reviewCount: integer('review_count').default(0),
  hours: text('hours'),
  phone: text('phone'),
  coordinates: jsonb('coordinates'),
  description: text('description'),
  metadata: jsonb('metadata'),
  observedAt: timestamp('observed_at').defaultNow().notNull()
});

export const diagnoses = pgTable('diagnoses', {
  id: text('id').primaryKey(),
  businessId: text('business_id').references(() => businesses.id),
  diagnosis: text('diagnosis').notNull(),
  primaryConstraint: text('primary_constraint').notNull(),
  confidence: integer('confidence').notNull(),
  evidence: jsonb('evidence').notNull(),
  diagnosedAt: timestamp('diagnosed_at').defaultNow().notNull()
});

export const briefs = pgTable('briefs', {
  id: text('id').primaryKey(),
  businessId: text('business_id').references(() => businesses.id).notNull(),
  diagnosisId: text('diagnosis_id').references(() => diagnoses.id).notNull(),
  strategyData: jsonb('strategy_data').notNull(),
  recommendationData: jsonb('recommendation_data').notNull(),
  executionTimeMs: integer('execution_time_ms').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const playbooks = pgTable('playbooks', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  adapterKey: text('adapter_key').notNull(),
  anchorProduct: text('anchor_product').notNull(),
  rules: jsonb('rules').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const generations = pgTable('generations', {
  id: text('id').primaryKey(),
  rawInputUrl: text('raw_input_url').notNull(),
  briefId: text('brief_id').references(() => briefs.id),
  status: text('status').notNull(),
  executionMs: integer('execution_ms').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull()
});
