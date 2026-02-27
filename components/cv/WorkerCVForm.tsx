"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { toast } from "sonner"
import { Loader2, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react"

// Types
type Trade = "electrician" | "welder" | "mason" | "carpenter" | "plumber" | "painter" | "mechanic" | "other"

interface CVFormData {
    trade: Trade | ""
    trade_specialization: string
    years_experience: number
    certifications: string[]
    tools_known: string[]
    work_regions: string[]
    work_types: string[]
    expected_salary_min: number
}

// Data
const TRADES = [
    { value: "electrician", label: "Elektrikár" },
    { value: "welder", label: "Zvárač" },
    { value: "mason", label: "Murár" },
    { value: "carpenter", label: "Tesár / Stolár" },
    { value: "plumber", label: "Vodár / Kúrenár" },
    { value: "painter", label: "Maliar" },
    { value: "mechanic", label: "Mechanik" },
    { value: "other", label: "Iné remeslo" },
]

const REGIONS = [
    "Bratislavský kraj",
    "Trnavský kraj",
    "Trenčiansky kraj",
    "Nitriansky kraj",
    "Žilinský kraj",
    "Banskobystrický kraj",
    "Prešovský kraj",
    "Košický kraj",
    "Zahraničie (EÚ)",
]

const WORK_TYPES = [
    { value: "full_time", label: "TPP (Trvalý pracovný pomer)" },
    { value: "contract", label: "Živnosť (SZČO)" },
    { value: "part_time", label: "Skrátený úväzok" },
    { value: "project_based", label: "Na dohodu / projekt" },
]

export default function WorkerCVForm() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState<CVFormData>({
        trade: "",
        trade_specialization: "",
        years_experience: 0,
        certifications: [],
        tools_known: [],
        work_regions: [],
        work_types: [],
        expected_salary_min: 1500,
    })

    // Handlers
    const handleTradeChange = (val: string) => setFormData({ ...formData, trade: val as Trade })

    const handleCheckboxArray = (field: "certifications" | "tools_known" | "work_regions" | "work_types", value: string, checked: boolean) => {
        setFormData((prev: CVFormData) => {
            const current = prev[field]
            const updated = checked ? [...current, value] : current.filter((item: string) => item !== value)
            return { ...prev, [field]: updated }
        })
    }

    const nextStep = () => {
        if (step === 1 && !formData.trade) {
            toast.error("Prosím, vyberte si remeslo.")
            return
        }
        setStep((s: number) => s + 1)
    }

    const prevStep = () => setStep((s: number) => Math.max(1, s - 1))

    const onSubmit = async () => {
        setIsSubmitting(true)

        try {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            )

            const { data: sessionData } = await supabase.auth.getSession()
            const user = sessionData.session?.user

            if (!user) {
                toast.error("Musíte byť prihlásený")
                router.push("/auth/login?redirectTo=/zivotopis-a-cv")
                return
            }

            // Upsert worker profile
            const { error } = await supabase.from("worker_profiles").upsert({
                id: user.id,
                trade: formData.trade,
                trade_specialization: formData.trade_specialization,
                years_experience: formData.years_experience,
                certifications: formData.certifications,
                tools_known: formData.tools_known,
                work_regions: formData.work_regions,
                work_types: formData.work_types,
                expected_salary_min: formData.expected_salary_min,
                cv_completed_at: new Date().toISOString()
            })

            if (error) throw error

            toast.success("Životopis uložený! Presmerovanie na test...")
            router.push("/testovanie-kandidatov")

        } catch (err: any) {
            console.error(err)
            toast.error(err.message || "Chyba pri ukladaní CV")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            {/* Progress */}
            <div className="mb-8">
                <div className="flex justify-between text-sm font-medium text-muted-foreground mb-2">
                    <span>Krok {step} z 3</span>
                    <span>{Math.round((step / 3) * 100)}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-300 ease-in-out"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>
            </div>

            <Card className="shadow-lg border-primary/10">

                {/* STEP 1: Základné zameranie */}
                {step === 1 && (
                    <>
                        <CardHeader>
                            <CardTitle className="text-2xl">Vaše Remeslo</CardTitle>
                            <CardDescription>Čo presne robíte a koľko máte skúseností?</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-3">
                                <Label className="text-base">Hlavné zameranie <span className="text-red-500">*</span></Label>
                                <Select value={formData.trade} onValueChange={handleTradeChange}>
                                    <SelectTrigger className="h-12 text-lg">
                                        <SelectValue placeholder="Vyberte remeslo..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TRADES.map((t) => (
                                            <SelectItem key={t.value} value={t.value} className="text-base">{t.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <Label>Špecializácia (nepovinné)</Label>
                                <Input
                                    placeholder="Napr. Silnoprúd, TIG zváranie, Strechy..."
                                    value={formData.trade_specialization}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, trade_specialization: e.target.value })}
                                />
                                <p className="text-xs text-muted-foreground">Upresnite, v čom ste najlepší.</p>
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <div className="flex justify-between">
                                    <Label className="text-base">Roky praxe v odbore: <span className="font-bold text-primary">{formData.years_experience} rokov</span></Label>
                                </div>
                                <Slider
                                    value={[formData.years_experience]}
                                    onValueChange={(v: number[]) => setFormData({ ...formData, years_experience: v[0] })}
                                    max={40}
                                    step={1}
                                    className="py-4"
                                />
                            </div>
                        </CardContent>
                    </>
                )}

                {/* STEP 2: Zručnosti a certifikáty */}
                {step === 2 && (
                    <>
                        <CardHeader>
                            <CardTitle className="text-2xl">Zručnosti a Vybavenie</CardTitle>
                            <CardDescription>Certifikáty a nástroje, ktoré ovládate.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="space-y-3">
                                <Label className="text-base">Certifikáty a osvedčenia (oddeľte čiarkou)</Label>
                                <Textarea
                                    placeholder="Napr. §21 Vyhláška 508/2009, Zváračský preukaz TIG, Vodičský B..."
                                    value={formData.certifications.join(", ")}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({
                                        ...formData,
                                        certifications: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean)
                                    })}
                                    className="h-24"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label className="text-base">Pracovné nástroje, ktoré bezpečne ovládate</Label>
                                <Textarea
                                    placeholder="Napr. Vŕtacie kladivo, Uhlová brúska, Zváračka CO2, Multimeter..."
                                    value={formData.tools_known.join(", ")}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({
                                        ...formData,
                                        tools_known: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean)
                                    })}
                                    className="h-24"
                                />
                            </div>
                        </CardContent>
                    </>
                )}

                {/* STEP 3: Preferencie a Lokalita */}
                {step === 3 && (
                    <>
                        <CardHeader>
                            <CardTitle className="text-2xl">Pracovné Podmienky</CardTitle>
                            <CardDescription>Kde a za koľko chcete pracovať.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">

                            <div className="space-y-3">
                                <Label className="text-base font-semibold">Región pôsobenia</Label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {REGIONS.map((region) => (
                                        <div key={region} className="flex items-center space-x-2 bg-secondary/30 p-2 rounded border border-border/50">
                                            <Checkbox
                                                id={`reg-${region}`}
                                                checked={formData.work_regions.includes(region)}
                                                onCheckedChange={(c: boolean) => handleCheckboxArray("work_regions", region, c)}
                                            />
                                            <Label htmlFor={`reg-${region}`} className="font-normal cursor-pointer flex-grow">{region}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3 pt-4 border-t">
                                <Label className="text-base font-semibold">Typ spolupráce</Label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {WORK_TYPES.map((type) => (
                                        <div key={type.value} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`wt-${type.value}`}
                                                checked={formData.work_types.includes(type.value)}
                                                onCheckedChange={(c: boolean) => handleCheckboxArray("work_types", type.value, c)}
                                            />
                                            <Label htmlFor={`wt-${type.value}`} className="font-normal cursor-pointer">{type.label}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <div className="flex justify-between items-center">
                                    <Label className="text-base font-semibold">Očakávaná odmena (mesačne / ekvivalent)</Label>
                                    <span className="text-xl font-bold text-primary px-3 py-1 bg-primary/10 rounded-md">
                                        od {formData.expected_salary_min} €
                                    </span>
                                </div>
                                <Slider
                                    value={[formData.expected_salary_min]}
                                    onValueChange={(v: number[]) => setFormData({ ...formData, expected_salary_min: v[0] })}
                                    min={800}
                                    max={5000}
                                    step={100}
                                    className="py-4"
                                />
                            </div>

                        </CardContent>
                    </>
                )}

                <CardFooter className="flex justify-between pt-6 border-t mt-4 bg-muted/20">
                    <Button
                        variant="outline"
                        onClick={prevStep}
                        disabled={step === 1 || isSubmitting}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Späť
                    </Button>

                    {step < 3 ? (
                        <Button onClick={nextStep}>
                            Ďalej <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button onClick={onSubmit} disabled={isSubmitting} size="lg" className="w-full sm:w-auto font-bold">
                            {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CheckCircle2 className="mr-2 h-5 w-5" />}
                            Uložiť a prejsť na test
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
