import { Link } from "react-router-dom";
import { useState } from "react";
import Profile from "./Profile";
import UpdateProfile from "./UpdateProfile";
import UpdatePassword from "./UpdatePassword";

const Account = () => {
  const [selectedComponent, setSelectedComponent] = useState("Profile");
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-background p-4 md:gap-8 sm:pl-20">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <span className="text-[11px] uppercase tracking-wider text-primary font-semibold">
            Administrative Preferences
          </span>
          <h1 className="text-3xl font-serif font-bold text-foreground tracking-tight">Account Settings</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[200px_1fr] lg:grid-cols-[250px_1fr]">
          <nav className="flex flex-col gap-1 text-sm font-medium text-muted-foreground p-1 bg-card rounded-2xl border border-border shadow-xs">
            <button
              type="button"
              className={`text-left px-3.5 py-2.5 rounded-xl transition-all ${
                selectedComponent === "Profile"
                  ? "font-semibold text-primary bg-secondary/80 shadow-xs"
                  : "hover:text-foreground hover:bg-muted/50"
              }`}
              onClick={() => setSelectedComponent("Profile")}
            >
              Profile Overview
            </button>
            <button
              type="button"
              className={`text-left px-3.5 py-2.5 rounded-xl transition-all ${
                selectedComponent === "Update Profile"
                  ? "font-semibold text-primary bg-secondary/80 shadow-xs"
                  : "hover:text-foreground hover:bg-muted/50"
              }`}
              onClick={() => setSelectedComponent("Update Profile")}
            >
              Edit Profile
            </button>
            <button
              type="button"
              className={`text-left px-3.5 py-2.5 rounded-xl transition-all ${
                selectedComponent === "Update Password"
                  ? "font-semibold text-primary bg-secondary/80 shadow-xs"
                  : "hover:text-foreground hover:bg-muted/50"
              }`}
              onClick={() => setSelectedComponent("Update Password")}
            >
              Security & Password
            </button>
          </nav>
          <div className="grid gap-6">
            {(() => {
              switch (selectedComponent) {
                case "Profile":
                  return <Profile />;
                case "Update Profile":
                  return <UpdateProfile />;
                case "Update Password":
                  return <UpdatePassword />;
                default:
                  return <Profile />;
              }
            })()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Account;
