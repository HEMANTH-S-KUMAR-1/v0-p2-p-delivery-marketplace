import { ClipboardList, UserCheck, PackageCheck } from "lucide-react"

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Post Your Parcel",
    description: "Enter your pickup and drop-off locations, select the item type, and get an instant price quote in seconds.",
  },
  {
    icon: UserCheck,
    step: "02",
    title: "Traveler Accepts",
    description: "A verified commuter heading along the Tumkur-Bengaluru route picks up your delivery request.",
  },
  {
    icon: PackageCheck,
    step: "03",
    title: "Delivered Safely",
    description: "Track the milestone updates in real-time. Confirm delivery with OTP. Payment released from escrow.",
  },
]

export function HowItWorks() {
  return (
    <section className="bg-background px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-secondary">
            Simple Process
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            How It Works
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3 md:gap-6">
          {steps.map((step, index) => (
            <div
              key={step.step}
              className="group relative rounded-2xl border border-border bg-card p-8 transition-all hover:border-secondary/40 hover:shadow-lg"
            >
              {/* Step number */}
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 text-primary transition-colors group-hover:bg-secondary/10 group-hover:text-secondary">
                  <step.icon className="h-6 w-6" />
                </div>
                <span className="font-mono text-sm font-bold text-muted-foreground">
                  {step.step}
                </span>
              </div>

              <h3 className="mb-3 text-xl font-bold text-foreground">{step.title}</h3>
              <p className="leading-relaxed text-muted-foreground">{step.description}</p>

              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="absolute -right-3 top-1/2 hidden h-px w-6 bg-border md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
