import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  clearAllProjectErrors,
  deleteProject,
  getAllProjects,
  resetProjectSlice,
} from "@/store/slices/projectSlice";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { Eye, Pen, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ManageProjects = () => {
  const navigateTo = useNavigate();
  const [query, setQuery] = useState("");
  const handleReturnToDashboard = () => {
    navigateTo("/");
  };
  const { projects, loading, error, message } = useSelector(
    (state) => state.project
  );

  const dispatch = useDispatch();
  const handleProjectDelete = (id) => {
    if (window.confirm("Delete this project from your portfolio? This cannot be undone.")) dispatch(deleteProject(id));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllProjectErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetProjectSlice());
      dispatch(getAllProjects());
    }
  }, [dispatch, error, loading, message]);

  const filtered = (projects || []).filter(project => `${project.title} ${project.technologies}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 py-8 sm:px-8">
      <Button variant="ghost" onClick={handleReturnToDashboard} className="mb-6">← Back to overview</Button>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div><p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Portfolio content</p><h1 className="text-3xl font-semibold tracking-tight">Projects</h1><p className="mt-2 text-sm text-muted-foreground">Review your work, update details, and keep every project current.</p></div>
        <div><label htmlFor="project-search" className="sr-only">Search projects</label><input id="project-search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search projects…" className="w-full rounded-xl border bg-card px-4 py-3 sm:w-64" /></div>
      </div>
      <p className="mb-4 text-xs text-muted-foreground" aria-live="polite">{filtered.length} {filtered.length === 1 ? "project" : "projects"}</p>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map(project => <article key={project._id} className="flex overflow-hidden rounded-2xl border bg-card shadow-sm flex-col">
          <img src={project.projectBanner?.url} alt={`${project.title} preview`} className="aspect-video w-full border-b bg-muted object-cover object-top" loading="lazy" />
          <div className="flex flex-1 flex-col p-6">
            <p className="mb-3 text-xs font-medium text-primary">{project.stack}</p>
            <h2 className="text-xl font-semibold tracking-tight">{project.title}</h2>
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{project.description}</p>
            <div className="my-5 flex flex-wrap gap-2">{String(project.technologies || "").split(",").slice(0,5).map(tech => <span key={tech} className="rounded-md bg-muted px-2 py-1 text-[11px] font-medium">{tech.trim()}</span>)}</div>
            <div className="mt-auto flex items-center justify-between border-t pt-4">
              <div className="flex gap-2"><Button asChild size="sm"><Link to={`/update/project/${project._id}`}>Edit project</Link></Button><Button asChild size="sm" variant="outline"><Link to={`/view/project/${project._id}`}>Details</Link></Button></div>
              <Button variant="ghost" size="icon" disabled={loading} aria-label={`Delete ${project.title}`} onClick={() => handleProjectDelete(project._id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        </article>)}
      </div>
      {!filtered.length && <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">{loading ? "Loading projects…" : query ? "No projects match your search." : "Your projects will appear here after you add them."}</div>}
    </main>
  );
};
export default ManageProjects;
