import type { Metadata } from "next";
import "./globals.css";
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
      data-scroll-behavior="smooth"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-[#fcfbf9] text-slate-800">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
