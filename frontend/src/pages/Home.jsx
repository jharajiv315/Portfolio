import { useEffect } from "react";
import { MotionConfig } from "framer-motion";
import usePortfolioData from "../hooks/usePortfolioData";
import Navbar from "../components/Navbar";
import Hero from "../sections/home";
import About from "../sections/About";
import Skills from "../sections/Skills";
import Projects from "../sections/project";
import Experience from "../sections/Experience";
import Contact from "../sections/Contact";
import Footer from "../sections/Footer";
export default function Home() {
  const {
    user,
    skills,
    projects,
    timelines,
    softwareApplications,
    loading,
    error,
    refetch,
  } = usePortfolioData();
  useEffect(() => {
    if (window.location.hash) {
      const target = document.getElementById(window.location.hash.slice(1));
      target?.scrollIntoView();
    }
  }, []);
  return (
    <MotionConfig reducedMotion="user">
      <div className="portfolio-studio">
        <a href="#main-content" className="studio-skip-link">
          Skip to content
        </a>
        <Navbar user={user} />
        <main id="main-content">
          <Hero user={user} projectCount={projects.length} />
          <Projects projects={projects} user={user} loading={loading} />
          <About user={user} />
          <Skills skills={skills} softwareApplications={softwareApplications} />
          {timelines.length > 0 && <Experience timelines={timelines} />}
          <Contact user={user} />
        </main>
        <Footer user={user} />
        {error && (
          <div className="studio-load-notice" role="status">
            Some content couldn’t load.{" "}
            <button type="button" onClick={refetch}>
              Try again
            </button>
          </div>
        )}
      </div>
    </MotionConfig>
  );
}
