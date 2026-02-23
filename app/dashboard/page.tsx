"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ShieldCheck, User, BadgeCheck, Loader2, CheckCircle2,
  AlertCircle, Package, LogOut, MapPin, Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/client"

interface UserProfile {
  id: string
  full_name: string | null
  kyc_status: "pending" | "submitted" | "verified" | "rejected"
  aadhaar_ref: string | null
  avatar_url: string | null
}

export default function DashboardPage() {
  const router = useRouter()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)

  // KYC form state
  const [aadhaar, setAadhaar] = useState("")
  const [kycLoading, setKycLoading] = useState(false)
  const [kycError, setKycError] = useState<string | null>(null)
  const [kycSuccess, setKycSuccess] = useState<string | null>(null)

  const loadProfile = useCallback(async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/login")
      return
    }

    setEmail(user.email ?? null)

    const { data } = await supabase
      .from("users")
      .select("id, full_name, kyc_status, aadhaar_ref, avatar_url")
      .eq("id", user.id)
      .single()

    setProfile(data as UserProfile)
    setLoadingProfile(false)
  }, [router])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  const handleKycSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setKycLoading(true)
    setKycError(null)
    setKycSuccess(null)

    const cleaned = aadhaar.replace(/\s|-/g, "")
    const res = await fetch("/api/kyc/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aadhaarNumber: cleaned }),
    })
    const json = await res.json()

    if (!res.ok) {
      setKycError(json.error ?? "Verification failed. Please try again.")
    } else {
      setKycSuccess(json.message)
      // Refresh profile to show updated KYC status
      await loadProfile()
    }
    setKycLoading(false)
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const formatAadhaar = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 12)
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ")
  }

  if (loadingProfile) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </main>
        <Footer />
      </div>
    )
  }

  const isVerified = profile?.kyc_status === "verified"
  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : email?.slice(0, 2).toUpperCase() ?? "RD"

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background px-4 py-8 md:py-12">
        <div className="mx-auto max-w-2xl space-y-6">

          {/* Profile card */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                {initials}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-foreground">
                    {profile?.full_name ?? "My Account"}
                  </h1>
                  {isVerified && (
                    <span title="KYC Verified" className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-secondary-foreground">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      Verified
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">{email}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* KYC section */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isVerified ? "bg-secondary/10" : "bg-muted"}`}>
                <ShieldCheck className={`h-5 w-5 ${isVerified ? "text-secondary" : "text-muted-foreground"}`} />
              </div>
              <div>
                <h2 className="font-bold text-foreground">Identity Verification (KYC)</h2>
                <p className="text-xs text-muted-foreground">
                  Required to post trips and accept deliveries
                </p>
              </div>
            </div>

            {isVerified ? (
              <div className="flex items-center gap-3 rounded-xl bg-secondary/10 p-4">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-secondary" />
                <div>
                  <p className="text-sm font-bold text-secondary">KYC Verified ✓</p>
                  <p className="text-xs text-muted-foreground">
                    Aadhaar: {profile?.aadhaar_ref ?? "on file"}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleKycSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Aadhaar Number
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      value={aadhaar}
                      onChange={(e) => setAadhaar(formatAadhaar(e.target.value))}
                      placeholder="XXXX XXXX XXXX"
                      maxLength={14} // 12 digits + 2 spaces
                      className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-4 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 tracking-widest focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Demo: any 12-digit number will succeed (e.g. 1234 5678 9012)
                  </p>
                </div>

                {kycError && (
                  <div className="flex items-start gap-2 rounded-xl bg-destructive/10 p-3">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                    <p className="text-xs text-destructive">{kycError}</p>
                  </div>
                )}
                {kycSuccess && (
                  <div className="flex items-start gap-2 rounded-xl bg-secondary/10 p-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                    <p className="text-xs text-secondary">{kycSuccess}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={kycLoading || aadhaar.replace(/\s/g, "").length < 12}
                  className="gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  {kycLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Verify Aadhaar
                </Button>
              </form>
            )}
          </div>

          {/* Quick actions */}
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/send"
              className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:border-secondary/40 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/5 group-hover:bg-secondary/10">
                <Package className="h-5 w-5 text-primary group-hover:text-secondary" />
              </div>
              <div>
                <p className="font-bold text-foreground">Send a Parcel</p>
                <p className="text-xs text-muted-foreground">Find a traveler on your route</p>
              </div>
            </Link>
            <Link
              href={isVerified ? "/travel" : "#"}
              onClick={!isVerified ? (e) => { e.preventDefault(); setKycError("Complete KYC to post a trip.") } : undefined}
              className={`group flex items-center gap-4 rounded-2xl border bg-card p-5 transition-all hover:shadow-md ${
                isVerified
                  ? "border-border hover:border-secondary/40"
                  : "cursor-not-allowed border-border opacity-60"
              }`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/5 group-hover:bg-secondary/10">
                <MapPin className="h-5 w-5 text-primary group-hover:text-secondary" />
              </div>
              <div>
                <p className="font-bold text-foreground">Post a Trip</p>
                <p className="text-xs text-muted-foreground">
                  {isVerified ? "Earn by carrying parcels" : "Requires KYC verification"}
                </p>
              </div>
            </Link>
            <Link
              href="/track"
              className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:border-secondary/40 hover:shadow-md sm:col-span-2"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/5 group-hover:bg-secondary/10">
                <Calendar className="h-5 w-5 text-primary group-hover:text-secondary" />
              </div>
              <div>
                <p className="font-bold text-foreground">Track Active Delivery</p>
                <p className="text-xs text-muted-foreground">View milestones and enter OTP</p>
              </div>
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
