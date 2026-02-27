"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"

interface CompanyIdFieldProps {
  value: string
  onChange: (value: string) => void
  country: string
  onCountryChange: (country: string) => void
  error?: string
}

const COMPANY_ID_SYSTEMS = {
  SK: {
    label: "IČO",
    placeholder: "12345678",
    pattern: /^\d{8}$/,
    description: "8-ciferné identifikačné číslo organizácie",
  },
  CZ: { label: "IČ", placeholder: "12345678", pattern: /^\d{8}$/, description: "8-ciferné identifikačné číslo" },
  AT: {
    label: "Firmenbuchnummer",
    placeholder: "123456a",
    pattern: /^\d{6}[a-z]$/i,
    description: "6 číslic + písmeno",
  },
  DE: {
    label: "Handelsregisternummer",
    placeholder: "HRB 12345",
    pattern: /^HR[AB]\s?\d+$/i,
    description: "HRA/HRB + číslo",
  },
  PL: {
    label: "NIP",
    placeholder: "1234567890",
    pattern: /^\d{10}$/,
    description: "10-ciferné daňové identifikačné číslo",
  },
  HU: {
    label: "Cégjegyzékszám",
    placeholder: "01-09-123456",
    pattern: /^\d{2}-\d{2}-\d{6}$/,
    description: "XX-XX-XXXXXX formát",
  },
  GB: { label: "Company Number", placeholder: "12345678", pattern: /^\d{8}$/, description: "8-digit company number" },
  IE: {
    label: "CRO Number",
    placeholder: "123456",
    pattern: /^\d{6}$/,
    description: "6-digit Companies Registration Office number",
  },
  FR: { label: "SIRET", placeholder: "12345678901234", pattern: /^\d{14}$/, description: "14-ciferné SIRET číslo" },
  ES: {
    label: "CIF",
    placeholder: "A12345674",
    pattern: /^[ABCDEFGHJNPQRSUVW]\d{7}[0-9A-J]$/,
    description: "Písmeno + 7 číslic + kontrolný znak",
  },
  IT: {
    label: "Codice Fiscale",
    placeholder: "12345678901",
    pattern: /^\d{11}$/,
    description: "11-ciferný daňový kód",
  },
  NL: {
    label: "KvK-nummer",
    placeholder: "12345678",
    pattern: /^\d{8}$/,
    description: "8-ciferné číslo obchodnej komory",
  },
  BE: {
    label: "Ondernemingsnummer",
    placeholder: "0123.456.789",
    pattern: /^\d{4}\.\d{3}\.\d{3}$/,
    description: "XXXX.XXX.XXX formát",
  },
  CH: {
    label: "UID",
    placeholder: "CHE-123.456.789",
    pattern: /^CHE-\d{3}\.\d{3}\.\d{3}$/,
    description: "CHE-XXX.XXX.XXX formát",
  },
  US: { label: "EIN", placeholder: "12-3456789", pattern: /^\d{2}-\d{7}$/, description: "XX-XXXXXXX formát" },
  CA: {
    label: "BN",
    placeholder: "123456789RC0001",
    pattern: /^\d{9}R[CP]\d{4}$/,
    description: "9 číslic + RC/RP + 4 číslice",
  },
}

const COUNTRIES = [
  { code: "SK", name: "Slovensko" },
  { code: "CZ", name: "Česká republika" },
  { code: "AT", name: "Rakúsko" },
  { code: "DE", name: "Nemecko" },
  { code: "PL", name: "Poľsko" },
  { code: "HU", name: "Maďarsko" },
  { code: "GB", name: "Veľká Británia" },
  { code: "IE", name: "Írsko" },
  { code: "FR", name: "Francúzsko" },
  { code: "ES", name: "Španielsko" },
  { code: "IT", name: "Taliansko" },
  { code: "NL", name: "Holandsko" },
  { code: "BE", name: "Belgicko" },
  { code: "CH", name: "Švajčiarsko" },
  { code: "US", name: "USA" },
  { code: "CA", name: "Kanada" },
]

export function CompanyIdField({ value, onChange, country, onCountryChange, error }: CompanyIdFieldProps) {
  const [validationError, setValidationError] = useState<string>("")

  const currentSystem = COMPANY_ID_SYSTEMS[country as keyof typeof COMPANY_ID_SYSTEMS]

  useEffect(() => {
    if (value && currentSystem) {
      const isValid = currentSystem.pattern.test(value)
      if (!isValid) {
        setValidationError(`Neplatný formát. Očakávaný formát: ${currentSystem.description}`)
      } else {
        setValidationError("")
      }
    } else {
      setValidationError("")
    }
  }, [value, currentSystem])

  const handleValueChange = (newValue: string) => {
    onChange(newValue)
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="country">Krajina *</Label>
        <Select value={country} onValueChange={onCountryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Vyberte krajinu" />
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {currentSystem && (
        <div className="grid gap-2">
          <Label htmlFor="companyId">{currentSystem.label} *</Label>
          <Input
            id="companyId"
            type="text"
            placeholder={currentSystem.placeholder}
            value={value}
            onChange={(e) => handleValueChange(e.target.value)}
            className={validationError || error ? "border-red-500" : ""}
          />
          <p className="text-xs text-gray-500">{currentSystem.description}</p>
          {(validationError || error) && <p className="text-sm text-red-500">{validationError || error}</p>}
        </div>
      )}
    </div>
  )
}
