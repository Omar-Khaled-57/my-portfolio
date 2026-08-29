export const getToolImage = (tool, theme) =>
  theme === "dark" || !tool?.image_light ? tool?.image : tool?.image_light;

export const techToolsById = (tools) => new Map((tools || []).map((tool) => [tool.id, tool]));

export const resolveProjectTools = (project, tools) => {
  const map = techToolsById(tools);
  return (project?.tech_ids || [])
    .map((id) => map.get(id))
    .filter(Boolean);
};