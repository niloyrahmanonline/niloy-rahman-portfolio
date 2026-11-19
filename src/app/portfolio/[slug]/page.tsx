import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PhotoComparison, ProjectArt } from "@/components/portfolio";
import { PageHeading, Showreel } from "@/components/sections";
import { projects } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  return { title: project.title, description: project.description };
}

export default async function ProjectDetails({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  return <div className="wrap page project-page"><Link className="breadcrumb" href="/portfolio">All projects</Link><PageHeading label={project.category + " · Concept"} title={project.title} description={project.description} />
    <div className="project-feature">{project.art === "film" ? <Showreel /> : project.art === "portrait" ? <PhotoComparison /> : <ProjectArt project={project} />}</div>
  </div>;
}