import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { sendCoinPurchaseInvoice } from "@/lib/email/invoice-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { companyId, amount, paymentMethod, stripePaymentIntentId } = body

    // Validate input
    if (!companyId || !amount || amount < 1) {
      return NextResponse.json({ error: "Invalid input parameters" }, { status: 400 })
    }

    // Create Supabase client
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    // Call the purchase_coins database function
    const { data, error } = await supabase.rpc("purchase_coins", {
      p_company_id: companyId,
      p_amount: amount,
      p_payment_method: paymentMethod || "stripe",
      p_stripe_payment_intent_id: stripePaymentIntentId || `demo_${Date.now()}`,
    })

    if (error) {
      console.error("Error purchasing coins:", error)
      return NextResponse.json({ error: "Failed to purchase coins", details: error.message }, { status: 500 })
    }

    try {
      await sendCoinPurchaseInvoice({
        companyId,
        coinAmount: amount,
        totalAmount: amount, // 1 coin = 1€
        paymentMethod: paymentMethod || "stripe",
        transactionId: stripePaymentIntentId || `demo_${Date.now()}`,
      })
    } catch (invoiceError) {
      console.error("Error sending invoice:", invoiceError)
      // Don't fail the purchase if invoice sending fails
    }

    return NextResponse.json({
      success: true,
      data,
      message: `Successfully purchased ${amount} coins`,
    })
  } catch (error) {
    console.error("Error in coins purchase API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
