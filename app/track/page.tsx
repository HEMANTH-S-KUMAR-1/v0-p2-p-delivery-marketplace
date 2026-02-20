import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MilestoneTracker } from "@/components/tracker/milestone-tracker"

export default function TrackPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <MilestoneTracker />
      </main>
      <Footer />
    </div>
  )
}
