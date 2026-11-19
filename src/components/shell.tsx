import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import { Navigation } from "./navigation";
import { navigation, profile } from "@/lib/content";

export function Brand() {
  return <Link href="/" className="brand"><span className="brand-mark" aria-hidden="true">nr<span>.</span></span><span>{profile.name}</span></Link>;
}

export function Header() {
  return <header className="site-header"><div className="nav-shell"><Brand /><Navigation /></div></header>;
}

export function Footer() {
  return <footer className="site-footer wrap">
    <div><Brand /><p>{profile.role} · {profile.location}</p></div>
    <nav className="footer-nav" aria-label="Footer navigation">{navigation.filter(([label]) => label !== "Home").map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav><div className="footer-links">
      <a href={"mailto:" + profile.email} aria-label="Email Niloy"><Mail size={19} /></a>
      <a href={profile.whatsapp} aria-label="WhatsApp"><MessageCircle size={19} /></a>
      <a href={profile.facebook} aria-label="Facebook"><span className="facebook-mark" aria-hidden="true">f</span></a>
    </div>
  </footer>;
}