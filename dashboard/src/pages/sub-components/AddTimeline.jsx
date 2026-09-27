import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import SpecialLoadingButton from "./SpecialLoadingButton";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  addNewTimeline,
  clearAllTimelineErrors,
  getAllTimeline,
  resetTimelineSlice,
} from "@/store/slices/timelineSlice";

const AddTimeline = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const { loading, error, message } = useSelector((state) => state.timeline);
  const dispatch = useDispatch();

  const handleAddNewTimeline = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !from.trim()) {
      toast.error("Please fill in Title, Description, and Starting Year (From).");
      return;
    }
    dispatch(
      addNewTimeline({
        title: title.trim(),
        description: description.trim(),
        from: from.trim(),
        to: to.trim() || "Present",
      })
    );
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllTimelineErrors());
    }
    if (message) {
      toast.success(message);
      setTitle("");
      setDescription("");
      setFrom("");
      setTo("");
      dispatch(resetTimelineSlice());
      dispatch(getAllTimeline());
    }
  }, [dispatch, error, message]);

  return (
    <>
      <div className="flex justify-center items-center min-h-[85vh] sm:gap-4 sm:py-4 sm:pl-14">
        <form
          className="w-[100%] px-5 md:w-[650px] bg-card p-6 sm:p-8 rounded-2xl border border-border shadow-xs"
          onSubmit={handleAddNewTimeline}
        >
          <div className="space-y-8">
            <div className="border-b border-border pb-6">
              <div className="text-center">
                <span className="text-[11px] uppercase tracking-wider text-primary font-semibold block mb-1">
                  Career Milestones & Journey
                </span>
                <h2 className="font-serif font-bold text-2xl sm:text-3xl text-foreground tracking-tight">
                  Add Timeline Event
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Record an academic qualification, professional experience, or achievement
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-5">
                <div className="w-full">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
                    Milestone Title *
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. B.Tech Computer Science"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="w-full">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
                    Description *
                  </label>
                  <Textarea
                    required
                    placeholder="Key responsibilities, courses, or achievements..."
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
                      Starting Year (From) *
                    </label>
                    <Input
                      type="text"
                      required
                      placeholder="e.g. 2022"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
                      Ending Year (To)
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. 2026 or Present"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-4">
            {!loading ? (
              <Button type="submit" className="w-full sm:w-auto px-8 rounded-full">
                Add Milestone
              </Button>
            ) : (
              <SpecialLoadingButton content={"Adding New Timeline"} />
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default AddTimeline;
