import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeading, Showreel } from "@/components/sections";
import { ServiceVisual } from "@/components/service-visual";
import { PhotoComparison } from "@/components/portfolio";
import { services } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return services.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();
  return { title: service.name, description: service.description };
}

export default async function ServiceDetails({ params }: Props) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();
  return <div className="wrap page"><Link className="breadcrumb" href="/services">All services</Link><PageHeading label={service.tool} title={service.name} description={service.description} />
    <div className="service-detail-layout"><div className="panel detail-panel"><h2>What I can help with</h2><ul>{service.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
    <div className="actions">{slug === "digital-subscriptions" && <Link className="button button-glass" href="/digital-subscriptions">View catalog preview</Link>}<Link className="button button-primary" href="/contact">Get in touch</Link></div></div><ServiceVisual kind={service.icon} /></div>
    {slug === "wedding-video-editing" && <div className="section"><Showreel /></div>}
    {slug === "premium-photo-editing" && <section className="section"><h2>Portrait color comparison</h2><PhotoComparison /></section>}
  </div>;
}