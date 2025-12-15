"use client"

export function AboutContent() {
  const handleLinkClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-blue-400 via-purple-500 to-red-400 rounded-full flex items-center justify-center text-white text-4xl md:text-5xl font-bold animate-in zoom-in duration-700 hover:scale-105 transition-transform overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-gray-800 via-blue-600 to-red-500 rounded-full flex items-center justify-center">
              AT
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 animate-in slide-in-from-right duration-500 delay-200">
              Amara Thuridha
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-gray-600 animate-in slide-in-from-right duration-500 delay-300">
              <span>Student</span>
              <span className="text-blue-500">•</span>
              <span>Designer</span>
              <span className="text-blue-500">•</span>
              <span>Developer</span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 animate-in slide-in-from-right duration-500 delay-400">

            <div className="flex items-center gap-4">
              <span className="text-gray-500 w-20">Email</span>
              <span
                className="text-gray-800 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => handleLinkClick("mailto:athuridhaa@gmail.com")}
              >
                athuridhaa@gmail.com
              </span>
            </div>
          </div>

          {/* About Section */}
          <div className="space-y-4 animate-in slide-in-from-right duration-500 delay-500">
            <h2 className="text-lg font-semibold text-gray-800">About</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p>
                I'm a student and aspiring developer based in Jakarta, Indonesia. Currently pursuing a degree in
                Information Systems at Universitas Tarumanagara, focusing on business process analysis and technology
                implementation.
              </p>
              <p>
                My passion lies in creating innovative solutions that bridge the gap between business processes and
                technology. I enjoy exploring new technologies and frameworks to enhance my skills and stay up-to-date
                with the latest industry trends.
              </p>
              <p>
                Prior to that I was involved in various volunteer activities including being a Member of Visual Design
                Creative at{" "}
                <span className="text-blue-600 underline cursor-pointer hover:text-blue-800 transition-colors">
                  Tarumanagara Fair 2023
                </span>
                , focused on creating engaging visual content and event documentation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
