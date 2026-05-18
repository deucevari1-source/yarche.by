import { sql } from 'drizzle-orm';
import { db, schema } from '@/lib/db/client';

export type Window = '24h' | '7d' | '30d';

export const WINDOWS: Record<Window, string> = {
  '24h': '24 hours',
  '7d': '7 days',
  '30d': '30 days',
};

function intervalSql(w: Window) {
  return sql.raw(`'${WINDOWS[w]}'::interval`);
}

export async function countSessionsSince(w: Window): Promise<number> {
  const rows = await db.execute(
    sql`select count(*)::int as n from sessions where started_at > now() - ${intervalSql(w)}`,
  );
  return Number((rows.rows[0] as { n: number }).n);
}

export async function countEventsSince(w: Window): Promise<number> {
  const rows = await db.execute(
    sql`select count(*)::int as n from events where ts > now() - ${intervalSql(w)}`,
  );
  return Number((rows.rows[0] as { n: number }).n);
}

export async function countLeadsSince(w: Window): Promise<number> {
  const rows = await db.execute(
    sql`select count(*)::int as n from leads where ts > now() - ${intervalSql(w)}`,
  );
  return Number((rows.rows[0] as { n: number }).n);
}

export async function activeRightNow(minutes = 5): Promise<number> {
  const rows = await db.execute(
    sql`select count(*)::int as n from sessions
        where last_seen > now() - (${minutes} || ' minutes')::interval`,
  );
  return Number((rows.rows[0] as { n: number }).n);
}

export type SourceRow = { source: string; sessions: number };

export async function topSources(w: Window, limit = 10): Promise<SourceRow[]> {
  const rows = await db.execute(sql`
    select
      coalesce(nullif(first_utm_source, ''),
               nullif(first_referrer, ''),
               '(direct)') as source,
      count(*)::int as sessions
    from sessions
    where started_at > now() - ${intervalSql(w)}
    group by 1
    order by sessions desc
    limit ${limit}
  `);
  return rows.rows as SourceRow[];
}

export type PageRow = { path: string; views: number; sessions: number };

export async function topPages(w: Window, limit = 20): Promise<PageRow[]> {
  const rows = await db.execute(sql`
    select
      path,
      count(*)::int as views,
      count(distinct session_id)::int as sessions
    from events
    where type = 'pageview'
      and path is not null
      and ts > now() - ${intervalSql(w)}
    group by path
    order by views desc
    limit ${limit}
  `);
  return rows.rows as PageRow[];
}

export type RealtimeRow = {
  session_id: string;
  last_seen: Date;
  current_path: string | null;
  referrer: string | null;
};

export async function realtimeSessions(minutes = 5): Promise<RealtimeRow[]> {
  const rows = await db.execute(sql`
    select
      s.id as session_id,
      s.last_seen,
      s.first_referrer as referrer,
      (
        select path from events e
        where e.session_id = s.id and e.path is not null
        order by ts desc limit 1
      ) as current_path
    from sessions s
    where s.last_seen > now() - (${minutes} || ' minutes')::interval
    order by s.last_seen desc
    limit 100
  `);
  return rows.rows as RealtimeRow[];
}

export async function recentLeads(limit = 50) {
  return db
    .select()
    .from(schema.leads)
    .orderBy(sql`ts desc`)
    .limit(limit);
}
