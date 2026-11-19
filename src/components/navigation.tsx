"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, SunMoon, X } from "lucide-react";
import { useState } from "react";
import { navigation } from "@/lib/content";

const headerRoutes = ["/", "/portfolio", "/services", "/about", "/digital-subscriptions", "/contact"];

export function Navigation() {
  const pathname = usePathname();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const open = menuPath === pathname;
  function toggleTheme() {
    const root = document.documentElement;
    const current = root.dataset.theme ?? (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    const next = current === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("portfolio-theme", next); } catch {}
  }

  return <div className="nav-controls" onKeyDown={(event) => {
    if (open && event.key === "Escape") {
      setMenuPath(null);
      document.getElementById("menu-toggle")?.focus();
    }
  }}>
    <button type="button" className="icon-button" aria-label="Switch color theme" onClick={toggleTheme}><SunMoon size={18} /></button>
    <button type="button" id="menu-toggle" className="icon-button menu-toggle" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="site-navigation" onClick={() => setMenuPath(open ? null : pathname)}>{open ? <X size={20} /> : <Menu size={20} />}</button>
    <nav className={open ? "nav-links is-open optical-glass" : "nav-links optical-glass"} id="site-navigation" aria-label="Main navigation" data-glass-reflection>
      {headerRoutes.map((route) => {
        const [label, href] = navigation.find(([, href]) => href === route)!;
        const active = pathname === href || (href !== "/" && pathname.startsWith(href + "/"));
        return <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} data-active={active} data-mobile-only={href === "/digital-subscriptions" || href === "/contact"} onClick={() => setMenuPath(null)}>{href === "/portfolio" ? "Selected work" : label}</Link>;
      })}
      <span className="glass-reflection" aria-hidden="true"><span /></span>
    </nav>
    <Link href="/contact" className="nav-contact optical-glass">Get in touch <ArrowUpRight size={15} aria-hidden="true" /></Link>
  </div>;
}
