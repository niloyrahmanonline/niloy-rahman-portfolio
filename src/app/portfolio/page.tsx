import type { Metadata } from "next";
import { PhotoComparison, PortfolioGrid } from "@/components/portfolio";
import { PageHeading, SectionHeading, Showreel } from "@/components/sections";

export const metadata: Metadata = { title: "Portfolio", description: "Browse sample studies in web development, wedding films, and portrait color grading." };
export default function Portfolio() {
  return <div className="wrap page"><PageHeading label="Portfolio" title="Selected work." description="Filter concept studies by development, film, or photography." /><PortfolioGrid />
    <section className="section media-grid"><div><SectionHeading label="Film" title="Wedding films." /><Showreel /></div><div><SectionHeading label="Photo editing" title="A study in color." /><PhotoComparison /></div></section>
  </div>;
}