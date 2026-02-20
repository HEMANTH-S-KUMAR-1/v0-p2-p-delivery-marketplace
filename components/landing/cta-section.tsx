import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="bg-primary px-4 py-20 md:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl">
          Ready to Send Your First Parcel?
        </h2>
        <p className="mb-10 text-lg leading-relaxed text-primary-foreground/70">
          Join thousands of users who trust RouteDrop for fast, affordable peer-to-peer deliveries across India.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            className="h-14 gap-2 rounded-xl bg-secondary px-8 text-base font-semibold text-secondary-foreground hover:bg-secondary/90"
            asChild
          >
            <Link href="/send">
              Get Started Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-14 rounded-xl border-primary-foreground/30 bg-transparent px-8 text-base font-semibold text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            asChild
          >
            <Link href="/travel">Become a Traveler</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
