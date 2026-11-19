import type { Metadata } from "next";
import { Catalog, PageHeading } from "@/components/sections";
import { profile } from "@/lib/content";

export const metadata: Metadata = { title: "Digital Subscriptions", description: "Preview NR Digital Subscription catalog categories and inquire about availability." };
export default function DigitalSubscriptions() {
  return <div className="wrap page"><PageHeading label="NR Digital Subscription" title="Digital subscriptions." description="Browse sample catalog categories and ask about current options and availability." /><Catalog /><a className="button button-primary catalog-action" href={profile.whatsapp}>Ask on WhatsApp</a></div>;
}