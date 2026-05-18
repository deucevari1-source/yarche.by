import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

declare global {
  // eslint-disable-next-line no-var
  var __yarcheDb: NodePgDatabase<typeof schema> | undefined;
}

function init(): NodePgDatabase<typeof schema> {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
  return drizzle(pool, { schema });
}

function getDb(): NodePgDatabase<typeof schema> {
  if (global.__yarcheDb) return global.__yarcheDb;
  const instance = init();
  if (process.env.NODE_ENV !== 'production') global.__yarcheDb = instance;
  return instance;
}

export const db = new Proxy({} as NodePgDatabase<typeof schema>, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb(), prop, receiver);
  },
});

export { schema };
