import { API_URL } from "../config";
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { ArrowLeft, Github, ExternalLink, Sparkles, Layers, Cpu } from "lucide-react";
import CustomCursor from "../components/CustomCursor";
import ParticleBackground from "../components/ParticleBackground";

export const ProjectView = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getProject = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/v1/project/get/${id}`, {
          withCredentials: true,
        });
        if (res.data && res.data.project) {
          setProject(res.data.project);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load project details");
      } finally {
        setLoading(false);
      }
    };
    getProject();
  }, [id]);

  const hasGitRepo =
    project?.gitRepoLink &&
    project.gitRepoLink.trim() !== "" &&
    !project.gitRepoLink.includes("[ADD");

  const hasLiveLink =
    project?.projectLink &&
    project.projectLink.trim() !== "" &&
    !project.projectLink.includes("[ADD");

  const technologiesList = project?.technologies
    ? project.technologies.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="relative min-h-screen bg-black text-white font-poppins py-12 px-5 sm:px-8">
      <CustomCursor />
      <ParticleBackground />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Navigation Bar / Return */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-sm font-body font-medium text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Portfolio</span>
          </button>

          <span className="text-xs font-body uppercase tracking-wider text-cyan-400 font-medium">
            Project Overview
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
          </div>
        ) : !project ? (
          <div className="text-center py-20 text-gray-400 font-body">
            Project not found or unavailable.
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {/* Header / Title */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-body uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{project.stack || "Full-Stack Development"}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-4 tracking-tight">
                {project.title}
              </h1>
              {project.deployed && (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-body font-medium bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                  Status: {project.deployed}
                </span>
              )}
            </div>

            {/* Banner Image */}
            <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden glass-card border border-white/10 shadow-2xl relative">
              <img
                src={project.projectBanner?.url || "/placeholder.jpg"}
                alt={project.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop";
                }}
              />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Main Description */}
              <div className="md:col-span-2 glass-card rounded-2xl p-6 sm:p-8 border border-white/10 flex flex-col gap-4">
                <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-cyan-400" />
                  <span>About this Project</span>
                </h2>
                <p className="text-gray-300 text-base leading-relaxed whitespace-pre-line font-body font-normal">
                  {project.description}
                </p>
              </div>

              {/* Sidebar: Tech & Links */}
              <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 flex flex-col gap-6">
                <div>
                  <h3 className="text-xs font-body uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2 font-medium">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <span>Technologies</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {technologiesList.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-full text-xs font-body font-normal bg-white/5 border border-white/10 text-gray-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
                  {hasGitRepo && (
                    <a
                      href={project.gitRepoLink}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 hover:text-white transition-colors flex items-center justify-center gap-2 text-sm font-body font-medium"
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
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-body font-medium transition-all flex items-center justify-center gap-2 text-sm shadow-md shadow-cyan-500/20"
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
