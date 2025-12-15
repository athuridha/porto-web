"use client"

import { useState, useEffect } from "react"
import { StartupAnimation } from "@/components/loading/startup-animation"
import { MenuBar } from "@/components/desktop/menu-bar"
import { DesktopBackground } from "@/components/desktop/desktop-background"
import { DesktopShortcut } from "@/components/desktop/desktop-shortcut"
import { CalculatorShortcut } from "@/components/desktop/calculator-shortcut"
import { CalendarShortcut } from "@/components/desktop/calendar-shortcut"
import { Dock } from "@/components/desktop/dock"
import { Window } from "@/components/window/window"
import { NavigationSidebar } from "@/components/sidebar/navigation-sidebar"
import { AboutContent } from "@/components/content/about-content"
import { ProjectsContent } from "@/components/content/projects-content"
import { ProjectDetailContent } from "@/components/content/project-detail-content"
import { ExperienceContent } from "@/components/content/experience-content"
import { EducationContent } from "@/components/content/education-content"
import { ContactContent } from "@/components/content/contact-content"
import { Calculator } from "@/components/apps/calculator"
import { Calendar } from "@/components/apps/calendar"
import { FlappyBird } from "@/components/apps/flappy-bird"

export default function AmaraDesktop() {
  const [isLoading, setIsLoading] = useState(true)
  const [openWindows, setOpenWindows] = useState<string[]>([])
  const [maximizedWindows, setMaximizedWindows] = useState<Set<string>>(new Set())
  const [activeSection, setActiveSection] = useState("about")
  const [showSidebar, setShowSidebar] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      // Auto-hide sidebar on mobile
      if (window.innerWidth < 768) {
        setShowSidebar(false)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleStartupComplete = () => {
    setIsLoading(false)
  }

  const openWindow = (windowId: string) => {
    if (!openWindows.includes(windowId)) {
      setOpenWindows([...openWindows, windowId])
    }
  }

  const openFinderAboutMe = () => {
    setActiveSection("about")
    openWindow("finder")
  }

  const closeWindow = (windowId: string) => {
    setOpenWindows(openWindows.filter((id) => id !== windowId))
    setMaximizedWindows((prev) => {
      const newSet = new Set(prev)
      newSet.delete(windowId)
      return newSet
    })
    // Clear selected project if closing project detail window
    if (windowId.startsWith("project-detail-")) {
      setSelectedProject(null)
    }
  }

  const toggleMaximize = (windowId: string) => {
    setMaximizedWindows((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(windowId)) {
        newSet.delete(windowId)
      } else {
        newSet.add(windowId)
      }
      return newSet
    })
  }

  const handleProjectClick = (projectName: string) => {
    setSelectedProject(projectName)
    const windowId = `project-detail-${projectName.replace(/\s+/g, "-").toLowerCase()}`
    openWindow(windowId)
  }

  const getWindowTitle = (windowId: string) => {
    if (windowId.startsWith("project-detail-")) {
      return selectedProject || "Project Details"
    }

    switch (windowId) {
      case "finder":
        return "Amara Thuridha - Profile"
      case "about":
        return "About Me"
      case "projects":
        return "Selected Projects"
      case "education":
        return "Education"
      case "experience":
        return "Experience"
      case "contact":
        return "Contact"
      case "calculator":
        return "Calculator"
      case "calendar":
        return "Calendar"
      case "flappy-bird":
        return "Kotak Loncat"
      default:
        return "Window"
    }
  }

  const getWindowContent = (windowId: string) => {
    if (windowId.startsWith("project-detail-") && selectedProject) {
      return <ProjectDetailContent projectName={selectedProject} />
    }

    switch (windowId) {
      case "about":
        return <AboutContent />
      case "projects":
        return <ProjectsContent onProjectClick={handleProjectClick} />
      case "education":
        return <EducationContent />
      case "experience":
        return <ExperienceContent />
      case "contact":
        return <ContactContent />
      case "calculator":
        return <Calculator />
      case "calendar":
        return <Calendar />
      case "flappy-bird":
        return <FlappyBird />
      default:
        return <div className="p-8">Content not found</div>
    }
  }

  const shouldShowSidebar = (windowId: string) => {
    return windowId === "finder"
  }

  if (isLoading) {
    return <StartupAnimation onComplete={handleStartupComplete} />
  }

  return (
    <DesktopBackground>
      <MenuBar onOpenFinder={openFinderAboutMe} />

      {/* Desktop Shortcuts */}
      <DesktopShortcut onDoubleClick={() => openWindow("projects")} />
      <CalculatorShortcut onDoubleClick={() => openWindow("calculator")} />
      <CalendarShortcut onDoubleClick={() => openWindow("calendar")} />

      {/* Windows */}
      {openWindows.map((windowId, index) => (
        <Window
          key={windowId}
          windowId={windowId}
          title={getWindowTitle(windowId)}
          onClose={() => closeWindow(windowId)}
          isMaximized={maximizedWindows.has(windowId)}
          onMaximize={() => toggleMaximize(windowId)}
          showSidebar={shouldShowSidebar(windowId) && showSidebar}
          onToggleSidebar={shouldShowSidebar(windowId) ? () => setShowSidebar(!showSidebar) : undefined}
          sidebar={
            shouldShowSidebar(windowId) ? (
              <NavigationSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
            ) : undefined
          }
        >
          {windowId === "finder" ? (
            <div className="transition-all duration-300">
              {activeSection === "about" && <AboutContent />}
              {activeSection === "education" && <EducationContent />}
              {activeSection === "experience" && <ExperienceContent />}
              {activeSection === "contact" && <ContactContent />}
            </div>
          ) : (
            getWindowContent(windowId)
          )}
        </Window>
      ))}

      {/* Dock */}
      <Dock
        onOpenWindow={openWindow}
        openWindows={openWindows}
        onCloseWindow={closeWindow}
        maximizedWindows={maximizedWindows}
      />
    </DesktopBackground>
  )
}
