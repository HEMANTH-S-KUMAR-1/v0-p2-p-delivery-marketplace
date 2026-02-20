"use client"

import { useState } from "react"
import {
  PackageOpen, Route, MapPinCheck, KeyRound,
  CheckCircle2, Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Milestone {
  id: number
  label: string
  description: string
  icon: typeof PackageOpen
  buttonText: string
}

const milestones: Milestone[] = [
  {
    id: 1,
    label: "Picked Up",
    description: "Parcel collected from the sender",
    icon: PackageOpen,
    buttonText: "Confirm Pickup",
  },
  {
    id: 2,
    label: "In Transit",
    description: "En route to destination city",
    icon: Route,
    buttonText: "Mark In Transit",
  },
  {
    id: 3,
    label: "Reached Destination City",
    description: "Arrived in the destination city",
    icon: MapPinCheck,
    buttonText: "Mark Arrived",
  },
  {
    id: 4,
    label: "Delivered (Enter OTP)",
    description: "Confirm delivery with receiver OTP",
    icon: KeyRound,
    buttonText: "Enter OTP & Complete",
  },
]

export function MilestoneTracker() {
  const [currentStep, setCurrentStep] = useState(0)
  const [otpValue, setOtpValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [completed, setCompleted] = useState(false)

  const handleAdvance = (stepId: number) => {
    if (stepId === 4) {
      if (otpValue.length !== 4) return
      setIsLoading(true)
      setTimeout(() => {
        setCurrentStep(4)
        setIsLoading(false)
        setCompleted(true)
      }, 1500)
      return
    }
    setCurrentStep(stepId)
  }

  if (completed) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-secondary/10">
            <CheckCircle2 className="h-12 w-12 text-secondary" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-foreground">
            Delivery Complete!
          </h2>
          <p className="mb-2 text-muted-foreground">
            The parcel has been successfully delivered.
          </p>
          <p className="mb-8 text-sm text-muted-foreground">
            Payment of{" "}
            <span className="font-bold text-secondary">{"₹"}250</span> has been
            released from escrow.
          </p>

          <div className="mb-8 w-full rounded-xl border border-border bg-card p-5">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tracking ID</span>
                <span className="font-mono font-bold text-foreground">
                  RD-2026-0847
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Route</span>
                <span className="text-foreground">Mumbai → Pune</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="text-foreground">3h 12m</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between font-bold">
                <span className="text-foreground">Earnings</span>
                <span className="text-secondary">{"₹"}250</span>
              </div>
            </div>
          </div>

          <div className="flex w-full gap-3">
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/">Home</Link>
            </Button>
            <Button
              className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
              asChild
            >
              <Link href="/travel">View More Deliveries</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Active Delivery</h2>
        <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-bold text-secondary">
          Live
        </span>
      </div>
      <p className="mb-8 text-sm text-muted-foreground">
        Tracking ID:{" "}
        <span className="font-mono font-semibold text-foreground">
          RD-2026-0847
        </span>
      </p>

      {/* Route summary card */}
      <div className="mb-8 rounded-xl border border-border bg-card p-4">
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center gap-1">
            <div className="mt-1 h-3 w-3 rounded-full border-2 border-secondary bg-secondary/20" />
            <div className="h-8 w-px bg-border" />
            <div className="h-3 w-3 rounded-full border-2 border-primary bg-primary/20" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Mumbai</p>
            <p className="mb-2 text-xs text-muted-foreground">Origin</p>
            <p className="text-sm font-medium text-foreground">Pune</p>
            <p className="text-xs text-muted-foreground">Destination</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-secondary">+{"₹"}250</p>
            <p className="text-xs text-muted-foreground">Small Box</p>
          </div>
        </div>
      </div>

      {/* Milestone tracker */}
      <div className="space-y-0">
        {milestones.map((milestone, index) => {
          const isDone = currentStep >= milestone.id
          const isCurrent = currentStep === milestone.id - 1
          const isFuture = currentStep < milestone.id - 1

          return (
            <div key={milestone.id} className="relative flex gap-4">
              {/* Vertical line + icon */}
              <div className="flex flex-col items-center">
                <div
                  className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                    isDone
                      ? "border-secondary bg-secondary text-secondary-foreground"
                      : isCurrent
                        ? "border-secondary bg-secondary/10 text-secondary"
                        : "border-border bg-muted text-muted-foreground"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <milestone.icon className="h-5 w-5" />
                  )}
                </div>
                {index < milestones.length - 1 && (
                  <div
                    className={`h-full w-0.5 transition-colors ${
                      isDone ? "bg-secondary" : "bg-border"
                    }`}
                    style={{ minHeight: "60px" }}
                  />
                )}
              </div>

              {/* Content */}
              <div
                className={`flex-1 pb-8 ${
                  index === milestones.length - 1 ? "pb-0" : ""
                }`}
              >
                <p
                  className={`text-sm font-bold ${
                    isDone
                      ? "text-secondary"
                      : isCurrent
                        ? "text-foreground"
                        : "text-muted-foreground"
                  }`}
                >
                  {milestone.label}
                </p>
                <p className="mb-3 text-xs text-muted-foreground">
                  {milestone.description}
                </p>

                {/* OTP Input for last step */}
                {isCurrent && milestone.id === 4 && (
                  <div className="mb-3">
                    <label className="mb-1.5 block text-xs font-semibold text-foreground">
                      Enter 4-digit OTP from receiver
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={otpValue}
                      onChange={(e) =>
                        setOtpValue(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="_ _ _ _"
                      className="w-32 rounded-lg border border-input bg-card px-4 py-2.5 text-center font-mono text-lg tracking-[0.5em] text-foreground transition-colors focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                    />
                  </div>
                )}

                {isCurrent && (
                  <Button
                    size="sm"
                    className="gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90 disabled:opacity-50"
                    onClick={() => handleAdvance(milestone.id)}
                    disabled={
                      isLoading ||
                      (milestone.id === 4 && otpValue.length !== 4)
                    }
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      milestone.buttonText
                    )}
                  </Button>
                )}

                {isDone && (
                  <span className="text-xs font-medium text-secondary">
                    Completed
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
