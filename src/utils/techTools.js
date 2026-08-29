export const getToolImage = (tool, theme) =>
  theme === "dark" || !tool?.image_light ? tool?.image : tool?.image_light;

export const techToolsById = (tools) => new Map((tools || []).map((tool) => [tool.id, tool]));

export const normalizeName = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const toolNameCandidates = (tool) => {
  const norm = normalizeName(tool.name);
  const candidates = [norm];
  if (/\.(jsx?|tsx?)$/i.test(tool.name)) {
    const stem = norm.replace(/(jsx|js|tsx|ts)$/, "");
    if (stem) candidates.push(stem);
  }
  return candidates;
};

export const matchToolByName = (name, tools) => {
  const target = normalizeName(name);
  if (!target) return undefined;
  for (const tool of tools || []) {
    for (const candidate of toolNameCandidates(tool)) {
      if (candidate === target) return tool;
    }
  }
  let best;
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

export const resolveProjectTools = (project, tools) => {
  const map = techToolsById(tools);
  return (project?.tech_ids || [])
    .map((id) => map.get(id))
    .filter(Boolean);
};

export const resolveStackTools = (project, tools) => {
  if (project?.tech_ids?.length) return resolveProjectTools(project, tools);
  const seen = new Set();
  return (project?.tech_stack || []).reduce((acc, item) => {
    const tool = matchToolByName(item, tools);
    if (tool && !seen.has(tool.id)) {
      seen.add(tool.id);
      acc.push(tool);
    }
    return acc;
  }, []);
};