import { Link, useNavigate } from "react-router-dom";
import {
  FolderGit,
  History,
  Home,
  LayoutGrid,
  LogOut,
  MessageSquareMore,
  Package2,
  PanelLeft,
  PencilRuler,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import ContentStudio from "./ContentStudio";
import Dashboard from "./sub-components/Dashboard";
import AddSkill from "./sub-components/AddSkill";
import AddProject from "./sub-components/AddProject";
import AddSoftwareApplications from "./sub-components/AddSoftwareApplications";
import Account from "./sub-components/Account";
import { useDispatch, useSelector } from "react-redux";
import { clearAllUserErrors, logout } from "@/store/slices/userSlice";
import { toast } from "react-toastify";
import Messages from "./sub-components/Messages";
import AddTimeline from "./sub-components/AddTimeline";
import ManageTimeline from "./ManageTimeline";

const HomePage = () => {
  const [active, setActive] = useState("Dashboard");
  const [contentDirty, setContentDirty] = useState(false);
  const switchActive = (next) => {
    if (
      contentDirty &&
      !window.confirm("Leave without saving your content changes?")
    )
      return;
    setActive(next);
  };
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, error, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const handleLogout = () => {
    if (
      contentDirty &&
      !window.confirm("Sign out without saving your content changes?")
    )
      return;
    dispatch(logout());
    toast.success("Logged Out!");
  };
  const navigateTo = useNavigate();
  useEffect(() => {
    if (
      error &&
      !error.toLowerCase().includes("authenticated") &&
      !error.toLowerCase().includes("session")
    ) {
      toast.error(error);
      dispatch(clearAllUserErrors());
    }
    if (!isAuthenticated) {
      navigateTo("/login");
    }
  }, [isAuthenticated, error, dispatch, navigateTo]);
  const items = [
    ["Dashboard", Home, "Overview"],
    ["Add Project", FolderGit, "Add project"],
    ["Add Skill", PencilRuler, "Add skill"],
    ["Add Uses", LayoutGrid, "Add tool"],
    ["Timeline", History, "Timeline"],
    ["Messages", MessageSquareMore, "Messages"],
    ["Account", User, "Account"],
    ["Publishing", FolderGit, "Content & publishing"],
  ];
  const navigation = (close = () => {}) => (
    <nav aria-label="Main navigation" className="space-y-1">
      {items.map(([key, Icon, label]) => (
        <button
          key={key}
          type="button"
          aria-current={active === key ? "page" : undefined}
          onClick={() => {
            switchActive(key);
            close();
          }}
          className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${active === key ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </nav>
  );
  return (
    <div className="admin-shell min-h-screen bg-background text-foreground">
      <a className="sr-only focus:not-sr-only" href="#workspace">
        Skip to workspace
      </a>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r bg-card px-4 py-7 sm:flex">
        <Link
          to="/"
          onClick={() => switchActive("Dashboard")}
          className="mb-9 flex items-center gap-3 px-3"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-lg font-bold text-background">
            R.
          </span>
          <span className="text-sm font-semibold">
            Portfolio studio
            <span className="mt-1 block text-xs font-normal text-muted-foreground">
              Rajiv Jha
            </span>
          </span>
        </Link>
        <p className="mb-3 px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Workspace
        </p>
        {navigation()}
        <div className="mt-auto border-t pt-5">
          <a
            href="https://portfolio-beta-ochre-90.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-3 text-sm font-medium"
          >
            Open portfolio ↗
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-muted-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>
      <header className="flex items-center justify-between gap-4 border-b bg-card/80 px-5 py-6 sm:ml-60 sm:px-8">
        <div className="flex items-center gap-3">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="sm:hidden"
                aria-label="Open navigation"
              >
                <PanelLeft className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pt-12">
              <h2 className="mb-6 text-lg font-semibold">Portfolio studio</h2>
              {navigation(() => setMenuOpen(false))}
              <Button variant="ghost" onClick={handleLogout} className="mt-6">
                Sign out
              </Button>
            </SheetContent>
          </Sheet>
          <div>
            <p className="mb-1 text-xs font-medium text-muted-foreground">
              Your portfolio, up to date.
            </p>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              {items.find(([key]) => key === active)?.[2] || "Overview"}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm font-medium md:block">
            {user?.fullName || "Rajiv Jha"}
          </span>
          <img
            src={user?.avatar?.url || "/me.jpg"}
            alt="Profile"
            className="h-10 w-10 rounded-full border object-cover"
          />
        </div>
      </header>
      <div id="workspace" className="admin-workspace sm:ml-60">
        <div className="mx-5 mt-5 rounded-lg border bg-card px-4 py-3 text-xs text-muted-foreground">
          Content edits are saved as drafts.{" "}
          <button
            type="button"
            className="font-medium text-primary underline"
            onClick={() => switchActive("Publishing")}
          >
            Preview and publish your changes
          </button>
        </div>
        {(() => {
          switch (active) {
            case "Publishing":
              return <ContentStudio onDirtyChange={setContentDirty} />;
            case "Dashboard":
              return <Dashboard onNavigate={switchActive} />;
            case "Add Project":
              return <AddProject />;
            case "Add Skill":
              return <AddSkill />;
            case "Add Uses":
              return <AddSoftwareApplications />;
            case "Add Timeline":
            case "Timeline":
            case "Manage Timeline":
              return <ManageTimeline onBack={() => setActive("Dashboard")} />;
            case "Messages":
              return <Messages />;
            case "Account":
              return <Account />;
            default:
              return <Dashboard onNavigate={switchActive} />;
          }
        })()}
      </div>
    </div>
  );
};

export default HomePage;
