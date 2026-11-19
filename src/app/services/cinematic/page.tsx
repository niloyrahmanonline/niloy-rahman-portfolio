import type { Metadata } from "next";
import { CinematicServices } from "@/components/service-showcases";

export const metadata: Metadata = {
  title: "Cinematic Services",
  description: "Explore wedding films, cinematic reels, event coverage, video editing, and color grading.",
};

export default function CinematicServicesPage() {
  return <CinematicServices />;
}