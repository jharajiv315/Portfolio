import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
const endpoint = `${API_URL}/api/v1/content`;
const PROFILE = [
  ["fullName", "Public name"],
  ["email", "Public contact email"],
  ["aboutMe", "Professional title / short bio"],
  ["githubURL", "GitHub URL"],
  ["linkedinURL", "LinkedIn URL"],
  ["leetcodeURL", "LeetCode URL"],
];
const COPY_GROUPS = {
  Hero: [
    "heroEyebrow",
    "heroLine1",
    "heroLine2",
    "heroNameTemplate",
    "heroSupport",
    "heroPrimaryLabel",
    "heroResumeLabel",
    "portraitLabel",
    "portraitCaption",
    "portraitSubcaption",
    "heroFooter",
  ],
  About: ["aboutTitle", "aboutAccent", "aboutP1", "aboutP2"],
  Projects: ["projectsTitle", "projectsAccent", "projectsIntro"],
  Toolkit: ["skillsTitle", "skillsAccent", "skillsIntro"],
  Journey: ["experienceTitle", "experienceAccent", "experienceIntro"],
  Contact: ["contactTitle", "contactAccent", "contactIntro"],
  Footer: ["footerQuote"],
};
const labelOf = (key) =>
  key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
function Field({
  label,
  value,
  onChange,
  multiline = false,
  type = "text",
  hint,
}) {
  const Tag = multiline ? "textarea" : "input";
  return (
    <label className="block text-sm font-medium">
      {label}
      <Tag
        className="mt-2 w-full rounded-lg border bg-background px-3 py-2 text-sm font-normal"
        type={multiline ? undefined : type}
        rows={multiline ? 4 : undefined}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && (
        <span className="mt-1 block text-xs font-normal text-muted-foreground">
          {hint}
        </span>
      )}
    </label>
  );
}
export default function ContentStudio({ onDirtyChange = () => {} }) {
  const [state, setState] = useState(null),
    [draft, setDraft] = useState(null),
    [tab, setTab] = useState("Profile"),
    [busy, setBusy] = useState(""),
    [error, setError] = useState(""),
    [previewed, setPreviewed] = useState(null),
    [previewURL, setPreviewURL] = useState(""),
    [reviewed, setReviewed] = useState(false);
  const dirty = Boolean(
    state && draft && JSON.stringify(draft) !== JSON.stringify(state.draft),
  );
  const dirtyCallback = useRef(onDirtyChange);
  dirtyCallback.current = onDirtyChange;
  useEffect(() => {
    dirtyCallback.current(dirty);
    const guard = (e) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", guard);
    return () => window.removeEventListener("beforeunload", guard);
  }, [dirty]);
  useEffect(() => () => dirtyCallback.current(false), []);
  const install = (response) => {
    setState(response);
    setDraft(structuredClone(response.draft));
    setPreviewed(null);
    setReviewed(false);
  };
  const load = async () => {
    if (dirty && !window.confirm("Discard unsaved changes and reload?")) return;
    setBusy("load");
    setError("");
    try {
      install((await axios.get(`${endpoint}/admin`)).data);
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Could not load the content editor. Try again.",
      );
    } finally {
      setBusy("");
    }
  };
  useEffect(() => {
    load();
  }, []);
  const save = async () => {
    const response = (
      await axios.put(`${endpoint}/admin`, {
        ...draft,
        revision: state.revision,
      })
    ).data;
    install(response);
    return response;
  };
  const action = async (kind) => {
    let popup = null;
    if (kind === "preview") {
      popup = window.open("about:blank", "_blank");
      if (popup) popup.opener = null;
    }
    setBusy(kind);
    setError("");
    try {
      if (kind === "save") {
        await save();
        toast.success("Draft saved. Your public portfolio has not changed.");
      }
      if (kind === "preview") {
        const saved = dirty ? await save() : state;
        const response = (
          await axios.post(`${endpoint}/preview`, { revision: saved.revision })
        ).data;
        const url = `https://portfolio-beta-ochre-90.vercel.app/#preview=${response.token}`;
        setPreviewURL(url);
        setPreviewed(saved.revision);
        setReviewed(false);
        if (popup) popup.location.href = url;
      }
      if (kind === "publish") {
        const response = (
          await axios.post(`${endpoint}/publish`, { revision: state.revision })
        ).data;
        install(response);
        toast.success("Published. Visitors will now receive this version.");
      }
    } catch (e) {
      popup?.close();
      setError(
        e.response?.data?.message ||
          "The operation failed. Your unsaved edits are still here.",
      );
    } finally {
      setBusy("");
    }
  };
  const update = (fn) => {
    setDraft((current) => {
      const next = structuredClone(current);
      fn(next);
      return next;
    });
    setReviewed(false);
  };
  const move = (id, offset) =>
    update((d) => {
      const order = d.projects.map((p) => String(p.id));
      const index = order.indexOf(String(id)),
        target = index + offset;
      if (target < 0 || target >= order.length) return;
      [d.projects[index], d.projects[target]] = [
        d.projects[target],
        d.projects[index],
      ];
      d.settings.projectOrder = d.projects.map((p) => String(p.id));
    });
  if (!draft)
    return (
      <div className="p-8">
        <h2 className="text-xl font-semibold">Content & publishing</h2>
        <p className="my-4" role="status">
          {error || "Loading saved draft…"}
        </p>
        {error && <Button onClick={load}>Try again</Button>}
      </div>
    );
  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-8">
      <div className="sticky top-0 z-20 mb-6 rounded-xl border bg-card/95 p-5 shadow-sm backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Content & publishing</h2>
            <p className="mt-1 text-xs text-muted-foreground" role="status">
              {dirty
                ? "Unsaved changes"
                : state.revision === state.publishedRevision
                  ? "Saved version is published"
                  : "Saved draft · Not published"}
              {state.publishedAt &&
                ` · Last published ${new Date(state.publishedAt).toLocaleString()}`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" disabled={Boolean(busy)} onClick={load}>
              Reload draft
            </Button>
            <Button
              variant="outline"
              disabled={Boolean(busy) || !dirty}
              onClick={() => action("save")}
            >
              {busy === "save" ? "Saving…" : "Save draft"}
            </Button>
            <Button
              variant="outline"
              disabled={Boolean(busy)}
              onClick={() => action("preview")}
            >
              {busy === "preview" ? "Preparing…" : "Preview draft"}
            </Button>
            <Button
              disabled={
                Boolean(busy) ||
                dirty ||
                previewed !== state.revision ||
                !reviewed ||
                state.revision === state.publishedRevision
              }
              onClick={() => action("publish")}
            >
              {busy === "publish" ? "Publishing…" : "Publish"}
            </Button>
          </div>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Changes made in all dashboard content editors remain in the draft
          until you publish here. Preview saves your current edits and opens a
          private, temporary preview.
        </p>
        {previewURL && (
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
            <a
              href={previewURL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              Open preview (15 minutes)
            </a>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={reviewed}
                onChange={(e) => setReviewed(e.target.checked)}
                disabled={dirty || previewed !== state.revision}
              />
              I reviewed this saved version and want to publish it.
            </label>
          </div>
        )}
        {error && (
          <p className="mt-4 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
      <nav aria-label="Content settings" className="mb-6 flex flex-wrap gap-2">
        {["Profile", "Page text", "Visibility & order", "Project stories"].map(
          (name) => (
            <Button
              key={name}
              variant={tab === name ? "default" : "outline"}
              onClick={() => setTab(name)}
            >
              {name}
            </Button>
          ),
        )}
      </nav>
      {tab === "Profile" && (
        <section className="grid gap-6 rounded-xl border bg-card p-6 md:grid-cols-2">
          {PROFILE.map(([key, label]) => (
            <Field
              key={key}
              label={label}
              value={draft.user[key]}
              multiline={key === "aboutMe"}
              onChange={(v) =>
                update((d) => {
                  d.user[key] = v;
                })
              }
              hint={
                key === "email"
                  ? "Public contact address. This does not change your admin sign-in email."
                  : undefined
              }
            />
          ))}
          <Field
            label="Avatar URL"
            value={draft.user.avatar?.url}
            type="url"
            onChange={(v) =>
              update((d) => {
                d.user.avatar = { url: v };
              })
            }
            hint="Upload files through Account → Edit profile, or paste an existing image URL."
          />
          <Field
            label="Résumé URL"
            value={draft.user.resume?.url}
            type="url"
            onChange={(v) =>
              update((d) => {
                d.user.resume = { url: v };
              })
            }
          />
        </section>
      )}
      {tab === "Page text" && (
        <div className="space-y-5">
          {Object.entries(COPY_GROUPS).map(([group, keys]) => (
            <details
              key={group}
              className="rounded-xl border bg-card p-6"
              open={group === "Hero"}
            >
              <summary className="cursor-pointer font-semibold">
                {group}
              </summary>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {keys.map((key) => (
                  <Field
                    key={key}
                    label={labelOf(key)}
                    value={draft.settings.copy[key]}
                    multiline={/Intro|Support|P1|P2/.test(key)}
                    onChange={(v) =>
                      update((d) => {
                        d.settings.copy[key] = v;
                      })
                    }
                    hint={
                      key === "heroNameTemplate"
                        ? "Use {name} to insert your public name."
                        : undefined
                    }
                  />
                ))}
              </div>
            </details>
          ))}
        </div>
      )}
      {tab === "Visibility & order" && (
        <div className="space-y-6">
          <section className="rounded-xl border bg-card p-6">
            <h3 className="mb-4 font-semibold">Visible sections</h3>
            <div className="flex flex-wrap gap-6">
              {Object.entries(draft.settings.visibility).map(([key, value]) => (
                <label
                  key={key}
                  className="flex items-center gap-2 text-sm capitalize"
                >
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) =>
                      update((d) => {
                        d.settings.visibility[key] = e.target.checked;
                      })
                    }
                  />
                  {key}
                </label>
              ))}
            </div>
          </section>
          <section className="rounded-xl border bg-card p-6">
            <h3 className="mb-4 font-semibold">Project order & visibility</h3>
            {draft.projects.map((p, i) => (
              <div
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-3 border-t py-4"
              >
                <span className="font-medium">{p.title}</span>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={
                        !draft.settings.hiddenProjectIds.includes(String(p.id))
                      }
                      onChange={(e) =>
                        update((d) => {
                          d.settings.hiddenProjectIds = e.target.checked
                            ? d.settings.hiddenProjectIds.filter(
                                (id) => id !== String(p.id),
                              )
                            : [...d.settings.hiddenProjectIds, String(p.id)];
                        })
                      }
                    />
                    Published visibility
                  </label>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={i === 0}
                    aria-label={`Move ${p.title} up`}
                    onClick={() => move(p.id, -1)}
                  >
                    ↑
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={i === draft.projects.length - 1}
                    aria-label={`Move ${p.title} down`}
                    onClick={() => move(p.id, 1)}
                  >
                    ↓
                  </Button>
                </div>
              </div>
            ))}
          </section>
        </div>
      )}
      {tab === "Project stories" && (
        <div className="space-y-6">
          {draft.projects.map((p) => (
            <section key={p.id} className="rounded-xl border bg-card p-6">
              <h3 className="mb-2 text-lg font-semibold">{p.title}</h3>
              <p className="mb-5 text-xs text-muted-foreground">
                Edit the title, summary, technologies, thumbnail, and links in
                Manage projects. Add case-study content here. Keep claims tied
                to work you can demonstrate.
              </p>
              <div className="grid gap-5 md:grid-cols-2">
                {[
                  ["problem", "The problem"],
                  ["contribution", "Your contribution / project scope"],
                  ["decisions", "Engineering decisions"],
                  ["lessons", "Lessons & takeaways"],
                ].map(([key, label]) => (
                  <Field
                    key={key}
                    label={label}
                    value={p.caseStudy?.[key]}
                    multiline
                    onChange={(v) =>
                      update((d) => {
                        const project = d.projects.find((x) => x.id === p.id);
                        project.caseStudy = { ...project.caseStudy, [key]: v };
                      })
                    }
                  />
                ))}
                <Field
                  label="Additional screenshots (one public URL per line)"
                  value={(p.caseStudy?.screenshots || []).join("\n")}
                  multiline
                  onChange={(v) =>
                    update((d) => {
                      const project = d.projects.find((x) => x.id === p.id);
                      project.caseStudy = {
                        ...project.caseStudy,
                        screenshots: v.split("\n"),
                      };
                    })
                  }
                />
              </div>
              {p.caseStudy?.screenshots?.filter(Boolean).map((url) => (
                <img
                  key={url}
                  src={url}
                  alt={`${p.title} additional screenshot`}
                  className="mt-4 max-h-40 rounded-lg border object-contain"
                />
              ))}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
