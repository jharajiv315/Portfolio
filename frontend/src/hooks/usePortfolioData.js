import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API_URL } from "../config";
import baseline from "../data/portfolio-snapshot.json";
const CACHE_KEY = "rajiv-portfolio-published-v1";
let memory = null,
  inflight = null;
function cached() {
  if (memory) return memory;
  try {
    const parsed = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
    if (
      parsed?.schemaVersion === 1 &&
      Array.isArray(parsed.projects) &&
      parsed.user &&
      parsed.settings
    )
      return (memory = parsed);
  } catch {
    // Invalid or unavailable browser storage falls back to the bundled snapshot.
  }
  return baseline;
}
export function previewToken() {
  const hash =
    typeof window === "undefined" ? "" : window.location.hash.slice(1);
  return hash.startsWith("preview=")
    ? new URLSearchParams(hash).get("preview")
    : null;
}
const empty = {
  ...baseline,
  user: null,
  projects: [],
  skills: [],
  timelines: [],
  softwareApplications: [],
};
export default function usePortfolioData() {
  const token = previewToken();
  const [data, setData] = useState(() => (token ? empty : cached()));
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(true);
  const refresh = useCallback(async () => {
    setError(null);
    setRefreshing(true);
    if (token) setLoading(true);
    try {
      const request = token
        ? axios.get(
            `${API_URL}/api/v1/content/preview/${encodeURIComponent(token)}`,
            { timeout: 45000 },
          )
        : (inflight ||= axios
            .get(`${API_URL}/api/v1/content`, { timeout: 45000 })
            .finally(() => {
              inflight = null;
            }));
      const { data: response } = await request;
      const content = response.content;
      if (
        content?.schemaVersion !== 1 ||
        !Array.isArray(content.projects) ||
        !content.settings
      )
        throw Error("Invalid content");
      if (!token) {
        memory = content;
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(content));
        } catch {
          // Storage can be blocked or full; the in-memory content still updates.
        }
      }
      setData(content);
    } catch (e) {
      setError(
        token
          ? e.response?.data?.message ||
              "Preview could not be loaded. Please try again."
          : "Showing saved content. The latest update couldn’t be fetched.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);
  useEffect(() => {
    refresh();
    const focus = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", focus);
    return () => document.removeEventListener("visibilitychange", focus);
  }, [refresh]);
  useEffect(() => {
    if (!token) return;
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.append(meta);
    return () => meta.remove();
  }, [token]);
  return {
    ...data,
    loading,
    refreshing,
    error,
    refetch: refresh,
    isPreview: Boolean(token),
    previewToken: token,
  };
}
