"use client"

import { useState } from "react"
import { MapPin, Package, Weight, ChevronDown, IndianRupee, ShieldCheck, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const pickupLocations = [
  "Tumkur City Center",
  "Tumkur Bus Stand",
  "Tumkur Railway Station",
  "Siddaganga Matha",
  "Kyatsandra",
]

const dropoffLocations = [
  "Majestic (Kempegowda Bus Station)",
  "Yeshwantpur",
  "Rajajinagar",
  "Whitefield",
  "Electronic City",
  "Koramangala",
  "Indiranagar",
  "Hebbal",
]

const itemTypes = [
  { label: "Document / Envelope", value: "document", price: 120 },
  { label: "Small Box (up to 2kg)", value: "small-box", price: 180 },
  { label: "Keys / Small Items", value: "keys", price: 100 },
  { label: "Medium Box (2-5kg)", value: "medium-box", price: 250 },
]

const weightOptions = [
  { label: "Under 500g", value: "under-500g", multiplier: 1 },
  { label: "500g - 1kg", value: "500g-1kg", multiplier: 1.1 },
  { label: "1kg - 2kg", value: "1kg-2kg", multiplier: 1.2 },
  { label: "2kg - 5kg", value: "2kg-5kg", multiplier: 1.4 },
]

type BookingStep = "form" | "quote" | "payment" | "confirmed"

export function BookingForm() {
  const [step, setStep] = useState<BookingStep>("form")
  const [pickup, setPickup] = useState("")
  const [dropoff, setDropoff] = useState("")
  const [itemType, setItemType] = useState("")
  const [weight, setWeight] = useState("")

  const selectedItem = itemTypes.find((i) => i.value === itemType)
  const selectedWeight = weightOptions.find((w) => w.value === weight)
  const estimatedPrice = selectedItem && selectedWeight
    ? Math.round(selectedItem.price * selectedWeight.multiplier)
    : 0

  const canGetQuote = pickup && dropoff && itemType && weight

  if (step === "confirmed") {
    return (
      <div className="flex flex-col items-center px-4 py-16 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary/10">
          <ShieldCheck className="h-10 w-10 text-secondary" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-foreground">Booking Confirmed!</h2>
        <p className="mb-1 text-muted-foreground">Your parcel request has been posted.</p>
        <p className="mb-8 text-sm text-muted-foreground">A verified traveler will accept your delivery shortly.</p>
        <div className="mb-8 w-full max-w-sm rounded-xl border border-border bg-muted/50 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tracking ID</span>
            <span className="font-mono font-bold text-foreground">RD-2026-0847</span>
          </div>
          <div className="my-3 h-px bg-border" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Amount Held</span>
            <span className="font-bold text-secondary">{"₹"}{estimatedPrice}</span>
          </div>
        </div>
        <Button
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
          onClick={() => { setStep("form"); setPickup(""); setDropoff(""); setItemType(""); setWeight("") }}
        >
          Book Another Delivery
        </Button>
      </div>
    )
  }

  if (step === "payment") {
    return (
      <div className="mx-auto max-w-lg px-4 py-8">
        <h2 className="mb-1 text-2xl font-bold text-foreground">Secure Payment</h2>
        <p className="mb-8 text-muted-foreground">Funds are held in escrow until delivery is confirmed.</p>

        <div className="mb-6 rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
              <ShieldCheck className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Escrow Protected</p>
              <p className="text-xs text-muted-foreground">Money released only after OTP confirmation</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery Charge</span>
              <span className="text-foreground">{"₹"}{estimatedPrice}</span>
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
              <span className="text-foreground">{"₹"}{estimatedPrice + 20}</span>
            </div>
          </div>
        </div>

        {/* Mock payment methods */}
        <div className="mb-6 space-y-3">
          <p className="text-sm font-semibold text-foreground">Payment Method</p>
          {["UPI (GPay / PhonePe)", "Debit / Credit Card", "Net Banking"].map((method, i) => (
            <label
              key={method}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all ${
                i === 0 ? "border-secondary bg-secondary/5" : "border-border hover:border-secondary/40"
              }`}
            >
              <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                i === 0 ? "border-secondary" : "border-muted-foreground/40"
              }`}>
                {i === 0 && <div className="h-2.5 w-2.5 rounded-full bg-secondary" />}
              </div>
              <span className="text-sm font-medium text-foreground">{method}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setStep("quote")}>
            Back
          </Button>
          <Button
            className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
            onClick={() => setStep("confirmed")}
          >
            Pay {"₹"}{estimatedPrice + 20}
          </Button>
        </div>
      </div>
    )
  }

  if (step === "quote") {
    return (
      <div className="mx-auto max-w-lg px-4 py-8">
        <h2 className="mb-1 text-2xl font-bold text-foreground">Your Quote</h2>
        <p className="mb-8 text-muted-foreground">Review your delivery details and pricing.</p>

        <div className="mb-6 rounded-xl border border-border bg-card p-5">
          {/* Route */}
          <div className="mb-5 flex items-start gap-3">
            <div className="flex flex-col items-center gap-1">
              <div className="mt-1 h-3 w-3 rounded-full border-2 border-secondary bg-secondary/20" />
              <div className="h-8 w-px bg-border" />
              <div className="h-3 w-3 rounded-full border-2 border-primary bg-primary/20" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{pickup}</p>
              <p className="mb-2 text-xs text-muted-foreground">Tumkur</p>
              <p className="text-sm font-medium text-foreground">{dropoff}</p>
              <p className="text-xs text-muted-foreground">Bengaluru</p>
            </div>
          </div>
          <div className="h-px bg-border" />
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Item Type</span>
              <span className="text-foreground">{selectedItem?.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Weight</span>
              <span className="text-foreground">{selectedWeight?.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Est. Delivery</span>
              <span className="font-medium text-secondary">~2 hours</span>
            </div>
          </div>
        </div>

        {/* Price card */}
        <div className="mb-8 flex items-center justify-between rounded-xl border-2 border-secondary/30 bg-secondary/5 p-5">
          <div>
            <p className="text-sm text-muted-foreground">Estimated Price</p>
            <p className="text-3xl font-bold text-foreground">
              <span className="text-secondary">{"₹"}</span>{estimatedPrice}
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
            <ShieldCheck className="h-3.5 w-3.5" />
            Escrow Protected
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setStep("form")}>
            Edit Details
          </Button>
          <Button
            className="flex-1 gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90"
            onClick={() => setStep("payment")}
          >
            Proceed to Pay
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h2 className="mb-1 text-2xl font-bold text-foreground">Send a Package</h2>
      <p className="mb-8 text-muted-foreground">Tumkur to Bengaluru, delivered by daily commuters.</p>

      <div className="space-y-5">
        {/* Pickup Location */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <MapPin className="h-4 w-4 text-secondary" />
            Pickup Location
          </Label>
          <div className="relative">
            <select
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="w-full appearance-none rounded-xl border border-input bg-card px-4 py-3 pr-10 text-sm text-foreground transition-colors focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
            >
              <option value="">Select pickup area in Tumkur</option>
              {pickupLocations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        {/* Drop-off Location */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            Drop-off Location
          </Label>
          <div className="relative">
            <select
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
              className="w-full appearance-none rounded-xl border border-input bg-card px-4 py-3 pr-10 text-sm text-foreground transition-colors focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
            >
              <option value="">Select drop-off area in Bengaluru</option>
              {dropoffLocations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        {/* Item Type */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Package className="h-4 w-4 text-secondary" />
            Item Type
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {itemTypes.map((item) => (
              <button
                key={item.value}
                onClick={() => setItemType(item.value)}
                className={`rounded-xl border p-3 text-left text-sm transition-all ${
                  itemType === item.value
                    ? "border-secondary bg-secondary/5 text-foreground ring-2 ring-secondary/20"
                    : "border-input text-muted-foreground hover:border-secondary/40 hover:text-foreground"
                }`}
              >
                <span className="font-medium">{item.label}</span>
                <span className="mt-1 block text-xs text-muted-foreground">from {"₹"}{item.price}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Weight */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Weight className="h-4 w-4 text-primary" />
            Approximate Weight
          </Label>
          <div className="relative">
            <select
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full appearance-none rounded-xl border border-input bg-card px-4 py-3 pr-10 text-sm text-foreground transition-colors focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
            >
              <option value="">Select weight range</option>
              {weightOptions.map((w) => (
                <option key={w.value} value={w.value}>{w.label}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        {/* Instant Quote Preview */}
        {canGetQuote && (
          <div className="flex items-center justify-between rounded-xl border-2 border-secondary/30 bg-secondary/5 p-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Instant Quote</p>
              <p className="text-2xl font-bold text-foreground">
                <span className="text-secondary">{"₹"}</span>{estimatedPrice}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-secondary">
              <IndianRupee className="h-3.5 w-3.5" />
              Fixed Price
            </div>
          </div>
        )}

        <Button
          className="mt-2 h-13 w-full gap-2 rounded-xl bg-secondary text-base font-semibold text-secondary-foreground hover:bg-secondary/90 disabled:opacity-50"
          disabled={!canGetQuote}
          onClick={() => setStep("quote")}
        >
          Get Full Quote
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
