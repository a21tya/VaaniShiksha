import type { ReactNode } from "react";
import { IndiaMap, Tricolor } from "./Heritage";
export default function PageHeading({ eyebrow, title, description, children }: { eyebrow: string; title: ReactNode; description: ReactNode; children?: ReactNode }) {
  return <header className="page-heading"><div className="page-heading-copy"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p>{children && <div className="page-heading-actions">{children}</div>}</div><div className="heading-heritage" aria-hidden="true"><IndiaMap/><span lang="hi">मातृभाषा से<br/>मजबूत भारत</span><Tricolor/></div></header>;
}
