import test from "node:test";
import assert from "node:assert/strict";
import {
  buildDraft,
  revisionOf,
  adminState,
  publicContent,
  saveDraft,
  createPreview,
  readPreview,
  publishDraft,
  safeURL,
} from "./service.js";
const fixture = () => ({
  users: [
    {
      id: 1,
      fullName: "Rajiv",
      email: "admin@example.com",
      password: "DO_NOT_LEAK",
      resetPasswordToken: "PRIVATE",
      avatar: { url: "https://example.com/avatar.png" },
    },
  ],
  skills: [{ id: 1, title: "Java", proficiency: 75 }],
  projects: [
    {
      id: 1,
      title: "One",
      description: "Original",
      projectBanner: { url: "https://example.com/one.png" },
    },
    { id: 2, title: "Two" },
  ],
  timelines: [],
  softwareApplications: [],
  messages: [{ message: "PRIVATE_INQUIRY" }],
});
function initialized() {
  const data = fixture(),
    content = buildDraft(data);
  data.contentPublished = {
    content,
    revision: revisionOf(content),
    publishedAt: "initial",
  };
  return data;
}
test("public projection excludes authentication, reset tokens, and inquiries", () => {
  const data = fixture();
  const text = JSON.stringify(buildDraft(data));
  assert(!text.includes("DO_NOT_LEAK"));
  assert(!text.includes("PRIVATE"));
  assert(!text.includes("password"));
});
test("saved draft remains isolated until the previewed revision is published", () => {
  const data = initialized(),
    state = adminState(data),
    input = structuredClone(state.draft);
  input.user.fullName = "Updated";
  saveDraft(data, { ...input, revision: state.revision });
  assert.equal(publicContent(data).user.fullName, "Rajiv");
  const revision = adminState(data).revision;
  assert.throws(() => publishDraft(data, revision), { status: 409 });
  createPreview(data, revision, 1000);
  publishDraft(data, revision, 1100);
  assert.equal(publicContent(data).user.fullName, "Updated");
  assert.equal(data.contentPreviousPublished.content.user.fullName, "Rajiv");
});
test("legacy edits invalidate stale save and publish revisions", () => {
  const data = initialized(),
    state = adminState(data);
  createPreview(data, state.revision);
  data.projects[0].description = "Changed in another editor";
  assert.throws(
    () => saveDraft(data, { ...state.draft, revision: state.revision }),
    { status: 409 },
  );
  assert.throws(() => publishDraft(data, state.revision), { status: 409 });
});
test("public email edits do not change the admin login email or password", () => {
  const data = initialized(),
    state = adminState(data);
  state.draft.user.email = "public@example.com";
  saveDraft(data, { ...state.draft, revision: state.revision });
  assert.equal(data.users[0].email, "admin@example.com");
  assert.equal(data.users[0].password, "DO_NOT_LEAK");
  assert.equal(buildDraft(data).user.email, "public@example.com");
});
test("preview expires and contains an immutable revision", () => {
  const data = initialized(),
    state = adminState(data),
    preview = createPreview(data, state.revision, 1000);
  data.projects[0].title = "Later";
  assert.equal(readPreview(data, preview.token, 1100).projects[0].title, "One");
  assert.throws(() => readPreview(data, preview.token, preview.expiresAt), {
    status: 410,
  });
});
test("ordering, hidden projects, and section visibility survive publication", () => {
  const data = initialized(),
    state = adminState(data);
  state.draft.settings.projectOrder = ["2", "1"];
  state.draft.settings.hiddenProjectIds = ["1"];
  state.draft.settings.visibility.skills = false;
  saveDraft(data, { ...state.draft, revision: state.revision });
  const revision = adminState(data).revision;
  createPreview(data, revision);
  publishDraft(data, revision);
  assert.deepEqual(
    publicContent(data).projects.map((p) => p.id),
    [2],
  );
  assert.equal(publicContent(data).settings.visibility.skills, false);
});
test("reject executable URLs; normalize case-study data", () => {
  assert.throws(() => safeURL("javascript:alert(1)"), { status: 400 });
  const data = initialized(),
    state = adminState(data);
  state.draft.projects[0].caseStudy = {
    problem: "Real problem",
    screenshots: ["https://example.com/screen.png"],
  };
  saveDraft(data, { ...state.draft, revision: state.revision });
  assert.equal(buildDraft(data).projects[0].caseStudy.problem, "Real problem");
});
test("replaced uploads are retained while published versions can reference them", async () => {
  const { deleteReplacedAsset } =
    await import("../utils/deleteReplacedAsset.js");
  const before = process.env.STORAGE_DRIVER;
  process.env.STORAGE_DRIVER = "blob";
  try {
    assert.equal(
      (await deleteReplacedAsset("published-image")).result,
      "retained_for_published_versions",
    );
  } finally {
    if (before === undefined) delete process.env.STORAGE_DRIVER;
    else process.env.STORAGE_DRIVER = before;
  }
});
test("clearing a social URL removes it instead of restoring a hardcoded default", () => {
  const data = initialized(),
    state = adminState(data);
  state.draft.user.leetcodeURL = "";
  state.draft.user.githubURL = "";
  state.draft.user.linkedinURL = "";
  saveDraft(data, { ...state.draft, revision: state.revision });
  const profile = buildDraft(data).user;
  assert.equal(profile.leetcodeURL, "");
  assert.equal(profile.githubURL, "");
  assert.equal(profile.linkedinURL, "");
});
