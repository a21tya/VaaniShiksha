"use client";
import Link from "@/components/OfflineLink";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import Icon, { type IconName } from "./Icon";
const items: { label: string; href: string; icon: IconName }[] = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Teacher Dashboard", href: "/teacher", icon: "teacher" },
  { label: "Create Lesson", href: "/create-lesson", icon: "edit" },
  { label: "Lesson Library", href: "/lessons", icon: "book" },
  { label: "Learning Hub", href: "/learning", icon: "globe" },
  { label: "Student Mode", href: "/student/catalog", icon: "students" },
];
export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const online = useNetworkStatus();
  return <header className="site-header"><div className="nav-inner"><Link href="/" className="brand" aria-label="Vaani Shiksha home"><Image src="/vaanishiksha-logo-cropped.jpeg" alt="Vaani Shiksha" width={180} height={72} preload/></Link><nav className="desktop-nav" aria-label="Main navigation">{items.map(item => { const active = item.href === "/" ? pathname === "/" : item.href.startsWith("/student") ? pathname.startsWith("/student") : pathname.startsWith(item.href); return <Link href={item.href} key={item.href} aria-current={active ? "page" : undefined}><Icon name={item.icon} size={17}/>{item.label}</Link>; })}</nav><div className="nav-portals"><Link href="/teacher" className="portal-teacher">Teacher Access</Link><Link href="/student/catalog" className="portal-student">Student Portal</Link></div><button className="menu-toggle" aria-expanded={open} aria-controls="mobile-navigation" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>{open ? "✕" : "☰"}</button></div>{open && <nav id="mobile-navigation" className="mobile-navigation" aria-label="Mobile navigation">{items.map(item => <Link key={item.href} href={item.href} onClick={() => setOpen(false)}><Icon name={item.icon} size={18}/>{item.label}</Link>)}</nav>}{!online && <div className="offline-notice" role="status">You’re offline. Downloaded books, saved lessons and installed device models remain available.</div>}</header>;
}
