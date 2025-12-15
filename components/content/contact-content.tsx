"use client"

import { Mail, Linkedin, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function ContactContent() {
  const handleLinkClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Get In Touch</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
          <div className="space-y-3">
            <div
              className="flex items-center gap-3 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => handleLinkClick("mailto:athuridhaa@gmail.com")}
            >
              <Mail className="w-5 h-5 text-blue-500" />
              <span className="text-gray-600 hover:text-blue-600">athuridhaa@gmail.com</span>
            </div>
            <div
              className="flex items-center gap-3 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => handleLinkClick("https://linkedin.com/in/amara-thuridha-3baa3122b")}
            >
              <Linkedin className="w-5 h-5 text-blue-600" />
              <span className="text-gray-600 hover:text-blue-600">linkedin.com/in/amara-thuridha-3baa3122b</span>
            </div>
            <div
              className="flex items-center gap-3 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => handleLinkClick("https://github.com/athuridha")}
            >
              <Github className="w-5 h-5 text-gray-800" />
              <span className="text-gray-600 hover:text-blue-600">github.com/athuridha</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Send a Message</h3>
          <form className="space-y-4">
            <div>
              <Input placeholder="Your Name" className="w-full" />
            </div>
            <div>
              <Input type="email" placeholder="Your Email" className="w-full" />
            </div>
            <div>
              <Input placeholder="Subject" className="w-full" />
            </div>
            <div>
              <Textarea placeholder="Your Message" rows={4} className="w-full" />
            </div>
            <Button className="w-full bg-blue-500 hover:bg-blue-600">Send Message</Button>
          </form>
        </div>
      </div>
    </div>
  )
}
