import type { Metadata } from "next";
import "./learning.css";
export const metadata: Metadata = {
  title: "Learning Hub | Vaani Shiksha",
  description: "Explore NCERT books for Classes 1–5 and a simple Hindi–English dictionary for young learners.",
};
export default function LearningLayout({ children }: { children: React.ReactNode }) { return children; }
