import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export async function downloadResumeDocument(resumeUrl, fullName = "Rajiv Jha") {
  if (!resumeUrl || typeof resumeUrl !== "string" || !resumeUrl.trim()) {
    throw new Error("No resume URL provided");
  }

  try {
    const response = await fetch(resumeUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = await response.blob();

    let extension = "docx";
    const lowerUrl = resumeUrl.toLowerCase();
    if (lowerUrl.endsWith(".pdf") || blob.type === "application/pdf") {
      extension = "pdf";
    } else if (lowerUrl.endsWith(".doc") || blob.type === "application/msword") {
      extension = "doc";
    }

    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    const safeBaseName = (fullName || "Rajiv_Jha")
      .trim()
      .replace(/[^a-zA-Z0-9_-]/g, "_");
    link.download = `${safeBaseName}_Resume.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
    return true;
  } catch (err) {
    console.warn("Direct blob download failed, falling back to direct window open:", err);
    window.open(resumeUrl, "_blank", "noopener,noreferrer");
    return true;
  }
}

