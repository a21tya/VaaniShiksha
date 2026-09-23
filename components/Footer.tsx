import Link from "@/components/OfflineLink";
import { VillageLines, BookLines, IndianFlag } from "./Heritage";
export default function Footer() {
  return <footer className="site-footer"><div className="footer-landscape"><VillageLines/><p>Every language holds a world.<br/><strong>Let every child discover theirs.</strong></p><div className="footer-book"><BookLines/><span lang="hi">शिक्षा<br/>समावेश<br/>समृद्धि</span><IndianFlag/></div></div><div className="folk-border"/><div className="footer-inner"><p>© 2026 Vaani Shiksha <span> · Made for every voice, every classroom.</span></p><nav aria-label="Footer"><Link href="/offline">Offline setup</Link><Link href="/teacher">For teachers</Link><Link href="/student/catalog">For students</Link><Link href="/learning">Learning Hub</Link><Link href="/learning/dictionary">Dictionary</Link></nav></div></footer>;
}
