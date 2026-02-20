"use client"

import { useState } from "react"
import { MapPin, Package, IndianRupee, Clock, ChevronRight, CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface DeliveryItem {
  id: string
  earnings: number
  pickupArea: string
  dropoffArea: string
  itemType: string
  itemSize: string
  weight: string
  postedAgo: string
  senderRating: number
}

const availableDeliveries: DeliveryItem[] = [
  {
    id: "RD-2026-0847",
    earnings: 150,
    pickupArea: "Tumkur Bus Stand",
    dropoffArea: "Majestic (Kempegowda Bus Station)",
    itemType: "Document / Envelope",
    itemSize: "Small",
    weight: "Under 500g",
    postedAgo: "5 min ago",
    senderRating: 4.8,
  },
  {
    id: "RD-2026-0848",
    earnings: 200,
    pickupArea: "Tumkur City Center",
    dropoffArea: "Koramangala",
    itemType: "Small Box",
    itemSize: "Medium",
    weight: "1kg - 2kg",
    postedAgo: "12 min ago",
    senderRating: 4.9,
  },
  {
    id: "RD-2026-0849",
    earnings: 100,
    pickupArea: "Siddaganga Matha",
    dropoffArea: "Yeshwantpur",
    itemType: "Keys / Small Items",
    itemSize: "Tiny",
    weight: "Under 500g",
    postedAgo: "18 min ago",
    senderRating: 5.0,
  },
  {
    id: "RD-2026-0850",
    earnings: 220,
    pickupArea: "Kyatsandra",
    dropoffArea: "Electronic City",
    itemType: "Medium Box",
    itemSize: "Medium",
    weight: "2kg - 5kg",
    postedAgo: "25 min ago",
    senderRating: 4.7,
  },
  {
    id: "RD-2026-0851",
    earnings: 160,
    pickupArea: "Tumkur Railway Station",
    dropoffArea: "Indiranagar",
    itemType: "Small Box",
    itemSize: "Small",
    weight: "500g - 1kg",
    postedAgo: "32 min ago",
    senderRating: 4.6,
  },
]

export function DeliveryList() {
  const [acceptedId, setAcceptedId] = useState<string | null>(null)

  if (acceptedId) {
    const delivery = availableDeliveries.find((d) => d.id === acceptedId)
    if (!delivery) return null

    return (
      <div className="mx-auto max-w-lg px-4 py-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary/10">
            <CheckCircle2 className="h-10 w-10 text-secondary" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-foreground">Delivery Accepted!</h2>
          <p className="mb-8 text-muted-foreground">
            Pick up the parcel from <span className="font-semibold text-foreground">{delivery.pickupArea}</span> and deliver to <span className="font-semibold text-foreground">{delivery.dropoffArea}</span>.
          </p>

          <div className="mb-8 w-full rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-sm text-muted-foreground">{delivery.id}</span>
              <span className="rounded-full bg-secondary/10 px-3 py-1 text-sm font-bold text-secondary">
                +{"₹"}{delivery.earnings}
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
                  <p className="font-medium text-foreground">{delivery.pickupArea}</p>
                  <p className="mb-2 text-xs text-muted-foreground">Tumkur</p>
                  <p className="font-medium text-foreground">{delivery.dropoffArea}</p>
                  <p className="text-xs text-muted-foreground">Bengaluru</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setAcceptedId(null)}>
              Back to List
            </Button>
            <Button className="flex-1 gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90" asChild>
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

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Available Deliveries</h2>
          <p className="text-sm text-muted-foreground">Tumkur — Bengaluru route</p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-secondary/10 px-3 py-1 text-sm font-semibold text-secondary">
          <Package className="h-3.5 w-3.5" />
          {availableDeliveries.length} open
        </div>
      </div>

      <div className="space-y-3">
        {availableDeliveries.map((delivery) => (
          <div
            key={delivery.id}
            className="group rounded-xl border border-border bg-card p-4 transition-all hover:border-secondary/40 hover:shadow-md"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-full bg-secondary/10 px-3 py-1 text-sm font-bold text-secondary">
                +{"₹"}{delivery.earnings}
              </span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {delivery.postedAgo}
              </div>
            </div>

            <div className="mb-3 flex items-start gap-3">
              <div className="flex flex-col items-center gap-1">
                <div className="mt-1 h-2.5 w-2.5 rounded-full border-2 border-secondary" />
                <div className="h-5 w-px bg-border" />
                <div className="h-2.5 w-2.5 rounded-full border-2 border-primary" />
              </div>
              <div className="flex-1 text-sm">
                <p className="font-medium text-foreground">{delivery.pickupArea}</p>
                <p className="mt-1 font-medium text-foreground">{delivery.dropoffArea}</p>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                {delivery.itemType}
              </span>
              <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                {delivery.weight}
              </span>
            </div>

            <Button
              className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setAcceptedId(delivery.id)}
            >
              Accept Delivery
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
