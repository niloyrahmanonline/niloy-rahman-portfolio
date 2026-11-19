import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Camera, Clapperboard, CodeXml, Layers3, Play, Video } from "lucide-react";
import { PortraitStage } from "./portrait-stage";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About",
  description: "Meet Niloy Rahman, a creative developer and digital creator based in Dinajpur, Bangladesh.",
};

const disciplines = [
  { icon: CodeXml, first: "Web", second: "Development" },
  { icon: Video, first: "Video", second: "Production" },
  { icon: Camera, first: "Photography", second: "& Editing" },
  { icon: Layers3, first: "Digital", second: "Tools" },
];

function PortraitOrbit({ className }: { className: string }) {
  return (
    <div className={className} aria-hidden="true">
      <svg className={styles.orbitEnergy} viewBox="0 0 600 160" preserveAspectRatio="none" focusable="false">
        <ellipse className={styles.orbitStrand} cx="300" cy="80" rx="294" ry="75" />
        <ellipse className={styles.orbitBloom} cx="300" cy="80" rx="298" ry="78" pathLength="100" />
        <ellipse className={styles.orbitPulse} cx="300" cy="80" rx="298" ry="78" pathLength="100" />
      </svg>
    </div>
  );
}

export default function About() {
  return (
    <div className={styles.scene}>
      <div className={styles.wrap}>
        <section className={styles.intro} aria-labelledby="about-title">
          <div className={styles.copy}>
            <p className={styles.label}>About me</p>
            <h1 id="about-title">Creative Developer &amp;<br /><em>Digital Creator.</em></h1>
            <p className={styles.bio}>I&apos;m Niloy Rahman, a Creative Developer and Digital Creator who blends technology, storytelling and visual creativity. I work with web development, video editing, photography and cinematic production to create meaningful digital experiences.</p>
            <ul className={styles.disciplines}>
              {disciplines.map(({ icon: Icon, first, second }) => (
                <li key={first}>
                  <span className={styles.icon}><Icon aria-hidden="true" /></span>
                  {first}<br />{second}
                </li>
              ))}
            </ul>
            <div className={styles.actions}>
              <Link className={styles.primary} href="/contact">Get in touch <ArrowUpRight size={17} aria-hidden="true" /></Link>
              <Link className={styles.secondary} href="/portfolio"><Play size={17} aria-hidden="true" /> View My Work</Link>
            </div>
          </div>

          <PortraitStage className={styles.stage}>
            <div className={styles.glass} aria-hidden="true" />
            <PortraitOrbit className={styles.orbitBack} />
            <div className={styles.portrait}>
              <Image src="/images/about/niloy-main-transparent.png" alt="Niloy Rahman in a floral shirt operating a camera gimbal" fill preload sizes="(max-width: 760px) 86vw, (max-width: 1400px) 48vw, 700px" />
            </div>
            <PortraitOrbit className={styles.orbitFront} />
            <div className={styles.signature} aria-hidden="true">Niloy Rahman</div>
            <div className={styles.stageDecor} aria-hidden="true">
              <Clapperboard className={styles.film} />
              <CodeXml className={styles.code} />
              <Camera className={styles.camera} />
              <i /><i /><i /><i /><i />
            </div>
          </PortraitStage>
          <span className={styles.butterfly} aria-hidden="true" />
          <span className={styles.butterfly} aria-hidden="true" />
        </section>

        <section className={styles.behind} aria-labelledby="behind-title">
          <div className={styles.behindCopy}>
            <Clapperboard aria-hidden="true" />
            <div>
              <h2 id="behind-title">Behind the <em>Scenes</em></h2>
              <p>A glimpse of my creative journey, from shooting to final production.</p>
            </div>
          </div>
          <div className={`${styles.thumbnail} ${styles.leftPhoto}`}>
            <Image src="/images/about/new_add.jpg" alt="Niloy holding a camera on a gimbal in front of a colorful backdrop" width={4000} height={6000} sizes="(max-width: 760px) 91vw, (max-width: 1440px) 29vw, 385px" />
          </div>
          <div className={`${styles.thumbnail} ${styles.behindPhoto}`}>
            <Image src="/images/about/niloy-behind-scenes.jpg" alt="Niloy in a floral shirt adjusting a camera gimbal outdoors" width={3024} height={4032} sizes="(max-width: 760px) 91vw, (max-width: 1440px) 29vw, 385px" />
          </div>
        </section>
      </div>
    </div>
  );
}
