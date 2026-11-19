import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeading } from "@/components/sections";
import { profile } from "@/lib/content";

export const metadata: Metadata = { title: "About", description: "Meet Niloy Rahman, a creative developer and digital creator based in Dinajpur, Bangladesh." };
export default function About() {
  return <div className="wrap page"><PageHeading label="About me" title={profile.name} description={profile.role + " · " + profile.location} />
    <div className="about-layout"><div className="about-image panel"><Image src={profile.portrait} alt="Niloy Rahman" fill sizes="(max-width: 760px) 90vw, 360px" /></div><div className="panel detail-panel"><h2>Development and visual storytelling</h2><p>{profile.bio}</p><Link className="button button-primary" href="/contact">Get in touch</Link></div></div>
  </div>;
}