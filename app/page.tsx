import Link from "next/link";
import Image from "next/image";
import Icon, { type IconName } from "@/components/Icon";
import { IndiaMap, Tricolor } from "@/components/Heritage";

const steps = [
  { icon: "edit", title: "Create", text: "Design or adapt learning content in Hindi", href: "/create-lesson", color: "orange" },
  { icon: "translate", title: "Translate", text: "Build context-aware Santhali learning kits", href: "/create-lesson", color: "green" },
  { icon: "audio", title: "Enrich", text: "Add audio, vocabulary, activities and assessments", href: "/lessons", color: "blue" },
  { icon: "students", title: "Teach", text: "Bring lessons to life in your classroom", href: "/student/catalog", color: "purple" },
];

export default function Home() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="hero-art">
          <Image src="/education-hero.png" alt="Four schoolchildren looking toward the future beneath a tree in India" fill sizes="(max-width: 760px) 100vw, 60vw" preload />
        </div>
        <div className="hero-map"><IndiaMap/><div>Bharat<br/>ke bacchon ke liye,<br/>Bharat ki bhasha<Tricolor/></div></div>
        <div className="hero-motto" lang="hi">मातृभाषा से<br/>मजबूत भारत<Tricolor/></div>
        <div className="hero-content">
          <span className="eyebrow">Mother-Tongue Based Primary Education</span>
          <h1>Every Child Learns Better<br />in Their <span className="saffron">Own</span> <span className="forest">Language</span></h1>
          <p className="hero-description">Vaani Shiksha brings AI-powered learning resources, translation, and culturally relevant content to primary education in India’s vernacular languages.</p>
          <div className="hero-benefits">
            <div><i className="orange"><Icon name="book"/></i><span><b>Create &amp; Adapt</b><small>Engaging lessons</small></span></div>
            <div><i className="green"><Icon name="students"/></i><span><b>Support Inclusion</b><small>For every learner</small></span></div>
            <div><i className="blue"><Icon name="chart"/></i><span><b>Learn Together</b><small>Meaningful classrooms</small></span></div>
          </div>
          <div className="hero-actions"><Link className="primary-action" href="/teacher">Get Started <span>→</span></Link><a className="secondary-action" href="#how-it-works">⊙ &nbsp; Learn More</a></div>
        </div>
      </section>
      <section className="home-stats" aria-label="Learning resources">
        <div><i className="orange"><Icon name="book"/></i><span><strong>3</strong><b>Demo Lessons</b><small>Hindi–Santhali learning kits</small></span></div>
        <div><i className="green"><Icon name="check"/></i><span><strong>Teacher</strong><b>Review &amp; Verification</b><small>Make every lesson classroom-ready</small></span></div>
        <div><i className="blue"><Icon name="students"/></i><span><strong>3</strong><b>Grade Levels</b><small>Foundational learning content</small></span></div>
        <div><i className="orange"><Icon name="globe"/></i><span><strong>2</strong><b>Languages</b><small>Hindi <em>→</em> Santhali</small></span></div>
        <blockquote>“A stronger India begins with<br />a child who learns in their own language.”</blockquote>
      </section>
      <section className="home-workflow" id="how-it-works">
        <div className="section-title"><div><h2>How Vaani Shiksha Works</h2><p>From curriculum to classroom, in just a few simple steps</p></div><Link href="/create-lesson">Create your first lesson &nbsp; →</Link></div>
        <div className="workflow-grid">{steps.map((step, index) => <Link href={step.href} key={step.title} className={`workflow-card ${step.color}`}><i><Icon name={step.icon as IconName} size={25}/></i><div><h3>{index + 1}. {step.title}</h3><p>{step.text}</p></div><span className="step-arrow">↗</span></Link>)}</div>
      </section>
      <section className="home-languages"><div className="section-title"><div><h2>Our Supported Languages</h2><p>Building inclusive education for every learner</p></div></div><div className="language-pair"><span className="hindi"><b lang="hi">हिं</b>Hindi</span><span>→</span><span className="santhali"><b className="font-santhali" lang="sat">ᱥᱟᱱᱛᱟᱲᱤ</b>Santhali</span></div><p>Rooted in culture.<br />Growing with every classroom.</p></section>
      <section className="home-learning-entry"><div><span className="eyebrow">A little more to explore</span><h2>Books to read. Words to discover.</h2><p>Find NCERT books for Classes 1–5 and a little Hindi–English dictionary, all in your Learning Hub.</p></div><Link href="/learning" className="primary-action">Explore Learning Hub <Icon name="arrow" size={18}/></Link></section>
    </main>
  );
}
