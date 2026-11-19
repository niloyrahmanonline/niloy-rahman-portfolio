import { Camera, Clapperboard, Code2, Film, ImageIcon, Layers3, Mail, MessageCircle, Phone } from "lucide-react";
import { profile, showreel, subscriptions } from "@/lib/content";

const icons = { camera: Camera, code: Code2, film: Film, image: ImageIcon, layers: Layers3 };

export function SectionHeading({ label, title, description }: { label: string; title: string; description?: string }) {
  return <div className="section-heading"><p className="eyebrow">{label}</p><h2>{title}</h2>{description && <p>{description}</p>}</div>;
}

export function PageHeading({ label, title, description }: { label: string; title: string; description: string }) {
  return <div className="page-heading"><p className="eyebrow">{label}</p><h1>{title}</h1><p>{description}</p></div>;
}

export function Catalog() {
  return <div className="catalog-grid">{subscriptions.map(({ name, icon, description }) => {
    const Icon = icons[icon];
    return <article className="panel catalog-card" key={name}><span className="tile-icon"><Icon size={21} /></span><h3>{name}</h3><p>{description}</p></article>;
  })}</div>;
}

export function Showreel() {
  return <div className="showreel">
    {showreel.src ? <video controls playsInline preload="none" poster={showreel.poster} aria-label="Wedding film showreel">
      <source src={showreel.src} />
      {showreel.captions && <track kind="captions" src={showreel.captions} srcLang="en" label="English" />}
    </video> : <div className="reel-placeholder"><span className="tile-icon"><Clapperboard size={27} /></span><h3>Wedding film showreel</h3><p>Footage has yet to be added.</p></div>}
  </div>;
}

export function ContactLinks() {
  return <ul className="contact-links">
    <li><a href={"mailto:" + profile.email}><Mail size={19} /> {profile.email}</a></li>
    <li><a href="tel:+8801806896236"><Phone size={19} /> {profile.phone}</a></li>
    <li><a href={profile.whatsapp}><MessageCircle size={19} /> WhatsApp</a></li>
    <li><a href={profile.facebook}><span className="facebook-mark" aria-hidden="true">f</span> Facebook</a></li>
  </ul>;
}
