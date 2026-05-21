import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getAllTeam, getTeamMember } from '@/lib/team';
import { Icon } from '@/components/Icon';

function photoExists(photoPath: string): boolean {
  // photoPath is web-rooted, e.g. /team/vlad.jpg → public/team/vlad.jpg
  return existsSync(join(process.cwd(), 'public', photoPath.replace(/^\//, '')));
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTeam().map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const m = getTeamMember(slug);
  if (!m) return {};
  const desc = m.bio[0]?.slice(0, 200) ?? m.role;
  return {
    title: `${m.name} — ${m.role}`,
    description: desc,
    // Profile pages should not appear in search results — they're for
    // direct sharing/linking only. Names still show on service pages
    // (expert-badge), which remain indexable.
    robots: {
      index: false,
      follow: true,
      googleBot: { index: false, follow: true },
    },
    alternates: { canonical: `/team/${m.slug}` },
    openGraph: {
      title: `${m.name} — ${m.role}`,
      description: desc,
      url: `/team/${m.slug}`,
      type: 'profile',
      images: [{ url: m.photo }],
    },
  };
}

export default async function TeamMemberPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const m = getTeamMember(slug);
  if (!m) notFound();

  const tg = m.contacts.telegram;
  const li = m.contacts.linkedin;
  const ig = m.contacts.instagram;
  const email = m.contacts.email;

  return (
    <>
      <link rel="stylesheet" href="/pages/team.css" />
      <main data-page="team">
        <section className="team-hero">
          <div className="hero-badge team-badge">Команда</div>
          <div className="team-hero-grid">
            <div className="team-photo-wrap">
              {photoExists(m.photo) ? (
                <Image
                  src={m.photo}
                  alt={m.name}
                  width={420}
                  height={420}
                  priority
                  className="team-photo"
                />
              ) : (
                <div className="team-photo team-photo-placeholder" aria-label={m.name}>
                  {initials(m.name)}
                </div>
              )}
            </div>
            <div className="team-header">
              <h1>{m.name}</h1>
              <div className="team-role">{m.role}</div>
            </div>
            <div className="team-info">
              {m.bio.map((p, i) => (
                <p key={i} className="team-bio">
                  {p}
                </p>
              ))}

              <div className="team-meta">
                <div>
                  <div className="team-meta-label">Направления</div>
                  <div className="team-meta-value">{m.focus.join(' · ')}</div>
                </div>
                <div>
                  <div className="team-meta-label">Образование</div>
                  <div className="team-meta-value">{m.education}</div>
                </div>
              </div>

              {(email || tg || li || ig) && (
                <div className="team-contacts">
                  <div className="team-meta-label">Контакты</div>
                  <div className="team-contacts-list">
                    {email && (
                      <a href={`mailto:${email}`} className="team-contact" aria-label="Email">
                        <Icon name="mail" />
                        <span>{email}</span>
                      </a>
                    )}
                    {tg && (
                      <a
                        href={tg.startsWith('http') ? tg : `https://t.me/${tg.replace(/^@/, '')}`}
                        target="_blank"
                        rel="noopener"
                        className="team-contact"
                        aria-label="Telegram"
                      >
                        <Icon name="telegram" />
                        <span>Telegram</span>
                      </a>
                    )}
                    {li && (
                      <a
                        href={li}
                        target="_blank"
                        rel="noopener"
                        className="team-contact"
                        aria-label="LinkedIn"
                      >
                        <Icon name="linkedin" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {ig && (
                      <a
                        href={`https://instagram.com/${ig.replace(/^@/, '')}`}
                        target="_blank"
                        rel="noopener"
                        className="team-contact"
                        aria-label="Instagram"
                      >
                        <Icon name="instagram" />
                        <span>@{ig.replace(/^@/, '')}</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div className="team-cta">
                <Link href="/contact" className="team-cta-btn">
                  Написать в агентство →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
