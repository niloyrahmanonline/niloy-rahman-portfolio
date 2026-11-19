import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Play } from "lucide-react";
import { projects, profile, services, showreel } from "@/lib/content";
import { HeroMotion } from "./hero-motion";
import { HeroOrbitLayer } from "./hero-orbits";
import { HeroGalaxy } from "./hero-galaxy";

const featured = projects.find(({ art }) => art === "film")!;

export function Hero() {
  return <section className="cinematic-hero" aria-labelledby="hero-title">
    <HeroGalaxy />
    <div className="hero-terrain" aria-hidden="true" />
    <p className="cinematic-role">{profile.role}</p>
    <h1 className="cinematic-title" id="hero-title"><span>Niloy</span>{" "}<span>Rahman</span></h1>
    <HeroMotion>
      <HeroOrbitLayer side="back" />
      <div className="cinematic-portrait">
        <Image src={profile.portrait} alt="Niloy Rahman" width={4000} height={6000} preload sizes="(max-width: 767px) 92vw, (max-width: 1199px) 58vw, 49vw" />
      </div>
      <HeroOrbitLayer side="front" />
    </HeroMotion>
    <div className="cinematic-intro">
      <p>I build for the <strong>web</strong> and tell stories through <strong>film</strong> and <strong>photography</strong>.</p>
      <div className="cinematic-actions">
        <Link href="/portfolio" className="button button-primary hero-primary" data-glass-reflection>
          <span data-magnet-content>Explore selected work <ArrowUpRight size={16} aria-hidden="true" /></span>
          <span className="glass-reflection" aria-hidden="true"><span /></span>
        </Link>
        <a href="#showreel" className="hero-reel"><span><Play size={17} aria-hidden="true" /></span>Showreel{!showreel.src && <small>Preview</small>}</a>
      </div>
    </div>
    <div className="hero-counts">
      <Link href="/services"><strong>{services.length}</strong> Services</Link>
      <Link href="/portfolio"><strong>{projects.length}</strong> Concepts</Link>
    </div>
    <div className="hero-location optical-glass" data-glass-reflection>
      <MapPin size={20} aria-hidden="true" /><span>{profile.location}</span>
      <span className="glass-reflection" aria-hidden="true"><span /></span>
    </div>
    <Link className="hero-feature optical-glass" href={"/portfolio/" + featured.slug} data-glass-reflection>
      <div className="hero-feature-art" aria-hidden="true"><div className="hero-clapperboard"><i /><b /><b /></div></div>
      <div className="hero-feature-caption"><div><small>Featured concept</small><span>{featured.title}</span></div><ArrowUpRight size={18} aria-hidden="true" /></div>
      <span className="glass-reflection" aria-hidden="true"><span /></span>
    </Link>
  </section>;
}
