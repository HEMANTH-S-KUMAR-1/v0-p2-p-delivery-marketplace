import { Header } from "@/components/header"
import { HeroSection } from "@/components/landing/hero-section"
import { HowItWorks } from "@/components/landing/how-it-works"
import { TrustSection } from "@/components/landing/trust-section"
import { CtaSection } from "@/components/landing/cta-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <HowItWorks />
        <TrustSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
