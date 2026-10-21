export interface StackGroup {
  title: string;
  items: StackItem[];
}

export interface StackItem {
  name: string;
  icon: string;
  color: string;
}

export const stack: StackGroup[] = [
  {
    title: "Frontend",
    items: [
      { name: "HTML", icon: "simple-icons:html5", color: "#E34F26" },
      { name: "CSS3", icon: "simple-icons:css3", color: "#1572B6" },
      { name: "Markdown", icon: "simple-icons:markdown", color: "#FFFFFF" },
      { name: "TypeScript", icon: "simple-icons:typescript", color: "#3178C6" },
      { name: "JavaScript", icon: "simple-icons:javascript", color: "#F7DF1E" },
      { name: "Astro", icon: "simple-icons:astro", color: "#BC52EE" },
      { name: "Next.js", icon: "simple-icons:nextdotjs", color: "#FFFFFF" },
      { name: "TailwindCSS", icon: "simple-icons:tailwindcss", color: "#06B6D4" },
      { name: "Svelte", icon: "simple-icons:svelte", color: "#FF3E00" },
      { name: "SvelteKit", icon: "simple-icons:svelte", color: "#FF3E00" },
    ],
  },
  {
    title: "Backend",
    items: [
      { name: "Node.js", icon: "simple-icons:nodedotjs", color: "#5FA04E" },
      { name: "NestJS", icon: "simple-icons:nestjs", color: "#E0234E" },
      { name: "Django", icon: "simple-icons:django", color: "#092E20" },
      { name: "FastAPI", icon: "simple-icons:fastapi", color: "#009688" },
      { name: "Ruby on Rails", icon: "simple-icons:rubyonrails", color: "#D30001" },
      { name: "Spring Boot", icon: "simple-icons:springboot", color: "#6DB33F" },
      { name: "REST API", icon: "simple-icons:openapiinitiative", color: "#6BA539" },
      { name: "GraphQL", icon: "simple-icons:graphql", color: "#E10098" },
      { name: "Prisma", icon: "simple-icons:prisma", color: "#2D3748" },
      { name: "Twurple", icon: "simple-icons:twitch", color: "#9146FF" },
      { name: "JWT", icon: "simple-icons:jsonwebtokens", color: "#000000" },
    ],
  },
  {
    title: "Lenguajes",
    items: [
      { name: "Java", icon: "simple-icons:openjdk", color: "#FFFFFF" },
      { name: "Python", icon: "simple-icons:python", color: "#3776AB" },
      { name: "Rust", icon: "simple-icons:rust", color: "#FFFFFF" },
      { name: "C#", icon: "simple-icons:csharp", color: "#512BD4" },
      { name: "C++", icon: "simple-icons:cplusplus", color: "#00599C" },
      { name: "Kotlin", icon: "simple-icons:kotlin", color: "#7F52FF" },
      { name: "Go", icon: "simple-icons:go", color: "#00ADD8" },
      { name: "Ruby", icon: "simple-icons:ruby", color: "#CC342D" },
      { name: "Bash", icon: "simple-icons:gnubash", color: "#4EAA25" },
      { name: "PowerShell", icon: "simple-icons:powershell", color: "#5391FE" },
      { name: "GLSL", icon: "simple-icons:opengl", color: "#5586A4" },
    ],
  },
  {
    title: "Minecraft",
    items: [
      { name: "Fabric", icon: "simple-icons:minecraft", color: "#DBBFA9" },
      { name: "NeoForge", icon: "simple-icons:minecraft", color: "#F16436" },
      { name: "Forge", icon: "simple-icons:minecraft", color: "#8B8B8B" },
      { name: "Bukkit", icon: "simple-icons:minecraft", color: "#8B8B8B" },
    ],
  },
  {
    title: "Bases de datos",
    items: [
      { name: "MySQL", icon: "simple-icons:mysql", color: "#4479A1" },
      { name: "SQLite", icon: "simple-icons:sqlite", color: "#003B57" },
      { name: "MariaDB", icon: "simple-icons:mariadb", color: "#003545" },
      { name: "MongoDB", icon: "simple-icons:mongodb", color: "#47A248" },
      { name: "PostgreSQL", icon: "simple-icons:postgresql", color: "#4169E1" },
      { name: "Redis", icon: "simple-icons:redis", color: "#FF4438" },
    ],
  },
  {
    title: "Herramientas",
    items: [
      { name: "Tauri", icon: "simple-icons:tauri", color: "#FFC131" },
      { name: "Git", icon: "simple-icons:git", color: "#F05032" },
      { name: "Docker", icon: "simple-icons:docker", color: "#2496ED" },
      { name: "Gradle", icon: "simple-icons:gradle", color: "#02303A" },
      { name: "Maven", icon: "simple-icons:apachemaven", color: "#C71A36" },
      { name: "IntelliJ IDEA", icon: "simple-icons:intellijidea", color: "#FE315D" },
      { name: "GitHub", icon: "simple-icons:github", color: "#FFFFFF" },
      { name: "GitHub Actions", icon: "simple-icons:githubactions", color: "#2088FF" },
      { name: "GitLab", icon: "simple-icons:gitlab", color: "#FC6D26" },
      { name: "Vercel", icon: "simple-icons:vercel", color: "#FFFFFF" },
      { name: "Cloudflare", icon: "simple-icons:cloudflare", color: "#F38020" },
      { name: "Debian", icon: "simple-icons:debian", color: "#A81D33" },
      { name: ".NET", icon: "simple-icons:dotnet", color: "#512BD4" },
    ],
  },
];