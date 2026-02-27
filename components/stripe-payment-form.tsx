"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useI18n } from "@/lib/i18n/context"
import { staticTranslations } from "@/lib/i18n/translations"

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripePaymentFormProps {
  companyId: string
  coinAmount: number
  totalAmount: number
  onSuccess: () => void
  onError: (error: string) => void
}

function PaymentForm({ companyId, coinAmount, totalAmount, onSuccess, onError }: StripePaymentFormProps) {
  const { language } = useI18n()
  const currentLang = (language && staticTranslations[language] ? language : "sk") as keyof typeof staticTranslations
  const t = staticTranslations[currentLang].modals.buyCoin

  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState<string>("")
  const [error, setError] = useState<string>("")

  // Create payment intent when component mounts
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            companyId,
            amount: coinAmount,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to create payment intent")
        }

        setClientSecret(data.clientSecret)
      } catch (err) {
        console.error("Error creating payment intent:", err)
        setError(err instanceof Error ? err.message : "Failed to initialize payment")
      }
    }

    if (companyId && coinAmount > 0) {
      createPaymentIntent()
    }
  }, [companyId, coinAmount])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements || !clientSecret) {
      return
    }

    setLoading(true)
    setError("")

    const cardElement = elements.getElement(CardElement)

    if (!cardElement) {
      setError("Card element not found")
      setLoading(false)
      return
    }

    // Confirm payment
    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    })

    if (stripeError) {
      console.error("Payment error:", stripeError)
      setError(stripeError.message || "Payment failed")
      onError(stripeError.message || "Payment failed")
    } else if (paymentIntent?.status === "succeeded") {
      onSuccess()
    }

    setLoading(false)
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
    },
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="p-4 border border-border rounded-lg">
        <CardElement options={cardElementOptions} />
      </div>

      <div className="p-4 bg-muted/50 rounded-lg">
        <div className="flex justify-between items-center text-sm">
          <span>{t.summary.coinCount}</span>
          <span className="font-medium">{coinAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span>{t.summary.pricePerCoin}</span>
          <span className="font-medium">1€</span>
        </div>
        <div className="border-t border-border mt-2 pt-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">{t.summary.totalPrice}</span>
            <span className="text-lg font-bold">{totalAmount.toLocaleString()}€</span>
          </div>
        </div>
      </div>

      <Button type="submit" disabled={!stripe || loading || !clientSecret} className="w-full">
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            {t.processing}
          </>
        ) : (
          <>
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            {t.demoPayment.replace("{amount}", totalAmount.toLocaleString())}
          </>
        )}
      </Button>
    </form>
  )
}

export function StripePaymentForm(props: StripePaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  )
}
