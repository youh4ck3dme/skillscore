import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    })

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      candidateId,
      country,
      profession,
      workType,
      seniority,
      experienceYears,
      monthsCount,
      monthlyPrice,
      totalPrice,
      paymentDay,
    } = body

    // Validate required fields
    if (
      !candidateId ||
      !country ||
      !profession ||
      !workType ||
      !seniority ||
      !monthsCount ||
      !monthlyPrice ||
      !paymentDay
    ) {
      return NextResponse.json({ error: "Chýbajú povinné polia" }, { status: 400 })
    }

    // Check company has enough coins for first payment
    const { data: wallet, error: walletError } = await supabase
      .from("coin_wallets")
      .select("balance")
      .eq("user_id", user.id)
      .single()

    if (walletError || !wallet) {
      return NextResponse.json({ error: "Peňaženka nenájdená" }, { status: 400 })
    }

    if (wallet.balance < monthlyPrice) {
      return NextResponse.json({ error: "Nedostatok coinov pre prvú platbu" }, { status: 400 })
    }

    // Check if candidate is already hired
    const { data: existingHire } = await supabase
      .from("candidate_profiles")
      .select("is_hired")
      .eq("id", candidateId)
      .single()

    if (existingHire?.is_hired) {
      return NextResponse.json({ error: "Kandidát je už zamestnaný" }, { status: 400 })
    }

    // Calculate dates
    const startDate = new Date()
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + monthsCount)

    // Calculate first payment due date (5 days from now for first payment)
    const firstPaymentDate = new Date()
    firstPaymentDate.setDate(firstPaymentDate.getDate() + 5)

    // Create hire record
    const { data: hire, error: hireError } = await supabase
      .from("company_hires")
      .insert({
        company_id: user.id,
        candidate_id: candidateId,
        country,
        profession,
        work_type: workType,
        seniority,
        experience_years: experienceYears,
        months_count: monthsCount,
        monthly_price: monthlyPrice,
        total_price: totalPrice,
        payment_day: paymentDay,
        start_date: startDate.toISOString().split("T")[0],
        end_date: endDate.toISOString().split("T")[0],
        next_payment_date: firstPaymentDate.toISOString().split("T")[0],
      })
      .select()
      .single()

    if (hireError) {
      console.error("Hire error:", hireError)
      return NextResponse.json({ error: "Chyba pri vytváraní objednávky" }, { status: 500 })
    }

    // Create payment schedule
    const payments = []
    for (let i = 0; i < monthsCount; i++) {
      const dueDate = new Date(startDate)
      if (i === 0) {
        // First payment is in 5 days
        dueDate.setDate(dueDate.getDate() + 5)
      } else {
        // Subsequent payments on payment_day of each month
        dueDate.setMonth(dueDate.getMonth() + i)
        dueDate.setDate(paymentDay)
      }

      payments.push({
        hire_id: hire.id,
        month_number: i + 1,
        amount: monthlyPrice,
        due_date: dueDate.toISOString().split("T")[0],
        status: "pending",
      })
    }

    const { error: paymentsError } = await supabase.from("company_hire_payments").insert(payments)

    if (paymentsError) {
      console.error("Payments error:", paymentsError)
      // Rollback hire if payments failed
      await supabase.from("company_hires").delete().eq("id", hire.id)
      return NextResponse.json({ error: "Chyba pri vytváraní platobného plánu" }, { status: 500 })
    }

    // Deduct first payment from wallet
    const { error: deductError } = await supabase
      .from("coin_wallets")
      .update({ balance: wallet.balance - monthlyPrice })
      .eq("user_id", user.id)

    if (deductError) {
      console.error("Deduct error:", deductError)
      return NextResponse.json({ error: "Chyba pri strhnutí coinov" }, { status: 500 })
    }

    // Record transaction
    await supabase.from("coin_transactions").insert({
      user_id: user.id,
      amount: -monthlyPrice,
      type: "hire_payment",
      description: `Platba za zamestnanie - mesiac 1/${monthsCount}`,
      reference_id: hire.id,
    })

    // Mark first payment as paid
    await supabase
      .from("company_hire_payments")
      .update({ status: "paid", paid_date: new Date().toISOString().split("T")[0] })
      .eq("hire_id", hire.id)
      .eq("month_number", 1)

    // Update hire record
    await supabase
      .from("company_hires")
      .update({
        coins_paid: monthlyPrice,
        last_payment_date: new Date().toISOString().split("T")[0],
      })
      .eq("id", hire.id)

    // Deactivate candidate from market
    const { error: deactivateError } = await supabase
      .from("candidate_profiles")
      .update({
        is_hired: true,
        hired_until: endDate.toISOString().split("T")[0],
        hired_by: user.id,
      })
      .eq("id", candidateId)

    if (deactivateError) {
      console.error("Deactivate error:", deactivateError)
    }

    return NextResponse.json({
      success: true,
      hire: hire,
      message: `Kandidát úspešne zamestnaný. Prvá platba ${monthlyPrice} coinov bola strhnutá.`,
    })
  } catch (error) {
    console.error("Hire error:", error)
    return NextResponse.json({ error: "Interná chyba servera" }, { status: 500 })
  }
}
