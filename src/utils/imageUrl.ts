const STORAGE_MARKER = "/storage/v1/object/public/";

// Appends supabase Image Transformation params (width/quality) to a public
// storage URL so the browser fetches an appropriately sized rendition instead
// of the full uploaded native resolution (project screenshots are often
// 1536-1920px wide, displayed at <= ~520px). Quality stays high enough that
// the images remain visually sharp. Non-storage URLs (local assets,
// data:, http:) and already-transformed URLs are returned unchanged.
//
// Note: Supabase only serves transformed renditions when the "Image
// Transformations" feature is enabled in the project dashboard; when disabled
// the storage service ignores these params and returns the original file, so
// this helper is safe to ship either way.
export function optimizeStorageUrl(
  url: string | null | undefined,
  { width, quality }: { width: number; quality?: number },
): string {
  if (!url || !url.includes(STORAGE_MARKER)) return url ?? "";
  try {
    const u = new URL(url);
    if (u.searchParams.has("width") || u.searchParams.has("quality")) return url;
    u.searchParams.set("width", String(width));
    if (quality) u.searchParams.set("quality", String(quality));
    return u.toString();
  } catch {
    return url;
  }
}