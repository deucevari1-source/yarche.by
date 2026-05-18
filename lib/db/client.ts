import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

declare global {
  // eslint-disable-next-line no-var
  var __yarcheDb: NodePgDatabase<typeof schema> | undefined;
}

let instance: NodePgDatabase<typeof schema> | null = null;

function init(): NodePgDatabase<typeof schema> {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
  return drizzle(pool, { schema });
}

function getDb(): NodePgDatabase<typeof schema> {
  // Module-level cache for the normal case. The `global` cache exists only
  // to survive dev HMR (Next reloads modules but preserves globalThis), so
  // we never make a second pool while editing files.
  if (instance) return instance;
  if (global.__yarcheDb) {
    instance = global.__yarcheDb;
    return instance;
  }
  instance = init();
  global.__yarcheDb = instance;
  return instance;
}

export const db = new Proxy({} as NodePgDatabase<typeof schema>, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb(), prop, receiver);
  },
});

export { schema };
