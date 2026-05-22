import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FeatureLandingPage } from '@/components/FeatureLandingPage';
import { getAllFeatures, getFeature } from '@/lib/web-features';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllFeatures().map((f) => ({ feature: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ feature: string }>;
}): Promise<Metadata> {
  const { feature } = await params;
  const f = getFeature(feature);
  if (!f) return {};

  const url = `/web/${f.slug}`;
  return {
    title: { absolute: f.metaTitle },
    description: f.metaDescription,
    keywords: f.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: f.metaTitle,
      description: f.metaDescription,
      url,
      type: 'website',
      images: [{ url: 'https://yarche.by/images/og.jpg' }],
    },
  };
}

export default async function WebFeaturePage({
  params,
}: {
  params: Promise<{ feature: string }>;
}) {
  const { feature } = await params;
  const f = getFeature(feature);
  if (!f) notFound();
  return <FeatureLandingPage feature={f} />;
}
