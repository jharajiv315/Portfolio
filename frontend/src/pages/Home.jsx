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
    settings,
    isPreview,
    previewToken,
  } = usePortfolioData();
  useEffect(() => {
    if (window.location.hash) {
      const target = document.getElementById(window.location.hash.slice(1));
      target?.scrollIntoView();
    }
  }, []);
  const copy = settings.copy;
  const visible = settings.visibility;
  if (isPreview && (loading || error))
    return (
      <div className="min-h-screen bg-[#FAF7F2] p-8 text-[#1C1917]">
        <h1 className="text-2xl font-semibold">Draft preview</h1>
        <p className="my-5" role="status">
          {error || "Loading your saved draft…"}
        </p>
        {error && <button onClick={refetch}>Try again</button>}{" "}
        <a href="/">Return to public portfolio</a>
      </div>
    );
  return (
    <MotionConfig reducedMotion="user">
      <div
        className="portfolio-studio"
        onClickCapture={
          isPreview
            ? (event) => {
                const anchor = event.target.closest?.('a[href^="#"]');
                if (anchor) {
                  const target = document.getElementById(
                    anchor.getAttribute("href").slice(1),
                  );
                  if (target) {
                    event.preventDefault();
                    target.scrollIntoView({
                      behavior: window.matchMedia(
                        "(prefers-reduced-motion: reduce)",
                      ).matches
                        ? "auto"
                        : "smooth",
                    });
                  }
                }
              }
            : undefined
        }
      >
        <a href="#main-content" className="studio-skip-link">
          Skip to content
        </a>
        <Navbar user={user} sections={visible} />
        <main id="main-content">
          {isPreview && (
            <div className="portfolio-preview-banner" role="status">
              Draft preview · Not public · Expires after 15 minutes{" "}
              <a href="/">Exit preview</a>
            </div>
          )}
          <Hero user={user} projectCount={projects.length} copy={copy} />
          {visible.projects && (
            <Projects
              projects={projects}
              user={user}
              loading={loading}
              copy={copy}
              previewToken={previewToken}
            />
          )}
          {visible.about && <About user={user} copy={copy} />}
          {visible.skills && (
            <Skills
              skills={skills}
              softwareApplications={softwareApplications}
              copy={copy}
            />
          )}
          {visible.experience && timelines.length > 0 && (
            <Experience timelines={timelines} copy={copy} />
          )}
          {visible.contact && (
            <Contact user={user} copy={copy} preview={isPreview} />
          )}
        </main>
        <Footer user={user} copy={copy} />
        {error && (
          <div className="studio-load-notice" role="status">
            {error}{" "}
            <button type="button" onClick={refetch}>
              Try again
            </button>
          </div>
        )}
      </div>
    </MotionConfig>
  );
}
