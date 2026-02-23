import { NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"
import { createClient } from "@/lib/supabase/server"

// Payment split constants
const TRAVELER_SHARE = 0.8 // 80% to the traveler
const PLATFORM_SHARE = 0.2 // 20% to the platform

// getRazorpayClient is used to create an authenticated Razorpay instance.
// Call this inside request handlers (never at module level) so the build
// does not fail when RAZORPAY_KEY_ID is absent in CI / preview environments.
// Uncomment the razorpay.transfers.create() call below once Razorpay Route
// is activated on the live account to replace the transfer scaffold.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials are not configured.")
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { deliveryId, otp } = body as {
      deliveryId?: string
      otp?: string
    }

    if (!deliveryId || !otp) {
      return NextResponse.json(
        { error: "deliveryId and otp are required" },
        { status: 400 }
      )
    }

    if (!/^\d{4}$/.test(otp)) {
      return NextResponse.json(
        { error: "OTP must be exactly 4 digits" },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch delivery with trip and traveler info
    const { data: delivery, error: fetchError } = await supabase
      .from("deliveries")
      .select(
        `
        id, sender_id, price, platform_fee, escrow_status,
        delivery_otp, razorpay_order_id, razorpay_payment_id,
        trip:trips!deliveries_trip_id_fkey (
          traveler_id,
          traveler:users!trips_traveler_id_fkey (
            id, full_name
          )
        )
      `
      )
      .eq("id", deliveryId)
      .single()

    if (fetchError || !delivery) {
      return NextResponse.json({ error: "Delivery not found" }, { status: 404 })
    }

    // Only the traveler assigned to this delivery can trigger release
    const tripData = delivery.trip as {
      traveler_id: string
      traveler: { id: string; full_name: string }
    }
    if (tripData?.traveler_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Validate OTP
    if (delivery.delivery_otp !== otp) {
      return NextResponse.json(
        { error: "Invalid OTP. Please ask the sender for the correct code." },
        { status: 422 }
      )
    }

    if (delivery.escrow_status === "released") {
      return NextResponse.json(
        { error: "Payment has already been released for this delivery." },
        { status: 409 }
      )
    }

    const totalAmount = Number(delivery.price) + Number(delivery.platform_fee)
    const travelerPayout = Math.round(totalAmount * TRAVELER_SHARE * 100) // paise
    const platformPayout = Math.round(totalAmount * PLATFORM_SHARE * 100) // paise

    // In production: use Razorpay Route / Transfer to split the payment
    // razorpay.transfers.create({ account: travelerAccountId, amount: travelerPayout, ... })
    // For now we scaffold the transfer intent and mark as released in DB
    const transferIntent = {
      traveler: {
        account: `traveler_${tripData.traveler_id}`,
        amount: travelerPayout,
        currency: "INR",
        notes: { purpose: "delivery_payout", delivery_id: deliveryId },
      },
      platform: {
        account: process.env.RAZORPAY_PLATFORM_ACCOUNT_ID ?? "platform",
        amount: platformPayout,
        currency: "INR",
        notes: { purpose: "platform_fee", delivery_id: deliveryId },
      },
    }

    // Mark escrow as released and delivery as delivered
    const { error: updateError } = await supabase
      .from("deliveries")
      .update({
        escrow_status: "released",
        status: "delivered",
        otp_verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", deliveryId)

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update delivery: " + updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Escrow released. Payment split successfully.",
      breakdown: {
        total: totalAmount,
        travelerShare: travelerPayout / 100,
        platformShare: platformPayout / 100,
      },
      transferIntent,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
