import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { ContactLinks, PageHeading } from "@/components/sections";
import { profile } from "@/lib/content";

export const metadata: Metadata = { title: "Contact", description: "Contact Niloy Rahman by email, phone, WhatsApp, or Facebook." };
export default function Contact() {
  return <div className="wrap page"><PageHeading label="Contact" title="Let’s talk." description="Tell me what you’re working on and where I can help." /><div className="contact-grid"><div className="panel detail-panel"><h2>Reach me directly</h2><p>{profile.location}</p><ContactLinks /></div><ContactForm /></div></div>;
}