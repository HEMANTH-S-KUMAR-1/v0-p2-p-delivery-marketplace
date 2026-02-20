"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import {
  MapPin, Clock, Star, Package, ShieldCheck, ArrowRight,
  ChevronRight, Car, Train, Bus, User, ArrowLeft, IndianRupee,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface TravelerResult {
  id: string
  name: string
  rating: number
  trips: number
  verified: boolean
  departureTime: string
  vehicleType: "car" | "bus" | "train"
  trunkSpace: "Small" | "Medium" | "Large"
  askingPrice: number
  avatar: string
}

const vehicleIcons = {
  car: Car,
  bus: Bus,
  train: Train,
}

const vehicleLabels = {
  car: "Car",
  bus: "Bus",
  train: "Train",
}

const trunkColors: Record<string, string> = {
  Small: "bg-muted text-muted-foreground",
  Medium: "bg-secondary/10 text-secondary",
  Large: "bg-primary/10 text-primary",
}

function getMockTravelers(from: string, to: string): TravelerResult[] {
  return [
    {
      id: "T-001",
      name: "Rahul Sharma",
      rating: 4.9,
      trips: 127,
      verified: true,
      departureTime: "06:30 AM",
      vehicleType: "car",
      trunkSpace: "Large",
      askingPrice: 250,
      avatar: "RS",
    },
    {
      id: "T-002",
      name: "Priya Nair",
      rating: 4.8,
      trips: 84,
      verified: true,
      departureTime: "07:15 AM",
      vehicleType: "bus",
      trunkSpace: "Medium",
      askingPrice: 150,
      avatar: "PN",
    },
    {
      id: "T-003",
      name: "Amit Patel",
      rating: 5.0,
      trips: 203,
      verified: true,
      departureTime: "08:00 AM",
      vehicleType: "train",
      trunkSpace: "Small",
      askingPrice: 120,
      avatar: "AP",
    },
    {
      id: "T-004",
      name: "Sneha Reddy",
      rating: 4.7,
      trips: 56,
      verified: true,
      departureTime: "09:45 AM",
      vehicleType: "car",
      trunkSpace: "Large",
      askingPrice: 280,
      avatar: "SR",
    },
    {
      id: "T-005",
      name: "Vikram Singh",
      rating: 4.6,
      trips: 42,
      verified: true,
      departureTime: "10:30 AM",
      vehicleType: "bus",
      trunkSpace: "Medium",
      askingPrice: 180,
      avatar: "VS",
    },
  ]
}

type FlowStep = "results" | "checkout" | "confirmed"

export function BookingForm() {
  const searchParams = useSearchParams()
  const from = searchParams.get("from") || "Mumbai"
  const to = searchParams.get("to") || "Pune"
  const date = searchParams.get("date") || "2026-02-21"

  const [step, setStep] = useState<FlowStep>("results")
  const [selectedTraveler, setSelectedTraveler] = useState<TravelerResult | null>(null)

  const travelers = getMockTravelers(from, to)

  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
      })
    : "Tomorrow"

  // --- Confirmed ---
  if (step === "confirmed" && selectedTraveler) {
    return (
      <div className="flex flex-col items-center px-4 py-16 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary/10">
          <ShieldCheck className="h-10 w-10 text-secondary" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-foreground">Booking Confirmed!</h2>
        <p className="mb-1 text-muted-foreground">
          {selectedTraveler.name} will carry your parcel from {from} to {to}.
        </p>
        <p className="mb-8 text-sm text-muted-foreground">
          You will be notified once the traveler picks up your package.
        </p>
        <div className="mb-8 w-full max-w-sm rounded-xl border border-border bg-muted/50 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tracking ID</span>
            <span className="font-mono font-bold text-foreground">RD-2026-0847</span>
          </div>
          <div className="my-3 h-px bg-border" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Escrow Amount</span>
            <span className="font-bold text-secondary">
              {"₹"}{selectedTraveler.askingPrice + 20}
            </span>
          </div>
        </div>
        <div className="flex w-full max-w-sm gap-3">
          <Button variant="outline" className="flex-1" asChild>
            <Link href="/track">Track Delivery</Link>
          </Button>
          <Button
            className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
            onClick={() => {
              setStep("results")
              setSelectedTraveler(null)
            }}
          >
            New Search
          </Button>
        </div>
      </div>
    )
  }

  // --- Checkout ---
  if (step === "checkout" && selectedTraveler) {
    const VehicleIcon = vehicleIcons[selectedTraveler.vehicleType]
    return (
      <div className="mx-auto max-w-lg px-4 py-8">
        <button
          onClick={() => setStep("results")}
          className="mb-6 flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to results
        </button>

        <h2 className="mb-1 text-2xl font-bold text-foreground">
          Book {selectedTraveler.name}
        </h2>
        <p className="mb-8 text-muted-foreground">
          Funds are held in escrow until delivery is confirmed via OTP.
        </p>

        {/* Traveler summary */}
        <div className="mb-6 rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {selectedTraveler.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-bold text-foreground">{selectedTraveler.name}</p>
                {selectedTraveler.verified && (
                  <ShieldCheck className="h-4 w-4 text-secondary" />
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-secondary" />
                  {selectedTraveler.rating}
                </span>
                <span>{selectedTraveler.trips} trips</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center gap-1">
                <div className="mt-1 h-3 w-3 rounded-full border-2 border-secondary bg-secondary/20" />
                <div className="h-8 w-px bg-border" />
                <div className="h-3 w-3 rounded-full border-2 border-primary bg-primary/20" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{from}</p>
                <p className="mb-2 text-xs text-muted-foreground">
                  Departing {selectedTraveler.departureTime}
                </p>
                <p className="font-medium text-foreground">{to}</p>
                <p className="text-xs text-muted-foreground">{formattedDate}</p>
              </div>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vehicle</span>
              <span className="flex items-center gap-1.5 text-foreground">
                <VehicleIcon className="h-3.5 w-3.5" />
                {vehicleLabels[selectedTraveler.vehicleType]}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trunk Space</span>
              <span className="text-foreground">{selectedTraveler.trunkSpace}</span>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-6 rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
              <ShieldCheck className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Escrow Protected</p>
              <p className="text-xs text-muted-foreground">
                Money released only after OTP confirmation
              </p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery Charge</span>
              <span className="text-foreground">
                {"₹"}{selectedTraveler.askingPrice}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Platform Fee</span>
              <span className="text-foreground">{"₹"}20</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Insurance</span>
              <span className="text-secondary">Free</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between font-bold">
              <span className="text-foreground">Total</span>
              <span className="text-foreground">
                {"₹"}{selectedTraveler.askingPrice + 20}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-6 space-y-3">
          <p className="text-sm font-semibold text-foreground">Payment Method</p>
          {["UPI (GPay / PhonePe)", "Debit / Credit Card", "Net Banking"].map(
            (method, i) => (
              <label
                key={method}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all ${
                  i === 0
                    ? "border-secondary bg-secondary/5"
                    : "border-border hover:border-secondary/40"
                }`}
              >
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    i === 0 ? "border-secondary" : "border-muted-foreground/40"
                  }`}
                >
                  {i === 0 && (
                    <div className="h-2.5 w-2.5 rounded-full bg-secondary" />
                  )}
                </div>
                <span className="text-sm font-medium text-foreground">{method}</span>
              </label>
            )
          )}
        </div>

        <Button
          className="h-13 w-full gap-2 rounded-xl bg-secondary text-base font-semibold text-secondary-foreground hover:bg-secondary/90"
          onClick={() => setStep("confirmed")}
        >
          <IndianRupee className="h-4 w-4" />
          Pay {"₹"}{selectedTraveler.askingPrice + 20} (Escrow)
        </Button>
      </div>
    )
  }

  // --- Search Results ---
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Route header */}
      <div className="mb-6">
        <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            href="/"
            className="transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">Search Results</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          {from} <ArrowRight className="mx-1 inline h-5 w-5 text-muted-foreground" /> {to}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {formattedDate} &middot; {travelers.length} travelers available
        </p>
      </div>

      {/* Filters row */}
      <div className="mb-6 flex flex-wrap gap-2">
        {["All", "Car", "Bus", "Train"].map((filter, i) => (
          <button
            key={filter}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              i === 0
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Traveler cards */}
      <div className="space-y-3">
        {travelers.map((traveler) => {
          const VehicleIcon = vehicleIcons[traveler.vehicleType]
          return (
            <div
              key={traveler.id}
              className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-secondary/40 hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {traveler.avatar}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="font-bold text-foreground">{traveler.name}</h3>
                    {traveler.verified && (
                      <ShieldCheck className="h-4 w-4 shrink-0 text-secondary" />
                    )}
                  </div>
                  <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-secondary" />
                      {traveler.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {traveler.trips} trips
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {traveler.departureTime}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      <VehicleIcon className="h-3.5 w-3.5" />
                      {vehicleLabels[traveler.vehicleType]}
                    </span>
                    <span
                      className={`rounded-md px-2.5 py-1 text-xs font-medium ${trunkColors[traveler.trunkSpace]}`}
                    >
                      <Package className="mr-1 inline h-3 w-3" />
                      {traveler.trunkSpace} Space
                    </span>
                  </div>
                </div>

                {/* Price + Book */}
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <p className="text-xl font-bold text-foreground">
                    <span className="text-secondary">{"₹"}</span>
                    {traveler.askingPrice}
                  </p>
                  <Button
                    size="sm"
                    className="gap-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    onClick={() => {
                      setSelectedTraveler(traveler)
                      setStep("checkout")
                    }}
                  >
                    Book
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
