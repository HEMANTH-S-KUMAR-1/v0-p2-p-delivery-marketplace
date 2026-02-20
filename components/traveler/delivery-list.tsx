"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import {
  MapPin, Package, IndianRupee, Clock, ChevronRight, CheckCircle2,
  ArrowRight, ArrowLeft, Car, Bus, Train, CalendarDays, ChevronDown,
  User, Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Link from "next/link"

const indianCities = [
  "Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai",
  "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
  "Kochi", "Chandigarh", "Indore", "Nagpur", "Coimbatore",
  "Surat", "Bhopal", "Patna", "Visakhapatnam", "Tumkur",
]

interface PackageRequest {
  id: string
  senderName: string
  senderRating: number
  from: string
  to: string
  itemType: string
  trunkNeeded: string
  weight: string
  offerPrice: number
  postedAgo: string
}

const mockPackageRequests: PackageRequest[] = [
  {
    id: "PKG-001",
    senderName: "Anita Desai",
    senderRating: 4.8,
    from: "Mumbai",
    to: "Pune",
    itemType: "Document / Envelope",
    trunkNeeded: "Small",
    weight: "Under 500g",
    offerPrice: 150,
    postedAgo: "3 min ago",
  },
  {
    id: "PKG-002",
    senderName: "Ravi Kumar",
    senderRating: 4.9,
    from: "Mumbai",
    to: "Pune",
    itemType: "Small Box",
    trunkNeeded: "Medium",
    weight: "1kg - 2kg",
    offerPrice: 220,
    postedAgo: "8 min ago",
  },
  {
    id: "PKG-003",
    senderName: "Meera Joshi",
    senderRating: 5.0,
    from: "Mumbai",
    to: "Pune",
    itemType: "Keys / Small Items",
    trunkNeeded: "Small",
    weight: "Under 500g",
    offerPrice: 100,
    postedAgo: "15 min ago",
  },
  {
    id: "PKG-004",
    senderName: "Suresh Iyer",
    senderRating: 4.7,
    from: "Mumbai",
    to: "Pune",
    itemType: "Medium Box",
    trunkNeeded: "Large",
    weight: "2kg - 5kg",
    offerPrice: 280,
    postedAgo: "22 min ago",
  },
]

type TravelerView = "form" | "posted" | "requests" | "accepted"

export function DeliveryList() {
  const searchParams = useSearchParams()
  const initialFrom = searchParams.get("from") || ""
  const initialTo = searchParams.get("to") || ""
  const initialDate = searchParams.get("date") || ""

  const [view, setView] = useState<TravelerView>(
    initialFrom && initialTo ? "form" : "form"
  )

  // Post a Trip form state
  const [originCity, setOriginCity] = useState(initialFrom)
  const [destCity, setDestCity] = useState(initialTo)
  const [travelDate, setTravelDate] = useState(initialDate)
  const [travelTime, setTravelTime] = useState("07:00")
  const [vehicleType, setVehicleType] = useState("")
  const [acceptedPkg, setAcceptedPkg] = useState<PackageRequest | null>(null)

  const canPost = originCity && destCity && travelDate && vehicleType

  // ---- Accepted ----
  if (view === "accepted" && acceptedPkg) {
    return (
      <div className="mx-auto max-w-lg px-4 py-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary/10">
            <CheckCircle2 className="h-10 w-10 text-secondary" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-foreground">
            Delivery Accepted!
          </h2>
          <p className="mb-8 text-muted-foreground">
            Pick up from{" "}
            <span className="font-semibold text-foreground">
              {acceptedPkg.senderName}
            </span>{" "}
            in {acceptedPkg.from} and deliver to {acceptedPkg.to}.
          </p>

          <div className="mb-8 w-full rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-sm text-muted-foreground">
                {acceptedPkg.id}
              </span>
              <span className="rounded-full bg-secondary/10 px-3 py-1 text-sm font-bold text-secondary">
                +{"₹"}{acceptedPkg.offerPrice}
              </span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center gap-1">
                  <div className="mt-1 h-3 w-3 rounded-full border-2 border-secondary bg-secondary/20" />
                  <div className="h-8 w-px bg-border" />
                  <div className="h-3 w-3 rounded-full border-2 border-primary bg-primary/20" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{acceptedPkg.from}</p>
                  <p className="mb-2 text-xs text-muted-foreground">Origin</p>
                  <p className="font-medium text-foreground">{acceptedPkg.to}</p>
                  <p className="text-xs text-muted-foreground">Destination</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setView("requests")
                setAcceptedPkg(null)
              }}
            >
              Back to Requests
            </Button>
            <Button
              className="flex-1 gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90"
              asChild
            >
              <Link href="/track">
                Start Delivery
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ---- Active Trips / Package Requests ----
  if (view === "requests") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <button
          onClick={() => setView("posted")}
          className="mb-6 flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to trip
        </button>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Pending Requests
            </h2>
            <p className="text-sm text-muted-foreground">
              {originCity} <ArrowRight className="mx-0.5 inline h-3.5 w-3.5" />{" "}
              {destCity} &middot; {mockPackageRequests.length} parcels
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-secondary/10 px-3 py-1 text-sm font-semibold text-secondary">
            <Package className="h-3.5 w-3.5" />
            {mockPackageRequests.length} open
          </div>
        </div>

        <div className="space-y-3">
          {mockPackageRequests.map((pkg) => (
            <div
              key={pkg.id}
              className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-secondary/40 hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                {/* Sender avatar */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-foreground">
                  {pkg.senderName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="font-bold text-foreground">
                      {pkg.senderName}
                    </h3>
                    <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 text-secondary" />
                      {pkg.senderRating}
                    </span>
                  </div>

                  <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {pkg.postedAgo}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      {pkg.itemType}
                    </span>
                    <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      {pkg.weight}
                    </span>
                    <span className="rounded-md bg-secondary/10 px-2.5 py-1 text-xs font-medium text-secondary">
                      {pkg.trunkNeeded} Space
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  <p className="text-xl font-bold text-foreground">
                    <span className="text-secondary">{"₹"}</span>
                    {pkg.offerPrice}
                  </p>
                  <Button
                    size="sm"
                    className="gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => {
                      setAcceptedPkg(pkg)
                      setView("accepted")
                    }}
                  >
                    Accept
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ---- Posted Success ----
  if (view === "posted") {
    return (
      <div className="mx-auto max-w-lg px-4 py-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary/10">
            <CheckCircle2 className="h-10 w-10 text-secondary" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-foreground">Trip Posted!</h2>
          <p className="mb-8 text-muted-foreground">
            Your trip from{" "}
            <span className="font-semibold text-foreground">{originCity}</span>{" "}
            to{" "}
            <span className="font-semibold text-foreground">{destCity}</span>{" "}
            is now live. Senders along your route can book you.
          </p>

          <div className="mb-8 w-full rounded-xl border border-border bg-card p-5">
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center gap-1">
                  <div className="mt-1 h-3 w-3 rounded-full border-2 border-secondary bg-secondary/20" />
                  <div className="h-8 w-px bg-border" />
                  <div className="h-3 w-3 rounded-full border-2 border-primary bg-primary/20" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{originCity}</p>
                  <p className="mb-2 text-xs text-muted-foreground">
                    Departing at {travelTime}
                  </p>
                  <p className="font-medium text-foreground">{destCity}</p>
                  <p className="text-xs text-muted-foreground">
                    {travelDate &&
                      new Date(travelDate).toLocaleDateString("en-IN", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                  </p>
                </div>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vehicle</span>
                <span className="font-medium text-foreground capitalize">
                  {vehicleType}
                </span>
              </div>
            </div>
          </div>

          <div className="flex w-full gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setView("form")}
            >
              Edit Trip
            </Button>
            <Button
              className="flex-1 gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90"
              onClick={() => setView("requests")}
            >
              View Requests
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ---- Post a Trip Form ----
  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h2 className="mb-1 text-2xl font-bold text-foreground">Post a Trip</h2>
      <p className="mb-8 text-muted-foreground">
        Tell us your route and earn by carrying parcels along the way.
      </p>

      <div className="space-y-5">
        {/* Origin City */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <MapPin className="h-4 w-4 text-secondary" />
            Origin City
          </Label>
          <div className="relative">
            <select
              value={originCity}
              onChange={(e) => setOriginCity(e.target.value)}
              className="w-full appearance-none rounded-xl border border-input bg-card px-4 py-3 pr-10 text-sm text-foreground transition-colors focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
            >
              <option value="">Select origin city</option>
              {indianCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        {/* Destination City */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            Destination City
          </Label>
          <div className="relative">
            <select
              value={destCity}
              onChange={(e) => setDestCity(e.target.value)}
              className="w-full appearance-none rounded-xl border border-input bg-card px-4 py-3 pr-10 text-sm text-foreground transition-colors focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
            >
              <option value="">Select destination city</option>
              {indianCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        {/* Date & Time Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <CalendarDays className="h-4 w-4 text-secondary" />
              Travel Date
            </Label>
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground transition-colors focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Clock className="h-4 w-4 text-primary" />
              Departure Time
            </Label>
            <input
              type="time"
              value={travelTime}
              onChange={(e) => setTravelTime(e.target.value)}
              className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground transition-colors focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
            />
          </div>
        </div>

        {/* Vehicle Type */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Car className="h-4 w-4 text-secondary" />
            Vehicle Type
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "car", label: "Car", Icon: Car },
              { value: "bus", label: "Bus", Icon: Bus },
              { value: "train", label: "Train", Icon: Train },
            ].map(({ value, label, Icon }) => (
              <button
                key={value}
                onClick={() => setVehicleType(value)}
                className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                  vehicleType === value
                    ? "border-secondary bg-secondary/5 text-foreground ring-2 ring-secondary/20"
                    : "border-input text-muted-foreground hover:border-secondary/40 hover:text-foreground"
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <Button
          className="mt-2 h-13 w-full gap-2 rounded-xl bg-secondary text-base font-semibold text-secondary-foreground hover:bg-secondary/90 disabled:opacity-50"
          disabled={!canPost}
          onClick={() => setView("posted")}
        >
          Post My Trip
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
