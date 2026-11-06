import { createHash, randomBytes } from "node:crypto";
export const DEFAULT_COPY = {
  heroEyebrow: "Computer science · Full-stack · AI/ML",
  heroLine1: "Thoughtful code.",
  heroLine2: "Useful products.",
  heroNameTemplate: "I’m {name}.",
  heroSupport:
    "From an idea to a working application, I learn by building, testing, and improving.",
  heroPrimaryLabel: "Explore my work",
  heroResumeLabel: "View résumé",
  portraitLabel: "THE PERSON BEHIND THE CODE",
  portraitCaption: "Always a work in progress.",
  portraitSubcaption: "Curiosity → code → iteration",
  heroFooter: "Building at the intersection of software & AI.",
  aboutTitle: "Curious by nature.",
  aboutAccent: "Engineer by practice.",
  aboutP1:
    "I’m studying computer science and building my foundations in software engineering and AI/ML. I enjoy turning a complex problem into smaller, understandable pieces—and then into something people can use.",
  aboutP2:
    "My work brings together full-stack development, data, and algorithms. Every project is a chance to make better decisions, understand a system more deeply, and improve the details that matter.",
  projectsTitle: "Ideas made",
  projectsAccent: "real.",
  projectsIntro:
    "A closer look at the products I’m building, the problems they address, and the technology behind them.",
  skillsTitle: "The tools behind",
  skillsAccent: "the thinking.",
  skillsIntro:
    "A growing foundation across software development, algorithms, and working with data.",
  experienceTitle: "Learning. Building.",
  experienceAccent: "Growing.",
  experienceIntro:
    "Academic progression, competitive programming milestones, and technical development.",
  contactTitle: "Have something",
  contactAccent: "in mind?",
  contactIntro:
    "A project idea, a collaboration, or a conversation about building better software—I’d like to hear it.",
  footerQuote: '"Success is when preparation meets opportunity."',
};
export const SECTION_KEYS = [
  "projects",
  "about",
  "skills",
  "experience",
  "contact",
];
const text = (v, max = 10000) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";
export function safeURL(value) {
  const v = text(value, 2048);
  if (!v) return "";
  try {
    const u = new URL(v);
    if (!["https:", "http:"].includes(u.protocol)) throw Error();
    return u.href;
  } catch {
    throw Object.assign(new Error("Use a valid http or https URL."), {
      status: 400,
    });
  }
}
const image = (v) => ({ url: safeURL(v?.url || "") });
export function cleanSettings(input = {}) {
  const copy = { ...DEFAULT_COPY };
  for (const k of Object.keys(copy))
    if (typeof input.copy?.[k] === "string") copy[k] = text(input.copy[k]);
  return {
    copy,
    visibility: Object.fromEntries(
      SECTION_KEYS.map((k) => [k, input.visibility?.[k] !== false]),
    ),
    projectOrder: Array.isArray(input.projectOrder)
      ? [...new Set(input.projectOrder.map(String))].slice(0, 500)
      : [],
    hiddenProjectIds: Array.isArray(input.hiddenProjectIds)
      ? [...new Set(input.hiddenProjectIds.map(String))].slice(0, 500)
      : [],
  };
}
export function publicProfile(u = {}) {
  return {
    fullName: text(u.fullName, 200),
    email: text(u.publicEmail ?? u.email, 254),
    aboutMe: text(u.aboutMe),
    githubURL: safeURL(u.githubURL || ""),
    linkedinURL: safeURL(u.linkedInURL || u.linkedinURL || ""),
    leetcodeURL: safeURL(u.leetcodeURL || "https://leetcode.com/u/Rajiv_Jha/"),
    avatar: image(u.avatar),
    resume: image(u.resume),
  };
}
export function cleanStory(story = {}) {
  return Object.fromEntries(
    ["problem", "contribution", "decisions", "lessons"]
      .map((k) => [k, text(story[k])])
      .concat([
        [
          "screenshots",
          (Array.isArray(story.screenshots) ? story.screenshots : [])
            .slice(0, 12)
            .map(safeURL)
            .filter(Boolean),
        ],
      ]),
  );
}
const idOf = (r) => String(r.id ?? r._id);
export function buildDraft(data) {
  const settings = cleanSettings(data.contentSettings);
  const projects = (data.projects || []).map((p) => ({
    id: p.id,
    _id: p.id,
    title: text(p.title, 300),
    description: text(p.description),
    stack: text(p.stack, 300),
    technologies: Array.isArray(p.technologies)
      ? p.technologies.join(", ")
      : text(p.technologies),
    deployed: text(p.deployed, 100),
    projectLink: safeURL(p.projectLink || ""),
    gitRepoLink: safeURL(p.gitRepoLink || ""),
    projectBanner: image(p.projectBanner),
    caseStudy: cleanStory(data.projectStories?.[idOf(p)]),
  }));
  const rank = (id) => {
    const i = settings.projectOrder.indexOf(id);
    return i < 0 ? settings.projectOrder.length : i;
  };
  projects.sort((a, b) => rank(idOf(a)) - rank(idOf(b)));
  return {
    schemaVersion: 1,
    user: publicProfile(data.users?.[0]),
    projects,
    settings,
    skills: (data.skills || []).map((s) => ({
      id: s.id,
      _id: s.id,
      title: text(s.title, 200),
      proficiency: Number(s.proficiency) || 0,
      svg: image(s.svg),
    })),
    timelines: (data.timelines || []).map((t) => ({
      id: t.id,
      _id: t.id,
      title: text(t.title, 300),
      description: text(t.description),
      timeline: {
        from: text(t.timeline?.from, 100),
        to: text(t.timeline?.to, 100),
      },
    })),
    softwareApplications: (data.softwareApplications || []).map((a) => ({
      id: a.id,
      _id: a.id,
      name: text(a.name, 200),
      svg: image(a.svg),
    })),
    testimonials: [],
  };
}
export const revisionOf = (content) =>
  createHash("sha256").update(JSON.stringify(content)).digest("hex");
export function assertRevision(data, revision) {
  if (revision !== revisionOf(buildDraft(data)))
    throw Object.assign(
      new Error(
        "The draft changed in another tab. Reload it before saving or publishing.",
      ),
      { status: 409 },
    );
}
export function saveDraft(data, input) {
  assertRevision(data, input.revision);
  const profile = publicProfile(input.user);
  if (!profile.fullName)
    throw Object.assign(new Error("Public name is required."), { status: 400 });
  if (profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email))
    throw Object.assign(new Error("Enter a valid public contact email."), {
      status: 400,
    });
  const u = data.users[0];
  Object.assign(u, {
    fullName: profile.fullName,
    publicEmail: profile.email,
    aboutMe: profile.aboutMe,
    githubURL: profile.githubURL,
    linkedinURL: profile.linkedinURL,
    linkedInURL: profile.linkedinURL,
    leetcodeURL: profile.leetcodeURL,
    avatar: { ...u.avatar, url: profile.avatar.url },
    resume: { ...u.resume, url: profile.resume.url },
  });
  data.contentSettings = cleanSettings(input.settings);
  data.projectStories = {};
  for (const p of input.projects || []) {
    if ((data.projects || []).some((r) => idOf(r) === idOf(p)))
      data.projectStories[idOf(p)] = cleanStory(p.caseStudy);
  }
  data.draftSavedAt = new Date().toISOString();
  return adminState(data);
}
export function adminState(data) {
  const draft = buildDraft(data);
  return {
    draft,
    revision: revisionOf(draft),
    publishedRevision: data.contentPublished?.revision || null,
    publishedAt: data.contentPublished?.publishedAt || null,
    savedAt: data.draftSavedAt || null,
  };
}
export function publicContent(data) {
  const content = structuredClone(
    data.contentPublished?.content || buildDraft(data),
  );
  content.projects = content.projects.filter(
    (p) => !content.settings.hiddenProjectIds.includes(idOf(p)),
  );
  return content;
}
export function createPreview(data, revision, now = Date.now()) {
  assertRevision(data, revision);
  const content = buildDraft(data);
  const token = randomBytes(24).toString("hex");
  data.contentPreviews = Object.fromEntries(
    Object.entries(data.contentPreviews || {})
      .filter(([, p]) => p.expiresAt > now)
      .slice(-9),
  );
  data.contentPreviews[token] = {
    content,
    revision,
    expiresAt: now + 15 * 60 * 1000,
  };
  return { token, expiresAt: now + 15 * 60 * 1000, revision };
}
export function readPreview(data, token, now = Date.now()) {
  const p = data.contentPreviews?.[token];
  if (!p || p.expiresAt <= now)
    throw Object.assign(
      new Error(
        "This preview expired. Create a fresh preview from the dashboard.",
      ),
      { status: 410 },
    );
  return publicContent({ contentPublished: { content: p.content } });
}
export function publishDraft(data, revision, now = Date.now()) {
  assertRevision(data, revision);
  if (
    !Object.values(data.contentPreviews || {}).some(
      (p) => p.revision === revision && p.expiresAt > now,
    )
  )
    throw Object.assign(
      new Error("Preview this saved version before publishing."),
      { status: 409 },
    );
  data.contentPreviousPublished = data.contentPublished || null;
  data.contentPublished = {
    content: buildDraft(data),
    revision,
    publishedAt: new Date(now).toISOString(),
  };
  return adminState(data);
}
