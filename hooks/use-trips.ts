"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export interface Trip {
  id: string
  traveler_id: string
  origin: string
  destination: string
  travel_date: string
  departure_time: string | null
  vehicle_type: "car" | "bus" | "train"
  capacity: "Small" | "Medium" | "Large"
  price_per_kg: number | null
  status: string
  created_at: string
  traveler?: {
    full_name: string | null
    kyc_status: string
    avatar_url: string | null
  }
}

interface UseTripsOptions {
  origin?: string
  destination?: string
  date?: string
}

export function useTrips(options: UseTripsOptions = {}) {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    async function fetchTrips() {
      setLoading(true)
      setError(null)

      let query = supabase
        .from("trips")
        .select(
          `
          *,
          traveler:users!trips_traveler_id_fkey (
            full_name,
            kyc_status,
            avatar_url
          )
        `
        )
        .eq("status", "active")
        .order("travel_date", { ascending: true })

      if (options.origin) {
        query = query.ilike("origin", `%${options.origin}%`)
      }
      if (options.destination) {
        query = query.ilike("destination", `%${options.destination}%`)
      }
      if (options.date) {
        query = query.eq("travel_date", options.date)
      }

      const { data, error: queryError } = await query

      if (queryError) {
        setError(queryError.message)
      } else {
        setTrips((data as Trip[]) ?? [])
      }
      setLoading(false)
    }

    fetchTrips()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.origin, options.destination, options.date])

  return { trips, loading, error }
}
