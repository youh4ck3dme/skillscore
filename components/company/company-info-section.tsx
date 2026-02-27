"use client"

import { useState, useEffect, useImperativeHandle, forwardRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Building2, User, Phone, Mail, MapPin, Edit2, Save, X, AlertCircle, Coins, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CompanyUser {
  id: string
  email?: string
  company_name?: string
  phone?: string
  ico?: string
  address?: string
  contact_person?: string
  dic?: string
}

interface CompanyInfoSectionProps {
  companyUser: { user: CompanyUser } | null
  coinBalance: number
  onCoinsClick: () => void
  isLoading?: boolean
}

export interface CompanyInfoSectionHandle {
  openEdit: () => void
}

export const CompanyInfoSection = forwardRef<CompanyInfoSectionHandle, CompanyInfoSectionProps>(
  function CompanyInfoSection({ companyUser, coinBalance, onCoinsClick, isLoading }, ref) {
    const [isEditing, setIsEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    const user = companyUser?.user

    const [formData, setFormData] = useState({
      company_name: "",
      contact_person: "",
      contact_email: "",
      contact_phone: "",
      address: "",
      ico: "",
      dic: "",
    })

    useImperativeHandle(ref, () => ({
      openEdit: () => setIsEditing(true),
    }))

    useEffect(() => {
      if (user) {
        setFormData({
          company_name: user.company_name || "",
          contact_person: user.contact_person || "",
          contact_email: user.email || "",
          contact_phone: user.phone || "",
          address: user.address || "",
          ico: user.ico || "",
          dic: user.dic || "",
        })
      }
    }, [user])

    const handleSave = async () => {
      if (!user?.id) {
        return
      }

      setSaving(true)
      try {
        const response = await fetch("/api/company/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company_name: formData.company_name,
            contact_person: formData.contact_person,
            phone: formData.contact_phone,
            address: formData.address,
            ico: formData.ico,
            dic: formData.dic,
          }),
        })

        const result = await response.json()

        if (response.ok) {
          toast({
            title: "Údaje uložené",
            description: "Informácie o firme boli úspešne aktualizované.",
          })
          setIsEditing(false)
          router.refresh()
        } else {
          toast({
            title: "Chyba",
            description: result.error || "Nepodarilo sa uložiť údaje.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error saving company profile:", error)
        toast({
          title: "Chyba",
          description: "Nepodarilo sa uložiť údaje.",
          variant: "destructive",
        })
      } finally {
        setSaving(false)
      }
    }

    const missingFields = []
    if (!formData.company_name) missingFields.push("názov firmy")
    if (!formData.address) missingFields.push("adresa")
    if (!formData.ico) missingFields.push("IČO")
    if (!formData.dic) missingFields.push("DIČ")
    if (!formData.contact_person) missingFields.push("zodpovedná osoba")

    const hasMissingFields = missingFields.length > 0

    if (isLoading) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Informácie o firme
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      )
    }

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Informácie o firme
            </CardTitle>
            <CardDescription>Pre kontrolu vyplňte údaje o firme - tieto údaje sa zobrazia v zmluve</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            {/* Coin balance */}
            <Button variant="outline" className="flex items-center gap-2 bg-transparent" onClick={onCoinsClick}>
              <Coins className="h-4 w-4 text-yellow-500" />
              <span className="font-semibold">{coinBalance}</span>
              <span className="text-muted-foreground text-sm">coinov</span>
            </Button>

            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit2 className="h-4 w-4 mr-2" />
                Upraviť
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Zrušiť
                </Button>
                <Button size="sm" onClick={handleSave} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Ukladám..." : "Uložiť"}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {hasMissingFields && !isEditing && (
            <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0" />
              <span className="text-orange-700">Pre zmluvu chýba: {missingFields.join(", ")}</span>
              <Button variant="link" className="text-orange-700 p-0 h-auto ml-auto" onClick={() => setIsEditing(true)}>
                Vyplniť teraz
              </Button>
            </div>
          )}

          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Názov firmy *</Label>
                <Input
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  placeholder="Názov firmy"
                />
              </div>
              <div className="space-y-2">
                <Label>Zodpovedná osoba *</Label>
                <Input
                  value={formData.contact_person}
                  onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                  placeholder="Meno a priezvisko"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  placeholder="email@firma.sk"
                  disabled
                  className="bg-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label>Telefón</Label>
                <Input
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  placeholder="+421 ..."
                />
              </div>
              <div className="space-y-2">
                <Label>Adresa (sídlo) *</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Ulica, Mesto, PSČ"
                />
              </div>
              <div className="space-y-2">
                <Label>IČO *</Label>
                <Input
                  value={formData.ico}
                  onChange={(e) => setFormData({ ...formData, ico: e.target.value })}
                  placeholder="12345678"
                />
              </div>
              <div className="space-y-2">
                <Label>DIČ *</Label>
                <Input
                  value={formData.dic}
                  onChange={(e) => setFormData({ ...formData, dic: e.target.value })}
                  placeholder="SK12345678"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Firma</p>
                  <p className="font-medium">
                    {formData.company_name || <span className="text-orange-500">Vyplňte</span>}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Zodpovedná osoba</p>
                  <p className="font-medium">
                    {formData.contact_person || <span className="text-orange-500">Vyplňte</span>}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{formData.contact_email || "Nevyplnené"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Telefón</p>
                  <p className="font-medium">{formData.contact_phone || "Nevyplnené"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Adresa</p>
                  <p className="font-medium">{formData.address || <span className="text-orange-500">Vyplňte</span>}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Badge variant="outline" className={!formData.ico ? "border-orange-300 text-orange-600" : ""}>
                  IČO: {formData.ico || "–"}
                </Badge>
                <Badge variant="outline" className={!formData.dic ? "border-orange-300 text-orange-600" : ""}>
                  DIČ: {formData.dic || "–"}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  },
)
