"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Mail, Linkedin, Github, Cloud, Sun, CloudRain, CloudSnow, MapPin, Loader2, AlertTriangle } from "lucide-react"

interface MenuBarProps {
  onOpenFinder?: () => void
}

interface WeatherData {
  temperature: number
  condition: string
  icon: string
  humidity: number
  windSpeed: number
  feelsLike: number
  uvIndex: string
  location: string
  country: string
}

interface LocationData {
  latitude: number
  longitude: number
  city: string
  country: string
}

export function MenuBar({ onOpenFinder }: MenuBarProps) {
  const [currentTime, setCurrentTime] = useState("")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [location, setLocation] = useState<LocationData | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(true)
  const [isLoadingWeather, setIsLoadingWeather] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [weatherError, setWeatherError] = useState<string | null>(null)
  const [showContactDropdown, setShowContactDropdown] = useState(false)
  const [showCalendarDropdown, setShowCalendarDropdown] = useState(false)
  const [showWeatherDropdown, setShowWeatherDropdown] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const calendarRef = useRef<HTMLDivElement>(null)
  const weatherRef = useRef<HTMLDivElement>(null)

  // Default fallback location (Jakarta)
  const defaultLocation: LocationData = {
    latitude: -6.2088,
    longitude: 106.8456,
    city: "Jakarta",
    country: "Indonesia",
  }

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      if (isMobile) {
        // Shorter format for mobile
        const options: Intl.DateTimeFormatOptions = {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }
        setCurrentTime(now.toLocaleDateString("en-US", options))
      } else {
        // Full format for desktop
        const options: Intl.DateTimeFormatOptions = {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }
        setCurrentTime(now.toLocaleDateString("en-US", options))
      }
    }

    updateTime()
    const interval = setInterval(updateTime, 60000)

    return () => clearInterval(interval)
  }, [isMobile])

  // Get user location using browser geolocation
  useEffect(() => {
    const getUserLocation = () => {
      setIsLoadingLocation(true)
      setLocationError(null)

      if (!navigator.geolocation) {
        setLocationError("Geolocation is not supported by this browser")
        setLocation(defaultLocation)
        setIsLoadingLocation(false)
        return
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes cache
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords

          try {
            // Use free reverse geocoding service (BigDataCloud)
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
            )

            if (response.ok) {
              const data = await response.json()
              setLocation({
                latitude,
                longitude,
                city: data.city || data.locality || data.principalSubdivision || "Unknown City",
                country: data.countryName || data.countryCode || "Unknown Country",
              })
            } else {
              throw new Error("Geocoding failed")
            }
          } catch (error) {
            console.warn("Reverse geocoding failed, using coordinates:", error)
            setLocation({
              latitude,
              longitude,
              city: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
              country: "Unknown",
            })
          }

          setIsLoadingLocation(false)
        },
        (error) => {
          console.warn("Geolocation error:", error)
          let errorMessage = "Location access denied"

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied by user"
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable"
              break
            case error.TIMEOUT:
              errorMessage = "Location request timed out"
              break
          }

          setLocationError(errorMessage)
          setLocation(defaultLocation)
          setIsLoadingLocation(false)
        },
        options,
      )
    }

    getUserLocation()
  }, [])

  // Generate realistic weather data based on location and time
  useEffect(() => {
    if (!location) return

    const generateWeatherData = () => {
      setIsLoadingWeather(true)
      setWeatherError(null)

      try {
        // Simulate API call delay
        setTimeout(() => {
          const now = new Date()
          const hour = now.getHours()
          const month = now.getMonth()
          const { latitude } = location

          // Base temperature calculation based on location and season
          let baseTemp = 25 // Default tropical temperature

          // Adjust for latitude (closer to equator = warmer)
          if (Math.abs(latitude) < 10) {
            baseTemp = 28 // Tropical
          } else if (Math.abs(latitude) < 30) {
            baseTemp = 24 // Subtropical
          } else if (Math.abs(latitude) < 50) {
            baseTemp = 18 // Temperate
          } else {
            baseTemp = 10 // Cold regions
          }

          // Seasonal adjustment (Northern hemisphere)
          const seasonalAdjustment =
            latitude > 0
              ? Math.sin(((month - 3) * Math.PI) / 6) * 8 // Northern hemisphere
              : Math.sin(((month - 9) * Math.PI) / 6) * 8 // Southern hemisphere

          // Daily temperature variation
          const dailyVariation = Math.sin(((hour - 6) * Math.PI) / 12) * 6

          // Random variation
          const randomVariation = (Math.random() - 0.5) * 4

          const temperature = Math.round(baseTemp + seasonalAdjustment + dailyVariation + randomVariation)

          // Weather conditions based on temperature and randomness
          const conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain", "Clear"]
          let condition = "Sunny"

          if (temperature < 15) {
            condition = Math.random() > 0.5 ? "Cloudy" : "Light Rain"
          } else if (temperature < 25) {
            condition = Math.random() > 0.3 ? "Partly Cloudy" : "Cloudy"
          } else {
            condition = Math.random() > 0.7 ? "Partly Cloudy" : "Sunny"
          }

          // Night time adjustments
          if (hour < 6 || hour > 20) {
            condition = condition.replace("Sunny", "Clear")
          }

          const mockWeatherData: WeatherData = {
            temperature,
            condition,
            icon: condition.toLowerCase().replace(" ", "-"),
            humidity: Math.round(60 + Math.random() * 30), // 60-90%
            windSpeed: Math.round(5 + Math.random() * 15), // 5-20 km/h
            feelsLike: Math.round(temperature + (Math.random() - 0.5) * 6), // ±3°C variation
            uvIndex: temperature > 25 ? "High" : temperature > 15 ? "Moderate" : "Low",
            location: location.city,
            country: location.country,
          }

          setWeather(mockWeatherData)
          setIsLoadingWeather(false)
        }, 1000)
      } catch (error) {
        console.error("Weather generation error:", error)
        setWeatherError("Failed to generate weather data")
        setIsLoadingWeather(false)
      }
    }

    generateWeatherData()

    // Update weather every 10 minutes
    const interval = setInterval(generateWeatherData, 600000)
    return () => clearInterval(interval)
  }, [location])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowContactDropdown(false)
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendarDropdown(false)
      }
      if (weatherRef.current && !weatherRef.current.contains(event.target as Node)) {
        setShowWeatherDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const getCurrentDate = () => {
    const now = new Date()
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return now.toLocaleDateString("en-US", options)
  }

  const getCalendarDays = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const today = now.getDate()

    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return { days, today }
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
      case "clear":
        return <Sun className="w-3 h-3 text-yellow-400" />
      case "partly cloudy":
      case "partly-cloudy":
        return <Cloud className="w-3 h-3 text-gray-300" />
      case "cloudy":
        return <Cloud className="w-3 h-3 text-gray-400" />
      case "light rain":
      case "rainy":
      case "rain":
        return <CloudRain className="w-3 h-3 text-blue-400" />
      case "snowy":
      case "snow":
        return <CloudSnow className="w-3 h-3 text-blue-200" />
      default:
        return <Cloud className="w-3 h-3 text-gray-300" />
    }
  }

  const retryLocation = () => {
    window.location.reload() // Simple retry by refreshing
  }

  const { days, today } = getCalendarDays()

  const handleLinkClick = (url: string, e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="fixed top-0 left-0 right-0 h-6 bg-black/20 backdrop-blur-md border-b border-white/10 z-50 flex items-center justify-between text-white">
      <div className="flex items-center px-2 md:px-4">
        <span
          className={`font-medium cursor-pointer hover:bg-white/10 px-1 md:px-2 py-1 rounded transition-colors ${
            isMobile ? "text-xs" : "text-sm"
          }`}
          onClick={onOpenFinder}
        >
          {isMobile ? "Amara" : "Amara Thuridha"}
        </span>
        <div className="relative ml-2 md:ml-4" ref={dropdownRef}>
          <span
            className={`cursor-pointer hover:text-blue-300 px-1 md:px-2 py-1 rounded transition-colors ${
              isMobile ? "text-xs" : "text-sm"
            }`}
            onClick={() => setShowContactDropdown(!showContactDropdown)}
          >
            Contact
          </span>

          {showContactDropdown && (
            <div
              className={`absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 text-gray-800 z-60 animate-in slide-in-from-top-2 duration-200 ${
                isMobile ? "w-64" : "w-72"
              }`}
            >
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-600 mb-3">My contacts</h3>

                <div className="space-y-2">
                  <div
                    className="flex items-center gap-3 text-sm text-gray-700 py-2 px-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                    onClick={(e) => handleLinkClick("mailto:athuridhaa@gmail.com", e)}
                  >
                    <Mail className="w-4 h-4 text-blue-500" />
                    <span>athuridhaa@gmail.com</span>
                  </div>

                  <div
                    className="flex items-center gap-3 text-sm text-gray-700 py-2 px-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                    onClick={(e) => handleLinkClick("https://linkedin.com/in/amara-thuridha-3baa3122b", e)}
                  >
                    <Linkedin className="w-4 h-4 text-blue-600" />
                    <span>linkedin.com/in/amara-thuridha-3baa3122b</span>
                  </div>

                  <div
                    className="flex items-center gap-3 text-sm text-gray-700 py-2 px-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                    onClick={(e) => handleLinkClick("https://github.com/athuridha", e)}
                  >
                    <Github className="w-4 h-4 text-gray-800" />
                    <span>github.com/athuridha</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4 px-2 md:px-4">
        {/* Weather */}
        <div className="relative" ref={weatherRef}>
          <div
            className={`flex items-center gap-1 cursor-pointer hover:bg-white/10 px-1 md:px-2 py-1 rounded transition-colors ${
              isMobile ? "text-xs" : "text-sm"
            }`}
            onClick={() => setShowWeatherDropdown(!showWeatherDropdown)}
          >
            {isLoadingLocation || isLoadingWeather ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : weatherError || locationError ? (
              <AlertTriangle className="w-3 h-3 text-yellow-400" />
            ) : weather ? (
              <>
                {getWeatherIcon(weather.condition)}
                <span>{weather.temperature}°</span>
              </>
            ) : (
              <Cloud className="w-3 h-3 text-gray-300" />
            )}
          </div>

          {showWeatherDropdown && (
            <div
              className={`absolute top-full right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 text-gray-800 z-60 animate-in slide-in-from-top-2 duration-200 ${
                isMobile ? "w-56" : "w-64"
              }`}
            >
              <div className="p-4">
                {/* Loading State */}
                {(isLoadingLocation || isLoadingWeather) && (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
                      <div className="text-sm text-gray-600">
                        {isLoadingLocation ? "Getting your location..." : "Loading weather..."}
                      </div>
                    </div>
                  </div>
                )}

                {/* Error State */}
                {(weatherError || locationError) && !isLoadingLocation && !isLoadingWeather && (
                  <div className="text-center py-4">
                    <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                    <div className="text-sm text-gray-600 mb-3">{locationError || weatherError}</div>
                    <button
                      onClick={retryLocation}
                      className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* Weather Data */}
                {weather && !isLoadingLocation && !isLoadingWeather && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-1 text-lg font-semibold text-gray-800">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span>{weather.location}</span>
                        </div>
                        {weather.country && <div className="text-xs text-gray-500">{weather.country}</div>}
                      </div>
                      <div className="flex items-center gap-2">
                        {getWeatherIcon(weather.condition)}
                        <span className="text-2xl font-light">{weather.temperature}°C</span>
                      </div>
                    </div>

                    <div className="text-gray-600 mb-4">{weather.condition}</div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Humidity</div>
                        <div className="font-medium">{weather.humidity}%</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Wind</div>
                        <div className="font-medium">{weather.windSpeed} km/h</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Feels like</div>
                        <div className="font-medium">{weather.feelsLike}°C</div>
                      </div>
                      <div>
                        <div className="text-gray-500">UV Index</div>
                        <div className="font-medium">{weather.uvIndex}</div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="text-xs text-gray-500 text-center">
                        Last updated:{" "}
                        {new Date().toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      {locationError && (
                        <div className="text-xs text-yellow-600 text-center mt-1">Using default location</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Date and Time */}
        <div className="relative" ref={calendarRef}>
          <div
            className={`text-right cursor-pointer hover:bg-white/10 px-1 md:px-2 py-1 rounded transition-colors ${
              isMobile ? "text-xs" : "text-sm"
            }`}
            onClick={() => setShowCalendarDropdown(!showCalendarDropdown)}
          >
            {currentTime}
          </div>

          {showCalendarDropdown && (
            <div
              className={`absolute top-full right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 text-gray-800 z-60 animate-in slide-in-from-top-2 duration-200 ${
                isMobile ? "w-72" : "w-80"
              }`}
            >
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">{getCurrentDate()}</h3>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, index) => (
                    <div
                      key={index}
                      className={`text-center py-2 text-sm rounded transition-colors ${
                        day === today
                          ? "bg-blue-500 text-white font-semibold"
                          : day
                            ? "hover:bg-gray-100 cursor-pointer"
                            : ""
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
