import { ShieldCheck, Lock, Star, Clock } from "lucide-react"

const trustItems = [
  {
    icon: ShieldCheck,
    title: "100% Verified Travelers",
    description: "Every commuter undergoes Aadhaar and phone verification before joining the platform.",
  },
  {
    icon: Lock,
    title: "Secure Escrow Payments",
    description: "Your payment is held securely until delivery is confirmed via OTP. Zero risk.",
  },
  {
    icon: Star,
    title: "Rated & Reviewed",
    description: "Every traveler has a public rating. Choose who carries your parcel with confidence.",
  },
  {
    icon: Clock,
    title: "Real-Time Milestones",
    description: "Track your package status from pickup to delivery with live milestone updates.",
  },
]

export function TrustSection() {
  return (
    <section className="bg-muted px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-secondary">
            Built on Trust
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Your Package, Fully Protected
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center transition-all hover:shadow-md"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10">
                <item.icon className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="mb-2 text-base font-bold text-foreground">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
