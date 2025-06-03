"use client"

import { Folder, ExternalLink, Github } from "lucide-react"

interface ProjectsContentProps {
  onProjectClick?: (projectName: string) => void
}

export const projects = [
  {
    name: "Sekolah - Frontend Application",
    description:
      "A modern school management system frontend built with Next.js, TypeScript, and Tailwind CSS. Features a clean and responsive user interface for managing school-related data.",
    image: "/images/1.png",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "React"],
    github: "https://github.com/athuridha/Sekolah",
    liveDemo: "https://sekolah-beta.vercel.app/",
  },
  {
    name: "Analysis of House Prices in Yogyakarta by Region",
    description: "Analyzing house price datasets in Yogyakarta.",
    image: "/images/2.png",
    technologies: ["Python"],
    liveDemo: "https://colab.research.google.com/drive/1Md_LcGJYyWdLZ5hOohXm5j8u9L4Rgj9T",
  },
  {
    name: "Front-End Invious Visuals",
    description: "Front-End Invious Visuals.",
    image: "/images/3.png",
    technologies: ["Html", "PHP"],
    github: "https://github.com/athuridha/MidExam-College",
    liveDemo: "https://athuridha.github.io/MidExam-College/",
  },
  {
    name: "WebApp WhatsApp Blast",
    description:
      "A web-based WhatsApp blast application with admin dashboard, contact management, and message history. Built for efficient bulk messaging.",
    image: "/images/4.png",
    technologies: ["React", "Node.js", "Express", "Sqlite"],
    github: "https://github.com/athuridha/webapp-whatsapp-blast",
  },
  {
    name: "Samudra Kreatif - Agency Frontend",
    description:
      "Frontend website for Samudra Kreatif agency, providing a modern and responsive interface for digital agency services.",
    image: "/images/5.jpg",
    technologies: ["Next.js", "React", "Tailwind CSS"],
    github: "https://github.com/athuridha/samudra-kreatif",
    liveDemo: "https://samudra-kreatif.vercel.app/",
  },
]

export function ProjectsContent({ onProjectClick }: ProjectsContentProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center gap-3">
          <Folder className="w-8 h-8 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-800">Projects</h2>
        </div>
      </div>

      {/* Table Header */}
      <div className="flex items-center px-4 py-2 bg-gray-100 border-b text-sm font-medium text-gray-600">
        <div className="flex-1">Name</div>
        <div className="w-32 text-center hidden md:block">Technologies</div>
        <div className="w-24 text-center">Links</div>
      </div>

      {/* Project List */}
      <div className="flex-1 overflow-y-auto">
        {projects.map((project, index) => (
          <div
            key={project.name}
            className={`flex items-center px-4 py-3 border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors duration-150 ${
              index % 2 === 0 ? "bg-white" : "bg-gray-50"
            }`}
            onClick={() => onProjectClick?.(project.name)}
          >
            <div className="flex-1 min-w-0">
              <div className="text-gray-800 hover:text-blue-600 transition-colors font-medium truncate">
                {project.name}
              </div>
              <div className="text-sm text-gray-500 mt-1 line-clamp-2">{project.description}</div>

              {/* Mobile technologies display */}
              <div className="md:hidden mt-2">
                <div className="flex flex-wrap gap-1">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop technologies display */}
            <div className="w-32 text-center hidden md:block">
              <div className="flex flex-wrap gap-1 justify-center">
                {project.technologies.slice(0, 2).map((tech) => (
                  <span key={tech} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 2 && (
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                    +{project.technologies.length - 2}
                  </span>
                )}
              </div>
            </div>

            <div className="w-24 text-center flex-shrink-0">
              <div className="flex gap-2 justify-center">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Github className="w-4 h-4 text-gray-600" />
                  </a>
                )}
                {project.liveDemo && (
                  <a
                    href={project.liveDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-4 h-4 text-gray-600" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
