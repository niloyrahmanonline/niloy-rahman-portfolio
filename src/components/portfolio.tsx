"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Camera, ChevronsLeftRight, Clapperboard, CodeXml, Film, Layers3 } from "lucide-react";
import { useId, useRef, useState } from "react";
import { profile, projects } from "@/lib/content";
import styles from "./portfolio.module.css";

type Project = (typeof projects)[number];
const filters = ["All", "Development", "Film", "Photography"] as const;

export function ProjectArt({ project, sizes = "(max-width: 760px) 90vw, 360px" }: { project: Project; sizes?: string }) {
  return <div className={"project-art art-" + project.art} aria-hidden="true">
    {project.art === "interface" && <div className="art-window"><div className="art-toolbar"><i /><i /><i /></div><div className="art-sidebar" /><div className="art-chart"><i /><i /><i /><i /><i /><i /></div></div>}
    {project.art === "film" && <div className="film-frame"><Film size={48} strokeWidth={1} /></div>}
    {project.art === "portrait" && <Image src={profile.portrait} alt="" fill sizes={sizes} />}
  </div>;
}

type Study = {
  key: string;
  title: string;
  category: "Development" | "Film" | "Photography" | "Digital";
  description: string;
  href: string;
  image: string;
};

const thumbnails = {
  interface: { image: "interface", description: "A modern and clean web interface concept." },
  film: { image: "/images/selected-work/wedding-film-timeline.png", description: "A cinematic wedding video editing concept." },
  portrait: { image: "photography", description: "A portrait photography and color grading study." },
} as const;

const studies: Study[] = [
  ...projects.map((project) => ({
    key: project.slug,
    title: project.art === "portrait" ? "Portrait Photography" : project.title,
    category: project.category,
    href: "/portfolio/" + project.slug,
    ...thumbnails[project.art],
  })),
  {
    key: "digital-subscriptions",
    title: "Digital Subscriptions",
    category: "Digital",
    href: "/digital-subscriptions",
    image: "subscriptions",
    description: "A service showcase for digital subscriptions.",
  },
];

const categoryIcons = { Development: CodeXml, Film: Clapperboard, Photography: Camera, Digital: Layers3 };

export function PortfolioGrid({ filterable = true }: { filterable?: boolean }) {
  const SectionTitle = filterable ? "h1" : "h2";
  const ProjectHeading = filterable ? "h2" : "h3";
  const resultsId = useId();
  const headingId = resultsId + "-heading";
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const visible = filter === "All" ? studies : studies.filter((study) => study.category === filter);

  return <section className={`${styles.showcase} ${filterable ? "" : styles.embedded}`} aria-labelledby={headingId}>
    <div className={styles.decor} aria-hidden="true">
      <span className={styles.butterfly}><i /><i /></span>
      <span className={styles.butterfly}><i /><i /></span>
    </div>
    <div className={styles.container}>
      <header className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>Portfolio</p>
          <SectionTitle id={headingId}>Selected <span>Work.</span></SectionTitle>
          <p className={styles.description}>A selection of creative experiments and concept studies.</p>
        </div>
        {filterable && <div className={styles.filters} role="group" aria-label="Filter selected work">
          {filters.map((item) => {
            const Icon = item === "All" ? null : categoryIcons[item];
            return <button key={item} type="button" aria-pressed={item === filter} aria-controls={resultsId}
              onClick={() => setFilter(item)}>{Icon && <Icon size={18} aria-hidden="true" />}{item}</button>;
          })}
        </div>}
      </header>
      {filterable && <p className="sr-only" role="status" aria-atomic="true">
        {filter === "All" ? "3 concept studies and 1 service showcase shown." : `${visible.length} ${filter.toLowerCase()} concept ${visible.length === 1 ? "study" : "studies"} shown.`}
      </p>}
      <div className={styles.grid} id={resultsId}>
        {visible.map((study) => {
          const titleId = resultsId + "-" + study.key;
          const Icon = categoryIcons[study.category];
          return <Link className={styles.card} key={study.key} href={study.href}
            aria-labelledby={titleId} data-project-card>
            <div className={styles.visual}>
              <Image src={study.image.startsWith("/") ? study.image : `/images/selected-work/${study.image}.webp`} alt="" fill
                sizes="(max-width: 620px) 92vw, (max-width: 1000px) 44vw, (max-width: 1500px) 28vw, 400px" />
            </div>
            <div className={styles.copy}>
              <p className={styles.badge}><Icon size={16} aria-hidden="true" />{study.category}</p>
              <ProjectHeading id={titleId}>{study.title}</ProjectHeading>
              <p className={styles.summary}>{study.description}</p>
              <span className={styles.action}>{study.category === "Digital" ? "View service" : "View project"} <ArrowUpRight size={16} aria-hidden="true" /></span>
            </div>
          </Link>;
        })}
      </div>
      {!filterable && <Link className={styles.browse} href="/portfolio">Browse portfolio <ArrowUpRight size={16} aria-hidden="true" /></Link>}
    </div>
  </section>;
}


export function PhotoComparison() {
  const image = useRef<HTMLDivElement>(null);
  const helpId = useId();
  return <div className="comparison">
    <div className="comparison-image" ref={image}>
      <Image src={profile.portrait} alt="Portrait of Niloy Rahman used for a color-grading demonstration" fill sizes="(max-width: 760px) 90vw, 580px" />
      <div className="comparison-after" aria-hidden="true">
        <Image src={profile.portrait} alt="" fill sizes="(max-width: 760px) 90vw, 580px" />
      </div>
      <span className="comparison-label before">Before</span><span className="comparison-label after">After</span>
      <div className="comparison-divider" aria-hidden="true" />
      <div className="comparison-handle" aria-hidden="true"><ChevronsLeftRight size={20} /></div>
      <input className="comparison-range" type="range" min="0" max="100" defaultValue="50"
        aria-label="Before and after photo comparison" aria-describedby={helpId} aria-valuetext="50% before, 50% after"
        onInput={(event) => {
          const slider = event.currentTarget;
          const before = slider.valueAsNumber;
          image.current?.style.setProperty("--split", before + "%");
          slider.setAttribute("aria-valuetext", before + "% before, " + (100 - before) + "% after");
        }} />
    </div>
    <p className="comparison-control" id={helpId}>Drag the handle or use the arrow keys to compare the original and warm grade.</p>
  </div>;
}
