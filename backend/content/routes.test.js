import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { createContentRouter } from "../routes/contentRouter.js";
import { buildDraft, revisionOf } from "./service.js";
test("HTTP draft → preview → publish workflow isolates visitors and rejects unauthenticated writes", async (t) => {
  let store = {
    users: [
      {
        id: 1,
        fullName: "Rajiv",
        email: "admin@example.com",
        password: "PRIVATE_PASSWORD",
        avatar: { url: "https://example.com/avatar.jpg" },
      },
    ],
    projects: [
      {
        id: 1,
        title: "Project",
        projectBanner: { url: "https://example.com/project.jpg" },
      },
    ],
    skills: [],
    timelines: [],
    softwareApplications: [],
    messages: [{ message: "PRIVATE_INQUIRY" }],
  };
  const initial = buildDraft(store);
  store.contentPublished = {
    content: initial,
    revision: revisionOf(initial),
    publishedAt: "initial",
  };
  const app = express();
  app.use(express.json());
  app.use(
    "/content",
    createContentRouter({
      read: async () => ({ data: structuredClone(store) }),
      mutate: async (fn) => {
        const next = structuredClone(store);
        const result = fn(next);
        store = next;
        return result;
      },
      auth: (req, res, next) =>
        req.headers.authorization === "Bearer test-admin"
          ? next()
          : res.status(401).json({ message: "Unauthorized" }),
    }),
  );
  const server = app.listen(0, "127.0.0.1");
  await new Promise((r) => server.once("listening", r));
  t.after(() => {
    server.closeAllConnections();
    server.close();
  });
  const base = `http://127.0.0.1:${server.address().port}/content`;
  const request = async (path = "", method = "GET", body, auth = true) => {
    const response = await fetch(base + path, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(auth ? { Authorization: "Bearer test-admin" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    return { status: response.status, body: await response.json() };
  };
  assert.equal((await request("/admin", "GET", null, false)).status, 401);
  assert.equal((await request("/admin", "PUT", {}, false)).status, 401);
  assert.equal((await request("/publish", "POST", {}, false)).status, 401);
  let { body: state } = await request("/admin");
  state.draft.settings.copy.heroSupport = "Only visible in draft";
  const saved = await request("/admin", "PUT", {
    ...state.draft,
    revision: state.revision,
  });
  assert.equal(saved.status, 200);
  let live = await request("", "GET", null, false);
  assert.notEqual(
    live.body.content.settings.copy.heroSupport,
    "Only visible in draft",
  );
  assert(!JSON.stringify(live).includes("PRIVATE"));
  assert.equal(
    (await request("/publish", "POST", { revision: saved.body.revision }))
      .status,
    409,
  );
  const preview = await request("/preview", "POST", {
    revision: saved.body.revision,
  });
  assert.equal(preview.status, 200);
  const previewRead = await request(
    `/preview/${preview.body.token}`,
    "GET",
    null,
    false,
  );
  assert.equal(
    previewRead.body.content.settings.copy.heroSupport,
    "Only visible in draft",
  );
  assert.equal(
    (
      await request("/admin", "PUT", {
        ...state.draft,
        revision: state.revision,
      })
    ).status,
    409,
  );
  assert.equal(
    (await request("/publish", "POST", { revision: saved.body.revision }))
      .status,
    200,
  );
  live = await request("", "GET", null, false);
  assert.equal(
    live.body.content.settings.copy.heroSupport,
    "Only visible in draft",
  );
  assert.equal(
    (await request("/preview/not-a-valid-token", "GET", null, false)).status,
    410,
  );
});
