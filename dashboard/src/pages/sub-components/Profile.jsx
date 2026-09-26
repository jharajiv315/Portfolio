import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSelector } from "react-redux";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { FileText, ExternalLink } from "lucide-react";
import { downloadResumeDocument } from "@/lib/utils";

const isImage = (url) => {
  if (!url || typeof url !== "string") return false;
  return url.match(/\.(jpeg|jpg|gif|png|webp|svg)($|\?)/i) || url.startsWith("data:image/");
};

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  return (
    <>
      <div className="w-full h-full">
        <div>
          <div className="grid w-[100%] gap-6">
            <div className="grid gap-1">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight">
                Profile Overview
              </h2>
              <p className="text-muted-foreground text-sm">
                Full review of your verified public profile information and social presence
              </p>
            </div>
            <div className="grid gap-5">
              <div className="flex items-start lg:justify-between lg:items-center flex-col lg:flex-row gap-5">
                <div className="grid gap-2 w-full sm:w-72">
                  <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                    Profile Image
                  </Label>
                  <div className="w-full sm:w-72 h-80 rounded-2xl border border-border overflow-hidden bg-card shadow-xs">
                    <img
                      src={user && user.avatar && user.avatar.url}
                      alt="avatar"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>
                <div className="grid gap-2 w-full sm:w-72">
                  <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                    Attached Resume
                  </Label>
                  {user?.resume?.url ? (
                    isImage(user.resume.url) ? (
                      <Link to={user.resume.url} target="_blank">
                        <div className="w-full sm:w-72 h-80 rounded-2xl border border-border overflow-hidden bg-card shadow-xs">
                          <img
                            src={user.resume.url}
                            alt="resume preview"
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          downloadResumeDocument(
                            user.resume.url,
                            user?.fullName || "Rajiv_Jha"
                          )
                        }
                        className="w-full sm:w-72 h-80 rounded-2xl border border-border bg-card shadow-xs hover:border-primary/50 transition-all flex flex-col items-center justify-center p-6 text-center gap-3 group cursor-pointer"
                      >
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                          <FileText className="w-8 h-8" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            Resume Document Attached
                          </p>
                          <span className="text-xs text-muted-foreground uppercase font-mono">
                            {user.resume.url.toLowerCase().endsWith(".pdf") ? "PDF" : "DOCX"}
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-xs text-primary font-medium group-hover:underline">
                          Download Document <ExternalLink className="w-3.5 h-3.5" />
                        </span>
                      </button>
                    )
                  ) : (
                    <div className="w-full sm:w-72 h-80 rounded-2xl border border-dashed border-border bg-muted/20 flex flex-col items-center justify-center p-6 text-center text-muted-foreground gap-2">
                      <FileText className="w-8 h-8 opacity-40" />
                      <p className="text-xs">No resume uploaded</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Full Name</Label>
                <Input type="text" defaultValue={user.fullName} disabled />
              </div>
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input type="email" defaultValue={user.email} disabled />
              </div>
              <div className="grid gap-2">
                <Label>Phone</Label>
                <Input type="text" defaultValue={user.phone} disabled />
              </div>
              <div className="grid gap-2">
                <Label>About Me</Label>
                <Textarea defaultValue={user.aboutMe} disabled />
              </div>
              <div className="grid gap-2">
                <Label>Portfolio URL</Label>
                <Input type="text" defaultValue={user.portfolioURL} disabled />
              </div>
              <div className="grid gap-2">
                <Label>Github URL</Label>
                <Input type="text" defaultValue={user.githubURL} disabled />
              </div>
              <div className="grid gap-2">
                <Label>LinkedIn URL</Label>
                <Input type="text" defaultValue={user.linkedInURL} disabled />
              </div>
              <div className="grid gap-2">
                <Label>Instagram URL</Label>
                <Input type="text" defaultValue={user.instagramURL} disabled />
              </div>
              <div className="grid gap-2">
                <Label>Twitter(X) URL</Label>
                <Input type="text" defaultValue={user.twitterURL} disabled />
              </div>
              <div className="grid gap-2">
                <Label>Facebook URL</Label>
                <Input type="text" defaultValue={user.facebookURL} disabled />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
