import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Trash2, Pencil, Plus, X, ArrowLeft } from "lucide-react";
import {
  clearAllTimelineErrors,
  deleteTimeline,
  getAllTimeline,
  resetTimelineSlice,
  addNewTimeline,
  updateTimeline,
} from "@/store/slices/timelineSlice";

const ManageTimeline = ({ onBack } = {}) => {
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const handleReturnToDashboard = () => {
    if (onBack) {
      onBack();
    } else {
      navigateTo("/");
    }
  };

  const { loading, timeline, error, message } = useSelector(
    (state) => state.timeline
  );

  // Modal / Form state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const handleDeleteTimeline = (id) => {
    if (window.confirm("Are you sure you want to delete this timeline event?")) {
      dispatch(deleteTimeline(id));
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setTitle("");
    setDescription("");
    setFrom("");
    setTo("");
    setIsAddOpen(true);
  };

  const handleOpenEdit = (element) => {
    setEditingItem(element);
    setTitle(element.title || "");
    setDescription(element.description || "");
    setFrom(element.timeline?.from || "");
    setTo(element.timeline?.to || "");
    setIsAddOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !from.trim()) {
      toast.error("Please fill in Title, Description, and Starting Year (From).");
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      from: from.trim(),
      to: to.trim() || "Present",
    };

    if (editingItem) {
      dispatch(updateTimeline(editingItem._id, payload));
    } else {
      dispatch(addNewTimeline(payload));
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllTimelineErrors());
    }
    if (message) {
      toast.success(message);
      setIsAddOpen(false);
      setEditingItem(null);
      dispatch(resetTimelineSlice());
      dispatch(getAllTimeline());
    }
  }, [dispatch, error, message]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 p-4 sm:p-8">
      <Tabs defaultValue="all" className="w-full max-w-6xl mx-auto">
        <TabsContent value="all">
          <Card className="border-border shadow-xs bg-card">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-primary font-semibold block mb-1">
                  Career Milestones & Journey
                </span>
                <CardTitle className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                  Manage Timeline
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground mt-0.5">
                  Add, update, or remove qualifications and career milestones
                </CardDescription>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={handleOpenAdd}
                  className="rounded-full shadow-sm flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  Add Timeline
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full shadow-xs flex items-center gap-1.5"
                  onClick={handleReturnToDashboard}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Dashboard
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="rounded-xl border border-border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[200px]">Title</TableHead>
                      <TableHead className="md:table-cell">Description</TableHead>
                      <TableHead className="w-[100px]">From</TableHead>
                      <TableHead className="w-[100px]">To</TableHead>
                      <TableHead className="text-right w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {timeline && timeline.length > 0 ? (
                      timeline.map((element) => {
                        return (
                          <TableRow className="hover:bg-muted/30 transition-colors" key={element._id}>
                            <TableCell className="font-semibold text-foreground">
                              {element.title}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm max-w-md line-clamp-2">
                              {element.description}
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {element.timeline?.from || "—"}
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {element.timeline?.to || "Present"}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  title="Edit Timeline"
                                  className="h-8 w-8 rounded-full border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all cursor-pointer"
                                  onClick={() => handleOpenEdit(element)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  title="Delete Timeline"
                                  className="h-8 w-8 rounded-full border border-red-500/40 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                                  onClick={() => handleDeleteTimeline(element._id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                          <p className="text-base font-medium">No timeline events found.</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Click "Add Timeline" above to record your first milestone.
                          </p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal Dialog for Add / Edit Timeline */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-lg rounded-2xl border border-border shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-primary font-semibold block mb-0.5">
                  {editingItem ? "Update Event" : "Create Event"}
                </span>
                <h3 className="font-serif font-bold text-xl text-foreground">
                  {editingItem ? "Edit Timeline Milestone" : "Add New Timeline Milestone"}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="h-8 w-8 rounded-full hover:bg-muted text-muted-foreground flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
                  Milestone Title *
                </label>
                <Input
                  required
                  placeholder="e.g. B.Tech Computer Science"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
                  Description *
                </label>
                <Textarea
                  required
                  rows={3}
                  placeholder="Describe your role, achievements, or academic focus..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
                    From (Year / Date) *
                  </label>
                  <Input
                    required
                    placeholder="e.g. 2022"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
                    To (Year / Date)
                  </label>
                  <Input
                    placeholder="e.g. 2026 or Present"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  className="rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="rounded-full px-6"
                >
                  {loading
                    ? editingItem
                      ? "Updating..."
                      : "Adding..."
                    : editingItem
                    ? "Save Changes"
                    : "Add Milestone"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTimeline;
