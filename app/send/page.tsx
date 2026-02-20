import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BookingForm } from "@/components/sender/booking-form"

export default function SendPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <BookingForm />
      </main>
      <Footer />
    </div>
  )
}
