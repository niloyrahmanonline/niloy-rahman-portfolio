"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, ChevronsLeftRight, Film } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
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

export function PortfolioGrid({ filterable = true }: { filterable?: boolean }) {
  const ProjectHeading = filterable ? "h2" : "h3";
  const resultsId = useId();
  const results = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const visible = filter === "All" ? projects : projects.filter((project) => project.category === filter);

  useEffect(() => {
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver((entries) => {
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting) continue;
        target.setAttribute("data-revealed", "");
        observer.unobserve(target);
      }
    }, { threshold: 0.15 });

    results.current?.querySelectorAll("[data-project-card]:not([data-revealed])").forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [filter]);

  return <>
    {filterable && <>
      <div className="filters" role="group" aria-label="Filter projects">
        {filters.map((item) => <button key={item} id={item === "All" ? resultsId + "-all" : undefined}
          type="button" aria-pressed={item === filter} aria-controls={resultsId} onClick={() => setFilter(item)}>
          <Check className="filter-check" size={14} aria-hidden="true" />{item}
        </button>)}
      </div>
      <span className="sr-only" role="status">{visible.length} {visible.length === 1 ? "project" : "projects"} shown · {filter}</span>
    </>}
    <div className={styles.grid} id={resultsId} ref={results}>
      {visible.length === 0 && <p className={styles.empty}>No projects in this category yet. <button type="button" onClick={() => {
        document.getElementById(resultsId + "-all")?.focus();
        setFilter("All");
      }}>Show all projects</button></p>}
      {visible.map((project) => {
        const titleId = resultsId + "-" + project.slug;
        return <Link className={styles.card} key={project.slug} href={"/portfolio/" + project.slug}
          aria-labelledby={titleId} data-project-card>
          <div className={styles.visual}><ProjectArt project={project} sizes="(max-width: 760px) 92vw, (max-width: 1300px) 53vw, 680px" /></div>
          <div className={styles.copy}>
            <p className="eyebrow">{project.category} · Concept</p>
            <ProjectHeading id={titleId}>{project.title}</ProjectHeading>
            <p className={styles.summary}>{project.description}</p>
            <span className={styles.action}>View project <ArrowUpRight size={17} aria-hidden="true" /></span>
          </div>
        </Link>;
      })}
    </div>
  </>;
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
