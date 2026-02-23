"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [otpMode, setOtpMode] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
    } else {
      router.push("/dashboard")
      router.refresh()
    }
    setIsLoading(false)
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    })
    if (error) {
      setError(error.message)
    } else {
      setOtpSent(true)
    }
    setIsLoading(false)
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    })
    if (error) {
      setError(error.message)
    } else {
      router.push("/dashboard")
      router.refresh()
    }
    setIsLoading(false)
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-primary-foreground/10 bg-card p-8 shadow-2xl">
      <h1 className="mb-1 text-2xl font-bold text-foreground">Welcome back</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Sign in to your RouteDrop account
      </p>

      {/* Mode toggle */}
      <div className="mb-6 flex rounded-xl bg-muted p-1">
        <button
          onClick={() => { setOtpMode(false); setError(null); setOtpSent(false) }}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
            !otpMode ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Password
        </button>
        <button
          onClick={() => { setOtpMode(true); setError(null); setOtpSent(false) }}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
            otpMode ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Email OTP
        </button>
      </div>

      {/* Password login */}
      {!otpMode && (
        <form onSubmit={handlePasswordLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </p>
          )}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </form>
      )}

      {/* OTP login */}
      {otpMode && !otpSent && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
              />
            </div>
          </div>
          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </p>
          )}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Send OTP
          </Button>
        </form>
      )}

      {otpMode && otpSent && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <p className="rounded-lg bg-secondary/10 px-3 py-2 text-xs text-secondary">
            A 6-digit code was sent to <strong>{email}</strong>
          </p>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">One-time code</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="_ _ _ _ _ _"
              className="w-full rounded-xl border border-input bg-background py-3 text-center font-mono text-lg tracking-widest text-foreground focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
            />
          </div>
          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </p>
          )}
          <Button
            type="submit"
            disabled={isLoading || otp.length < 6}
            className="w-full gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Verify & Sign In
          </Button>
          <button
            type="button"
            onClick={() => setOtpSent(false)}
            className="w-full text-xs text-muted-foreground hover:text-foreground"
          >
            Back
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-secondary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}
