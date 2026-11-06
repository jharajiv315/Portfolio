import { v2 as cloudinary } from "cloudinary";
// Published snapshots and the previous published version can still reference old uploads.
// Keep them while draft/publish storage is enabled; cleanup needs reference tracking.
export async function deleteReplacedAsset(publicId, options) {
  if (process.env.STORAGE_DRIVER === "blob")
    return { result: "retained_for_published_versions" };
  return cloudinary.uploader.destroy(publicId, options);
}
