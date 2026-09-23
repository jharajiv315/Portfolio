import React, { useState } from "react";
import usePortfolioData from "../hooks/usePortfolioData";
import IntroAnimation from "../components/IntroAnimation";
import CustomCursor from "../components/CustomCursor";
import Navbar from "../components/Navbar";
import Hero from "../sections/home";
import About from "../sections/About";
import Skills from "../sections/Skills";
import Projects from "../sections/project";
import Experience from "../sections/Experience";
import Testimonials from "../sections/testimonial";
import Contact from "../sections/Contact";
import Footer from "../sections/Footer";

export default function Home() {
  const [introFinished, setIntroFinished] = useState(false);
  const {
    user,
    skills,
    projects,
    timelines,
    softwareApplications,
    testimonials,
    loading,
    error,
  } = usePortfolioData();

  return (
    <div className="relative bg-[#FAF7F2] text-[#1C1917] min-h-screen selection:bg-[#B84A1C]/20 selection:text-[#B84A1C]">
      {/* Multilingual Intro Animation */}
      {!introFinished && (
        <IntroAnimation
          onFinish={() => setIntroFinished(true)}
          onComplete={() => setIntroFinished(true)}
        />
      )}

      {/* Main Website - Reveals when intro completes */}
      <div
        className={
          introFinished
            ? "opacity-100 transition-opacity duration-700"
            : "opacity-0 pointer-events-none"
        }
      >
        <CustomCursor />

        <Navbar user={user} />

        <main>
          <Hero user={user} />
          <About user={user} />
          <Skills skills={skills} softwareApplications={softwareApplications} />
          <Projects projects={projects} user={user} />
          {timelines && timelines.length > 0 && (
            <Experience timelines={timelines} />
          )}
          {testimonials && testimonials.length > 0 && (
            <Testimonials testimonials={testimonials} />
          )}
          <Contact user={user} />
        </main>

        <Footer user={user} />
      </div>

      {/* Subtle Error Banner if API is completely unavailable */}
      {error && (
        <div className="fixed bottom-4 left-4 z-50 p-3 rounded-xl bg-white/95 border border-red-300 text-red-800 text-xs shadow-xl backdrop-blur-md flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
