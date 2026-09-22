"use client";
import Link from "@/components/OfflineLink";
import { usePathname } from "next/navigation";
import Icon from "./Icon";

export default function LearningNavigation() {
  const path = usePathname();
  return <nav className="learning-navigation" aria-label="Learning hub">
    <Link href="/learning" aria-current={path === "/learning" ? "page" : undefined}><Icon name="book" size={19}/>NCERT Books<span>Classes 1–5</span></Link>
    <Link href="/learning/dictionary" aria-current={path === "/learning/dictionary" ? "page" : undefined}><Icon name="translate" size={19}/>Little Dictionary<span>Hindi & English</span></Link>
    <Link href="/learning/alphabets" aria-current={path === "/learning/alphabets" ? "page" : undefined}>अ Aa · Alphabets</Link>
    <Link href="/learning/speech" aria-current={path === "/learning/speech" ? "page" : undefined}>Speech to Text</Link>
  </nav>;
}
