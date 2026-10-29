export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  href?: string;
}

export const projects: Project[] = [
  {
    id: "project-01",
    title: "Project One",
    category: "Minecraft",
    description:
      "Replace this text with a short description of your mod, its mechanics and what you built.",
    technologies: ["Java", "Fabric"],
  },
  {
    id: "project-02",
    title: "Project Two",
    category: "Web application",
    description:
      "Replace this text with the purpose of your application and the problem it solves.",
    technologies: ["Astro", "Svelte", "TypeScript"],
  },
  {
    id: "project-03",
    title: "Project Three",
    category: "Developer tool",
    description:
      "Replace this text with a description of your tool, its features and your contribution.",
    technologies: ["Rust", "Tauri"],
  },
];