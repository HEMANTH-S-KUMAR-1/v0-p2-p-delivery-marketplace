import { Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DeliveryList } from "@/components/traveler/delivery-list"

export default function TravelPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
            </div>
          }
        >
          <DeliveryList />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
