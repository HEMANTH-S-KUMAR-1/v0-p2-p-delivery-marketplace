import { NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"
import { createClient } from "@/lib/supabase/server"

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
    const { deliveryId, amount } = body as {
      deliveryId?: string
      amount?: number
    }

    if (!deliveryId || !amount) {
      return NextResponse.json(
        { error: "deliveryId and amount are required" },
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

    // Verify the delivery belongs to this sender
    const { data: delivery, error: fetchError } = await supabase
      .from("deliveries")
      .select("id, sender_id, status, escrow_status")
      .eq("id", deliveryId)
      .single()

    if (fetchError || !delivery) {
      return NextResponse.json({ error: "Delivery not found" }, { status: 404 })
    }

    if (delivery.sender_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Create a Razorpay order (acts as the escrow hold in a nodal account)
    // amount is in paise (₹1 = 100 paise)
    const razorpay = getRazorpayClient()
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `routedrop_${deliveryId}`,
      notes: {
        delivery_id: deliveryId,
        sender_id: user.id,
        purpose: "p2p_delivery_escrow",
      },
    })

    // Save Razorpay order ID to delivery record
    await supabase
      .from("deliveries")
      .update({
        razorpay_order_id: order.id,
        escrow_status: "held",
        updated_at: new Date().toISOString(),
      })
      .eq("id", deliveryId)

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
