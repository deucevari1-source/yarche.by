import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FeatureLandingPage } from '@/components/FeatureLandingPage';
import { getAllSeoFeatures, getSeoFeature } from '@/lib/seo-features';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSeoFeatures().map((f) => ({ feature: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ feature: string }>;
}): Promise<Metadata> {
  const { feature } = await params;
  const f = getSeoFeature(feature);
  if (!f) return {};

  const url = `/seo/${f.slug}`;
  return {
    title: { absolute: f.metaTitle },
    description: f.metaDescription,
    keywords: f.keywords,
    alternates: { canonical: url },
    // Pages are AI-drafted guides — keep them out of the index until they're
    // edited by a human (add real cases, real author byline). Links from /seo
    // still work for visitors; we just don't want search engines ranking them
    // as-is.
    robots: {
      index: false,
      follow: true,
      googleBot: { index: false, follow: true },
    },
    openGraph: {
      title: f.metaTitle,
      description: f.metaDescription,
      url,
      type: 'website',
      images: [{ url: 'https://yarche.by/images/og.jpg' }],
    },
  };
}

export default async function SeoFeaturePage({
  params,
}: {
  params: Promise<{ feature: string }>;
}) {
  const { feature } = await params;
  const f = getSeoFeature(feature);
  if (!f) notFound();
  return <FeatureLandingPage feature={f} />;
}
