"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Coins } from "lucide-react"
import { PricingCalculator } from "@/components/pricing-calculator"

const TEST_PRICING = [
  { name: "Pracovné zručnosti", coins: 10, description: "Základný obraz o práci kandidáta" },
  { name: "Jazykový test", coins: 12, description: "Overenie úrovne jazyka" },
  { name: "Digitálne zručnosti", coins: 8, description: "Práca s e-mailom, dokumentmi" },
  { name: "SJT základný", coins: 10, description: "Reakcie v pracovných situáciách" },
  { name: "IT schopnosti", coins: 14, description: "Technické znalosti" },
  { name: "Verbálne schopnosti", coins: 14, description: "Práca s textom" },
  { name: "Pozornosť k detailom", coins: 10, description: "Presnosť a všímavosť" },
  { name: "Plánovanie", coins: 12, description: "Práca s časom a prioritami" },
  { name: "Data Entry", coins: 8, description: "Zadávanie údajov" },
  { name: "Kognitívny SJT", coins: 16, description: "Rozhodovanie v zložitých situáciách" },
  { name: "BOZP", coins: 8, description: "Bezpečnosť pri práci" },
  { name: "Work Sample", coins: 25, description: "Simulácia reálnej práce" },
]

const COIN_PACKAGES = [
  { name: "Štart", coins: 50, price: 50, bonus: 0 },
  { name: "Základ", coins: 100, price: 95, bonus: 5 },
  { name: "Business", coins: 250, price: 225, bonus: 25 },
  { name: "Pro", coins: 500, price: 425, bonus: 75 },
  { name: "Enterprise", coins: 1000, price: 800, bonus: 200 },
]

function calculateCustomPrice(coins: number): { price: number; discount: number; discountPercent: number } {
  if (coins < 100) {
    return { price: coins, discount: 0, discountPercent: 0 }
  } else if (coins < 250) {
    const discountPercent = 5
    const price = Math.round(coins * 0.95)
    return { price, discount: coins - price, discountPercent }
  } else if (coins < 500) {
    const discountPercent = 10
    const price = Math.round(coins * 0.9)
    return { price, discount: coins - price, discountPercent }
  } else if (coins < 1000) {
    const discountPercent = 15
    const price = Math.round(coins * 0.85)
    return { price, discount: coins - price, discountPercent }
  } else {
    const discountPercent = 20
    const price = Math.round(coins * 0.8)
    return { price, discount: coins - price, discountPercent }
  }
}

interface CompanyPricingSectionProps {
  onBuyCoins?: (amount?: number) => void
  coinBalance?: number
}

export function CompanyPricingSection({ onBuyCoins, coinBalance = 0 }: CompanyPricingSectionProps) {
  const [customCoins, setCustomCoins] = useState("")

  const customPricing = useMemo(() => {
    const coins = Number(customCoins) || 0
    if (coins < 10) return null
    return calculateCustomPrice(coins)
  }, [customCoins])

  return (
    <Tabs defaultValue="calculator">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="calculator">Kalkulačka ceny</TabsTrigger>
        <TabsTrigger value="tests">Cenník testov</TabsTrigger>
        <TabsTrigger value="shop">Shop coinov</TabsTrigger>
      </TabsList>

      <TabsContent value="calculator">
        <PricingCalculator />
      </TabsContent>

      {/* Cenník testov */}
      <TabsContent value="tests" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TEST_PRICING.map((test) => (
            <div key={test.name} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">{test.name}</p>
                <p className="text-sm text-muted-foreground">{test.description}</p>
              </div>
              <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-200">
                <Coins className="h-3 w-3 mr-1" />
                {test.coins}
              </Badge>
            </div>
          ))}
        </div>
      </TabsContent>

      {/* Shop coinov */}
      <TabsContent value="shop" className="space-y-6">
        <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Coins className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Váš zostatok</p>
                <p className="text-2xl font-bold text-yellow-700">{coinBalance} coinov</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {COIN_PACKAGES.map((pkg) => (
            <Card key={pkg.name} className="relative overflow-hidden hover:shadow-md transition-shadow">
              {pkg.bonus > 0 && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-green-500">+{pkg.bonus} bonus</Badge>
                </div>
              )}
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Coins className="h-5 w-5 text-yellow-500" />
                  {pkg.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-yellow-600">{pkg.coins}</span>
                  <span className="text-muted-foreground">coinov</span>
                </div>
                <p className="text-2xl font-semibold text-primary">{pkg.price} €</p>
                {pkg.bonus > 0 && <p className="text-sm text-green-600">Ušetríte {pkg.coins - pkg.price} €</p>}
                <Button className="w-full" onClick={() => onBuyCoins?.(pkg.coins)}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Kúpiť
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-3">Vlastné množstvo</h4>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                type="number"
                min="10"
                placeholder="Počet coinov (min. 10)"
                value={customCoins}
                onChange={(e) => setCustomCoins(e.target.value)}
              />
              {customPricing && customPricing.discountPercent > 0 && (
                <p className="text-sm text-green-600 mt-1">
                  Zľava {customPricing.discountPercent}% - ušetríte {customPricing.discount} €
                </p>
              )}
            </div>
            <Button
              onClick={() => onBuyCoins?.(Number(customCoins))}
              disabled={!customCoins || Number(customCoins) < 10}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Kúpiť za {customPricing?.price || customCoins || 0} €
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">1 coin = 1 € (zľavy platia od 100 coinov)</p>
        </div>
      </TabsContent>
    </Tabs>
  )
}
