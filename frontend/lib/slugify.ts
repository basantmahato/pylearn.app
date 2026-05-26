/**
 * Converts a string into a URL-safe slug.
 * e.g. "Python Introduction & Basics" → "python-introduction-and-basics"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")           // & → and
    .replace(/[^\w\s-]/g, "")       // remove non-word chars (keep hyphens)
    .replace(/[\s_]+/g, "-")        // spaces/underscores → hyphens
    .replace(/-+/g, "-")            // collapse duplicate hyphens
    .replace(/^-+|-+$/g, "");       // trim leading/trailing hyphens
}

/**
 * The inverse: used when the slug IS the chapterId/setId (already clean identifiers).
 * Simply returns the id as-is since they are already URL-safe.
 */
export function idToSlug(id: string): string {
  return slugify(id);
}
