"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Package, Car, CalendarDays, MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const indianCities = [
  "Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai",
  "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
  "Kochi", "Chandigarh", "Indore", "Nagpur", "Coimbatore",
  "Surat", "Bhopal", "Patna", "Visakhapatnam", "Tumkur",
]

export function HeroSection() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"send" | "trip">("send")
  const [fromCity, setFromCity] = useState("")
  const [toCity, setToCity] = useState("")
  const [date, setDate] = useState("")
  const [fromSuggestions, setFromSuggestions] = useState<string[]>([])
  const [toSuggestions, setToSuggestions] = useState<string[]>([])
  const [focusedField, setFocusedField] = useState<"from" | "to" | null>(null)

  const filterCities = (query: string) => {
    if (!query) return []
    return indianCities.filter((c) =>
      c.toLowerCase().startsWith(query.toLowerCase())
    ).slice(0, 5)
  }

  const handleFromChange = (val: string) => {
    setFromCity(val)
    setFromSuggestions(filterCities(val))
  }

  const handleToChange = (val: string) => {
    setToCity(val)
    setToSuggestions(filterCities(val))
  }

  const handleSearch = () => {
    if (!fromCity || !toCity) return
    if (activeTab === "send") {
      router.push(`/send?from=${encodeURIComponent(fromCity)}&to=${encodeURIComponent(toCity)}&date=${encodeURIComponent(date)}`)
    } else {
      router.push(`/travel?from=${encodeURIComponent(fromCity)}&to=${encodeURIComponent(toCity)}&date=${encodeURIComponent(date)}`)
    }
  }

  return (
    <section className="relative overflow-hidden bg-primary px-4 pb-20 pt-16 md:pb-28 md:pt-24">
      {/* Background pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-4xl">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-sm text-primary-foreground">
            <span className="h-2 w-2 rounded-full bg-secondary" />
            Nationwide P2P Delivery Network
          </div>

          {/* Headline */}
          <h1 className="mb-6 max-w-3xl text-balance text-4xl font-bold leading-tight tracking-tight text-primary-foreground md:text-5xl lg:text-6xl md:leading-[1.1]">
            Send Parcels Anywhere.{" "}
            <span className="text-secondary">
              Faster and Cheaper
            </span>{" "}
            with Verified Travelers.
          </h1>

          {/* Subheadline */}
          <p className="mb-10 max-w-xl text-pretty text-lg leading-relaxed text-primary-foreground/70 md:text-xl">
            Connect with verified commuters traveling your route. Fast, affordable, and secure peer-to-peer delivery across India.
          </p>

          {/* Search Card */}
          <div className="w-full max-w-2xl rounded-2xl border border-primary-foreground/10 bg-card p-1.5 shadow-2xl md:p-2">
            {/* Tabs */}
            <div className="mb-4 flex rounded-xl bg-muted p-1">
              <button
                onClick={() => setActiveTab("send")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                  activeTab === "send"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Package className="h-4 w-4" />
                Send a Parcel
              </button>
              <button
                onClick={() => setActiveTab("trip")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                  activeTab === "trip"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Car className="h-4 w-4" />
                Post a Trip
              </button>
            </div>

            {/* Search Fields */}
            <div className="flex flex-col gap-3 p-2 md:flex-row md:items-end md:gap-2 md:p-3">
              {/* From City */}
              <div className="relative flex-1">
                <label className="mb-1.5 block text-left text-xs font-semibold text-muted-foreground">
                  From (City / Area)
                </label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
                  <input
                    type="text"
                    value={fromCity}
                    onChange={(e) => handleFromChange(e.target.value)}
                    onFocus={() => setFocusedField("from")}
                    onBlur={() => setTimeout(() => setFocusedField(null), 150)}
                    placeholder="e.g. Mumbai"
                    className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                  />
                </div>
                {focusedField === "from" && fromSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-xl border border-border bg-card py-1 shadow-lg">
                    {fromSuggestions.map((city) => (
                      <button
                        key={city}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground hover:bg-muted"
                        onMouseDown={() => {
                          setFromCity(city)
                          setFromSuggestions([])
                        }}
                      >
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        {city}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* To City */}
              <div className="relative flex-1">
                <label className="mb-1.5 block text-left text-xs font-semibold text-muted-foreground">
                  To (City / Area)
                </label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                  <input
                    type="text"
                    value={toCity}
                    onChange={(e) => handleToChange(e.target.value)}
                    onFocus={() => setFocusedField("to")}
                    onBlur={() => setTimeout(() => setFocusedField(null), 150)}
                    placeholder="e.g. Delhi"
                    className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                  />
                </div>
                {focusedField === "to" && toSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-xl border border-border bg-card py-1 shadow-lg">
                    {toSuggestions.map((city) => (
                      <button
                        key={city}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground hover:bg-muted"
                        onMouseDown={() => {
                          setToCity(city)
                          setToSuggestions([])
                        }}
                      >
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        {city}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Date */}
              <div className="flex-1 md:max-w-[180px]">
                <label className="mb-1.5 block text-left text-xs font-semibold text-muted-foreground">
                  Date
                </label>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-4 text-sm text-foreground transition-colors focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                  />
                </div>
              </div>

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                disabled={!fromCity || !toCity}
                className="h-[46px] gap-2 rounded-xl bg-secondary px-6 text-sm font-semibold text-secondary-foreground shadow-md hover:bg-secondary/90 disabled:opacity-50 md:px-5"
              >
                <Search className="h-4 w-4" />
                <span className="md:hidden">
                  {activeTab === "send" ? "Find Travelers" : "Post Trip"}
                </span>
                <span className="hidden md:inline">Search</span>
              </Button>
            </div>
          </div>

          {/* Popular routes */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-primary-foreground/50">Popular:</span>
            {[
              { from: "Mumbai", to: "Pune" },
              { from: "Delhi", to: "Jaipur" },
              { from: "Bengaluru", to: "Chennai" },
              { from: "Hyderabad", to: "Bengaluru" },
            ].map((route) => (
              <button
                key={`${route.from}-${route.to}`}
                onClick={() => {
                  setFromCity(route.from)
                  setToCity(route.to)
                }}
                className="rounded-full border border-primary-foreground/15 bg-primary-foreground/5 px-3 py-1 text-xs text-primary-foreground/70 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                {route.from} <ArrowRight className="mx-0.5 inline h-3 w-3" /> {route.to}
              </button>
            ))}
          </div>

          {/* Stats bar */}
          <div className="mt-12 grid w-full max-w-xl grid-cols-3 divide-x divide-primary-foreground/10 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-4 backdrop-blur md:mt-16">
            <div className="flex flex-col items-center px-2">
              <span className="text-2xl font-bold text-secondary md:text-3xl">
                10K+
              </span>
              <span className="mt-1 text-xs text-primary-foreground/60 md:text-sm">
                Deliveries Done
              </span>
            </div>
            <div className="flex flex-col items-center px-2">
              <span className="text-2xl font-bold text-secondary md:text-3xl">
                200+
              </span>
              <span className="mt-1 text-xs text-primary-foreground/60 md:text-sm">
                Cities Covered
              </span>
            </div>
            <div className="flex flex-col items-center px-2">
              <span className="text-2xl font-bold text-secondary md:text-3xl">
                4.9
              </span>
              <span className="mt-1 text-xs text-primary-foreground/60 md:text-sm">
                User Rating
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
