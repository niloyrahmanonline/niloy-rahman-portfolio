"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, ChevronsLeftRight, Film } from "lucide-react";
import { useId, useRef, useState } from "react";
import { profile, projects } from "@/lib/content";

type Project = (typeof projects)[number];
const filters = ["All", "Development", "Film", "Photography"] as const;

export function ProjectArt({ project }: { project: Project }) {
  return <div className={"project-art art-" + project.art} aria-hidden="true">
    {project.art === "interface" && <div className="art-window"><div className="art-toolbar"><i /><i /><i /></div><div className="art-sidebar" /><div className="art-chart"><i /><i /><i /><i /><i /><i /></div></div>}
    {project.art === "film" && <div className="film-frame"><Film size={48} strokeWidth={1} /></div>}
    {project.art === "portrait" && <Image src={profile.portrait} alt="" fill sizes="(max-width: 760px) 90vw, 360px" />}
  </div>;
}

export function PortfolioGrid() {
  const resultsId = useId();
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const visible = filter === "All" ? projects : projects.filter((project) => project.category === filter);
  return <>
    <div className="filters" role="group" aria-label="Filter projects">{filters.map((item) => <button key={item} id={item === "All" ? resultsId + "-all" : undefined} type="button" aria-pressed={item === filter} aria-controls={resultsId} onClick={() => setFilter(item)}><Check className="filter-check" size={14} aria-hidden="true" />{item}</button>)}</div>
    <span className="sr-only" role="status">{visible.length} {visible.length === 1 ? "project" : "projects"} shown · {filter}</span>
    <div className="project-grid" id={resultsId} data-all={filter === "All"}>{visible.length === 0 && <p className="panel project-empty">No projects in this category yet. <button type="button" onClick={() => {
      document.getElementById(resultsId + "-all")?.focus();
      setFilter("All");
    }}>Show all projects</button></p>}{visible.map((project) => <Link className={"panel project-card project-" + project.art} key={project.slug} href={"/portfolio/" + project.slug} data-glass-reflection>
      <ProjectArt project={project} /><div className="project-copy"><p className="card-meta">{project.category} · Concept</p><h3>{project.title}</h3><p className="project-summary">{project.description}</p><span className="service-action">View project</span></div>
      <span className="glass-reflection" aria-hidden="true"><span /></span>
    </Link>)}</div>
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
