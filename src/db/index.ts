import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema.ts';

const client = createClient({
  url: process.env.SQLITE_URL || 'file:./data/sqlite.db',
});

export const db = drizzle(client, { schema });
