// IT Skills Matcher - Maps candidate computer skills to IT skills test categories

interface ComputerSkill {
  skill: string
  level: string
}

interface ITSkillsMatch {
  subcategory: string
  subcategory_name: string
  level: string
  tools: string[]
}

// Mapping of computer skills to IT skills subcategories
const skillToSubcategoryMap: Record<string, string> = {
  // Office Apps
  "Microsoft Word": "office_apps",
  "Microsoft Excel": "office_apps",
  "Microsoft PowerPoint": "office_apps",
  "Microsoft Outlook": "office_apps",
  "Google Docs": "office_apps",
  "Google Sheets": "office_apps",
  "Adobe Acrobat": "office_apps",

  // Frontend Development
  JavaScript: "frontend_dev",
  TypeScript: "frontend_dev",
  React: "frontend_dev",
  Angular: "frontend_dev",
  "Vue.js": "frontend_dev",
  "HTML/CSS": "frontend_dev",
  "Sass/SCSS": "frontend_dev",
  Webpack: "frontend_dev",
  Redux: "frontend_dev",

  // Backend Development
  "Node.js": "backend_dev",
  Python: "backend_dev",
  Java: "backend_dev",
  "C++": "backend_dev",
  "C#": "backend_dev",
  PHP: "backend_dev",
  Ruby: "backend_dev",
  Go: "backend_dev",
  Rust: "backend_dev",
  Django: "backend_dev",
  Flask: "backend_dev",
  Spring: "backend_dev",
  ".NET": "backend_dev",
  "REST API": "backend_dev",
  GraphQL: "backend_dev",

  // Databases
  SQL: "databases",
  MongoDB: "databases",
  PostgreSQL: "databases",
  MySQL: "databases",

  // DevOps
  Git: "devops",
  Docker: "devops",
  Kubernetes: "devops",
  Jenkins: "devops",
  "GitLab CI": "devops",
  Terraform: "devops",
  Ansible: "devops",

  // Cloud
  AWS: "cloud",
  Azure: "cloud",
  "Google Cloud": "cloud",

  // Web Technologies (general web tech)
  Nginx: "web_tech",
  Apache: "web_tech",

  // System Administration
  Linux: "sysadmin",
  "Windows Server": "sysadmin",
}

// Subcategory display names
const subcategoryNames: Record<string, string> = {
  office_apps: "Kancelárske aplikácie",
  frontend_dev: "Frontend vývoj",
  backend_dev: "Backend vývoj",
  databases: "Databázy",
  devops: "DevOps",
  cloud: "Cloud technológie",
  web_tech: "Webové technológie",
  sysadmin: "Systémová administrácia",
}

// Map Slovak skill levels to test levels
const levelMap: Record<string, string> = {
  Začiatočník: "beginner",
  "Mierne pokročilý": "intermediate",
  Pokročilý: "advanced",
  Expert: "expert",
}

/**
 * Get IT skills tests for a candidate based on their computer skills
 * @param computerSkills - Array of computer skills with skill name and level
 * @returns Array of matched IT skills tests
 */
export function getITSkillsTestsForCandidate(computerSkills: ComputerSkill[]): ITSkillsMatch[] {
  if (!computerSkills || computerSkills.length === 0) {
    return []
  }

  // Group skills by subcategory
  const subcategoryMap = new Map<string, { level: string; tools: Set<string> }>()

  for (const skill of computerSkills) {
    const subcategory = skillToSubcategoryMap[skill.skill]

    if (!subcategory) {
      continue // Skip skills that don't map to any subcategory
    }

    const testLevel = levelMap[skill.level] || "beginner"

    if (!subcategoryMap.has(subcategory)) {
      subcategoryMap.set(subcategory, {
        level: testLevel,
        tools: new Set([skill.skill]),
      })
    } else {
      const existing = subcategoryMap.get(subcategory)!
      existing.tools.add(skill.skill)

      // Use the highest level among all skills in this subcategory
      const levelPriority = ["beginner", "intermediate", "advanced", "expert"]
      const currentLevelIndex = levelPriority.indexOf(existing.level)
      const newLevelIndex = levelPriority.indexOf(testLevel)

      if (newLevelIndex > currentLevelIndex) {
        existing.level = testLevel
      }
    }
  }

  // Convert to array of matches
  const matches: ITSkillsMatch[] = []

  for (const [subcategory, data] of subcategoryMap.entries()) {
    matches.push({
      subcategory,
      subcategory_name: subcategoryNames[subcategory] || subcategory,
      level: data.level,
      tools: Array.from(data.tools),
    })
  }

  return matches
}
