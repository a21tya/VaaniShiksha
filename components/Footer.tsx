import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="mt-auto bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white p-1.5 rounded-lg inline-block">
                <Image
                  src="/vaanishiksha-logo-cropped.jpeg"
                  alt="VaaniShiksha Logo"
                  width={160}
                  height={64}
                  className="h-9 w-auto object-contain"
                />
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              AI-Powered Vernacular Pedagogy and Real-Time Translation Tool for
              Mother Tongue-Based Primary Education (SIH Problem Statement SIH26042).
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">
              Prototype Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-amber-300 transition-colors">
                  Home / Landing Page
                </Link>
              </li>
              <li>
                <Link href="/teacher" className="hover:text-amber-300 transition-colors">
                  Teacher Dashboard
                </Link>
              </li>
              <li>
                <Link href="/create-lesson" className="hover:text-amber-300 transition-colors">
                  Lesson Creation Form
                </Link>
              </li>
              <li>
                <Link href="/student/catalog" className="hover:text-amber-300 transition-colors">
                  Student Mode (Plants Around Us)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">
              Language Focus
            </h3>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-amber-200">
              <span className="font-medium">Primary Focus:</span>
              <span>Hindi → Santhali</span>
            </div>
            <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
              Designed for inclusive primary classrooms in India, empowering teachers and native speakers.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 VaaniShiksha Project • SIH26042 Prototype Phase</p>
          <p className="text-slate-400">
            Mother Tongue-Based Multilingual Education (MTB-MLE) Initiative
          </p>
        </div>
      </div>
    </footer>
  );
}
