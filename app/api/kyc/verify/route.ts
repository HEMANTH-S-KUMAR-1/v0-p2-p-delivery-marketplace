import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Mock Setu / DigiLocker Aadhaar verification
// In production, replace with actual Setu API call:
// POST https://dg.setu.co/api/verify/aadhaar
function mockVerifyAadhaar(aadhaarNumber: string): {
  success: boolean
  ref: string
  maskedAadhaar: string
  name: string
} {
  // Basic format validation: 12 digits
  if (!/^\d{12}$/.test(aadhaarNumber)) {
    return { success: false, ref: "", maskedAadhaar: "", name: "" }
  }
  // Mock: always succeed for a valid-format Aadhaar
  const masked = `XXXX-XXXX-${aadhaarNumber.slice(-4)}`
  return {
    success: true,
    ref: `SETU-${Date.now()}`,
    maskedAadhaar: masked,
    name: "Verified User", // real API would return actual name
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { aadhaarNumber } = body as { aadhaarNumber?: string }

    if (!aadhaarNumber) {
      return NextResponse.json(
        { error: "aadhaarNumber is required" },
        { status: 400 }
      )
    }

    // 1. Verify with mock provider
    const result = mockVerifyAadhaar(aadhaarNumber.replace(/\s/g, ""))
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid Aadhaar number format. Must be 12 digits." },
        { status: 422 }
      )
    }

    // 2. Update user record in Supabase
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({
        kyc_status: "verified",
        aadhaar_ref: result.ref,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update KYC status: " + updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      maskedAadhaar: result.maskedAadhaar,
      ref: result.ref,
      message: "Aadhaar verified successfully. KYC status updated to Verified.",
    })
  } catch (err) {
    console.error("[KYC] Unexpected error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
