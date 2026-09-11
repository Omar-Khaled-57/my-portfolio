import { writeFileSync, existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const SITE_URL = process.env.SITE_URL || "https://omar-el-khouly.vercel.app";
const SITEMAP_PATH = join(ROOT, "public", "sitemap.xml");

function loadEnv() {
  const envPath = join(ROOT, ".env");
  if (!existsSync(envPath)) return {};
  const vars = {};
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    vars[key] = value;
  }
  return vars;
}

const arabicToLatin = {
  'أ': 'a', 'ا': 'a', 'إ': 'a', 'آ': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th',
  'ج': 'g', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z',
  'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a',
  'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
  'ه': 'h', 'و': 'w', 'ي': 'y', 'ة': 't', 'ى': 'a', 'ئ': 'a', 'ؤ': 'w',
  ' ': '-',
};

function toSlug(title) {
  if (!title) return "";
  return title
    .trim()
    .toLowerCase()
    .split("")
    .map((ch) => arabicToLatin[ch] || ch)
    .join("")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function fetchProjects(supabaseUrl, supabaseKey) {
  const res = await fetch(
    `${supabaseUrl}/rest/v1/projects?select=title,created_at&is_published=eq.true&order=id.desc`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Accept: "application/json",
      },
    },
  );
  if (!res.ok) {
    throw new Error(`Supabase request failed (${res.status}): ${await res.text()}`);
  }
  return res.json();
}

async function main() {
  const env = loadEnv();
  const supabaseUrl = process.env.VITE_SUPABASE_URL || env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY;

  const urls = [
    { loc: `${SITE_URL}/`, priority: "1.0", changefreq: "weekly" },
    { loc: `${SITE_URL}/cv`, priority: "0.8", changefreq: "monthly" },
  ];

  if (supabaseUrl && supabaseKey) {
    try {
      const projects = await fetchProjects(supabaseUrl, supabaseKey);
      for (const project of projects) {
        const slug = toSlug(project.title);
        if (!slug) continue;
        urls.push({
          loc: `${SITE_URL}/project/${slug}`,
          priority: "0.7",
          changefreq: "monthly",
          lastmod: project.created_at
            ? project.created_at.slice(0, 10)
            : undefined,
        });
      }
      console.log(`Sitemap: added ${projects.length} project URL(s).`);
    } catch (err) {
      console.warn(`Sitemap: could not fetch projects (${err.message}); keeping static entries.`);
    }
  } else {
    console.warn("Sitemap: Supabase env vars not found; using static entries only.");
  }

  const body = urls
    .map((u) => {
      const lastmod = u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : "";
      return `  <url>\n    <loc>${xmlEscape(u.loc)}</loc>${lastmod}\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`;
    })
    .join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

  writeFileSync(SITEMAP_PATH, sitemap);
  console.log(`Sitemap written to ${SITEMAP_PATH} (${urls.length} URLs).`);
}

main().catch((err) => {
  console.error("Sitemap generation failed:", err.message);
  process.exit(1);
});
