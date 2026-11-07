import { exportBackup, restoreBackup } from "../content/backup.js";
import express from "express";
import jwt from "jsonwebtoken";
import { readStore, mutateStore } from "../storage/blobStore.js";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  adminState,
  publicContent,
  saveDraft,
  createPreview,
  readPreview,
  publishDraft,
} from "../content/service.js";
export function createContentRouter({
  read = readStore,
  mutate = mutateStore,
  auth = isAuthenticated,
} = {}) {
  const router = express.Router();
  const handle = (fn) => async (req, res, next) => {
    try {
      res.set("Cache-Control", "no-store");
      await fn(req, res);
    } catch (e) {
      res.status(e.status || 500).json({
        success: false,
        message: e.status
          ? e.message
          : "Content could not be loaded or saved. Please try again.",
      });
    }
  };
  router.get(
    "/",
    handle(async (req, res) =>
      res.json({ content: publicContent((await read()).data) }),
    ),
  );
  router.get(
    "/preview/:token",
    handle(async (req, res) => {
      res.set("Referrer-Policy", "no-referrer");
      res.json({
        content: readPreview((await read()).data, req.params.token),
      });
    }),
  );
  router.get(
    "/admin",
    auth,
    handle(async (req, res) => res.json(adminState((await read()).data))),
  );
  router.put(
    "/admin",
    auth,
    handle(async (req, res) =>
      res.json(await mutate((data) => saveDraft(data, req.body))),
    ),
  );
  router.post(
    "/preview",
    auth,
    handle(async (req, res) =>
      res.json(await mutate((data) => createPreview(data, req.body.revision))),
    ),
  );
  router.post(
    "/publish",
    auth,
    handle(async (req, res) =>
      res.json(await mutate((data) => publishDraft(data, req.body.revision))),
    ),
  );

  router.get('/backup', auth, handle(async (req, res) => {
    res.set('Content-Disposition', 'attachment; filename="portfolio-backup.json"');
    res.json(exportBackup((await read()).data));
  }));
  router.post('/restore', auth, handle(async (req, res) => {
    res.json(await mutate(data => restoreBackup(data, req.body)));
  }));
  return router;
}
export default createContentRouter();
// Keep older public endpoints on the published version; authenticated admin reads see drafts.
export async function publishedReadGuard(req, res, next) {
  if (req.method !== "GET") return next();
  const path = req.path;
  let key, id;
  if (path === "/user/portfolio/me") key = "user";
  else if (path === "/project/getall") key = "projects";
  else if (path.startsWith("/project/get/")) {
    key = "project";
    id = path.split("/").pop();
  } else if (path === "/skill/getall") key = "skills";
  else if (path === "/timeline/getall") key = "timelines";
  else if (path === "/softwareapplication/getall") key = "softwareApplications";
  else return next();
  try {
    const { data } = await readStore();
    if (!data.contentPublished) return next();
    const token =
      req.headers.authorization?.replace(/^Bearer /, "");
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (data.users.some((u) => String(u.id) === String(decoded.id)))
          return next();
      }
    } catch {}
    const content = publicContent(data);
    if (key === "project") {
      const project = content.projects.find((p) => String(p.id) === id);
      return project
        ? res.json({ success: true, project })
        : res
            .status(404)
            .json({ success: false, message: "Project not found." });
    }
    res
      .set("Cache-Control", "no-store")
      .json({ success: true, [key]: content[key] });
  } catch (e) {
    next(e);
  }
}
