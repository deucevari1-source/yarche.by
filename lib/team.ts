import teamData from '@/content/team.json';

export type TeamMember = {
  slug: string;
  name: string;
  name_en: string;
  role: string;
  role_en: string;
  photo: string;
  bio: string[];
  bio_en: string[];
  focus: string[];
  focus_en: string[];
  education: string;
  education_en: string;
  contacts: {
    email: string | null;
    instagram: string | null;
    linkedin: string | null;
    telegram: string | null;
  };
};

export function getAllTeam(): TeamMember[] {
  return teamData.members as TeamMember[];
}

export function getTeamMember(slug: string): TeamMember | undefined {
  return getAllTeam().find((m) => m.slug === slug);
}
