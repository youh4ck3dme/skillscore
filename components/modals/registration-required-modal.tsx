"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, User, Building2, Users, Shield } from "lucide-react"

type UserType = "candidate" | "company" | "recruiter" | "admin"

interface RegistrationRequiredModalProps {
  isOpen: boolean
  onClose: () => void
  suggestedUserType?: UserType
  onRegister: (userType: UserType) => void
}

const userTypeConfig = {
  candidate: {
    icon: User,
    title: "Kandidát",
    description: "Hľadám prácu a chcem vyplniť svoj profil",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  company: {
    icon: Building2,
    title: "Firma",
    description: "Hľadám zamestnancov pre svoju firmu",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  recruiter: {
    icon: Users,
    title: "Recruiter",
    description: "Spájam firmy s kandidátmi a zarábam provízie",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  admin: {
    icon: Shield,
    title: "Administrátor",
    description: "Spravujem celú platformu",
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
}

export function RegistrationRequiredModal({
  isOpen,
  onClose,
  suggestedUserType,
  onRegister,
}: RegistrationRequiredModalProps) {
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(suggestedUserType || null)

  const handleRegister = () => {
    if (selectedUserType) {
      onRegister(selectedUserType)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Registrácia potrebná
          </DialogTitle>
          <DialogDescription>Pre túto funkciu sa musíš zaregistrovať. Aký typ účtu chceš vytvoriť?</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {Object.entries(userTypeConfig).map(([type, config]) => {
            const Icon = config.icon
            const isSelected = selectedUserType === type
            const isSuggested = suggestedUserType === type

            return (
              <Card
                key={type}
                className={`cursor-pointer transition-all ${
                  isSelected ? `${config.borderColor} ${config.bgColor} border-2` : "border hover:border-gray-300"
                } ${isSuggested ? "ring-2 ring-blue-200" : ""}`}
                onClick={() => setSelectedUserType(type as UserType)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Icon className={`h-5 w-5 ${config.color}`} />
                    {config.title}
                    {isSuggested && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Odporúčané</span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{config.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Zrušiť
          </Button>
          <Button onClick={handleRegister} disabled={!selectedUserType}>
            Registrovať sa ako {selectedUserType && userTypeConfig[selectedUserType].title}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
