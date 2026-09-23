import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSelector } from "react-redux";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";

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
                  <img
                    src={user && user.avatar && user.avatar.url}
                    alt="avatar"
                    className="w-full h-auto sm:w-72 sm:h-72 rounded-2xl border border-border object-cover bg-card shadow-xs"
                  />
                </div>
                <div className="grid gap-2 w-full sm:w-72">
                  <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                    Attached Resume
                  </Label>
                  <Link to={user && user.resume && user.resume.url} target="_blank">
                    <img
                      src={user && user.resume && user.resume.url}
                      alt="resume preview"
                      className="w-full h-auto sm:w-72 sm:h-72 rounded-2xl border border-border object-cover bg-card shadow-xs hover:border-primary/40 transition-colors"
                    />
                  </Link>
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
