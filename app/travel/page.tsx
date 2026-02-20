import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DeliveryList } from "@/components/traveler/delivery-list"

export default function TravelPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <DeliveryList />
      </main>
      <Footer />
    </div>
  )
}
