import { projectMetadata } from "../../lib/project-seo";
import usePortfolioData from "../hooks/usePortfolioData";
import { API_URL } from "../config";
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { ArrowLeft, Github, ExternalLink, Layers, Cpu } from "lucide-react";

export const ProjectView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    projects,
    user,
    loading,
    refreshing,
    error,
    isPreview,
    previewToken,
    settings,
  } = usePortfolioData();
  const project = projects.find((p) => String(p.id || p._id) === id);
  useEffect(() => {
    if (!project || isPreview) return;
    const previousTitle = document.title;
    const m = projectMetadata(project, user?.fullName);
    document.title = m.title;
    const changes = [];
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = m.url;
    changes.push(() => canonical.remove());
    for (const [attribute, key, value] of [['name','description',m.description], ['property','og:title',m.title], ['property','og:description',m.description], ['property','og:image',m.image], ['property','og:url',m.url], ['name','twitter:card','summary_large_image'], ['name','twitter:title',m.title], ['name','twitter:description',m.description], ['name','twitter:image',m.image]]) {
      let tag = document.head.querySelector(`meta[${attribute}="${key}"]`);
      const old = tag?.getAttribute('content'); const created = !tag;
      if (!tag) { tag = document.createElement('meta'); tag.setAttribute(attribute,key); document.head.appendChild(tag); }
      tag.setAttribute('content',value); changes.push(() => created ? tag.remove() : tag.setAttribute('content',old || ''));
    }
    return () => { document.title = previousTitle; changes.forEach(undo => undo()); };
  }, [project, user?.fullName, isPreview]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  const handleReturn = () => {
    // If previous history entry exists in current window, navigate back to preserve scroll position
    navigate(
      previewToken
        ? `/#preview=${previewToken}`
        : settings.visibility.projects
          ? "/#projects"
          : "/#home",
    );
  };

  const hasGitRepo =
    project?.gitRepoLink &&
    project.gitRepoLink.trim() !== "" &&
    !project.gitRepoLink.includes("[ADD");

  const hasLiveLink =
    project?.projectLink &&
    project.projectLink.trim() !== "" &&
    !project.projectLink.includes("[ADD");

  const technologiesList = project?.technologies
    ? project.technologies
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="case-page relative min-h-screen bg-[#FAF7F2] text-[#1C1917] py-12 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto relative z-10">
        {isPreview && (
          <div className="portfolio-preview-banner">
            Draft preview · Not published
          </div>
        )}
        {/* Navigation Bar / Return */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E8E1D5]">
          <button
            onClick={handleReturn}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#57534E] hover:text-[#1C1917] transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Portfolio</span>
          </button>

          <span className="text-xs uppercase tracking-wider text-[#B84A1C] font-semibold">
            Project Overview
          </span>
        </div>

        {loading || (!project && refreshing) ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="w-8 h-8 rounded-full border-2 border-[#B84A1C] border-t-transparent animate-spin" />
          </div>
        ) : !project ? (
          <div className="text-center py-20 text-[#78716C]">
            {error || "Project not found or unavailable."}
          </div>
        ) : (
          <div className="case-layout flex flex-col gap-10">
            {/* Header / Title */}
            <div>
              <p className="text-xs font-semibold text-[#B84A1C] uppercase tracking-wider mb-2">
                {project.stack || "Full-Stack Development"}
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#1C1917] mb-3 tracking-tight">
                {project.title}
              </h1>
              {project.deployed && (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#F1E9DE] border border-[#E8E1D5] text-[#875337]">
                  Status: {project.deployed}
                </span>
              )}
            </div>

            {/* Banner Image */}
            <div className="w-full aspect-[16/9] rounded-3xl overflow-hidden border border-[#E8E1D5] bg-white shadow-lg relative">
              <img
                src={project.projectBanner?.url || "/placeholder.jpg"}
                alt={project.title}
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop";
                }}
              />
            </div>

            {project.caseStudy && (
              <div className="project-case-study">
                {[
                  ["problem", "The problem"],
                  ["contribution", "Project contribution"],
                  ["decisions", "Engineering decisions"],
                  ["lessons", "Lessons & takeaways"],
                ].map(
                  ([key, label]) =>
                    project.caseStudy[key] && (
                      <section key={key} className="case-chapter">
                        <h2>{label}</h2>
                        <p>{project.caseStudy[key]}</p>
                      </section>
                    ),
                )}
              </div>
            )}
            {project.caseStudy?.screenshots?.length > 0 && (
              <section className="case-gallery">
                <h2>Project screenshots</h2>
                <div>
                  {project.caseStudy.screenshots.map((url, i) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={url}
                        loading="lazy"
                        alt={`${project.title} screenshot ${i + 1}`}
                      />
                    </a>
                  ))}
                </div>
              </section>
            )}
            {/* Content Grid */}
            <div className="case-overview grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Main Description */}
              <div className="case-description md:col-span-2 rounded-3xl p-6 sm:p-8 bg-white/95 border border-[#E8E1D5] shadow-xs flex flex-col gap-4">
                <h2 className="text-xl font-serif font-bold text-[#1C1917] flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#B84A1C]" />
                  <span>About this Project</span>
                </h2>
                <p className="text-[#57534E] text-base leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>
              </div>

              {/* Sidebar: Tech & Links */}
              <div className="case-facts rounded-3xl p-6 sm:p-8 bg-white/95 border border-[#E8E1D5] shadow-xs flex flex-col gap-6">
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-[#78716C] mb-3 flex items-center gap-2 font-semibold">
                    <Cpu className="w-4 h-4 text-[#B84A1C]" />
                    <span>Technologies</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {technologiesList.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-[#FAF7F2] border border-[#E8E1D5] text-[#1C1917]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#E8E1D5] pt-4 flex flex-col gap-3">
                  {hasGitRepo && (
                    <a
                      href={project.gitRepoLink}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 px-4 rounded-full bg-white/80 hover:bg-white border border-[#E8E1D5] text-[#1C1917] transition-all flex items-center justify-center gap-2 text-sm font-medium shadow-xs hover:shadow-sm"
                    >
                      <Github className="w-4 h-4" />
                      <span>Source Code</span>
                    </a>
                  )}

                  {hasLiveLink && (
                    <a
                      href={project.projectLink}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 px-4 rounded-full bg-[#B84A1C] hover:bg-[#A03D14] text-white font-medium transition-all flex items-center justify-center gap-2 text-sm shadow-md hover:shadow-lg"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Live Preview</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectView;
