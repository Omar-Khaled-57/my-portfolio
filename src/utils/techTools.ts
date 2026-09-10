import type { Project, TechTool } from "../types";

type ToolLike = Partial<TechTool>;

export const getToolImage = (tool: ToolLike | undefined | null | undefined, theme: string): string | undefined =>
  theme === "dark" || !tool?.image_light ? tool?.image : tool?.image_light;

export const techToolsById = (tools: TechTool[] | null | undefined): Map<string, TechTool> =>
  new Map((tools || []).map((tool) => [tool.id, tool]));

export const normalizeName = (value: unknown): string =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const toolNameCandidates = (tool: TechTool): string[] => {
  const norm = normalizeName(tool.name);
  const candidates = [norm];
  if (/\.(jsx?|tsx?)$/i.test(tool.name)) {
    const stem = norm.replace(/(jsx|js|tsx|ts)$/, "");
    if (stem) candidates.push(stem);
  }
  return candidates;
};

export const matchToolByName = (name: string, tools: TechTool[] | null | undefined): TechTool | undefined => {
  const target = normalizeName(name);
  if (!target) return undefined;
  for (const tool of tools || []) {
    for (const candidate of toolNameCandidates(tool)) {
      if (candidate === target) return tool;
    }
  }
  let best: TechTool | undefined;
  let bestLen = 0;
  for (const tool of tools || []) {
    const candidate = normalizeName(tool.name);
    if (!candidate || candidate.length > target.length) continue;
    if (target.startsWith(candidate) && candidate.length > bestLen) {
      best = tool;
      bestLen = candidate.length;
    }
  }
  return best;
};

export const resolveProjectTools = (
  project: Pick<Project, "tech_ids"> | Project,
  tools: TechTool[] | null | undefined,
): TechTool[] => {
  const map = techToolsById(tools);
  return (project?.tech_ids || [])
    .map((id) => map.get(id))
    .filter((tool): tool is TechTool => Boolean(tool));
};

export const resolveStackTools = (
  project: Pick<Project, "tech_ids" | "tech_stack"> | Project,
  tools: TechTool[] | null | undefined,
): TechTool[] => {
  if (project?.tech_ids?.length) return resolveProjectTools(project, tools);
  const seen = new Set<string>();
  return (project?.tech_stack || []).reduce<TechTool[]>((acc, item) => {
    const tool = matchToolByName(item, tools);
    if (tool && !seen.has(tool.id)) {
      seen.add(tool.id);
      acc.push(tool);
    }
    return acc;
  }, []);
};