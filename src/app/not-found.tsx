import Link from "next/link";
import { PageHeading } from "@/components/sections";

export default function NotFound() {
  return <div className="wrap page"><PageHeading label="404" title="Page not found." description="This page may have moved or the address may be incorrect." /><Link href="/" className="button button-primary">Back to home</Link></div>;
}