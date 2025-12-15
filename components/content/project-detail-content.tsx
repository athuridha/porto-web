import { ExternalLink, Github } from "lucide-react"
import { projects } from "./projects-content"

interface ProjectDetailContentProps {
  projectName: string
}

export function ProjectDetailContent({ projectName }: ProjectDetailContentProps) {
  const project = projects.find((p) => p.name === projectName)

  if (!project) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Not Found</h2>
        <p className="text-gray-600">The requested project could not be found.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Project Header */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">{project.name}</h1>

        {/* Project Image */}
        {project.image && (
          <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={project.image || "/placeholder.svg"}
              alt={project.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = "none"
                target.parentElement!.innerHTML = `
                  <div class="w-full h-full flex items-center justify-center bg-gray-100">
                    <span class="text-gray-500">Image not available</span>
                  </div>
                `
              }}
            />
          </div>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-800">Description</h2>
        <p className="text-gray-700 leading-relaxed">{project.description}</p>
      </div>

      {/* Technologies */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-800">Technologies Used</h2>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span key={tech} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-800">Links</h2>
        <div className="flex gap-4">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </a>
          )}
          {project.liveDemo && (
            <a
              href={project.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
