import type { Metadata } from "next";
import { PageHeading, ServiceGrid } from "@/components/sections";

export const metadata: Metadata = { title: "Services", description: "Explore development, film and photo editing, digital subscriptions, cinematography, and photography." };
export default function Services() {
  return <div className="wrap page"><PageHeading label="Services" title="What I do." description="Web and app development, editing, digital subscriptions, and visual production." /><ServiceGrid /></div>;
}