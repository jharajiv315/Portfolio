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
  return (
    <div className="relative min-h-screen bg-[#FAF7F2] text-[#1C1917] py-12 px-5 sm:px-8">
      <CustomCursor />
      <ParticleBackground />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Navigation Bar / Return */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E8E1D5]">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#57534E] hover:text-[#1C1917] transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Portfolio</span>
          </button>

          <span className="text-xs uppercase tracking-wider text-[#B84A1C] font-semibold">
            Project Overview
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="w-8 h-8 rounded-full border-2 border-[#B84A1C] border-t-transparent animate-spin" />
          </div>
        ) : !project ? (
          <div className="text-center py-20 text-[#78716C]">
            Project not found or unavailable.
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {/* Header / Title */}
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#E8E1D5] text-[#B84A1C] text-xs font-semibold uppercase tracking-wider mb-3 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{project.stack || "Full-Stack Development"}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#1C1917] mb-3 tracking-tight">
                {project.title}
              </h1>
              {project.deployed && (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 border border-emerald-200 text-emerald-800">
                  Status: {project.deployed}
                </span>
              )}
            </div>

            {/* Banner Image */}
            <div className="w-full aspect-[16/9] rounded-3xl overflow-hidden border border-[#E8E1D5] bg-white shadow-lg relative">
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
              <div className="md:col-span-2 rounded-3xl p-6 sm:p-8 bg-white/95 border border-[#E8E1D5] shadow-xs flex flex-col gap-4">
                <h2 className="text-xl font-serif font-bold text-[#1C1917] flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#B84A1C]" />
                  <span>About this Project</span>
                </h2>
                <p className="text-[#57534E] text-base leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>
              </div>

              {/* Sidebar: Tech & Links */}
              <div className="rounded-3xl p-6 sm:p-8 bg-white/95 border border-[#E8E1D5] shadow-xs flex flex-col gap-6">
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
