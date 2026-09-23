import type { Metadata } from "next";
import "./globals.css";
import "./refresh.css";
import OfflineNavigation from "@/components/OfflineNavigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Vaani Shiksha | Every Child, Every Language",
  description:
    "AI-Powered Vernacular Pedagogy and Real-Time Translation Tool for Mother Tongue-Based Primary Education.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "VaaniShiksha",
  },
};

export const viewport = {
  themeColor: "#fcfbf9",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className="h-full antialiased"
    >
      <head><script dangerouslySetInnerHTML={{ __html: `(function(){var t;try{t=localStorage.getItem('vaani-theme')}catch(e){}if(t!=='dark'&&t!=='light')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t})()` }} /></head>
      <body className="min-h-full flex flex-col">
        <OfflineNavigation />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
