import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CalendarDays, Camera, Clapperboard, CodeXml, ImageIcon, Layers3, MonitorPlay, Palette, Video, type LucideIcon } from "lucide-react";
import { services } from "@/lib/content";
import { ServicesScene } from "./services-scene";
import styles from "./service-showcases.module.css";

type ShowcaseCard = { title: string; description: string; image: string; href: string; icon: LucideIcon; inquiry?: boolean };

const overviewContent = {
  "web-app-development": { title: "Web/Apps Development", description: "Modern, responsive and high-performance web applications.", image: "development", icon: CodeXml },
  "wedding-video-editing": { title: "Wedding Video Edit", description: "Cinematic wedding films with professional editing and storytelling.", image: "wedding-edit", icon: Clapperboard },
  "premium-photo-editing": { title: "Premium Photo Edit", description: "High-end photo retouching and color grading for weddings and portraits.", image: "photo-edit", icon: ImageIcon },
  "digital-subscriptions": { title: "Digital Subscription", description: "Premium digital tools and subscriptions for creativity and productivity.", image: "subscription", icon: Layers3 },
  "cinematography-photography": { title: "Cinematography + Photography", description: "Professional shooting for weddings, events and creative projects.", image: "cinematography", icon: Camera },
} as const;

const overview: ShowcaseCard[] = services.map(({ slug }) => ({ ...overviewContent[slug], href: "/services/" + slug }));

const cinematic: ShowcaseCard[] = [
  { title: "Wedding Films", description: "Cinematic wedding films that tell your story with emotion, beauty and timeless style.", image: "wedding-films", href: "/services/wedding-video-editing", icon: Video },
  { title: "Cinematic Reels", description: "Short, impactful cinematic reels for weddings, events and social media.", image: "cinematic-reels", href: "/contact", icon: Clapperboard, inquiry: true },
  { title: "Event Coverage", description: "Professional coverage for weddings, events and special occasions.", image: "event-coverage", href: "/services/cinematography-photography", icon: CalendarDays },
  { title: "Video Editing", description: "Creative editing that brings your footage to life.", image: "video-editing", href: "/services/wedding-video-editing", icon: MonitorPlay },
  { title: "Color Grading", description: "Professional cinematic color grading for a premium film look.", image: "color-grading", href: "/services/wedding-video-editing", icon: Palette },
];

function Atmosphere() {
  return <div className={styles.atmosphere} aria-hidden="true">
    <span className={styles.butterfly}><i /><i /></span>
    <span className={styles.butterfly}><i /><i /></span>
  </div>;
}

function ServiceCard({ card, embedded = false, featured = false }: { card: ShowcaseCard; embedded?: boolean; featured?: boolean }) {
  const Heading = embedded ? "h3" : "h2";
  const Icon = card.icon;
  return <article className={`${styles.card} ${featured ? styles.featured : ""}`}>
    <div className={styles.art} data-art={card.image}>
      <Image src={`/images/services/${card.image}.webp`} alt="" fill sizes="(max-width: 620px) 92vw, (max-width: 1040px) 45vw, 300px" />
    </div>
    <div className={styles.copy}>
      <span className={styles.icon}><Icon size={21} aria-hidden="true" /></span>
      <Heading>{card.title}</Heading>
      <p>{card.description}</p>
      <Link className={styles.button} href={card.href} aria-label={`${card.inquiry ? "Inquire about" : "Learn more about"} ${card.title}`}>
        {card.inquiry ? "Inquire" : "Learn more"} <ArrowUpRight size={16} aria-hidden="true" />
      </Link>
    </div>
  </article>;
}

export function ServicesOverview({ embedded = false }: { embedded?: boolean }) {
  const Heading = embedded ? "h2" : "h1";
  return <ServicesScene className={`${styles.scene} ${styles.overview} ${embedded ? styles.embedded : ""}`} headingId="services-overview-title">
    <Atmosphere />
    <div className={styles.container}>
      <header className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>Services</p>
          <Heading id="services-overview-title">What I <em>Offer.</em></Heading>
          <p className={styles.subtitle}>A blend of technology and creativity to deliver professional solutions.</p>
        </div>
        <span className={styles.headingBadge} aria-hidden="true"><Layers3 size={19} /> Services</span>
      </header>
      <div className={styles.grid}>
        {overview.map((card) => <ServiceCard key={card.image} card={card} embedded={embedded} />)}
      </div>
      <div className={styles.more}><Link className={styles.button} href="/services/cinematic">Explore More Services <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
    </div>
  </ServicesScene>;
}

export function CinematicServices() {
  return <ServicesScene className={`${styles.scene} ${styles.cinematic}`} headingId="cinematic-services-title">
    <Atmosphere />
    <div className={styles.container}>
      <header className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>Services</p>
          <h1 id="cinematic-services-title">My Creative <em>Services.</em></h1>
          <p className={styles.subtitle}>Professional video production and post-production solutions for your special moments.</p>
        </div>
      </header>
      <div className={styles.grid}>
        {cinematic.map((card, i) => <ServiceCard key={card.image} card={card} featured={i === 0} />)}
      </div>
      <div className={styles.more}><Link className={styles.button} href="/services"><ArrowLeft size={16} aria-hidden="true" /> Back to Services</Link></div>
    </div>
  </ServicesScene>;
}