import Link from "next/link"
import { ArrowRight, Package, Car } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-primary px-4 pb-20 pt-16 md:pb-28 md:pt-24">
      {/* Background pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-sm text-primary-foreground">
            <span className="h-2 w-2 rounded-full bg-secondary" />
            Now serving Tumkur — Bengaluru route
          </div>

          {/* Headline */}
          <h1 className="mb-6 max-w-3xl text-balance text-4xl font-bold leading-tight tracking-tight text-primary-foreground md:text-6xl md:leading-[1.1]">
            Send Parcels from Tumkur to Bengaluru{" "}
            <span className="text-secondary">in 2 Hours</span>
          </h1>

          {/* Subheadline */}
          <p className="mb-10 max-w-xl text-pretty text-lg leading-relaxed text-primary-foreground/70 md:text-xl">
            Connect with verified daily commuters. Fast, affordable, and secure peer-to-peer delivery for your urgent packages.
          </p>

          {/* CTAs */}
          <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="h-14 w-full gap-3 rounded-xl bg-secondary px-8 text-base font-semibold text-secondary-foreground shadow-lg transition-all hover:bg-secondary/90 hover:shadow-xl sm:w-auto"
              asChild
            >
              <Link href="/send">
                <Package className="h-5 w-5" />
                Send a Package
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 w-full gap-3 rounded-xl border-primary-foreground/30 bg-transparent px-8 text-base font-semibold text-primary-foreground transition-all hover:bg-primary-foreground/10 hover:text-primary-foreground sm:w-auto"
              asChild
            >
              <Link href="/travel">
                <Car className="h-5 w-5" />
                {"I'm Driving (Earn Money)"}
              </Link>
            </Button>
          </div>

          {/* Stats bar */}
          <div className="mt-14 grid w-full max-w-xl grid-cols-3 divide-x divide-primary-foreground/10 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-4 backdrop-blur md:mt-20">
            <div className="flex flex-col items-center px-2">
              <span className="text-2xl font-bold text-secondary md:text-3xl">500+</span>
              <span className="mt-1 text-xs text-primary-foreground/60 md:text-sm">Deliveries Done</span>
            </div>
            <div className="flex flex-col items-center px-2">
              <span className="text-2xl font-bold text-secondary md:text-3xl">2 Hrs</span>
              <span className="mt-1 text-xs text-primary-foreground/60 md:text-sm">Avg. Delivery</span>
            </div>
            <div className="flex flex-col items-center px-2">
              <span className="text-2xl font-bold text-secondary md:text-3xl">4.9</span>
              <span className="mt-1 text-xs text-primary-foreground/60 md:text-sm">User Rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
