import Link from "next/link";
import { Hero } from "@/components/hero";
import { Catalog, SectionHeading, Showreel } from "@/components/sections";
import { PhotoComparison, PortfolioGrid } from "@/components/portfolio";
import { ServicesOverview } from "@/components/service-showcases";
import { profile } from "@/lib/content";

export default function Home() {
  return <>
    <Hero />
    <ServicesOverview embedded />
    <PortfolioGrid filterable={false} />
    <section className="wrap section media-grid">
      <div id="showreel" className="showreel-section"><SectionHeading label="Film" title="Wedding films." /><Showreel /></div>
      <div><SectionHeading label="Photo editing" title="A study in color." /><PhotoComparison /></div>
    </section>
    <section className="wrap section"><SectionHeading label="NR Digital Subscription" title="Subscription catalog." description="A preview of the catalog categories. Ask about current availability." /><Catalog /><Link className="text-link" href="/digital-subscriptions">Browse catalog preview</Link></section>
    <section className="wrap section"><div className="panel about-band"><SectionHeading label="About me" title="I’m Niloy Rahman." /><div><p>{profile.bio}</p><Link className="text-link" href="/about">More about me</Link></div></div></section>
    <section className="wrap section contact-band"><SectionHeading label="Contact" title="Have something in mind?" /><Link className="button button-primary" href="/contact">Get in touch</Link></section>
  </>;
}
