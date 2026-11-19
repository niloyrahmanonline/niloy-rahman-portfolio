import type { Metadata } from "next";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "./globals.css";
import "./glass.css";
import "./editorial.css";
import "./cinematic.css";
import { InteractionEffects } from "@/components/interaction-effects";
import { Footer, Header } from "@/components/shell";
import { profile } from "@/lib/content";

export const metadata: Metadata = {
  title: { default: "Niloy Rahman | Creative Developer & Digital Creator", template: "%s | Niloy Rahman" },
  description: "Explore web and app development, wedding film editing, photo editing, and visual work by Niloy Rahman in Dinajpur, Bangladesh.",
  openGraph: { type: "website", siteName: profile.name, title: profile.name + " | " + profile.role, description: "Development, editing, photography, and cinematography in Dinajpur, Bangladesh." },
};

const themeScript = "try { const value = localStorage.getItem('portfolio-theme'); if (value === 'light' || value === 'dark') document.documentElement.dataset.theme = value; } catch {}";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning>
    <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
    <body><a className="skip-link" href="#main">Skip to content</a><Header /><main id="main" tabIndex={-1}>{children}</main><Footer /><InteractionEffects /></body>
  </html>;
}