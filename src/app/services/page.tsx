import type { Metadata } from "next";
import { ServicesOverview } from "@/components/service-showcases";

export const metadata: Metadata = { title: "Services", description: "Explore development, film and photo editing, digital subscriptions, cinematography, and photography." };

export default function Services() {
  return <ServicesOverview />;
}