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

const HomePage = () => {
  const [active, setActive] = useState("");
  const { isAuthenticated, error, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged Out!");
  };
  const navigateTo = useNavigate();
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUserErrors());
    }
    if (!isAuthenticated) {
      navigateTo("/login");
    }
  }, [isAuthenticated]);
  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 hidden w-14 flex-col border-r border-border bg-card sm:flex z-50 shadow-xs">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            to="/"
            onClick={() => setActive("Dashboard")}
            className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-base font-serif font-bold text-primary-foreground shadow-sm hover:scale-105 transition-all"
          >
            R
          </Link>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    active === "Dashboard"
                      ? "text-accent-foreground bg-accent"
                      : "text-muted-foreground"
                  }  transition-colors hover:text-foreground md:h-8 md:w-8`}
                  onClick={() => setActive("Dashboard")}
                >
                  <Home className="h-5 w-5" />
                  <span className="sr-only">Dashboard</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Dashboard</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    active === "Add Project"
                      ? "text-accent-foreground bg-accent"
                      : "text-muted-foreground"
                  }  transition-colors hover:text-foreground md:h-8 md:w-8`}
                  onClick={() => setActive("Add Project")}
                >
                  <FolderGit className="h-5 w-5" />
                  <span className="sr-only">Add Project</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Add Project</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    active === "Add Skill"
                      ? "text-accent-foreground bg-accent"
                      : "text-muted-foreground"
                  }  transition-colors hover:text-foreground md:h-8 md:w-8`}
                  onClick={() => setActive("Add Skill")}
                >
                  <PencilRuler className="h-5 w-5" />
                  <span className="sr-only">Add Skill</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Add Skill</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    active === "Add Uses"
                      ? "text-accent-foreground bg-accent"
                      : "text-muted-foreground"
                  }  transition-colors hover:text-foreground md:h-8 md:w-8`}
                  onClick={() => setActive("Add Uses")}
                >
                  <LayoutGrid className="h-5 w-5" />
                  <span className="sr-only">Add Uses</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Add Uses</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    active === "Add Timeline"
                      ? "text-accent-foreground bg-accent"
                      : "text-muted-foreground"
                  }  transition-colors hover:text-foreground md:h-8 md:w-8`}
                  onClick={() => setActive("Add Timeline")}
                >
                  <History className="h-5 w-5" />
                  <span className="sr-only">Add Timeline</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Add Timeline</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    active === "Messages"
                      ? "text-accent-foreground bg-accent"
                      : "text-muted-foreground"
                  }  transition-colors hover:text-foreground md:h-8 md:w-8`}
                  onClick={() => setActive("Messages")}
                >
                  <MessageSquareMore className="h-5 w-5" />
                  <span className="sr-only">Messages</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Messages</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    active === "Account"
                      ? "text-accent-foreground bg-accent"
                      : "text-muted-foreground"
                  }  transition-colors hover:text-foreground md:h-8 md:w-8`}
                  onClick={() => setActive("Account")}
                >
                  <User className="h-5 w-5" />
                  <span className="sr-only">Account</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Account</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">Logout</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Logout</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 max-[900px]:h-[100px]">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                to="/"
                onClick={() => setActive("Dashboard")}
                className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-serif font-bold text-primary-foreground shadow-sm"
              >
                R
              </Link>
              <Link
                href="#"
                className={`flex items-center gap-4 px-2.5 ${
                  active === "Dashboard"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground "
                }`}
                onClick={() => setActive("Dashboard")}
              >
                <Home className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                className={`flex items-center gap-4 px-2.5 ${
                  active === "Add Project"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground "
                }`}
                onClick={() => setActive("Add Project")}
              >
                <FolderGit className="h-5 w-5" />
                Add Project
              </Link>
              <Link
                className={`flex items-center gap-4 px-2.5 ${
                  active === "Add Skill"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground "
                }`}
                onClick={() => setActive("Add Skill")}
              >
                <PencilRuler className="h-5 w-5" />
                Add Skill
              </Link>
              <Link
                className={`flex items-center gap-4 px-2.5 ${
                  active === "Add Uses"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground "
                }`}
                onClick={() => setActive("Add Uses")}
              >
                <LayoutGrid className="h-5 w-5" />
                Add Uses
              </Link>
              <Link
                className={`flex items-center gap-4 px-2.5 ${
                  active === "Profile"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground "
                }`}
                onClick={() => setActive("Account")}
              >
                <User className="h-5 w-5" />
                Account
              </Link>
              <Link
                className={`flex items-center gap-4 px-2.5 ${
                  active === "Timeline"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground "
                }`}
                onClick={() => setActive("Timeline")}
              >
                <History className="h-5 w-5" />
                Timeline
              </Link>
              <Link
                className={`flex items-center gap-4 px-2.5 ${
                  active === "Messages"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground "
                }`}
                onClick={() => setActive("Messages")}
              >
                <MessageSquareMore className="h-5 w-5" />
                Messages
              </Link>
              <Link
                className={
                  "flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                }
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-4 md:grow-0 sm:ml-16 sm:mt-5">
          {user?.avatar?.url ? (
            <img
              src={user.avatar.url}
              alt="avatar"
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl border border-border object-cover object-top shadow-sm bg-card max-[900px]:hidden"
            />
          ) : (
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl border border-border bg-card flex items-center justify-center font-serif font-bold text-2xl text-primary shadow-sm max-[900px]:hidden">
              {user?.fullName?.charAt(0) || "R"}
            </div>
          )}
          <div>
            <span className="text-[11px] uppercase tracking-wider text-primary font-semibold block">
              Admin Control Center
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-foreground tracking-tight">
              Welcome back, {user?.fullName || "Rajiv"}
            </h1>
          </div>
        </div>
      </header>
      {(() => {
        switch (active) {
          case "Dashboard":
            return <Dashboard />;
            break;
          case "Add Project":
            return <AddProject />;
            break;
          case "Add Skill":
            return <AddSkill />;
            break;
          case "Add Uses":
            return <AddSoftwareApplications />;
            break;
          case "Add Timeline":
            return <AddTimeline />;
            break;
          case "Messages":
            return <Messages />;
            break;
          case "Account":
            return <Account />;
            break;
          default:
            return <Dashboard />;
            break;
        }
      })()}
    </div>
  );
};

export default HomePage;
