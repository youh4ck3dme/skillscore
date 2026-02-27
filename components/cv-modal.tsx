"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { ChevronLeft, ChevronRight, X, Plus, CheckCircle } from "lucide-react" // Import CheckCircle
import { useI18n } from "@/lib/i18n/context"
import { staticTranslations } from "@/lib/i18n/translations"
import {
  getTranslatedFormOptions,
  getTranslatedStudyFields, // Import getTranslatedStudyFields
  licenseTypes,
  professionsData,
} from "@/lib/data/form-options"
import {
  professionsWithWorkTypes,
  professionsList,
  certificateMappingIndex,
  translateProfession,
  getTranslatedProfessionsList,
  translateProfessionName,
  getTranslatedYearsOptions,
} from "@/lib/data/work-experience-data"
import { getCertificatesForWorkType } from "@/lib/data/work-experience/certificates-loader"
import { ComputerSkillsChipSelector } from "@/components/computer-skills-chip-selector"
import { CVSuccessModal } from "@/components/cv-success-modal"
import { CandidateGDPRNew } from "@/components/legal/candidate-gdpr-new"

interface CVModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: () => void
  editMode?: boolean
}

export function CVModal({ open, onOpenChange, onComplete, editMode = false }: CVModalProps) {
  const { language } = useI18n()
  const currentLang = (language && staticTranslations[language] ? language : "sk") as keyof typeof staticTranslations

  const t = staticTranslations[currentLang]?.modals?.cvModal || staticTranslations.sk.modals.cvModal

  const formOptions = getTranslatedFormOptions(currentLang)
  const studyFields = getTranslatedStudyFields(currentLang)

  const translatedProfessionsList = getTranslatedProfessionsList(currentLang)

  const translatedYearsOptions = getTranslatedYearsOptions(currentLang)

  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 5

  // CV Form States
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedWorkLocations, setSelectedWorkLocations] = useState<string[]>([])
  const [isEuCitizen, setIsEuCitizen] = useState<string>("")
  const [gdprConsent, setGdprConsent] = useState(false)
  const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState<string[]>([])
  const [startDate, setStartDate] = useState("")
  const [hasDriversLicense, setHasDriversLicense] = useState("")
  const [selectedLicenseTypes, setSelectedLicenseTypes] = useState<string[]>([])
  // CHANGE: Added state for "no computer skills" checkbox
  const [hasNoComputerSkills, setHasNoComputerSkills] = useState(false)
  const [selectedComputerSkills, setSelectedComputerSkills] = useState<
    Array<{ category: string; tool: string; level: string }>
  >([])
  const [languages, setLanguages] = useState<Array<{ language: string; level: string }>>([{ language: "", level: "" }])
  const [educationLevel, setEducationLevel] = useState("")
  const [fieldOfStudy, setFieldOfStudy] = useState("")
  const [academicTitle, setAcademicTitle] = useState("")
  const [hasNoWorkExperience, setHasNoWorkExperience] = useState(false)
  const [workExperiences, setWorkExperiences] = useState<
    Array<{
      profession: string
      workType: string
      years: string
      certificate: string
    }>
  >([])
  const [desiredPositions, setDesiredPositions] = useState<Array<{ profession: string; workType: string }>>([
    { profession: "", workType: "" },
  ])
  const [expectedSalary, setExpectedSalary] = useState("")
  const [publishProfile, setPublishProfile] = useState(false)

  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [cvDataLoaded, setCvDataLoaded] = useState(false)
  const [showGDPRDialog, setShowGDPRDialog] = useState(false)

  const [isSaving, setIsSaving] = useState(false)

  const today = new Date().toISOString().split("T")[0]

  const loadExistingCVData = async () => {
    try {
      const localCVData = localStorage.getItem("candidate_cv_data")

      if (localCVData) {
        const cvData = JSON.parse(localCVData)

        if (cvData.basic_info) {
          setSelectedCountry(cvData.basic_info.country || "")
          setSelectedWorkLocations(cvData.basic_info.work_locations || [])
          setIsEuCitizen(cvData.basic_info.eu_citizenship ? "yes" : "no")
          setGdprConsent(cvData.basic_info.gdpr_consent || false)
        }

        if (cvData.work_conditions) {
          setSelectedEmploymentTypes(cvData.work_conditions.employment_types || [])
          setStartDate(cvData.work_conditions.start_date || "")
          setHasDriversLicense(cvData.work_conditions.driving_license || "")
          setSelectedLicenseTypes(cvData.work_conditions.license_types || [])
        }

        if (cvData.skills) {
          const hasNoSkills = !cvData.skills.computer_skills || cvData.skills.computer_skills.length === 0
          setHasNoComputerSkills(hasNoSkills)
          setSelectedComputerSkills(cvData.skills.computer_skills || [])
          setLanguages(
            cvData.skills.languages && cvData.skills.languages.length > 0
              ? cvData.skills.languages
              : [{ language: "", level: "" }],
          )
        }

        if (cvData.education) {
          setEducationLevel(cvData.education.level || "")
          setFieldOfStudy(cvData.education.fieldOfStudy || "")
          setAcademicTitle(cvData.education.academic_title || "")
        }

        if (cvData.work_experience) {
          const hasNoExp = !cvData.work_experience || cvData.work_experience.length === 0
          setHasNoWorkExperience(hasNoExp)
          setWorkExperiences(cvData.work_experience || [])
        }

        if (cvData.desired_positions && cvData.desired_positions.length > 0) {
          setDesiredPositions(cvData.desired_positions)
        }

        setExpectedSalary(cvData.expected_salary || "")
        setPublishProfile(cvData.publish_profile || false)

        setCvDataLoaded(true)
      } else {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          const { data: profile } = await supabase
            .from("candidate_profiles")
            .select("cv_summary")
            .eq("id", user.id)
            .single()

          if (profile && profile.cv_summary) {
            const cvData = typeof profile.cv_summary === "string" ? JSON.parse(profile.cv_summary) : profile.cv_summary

            if (cvData.basic_info) {
              setSelectedCountry(cvData.basic_info.country || "")
              setSelectedWorkLocations(cvData.basic_info.work_locations || [])
              setIsEuCitizen(cvData.basic_info.eu_citizenship ? "yes" : "no")
              setGdprConsent(cvData.basic_info.gdpr_consent || false)
            }

            if (cvData.work_conditions) {
              setSelectedEmploymentTypes(cvData.work_conditions.employment_types || [])
              setStartDate(cvData.work_conditions.start_date || "")
              setHasDriversLicense(cvData.work_conditions.driving_license || "")
              setSelectedLicenseTypes(cvData.work_conditions.license_types || [])
            }

            if (cvData.skills) {
              const hasNoSkills = !cvData.skills.computer_skills || cvData.skills.computer_skills.length === 0
              setHasNoComputerSkills(hasNoSkills)
              setSelectedComputerSkills(cvData.skills.computer_skills || [])
              setLanguages(
                cvData.skills.languages && cvData.skills.languages.length > 0
                  ? cvData.skills.languages
                  : [{ language: "", level: "" }],
              )
            }

            if (cvData.education) {
              setEducationLevel(cvData.education.level || "")
              setFieldOfStudy(cvData.education.fieldOfStudy || "")
              setAcademicTitle(cvData.education.academic_title || "")
            }

            if (cvData.work_experience) {
              const hasNoExp = !cvData.work_experience || cvData.work_experience.length === 0
              setHasNoWorkExperience(hasNoExp)
              setWorkExperiences(cvData.work_experience || [])
            }

            if (cvData.desired_positions && cvData.desired_positions.length > 0) {
              setDesiredPositions(cvData.desired_positions)
            }

            setExpectedSalary(cvData.expected_salary || "")
            setPublishProfile(cvData.publish_profile || false)

            setCvDataLoaded(true)
          }
        }
      }
    } catch (error) {
      console.error("Error loading existing CV data:", error)
      toast({
        title: "Upozornenie",
        description: "Nepodarilo sa načítať existujúce CV údaje",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    if (open && editMode && !cvDataLoaded) {
      loadExistingCVData()
    } else if (!open) {
      setCvDataLoaded(false)
    }
  }, [open, editMode])

  const calculateProgress = () => {
    let completed = 0
    const total = 15 // Still assuming 15 for now, can be adjusted if more fields become mandatory

    if (selectedCountry) completed++
    if (selectedWorkLocations.length > 0) completed++
    if (isEuCitizen) completed++
    if (gdprConsent) completed++
    if (selectedEmploymentTypes.length > 0) completed++
    if (startDate) completed++
    if (hasDriversLicense) completed++
    // if (computerSkillsCategory) completed++
    // CHANGE: Include "no computer skills" in progress calculation if selected
    if (hasNoComputerSkills || selectedComputerSkills.some((skill) => skill.category && skill.tool && skill.level))
      completed++
    if (languages.some((lang) => lang.language && lang.level)) completed++
    if (educationLevel) completed++
    if (fieldOfStudy) completed++
    if (academicTitle) completed++
    if (hasNoWorkExperience || workExperiences.some((exp) => exp.profession && exp.workType && exp.years)) completed++
    if (desiredPositions.some((pos) => pos.profession && pos.workType)) completed++
    if (expectedSalary) completed++
    // removed publishProfile from progress calculation

    return Math.round((completed / total) * 100)
  }

  const progress = calculateProgress()

  // Handlers
  const handleWorkLocationAdd = (location: string) => {
    if (!selectedWorkLocations.includes(location)) {
      setSelectedWorkLocations([...selectedWorkLocations, location])
    }
  }

  const handleWorkLocationRemove = (location: string) => {
    setSelectedWorkLocations(selectedWorkLocations.filter((loc) => loc !== location))
  }

  const handleEmploymentTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setSelectedEmploymentTypes([...selectedEmploymentTypes, type])
    } else {
      setSelectedEmploymentTypes(selectedEmploymentTypes.filter((t) => t !== type))
    }
  }

  const handleLicenseTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setSelectedLicenseTypes([...selectedLicenseTypes, type])
    } else {
      setSelectedLicenseTypes(selectedLicenseTypes.filter((t) => t !== type))
    }
  }

  const addComputerSkill = () => {
    // CHANGE: Added category field to each skill
    setSelectedComputerSkills([...selectedComputerSkills, { category: "", tool: "", level: "" }])
  }

  const removeComputerSkill = (index: number) => {
    setSelectedComputerSkills(selectedComputerSkills.filter((_, i) => i !== index))
  }

  const updateComputerSkill = (index: number, field: "category" | "tool" | "level", value: string) => {
    const newSkills = [...selectedComputerSkills]
    newSkills[index][field] = value

    if (field === "tool" && value) {
      const currentSkill = { ...newSkills[index] }
      if (currentSkill.category && currentSkill.tool) {
        const duplicateIndex = newSkills.findIndex(
          (skill, i) => i !== index && skill.category === currentSkill.category && skill.tool === currentSkill.tool,
        )
        if (duplicateIndex !== -1) {
          toast({
            title: "Duplicita",
            description: "Túto počítačovú zručnosť už máte pridanú v CV",
            variant: "destructive",
          })
          return
        }
      }
    }

    if (field === "category") {
      newSkills[index].tool = ""
      newSkills[index].level = ""
    }
    setSelectedComputerSkills(newSkills)
  }

  const addLanguage = () => {
    setLanguages([...languages, { language: "", level: "" }])
  }

  const removeLanguage = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index))
  }

  const updateLanguage = (index: number, field: "language" | "level", value: string) => {
    const newLanguages = [...languages]
    newLanguages[index][field] = value

    if (field === "language" && value) {
      const duplicateIndex = newLanguages.findIndex((lang, i) => i !== index && lang.language === value)
      if (duplicateIndex !== -1) {
        toast({
          title: "Duplicita",
          description: "Tento jazyk už máte pridaný v CV",
          variant: "destructive",
        })
        return
      }
    }

    setLanguages(newLanguages)
  }

  const addWorkExperience = () => {
    setWorkExperiences([...workExperiences, { profession: "", workType: "", years: "", certificate: "" }])
  }

  const removeWorkExperience = (index: number) => {
    setWorkExperiences(workExperiences.filter((_, i) => i !== index))
  }

  const updateWorkExperience = (index: number, field: string, value: any) => {
    const newExperiences = [...workExperiences]
    newExperiences[index] = { ...newExperiences[index], [field]: value }

    if ((field === "profession" || field === "workType") && value) {
      const currentExp = { ...newExperiences[index] }
      if (currentExp.profession && currentExp.workType) {
        const duplicateIndex = newExperiences.findIndex(
          (exp, i) => i !== index && exp.profession === currentExp.profession && exp.workType === currentExp.workType,
        )
        if (duplicateIndex !== -1) {
          toast({
            title: "Duplicita",
            description: "Túto pracovnú skúsenosť už máte pridanú v CV",
            variant: "destructive",
          })
          return
        }
      }
    }

    if (field === "profession") {
      newExperiences[index].workType = ""
      newExperiences[index].certificate = ""
    } else if (field === "workType") {
      newExperiences[index].certificate = ""
    }

    setWorkExperiences(newExperiences)
  }

  const addDesiredPosition = () => {
    setDesiredPositions([...desiredPositions, { profession: "", workType: "" }])
  }

  const removeDesiredPosition = (index: number) => {
    setDesiredPositions(desiredPositions.filter((_, i) => i !== index))
  }

  const updateDesiredPosition = (index: number, field: "profession" | "workType", value: string) => {
    const newPositions = [...desiredPositions]
    newPositions[index][field] = value

    if ((field === "profession" || field === "workType") && value) {
      const currentPos = { ...newPositions[index] }
      if (currentPos.profession && currentPos.workType) {
        const duplicateIndex = newPositions.findIndex(
          (pos, i) => i !== index && pos.profession === currentPos.profession && pos.workType === currentPos.workType,
        )
        if (duplicateIndex !== -1) {
          toast({
            title: "Duplicita",
            description: "Túto hľadanú pozíciu už máte pridanú v CV",
            variant: "destructive",
          })
          return
        }
      }
    }

    setDesiredPositions(newPositions)
  }

  const generateAnonymousId = async (): Promise<string> => {
    const supabase = createClient()
    let isUnique = false
    let anonymousId = ""

    while (!isUnique) {
      // Generate random 8-digit number
      anonymousId = Math.floor(10000000 + Math.random() * 90000000).toString()

      // Check if it already exists in database
      const { data } = await supabase
        .from("candidate_profiles")
        .select("anonymous_id")
        .eq("anonymous_id", anonymousId)
        .single()

      if (!data) {
        isUnique = true
      }
    }

    return anonymousId
  }

  // Save CV to database
  const saveCVToDatabase = async () => {
    try {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()

      let anonymousId = ""
      if (editMode) {
        const localCVData = localStorage.getItem("candidate_cv_data")
        if (localCVData) {
          const existingData = JSON.parse(localCVData)
          anonymousId = existingData.anonymous_id || ""
        }
      }

      if (!anonymousId) {
        anonymousId = Math.floor(10000000 + Math.random() * 90000000).toString()
      }

      const cvData = {
        basic_info: {
          country: selectedCountry,
          work_locations: selectedWorkLocations,
          eu_citizenship: isEuCitizen === "yes",
          gdpr_consent: gdprConsent,
        },
        work_conditions: {
          employment_types: selectedEmploymentTypes,
          start_date: startDate,
          driving_license: hasDriversLicense,
          license_types: selectedLicenseTypes,
        },
        skills: {
          computer_skills: hasNoComputerSkills
            ? []
            : selectedComputerSkills
                .filter((skill) => skill.category && skill.tool && skill.level)
                .map((skill) => ({
                  category: skill.category,
                  tool: skill.tool,
                  level: skill.level,
                })),
          languages: languages.filter((lang) => lang.language && lang.level),
        },
        education: {
          level: educationLevel,
          fieldOfStudy: fieldOfStudy,
          academic_title: academicTitle,
        },
        work_experience: hasNoWorkExperience
          ? []
          : workExperiences
              .filter((exp) => exp.profession && exp.workType && exp.years)
              .map((exp) => ({
                profession: exp.profession,
                workType: exp.workType,
                years: exp.years,
                certificate: exp.certificate && exp.certificate !== "none" ? exp.certificate : null,
              })),
        desired_positions: desiredPositions.filter((pos) => pos.profession && pos.workType),
        expected_salary: expectedSalary,
        publish_profile: publishProfile,
        anonymous_id: anonymousId,
        completed: true,
        completed_at: new Date().toISOString(),
      }

      const cvDisplayData = {
        work_experience: cvData.work_experience,
        desired_positions: cvData.desired_positions,
        languages: cvData.skills.languages,
        computer_skills: cvData.skills.computer_skills,
        work_locations: selectedWorkLocations,
        expected_salary: expectedSalary,
        anonymous_id: anonymousId,
        drivers_license: hasDriversLicense === "yes",
        license_types: selectedLicenseTypes,
        employment_type: selectedEmploymentTypes.join(", "),
        start_date: startDate,
      }

      localStorage.setItem("candidate_cv_data", JSON.stringify(cvData))
      localStorage.setItem("candidate_cv_full_data", JSON.stringify(cvDisplayData))
      localStorage.setItem("cv_completed", "true")

      if (!user) {
        window.dispatchEvent(new Event("cv-updated"))
        window.dispatchEvent(new Event("cv-completed"))

        toast({
          title: editMode ? "CV aktualizované" : "CV uložené lokálne",
          description: `CV bolo ${editMode ? "aktualizované" : "uložené"}. Pre trvalé uloženie sa prosím prihláste. Vaše anonymné ID: ${anonymousId}`,
        })
        return true
      }

      const { data: countries, error: countriesError } = await supabase
        .from("countries")
        .select("id, name")
        .in("name", selectedWorkLocations)

      if (countriesError) {
        console.error("Error fetching countries:", countriesError)
        throw countriesError
      }

      const countryUUIDs = countries?.map((c) => c.id) || []

      const supabaseData = {
        computer_skills: cvData.skills?.computer_skills || [],
        languages: cvData.skills?.languages || [],
        work_experience: cvData.work_experience || [],
        work_country_preferences: countryUUIDs, // Use UUIDs instead of country names
        work_experience_years: hasNoWorkExperience
          ? 0
          : Math.max(
              ...workExperiences
                .filter((exp) => exp.years)
                .map((exp) => {
                  const match = exp.years.match(/\d+/)
                  return match ? Number.parseInt(match[0]) : 0
                }),
              0,
            ),
        salary_expectation: expectedSalary ? Number.parseFloat(expectedSalary) : null,
        availability_date: startDate || null,
        education_level: educationLevel,
        cv_summary: cvData,
        auto_contact_enabled: publishProfile,
        anonymous_id: anonymousId,
        updated_at: new Date().toISOString(),
      }

      const { data: existingProfile, error: checkError } = await supabase
        .from("candidate_profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle()

      if (checkError) {
        console.error("Error checking existing profile:", checkError)
      }

      if (existingProfile) {
        const { error: updateError } = await supabase.from("candidate_profiles").update(supabaseData).eq("id", user.id)

        if (updateError) {
          console.error("Update error:", updateError)
          throw updateError
        }
      } else {
        const { error: insertError } = await supabase.from("candidate_profiles").insert([
          {
            id: user.id,
            ...supabaseData,
            created_at: new Date().toISOString(),
          },
        ])

        if (insertError) {
          console.error("Insert error:", insertError)
          throw insertError
        }
      }

      window.dispatchEvent(new Event("cv-updated"))
      window.dispatchEvent(new Event("cv-completed"))

      toast({
        title: "Úspech",
        description: `CV bolo úspešne ${editMode ? "aktualizované" : "uložené"} do databázy. Vaše anonymné ID: ${anonymousId}`,
      })

      return true
    } catch (error) {
      console.error("Error in saveCVToDatabase:", error)
      toast({
        title: "Chyba",
        description: `Nepodarilo sa ${editMode ? "aktualizovať" : "uložiť"} CV do databázy. CV je uložené lokálne.`,
        variant: "destructive",
      })
      return false
    }
  }

  // Step validation
  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return selectedCountry && selectedWorkLocations.length > 0 && isEuCitizen && gdprConsent
      case 2:
        return selectedEmploymentTypes.length > 0 && startDate && hasDriversLicense
      case 3:
        return (
          (hasNoComputerSkills ||
            selectedComputerSkills.some((skill) => skill.category && skill.tool && skill.level)) &&
          languages.length > 0 &&
          languages.some((lang) => lang.language && lang.level)
        )
      case 4:
        return (
          educationLevel &&
          fieldOfStudy &&
          (hasNoWorkExperience || workExperiences.some((exp) => exp.profession && exp.workType && exp.years))
        )
      case 5:
        const hasValidPosition = desiredPositions.some((pos) => {
          return pos.profession && pos.profession.trim() !== "" && pos.workType && pos.workType.trim() !== ""
        })
        const hasValidSalary = expectedSalary && expectedSalary.trim() !== ""
        return hasValidPosition && hasValidSalary
      default:
        return true
    }
  }

  const safeCertificateMappingIndex =
    certificateMappingIndex && typeof certificateMappingIndex === "object" ? certificateMappingIndex : {}

  const safeProfessionsData = professionsData && typeof professionsData === "object" ? professionsData : {}

  const handleComplete = async () => {
    if (isSaving) return

    setIsSaving(true)
    const saved = await saveCVToDatabase()

    if (saved) {
      onComplete()
      onOpenChange(false)

      setTimeout(() => {
        setShowSuccessModal(true)
        setIsSaving(false)
      }, 300)
    } else {
      setIsSaving(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            {/* Replaced hardcoded title with i18n */}
            <DialogTitle>{t.title}</DialogTitle>
            <div className="space-y-2 mt-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                {/* Replaced hardcoded text with i18n */}
                <span>
                  {t.step} {currentStep} {t.of} {totalSteps}
                </span>
                <span>
                  {progress}% {t.completed}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </DialogHeader>

          <div className="mt-6 space-y-6">
            {/* Step 1: Základné informácie */}
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Replaced hardcoded title with i18n */}
                <h3 className="text-lg font-semibold">{t.steps.basicInfo.title}</h3>

                <div className="space-y-2">
                  {/* Replaced hardcoded label with i18n */}
                  <label className="text-sm font-medium">
                    {t.steps.basicInfo.country} {t.steps.basicInfo.required}
                  </label>
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger>
                      {/* Replaced hardcoded placeholder with i18n */}
                      <SelectValue placeholder={t.steps.basicInfo.countryPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {formOptions.countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t.steps.basicInfo.workLocations} {t.steps.basicInfo.required}
                  </label>
                  <Select onValueChange={handleWorkLocationAdd}>
                    <SelectTrigger>
                      {/* Replaced hardcoded placeholder with i18n */}
                      <SelectValue placeholder={t.steps.basicInfo.workLocationsPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {formOptions.countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* Simplified Badge and removed redundant check */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedWorkLocations.map((location) => (
                      <Badge key={location} variant="secondary" className="gap-1">
                        {location}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => handleWorkLocationRemove(location)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t.steps.basicInfo.euCitizenLabel} {t.steps.basicInfo.required}
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="euCitizenYes"
                        name="euCitizen"
                        value="yes"
                        checked={isEuCitizen === "yes"}
                        onChange={(e) => setIsEuCitizen(e.target.value)}
                        className="h-4 w-4"
                      />
                      <label htmlFor="euCitizenYes" className="text-sm cursor-pointer">
                        {t.steps.basicInfo.euCitizen}
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="euCitizenNo"
                        name="euCitizen"
                        value="no"
                        checked={isEuCitizen === "no"}
                        onChange={(e) => setIsEuCitizen(e.target.value)}
                        className="h-4 w-4"
                      />
                      <label htmlFor="euCitizenNo" className="text-sm cursor-pointer">
                        {t.steps.basicInfo.nonEuCitizen}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {/* Simplified Checkbox and used i18n */}
                    <Checkbox
                      id="gdpr"
                      checked={gdprConsent}
                      onCheckedChange={(checked) => setGdprConsent(!!checked)}
                    />
                    <label htmlFor="gdpr" className="text-sm cursor-pointer">
                      {t.steps.basicInfo.gdprConsent} {t.steps.basicInfo.required}
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">
                    {t.steps.basicInfo.gdprConsentText}{" "}
                    <button
                      type="button"
                      onClick={() => setShowGDPRDialog(true)}
                      className="text-teal-600 hover:text-teal-700 underline"
                    >
                      GDPR
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Pracovné podmienky */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Replaced hardcoded title with i18n */}
                <h3 className="text-lg font-semibold">{t.steps.workConditions.title}</h3>

                <div className="space-y-2">
                  {/* Replaced hardcoded label with i18n */}
                  <label className="text-sm font-medium">
                    {t.steps.workConditions.employmentType} {t.steps.workConditions.required}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {formOptions.employmentTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={type}
                          checked={selectedEmploymentTypes.includes(type)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedEmploymentTypes([...selectedEmploymentTypes, type])
                            } else {
                              setSelectedEmploymentTypes(selectedEmploymentTypes.filter((t) => t !== type))
                            }
                          }}
                        />
                        <label htmlFor={type} className="text-sm cursor-pointer">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  {/* Replaced hardcoded label with i18n */}
                  <label className="text-sm font-medium">
                    {t.steps.workConditions.startDate} {t.steps.workConditions.required}
                  </label>
                  <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} min={today} />
                </div>

                <div className="space-y-2">
                  {/* Replaced hardcoded label with i18n */}
                  <label className="text-sm font-medium">
                    {t.steps.workConditions.driversLicense} {t.steps.workConditions.required}
                  </label>
                  <Select value={hasDriversLicense} onValueChange={setHasDriversLicense}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Replaced hardcoded options with i18n */}
                      <SelectItem value="yes">{t.steps.workConditions.yes}</SelectItem>
                      <SelectItem value="no">{t.steps.workConditions.no}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {hasDriversLicense === "yes" && (
                  <div className="space-y-2">
                    {/* Replaced hardcoded label with i18n */}
                    <label className="text-sm font-medium">{t.steps.workConditions.licenseTypes}</label>
                    <div className="grid grid-cols-4 gap-2">
                      {licenseTypes.map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`license-${type}`}
                            checked={selectedLicenseTypes.includes(type)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedLicenseTypes([...selectedLicenseTypes, type])
                              } else {
                                setSelectedLicenseTypes(selectedLicenseTypes.filter((t) => t !== type))
                              }
                            }}
                          />
                          <label htmlFor={`license-${type}`} className="text-sm cursor-pointer">
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Skills and Languages */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">{t.steps.skills.title}</h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t.steps.skills.computerSkills}</label>

                    {/* CHANGE: Added "no computer skills" checkbox */}
                    <div className="flex items-center space-x-2 p-4 border rounded-lg bg-muted/50">
                      <Checkbox
                        id="noComputerSkills"
                        checked={hasNoComputerSkills}
                        onCheckedChange={(checked) => {
                          setHasNoComputerSkills(!!checked)
                          if (checked) {
                            setSelectedComputerSkills([])
                          }
                        }}
                      />
                      <label htmlFor="noComputerSkills" className="text-sm cursor-pointer">
                        {t.steps.skills.computerSkillsNone}
                      </label>
                    </div>

                    {!hasNoComputerSkills && (
                      <div className="flex items-center gap-3 py-2">
                        <div className="flex-1 h-px bg-border"></div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">
                          alebo vyberte zručnosti
                        </span>
                        <div className="flex-1 h-px bg-border"></div>
                      </div>
                    )}

                    {/* CHANGE: Replaced dropdown-based selector with chip-based selector */}
                    {!hasNoComputerSkills && (
                      <ComputerSkillsChipSelector
                        selectedSkills={selectedComputerSkills}
                        onChange={setSelectedComputerSkills}
                        disabled={hasNoComputerSkills}
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Replaced hardcoded label with i18n */}
                  <label className="text-sm font-medium">
                    {t.steps.skills.languages} {t.steps.skills.required}
                    <span className="block text-xs text-muted-foreground font-normal mt-1">
                      {/* CHANGE: Use translation for helper text */}
                      {t.steps.skills.languagesHelper}
                    </span>
                  </label>
                  {languages.map((lang, index) => (
                    <div key={index} className="flex gap-2 items-end">
                      <div className="flex-1 space-y-2">
                        {/* Replaced hardcoded label with i18n */}
                        <label className="text-xs text-muted-foreground">
                          {t.steps.skills.languageNumber} {index + 1}
                        </label>
                        <Select
                          value={lang.language}
                          onValueChange={(value) => {
                            const newLanguages = [...languages]
                            newLanguages[index].language = value
                            setLanguages(newLanguages)
                          }}
                        >
                          <SelectTrigger>
                            {/* Replaced hardcoded placeholder with i18n */}
                            <SelectValue placeholder={t.steps.skills.languagePlaceholder} />
                          </SelectTrigger>
                          <SelectContent>
                            {formOptions.languages.map((language) => (
                              <SelectItem key={language} value={language}>
                                {language}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1 space-y-2">
                        <label className="text-xs text-muted-foreground">&nbsp;</label>
                        <Select
                          value={lang.level}
                          onValueChange={(value) => {
                            const newLanguages = [...languages]
                            newLanguages[index].level = value
                            setLanguages(newLanguages)
                          }}
                        >
                          <SelectTrigger>
                            {/* Replaced hardcoded placeholder with i18n */}
                            <SelectValue placeholder={t.steps.skills.levelPlaceholder} />
                          </SelectTrigger>
                          <SelectContent>
                            {formOptions.languageLevels.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setLanguages(languages.filter((_, i) => i !== index))}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {/* Replaced hardcoded button text with i18n */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLanguages([...languages, { language: "", level: "" }])}
                  >
                    {t.steps.skills.addLanguage}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Education and Work Experience */}
            {currentStep === 4 && (
              <div className="space-y-6">
                {/* Replaced hardcoded title with i18n */}
                <h3 className="text-lg font-semibold">{t.steps.education.title}</h3>

                <div className="space-y-2">
                  {/* Replaced hardcoded label with i18n */}
                  <label className="text-sm font-medium">
                    {t.steps.education.level} {t.steps.education.required}
                  </label>
                  <Select value={educationLevel} onValueChange={setEducationLevel}>
                    <SelectTrigger>
                      {/* Replaced hardcoded placeholder with i18n */}
                      <SelectValue placeholder={t.steps.education.levelPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {formOptions.educationLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  {/* Replaced hardcoded label with i18n */}
                  <label className="text-sm font-medium">
                    {t.steps.education.field} {t.steps.education.required}
                  </label>
                  <Select value={fieldOfStudy} onValueChange={setFieldOfStudy}>
                    <SelectTrigger>
                      <SelectValue placeholder={t.steps.education.fieldPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {studyFields.flatMap((fieldGroup) =>
                        fieldGroup.fields.map((field: string) => (
                          <SelectItem key={field} value={field}>
                            {field}
                          </SelectItem>
                        )),
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  {/* Replaced hardcoded label with i18n */}
                  <label className="text-sm font-medium">{t.steps.education.title_academic}</label>
                  <Select value={academicTitle} onValueChange={setAcademicTitle}>
                    <SelectTrigger>
                      {/* Replaced hardcoded placeholder with i18n */}
                      <SelectValue placeholder={t.steps.education.titlePlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {formOptions.academicTitles.map((title) => (
                        <SelectItem key={title} value={title}>
                          {title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium">{t.steps.education.workExperience}</label>

                  <div className="flex items-center space-x-2 p-4 border rounded-lg bg-muted/50">
                    <Checkbox
                      id="noWorkExperience"
                      checked={hasNoWorkExperience}
                      onCheckedChange={(checked) => {
                        setHasNoWorkExperience(!!checked)
                        if (checked) {
                          setWorkExperiences([])
                        }
                      }}
                    />
                    <label htmlFor="noWorkExperience" className="text-sm cursor-pointer">
                      {t.steps.education.noWorkExperience}
                    </label>
                  </div>

                  {!hasNoWorkExperience && (
                    <div className="flex items-center gap-3 py-2">
                      <div className="flex-1 h-px bg-border"></div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">
                        alebo pridajte skúsenosti
                      </span>
                      <div className="flex-1 h-px bg-border"></div>
                    </div>
                  )}

                  {!hasNoWorkExperience && (
                    <>
                      {workExperiences.map((exp, index) => {
                        let availableCertificates: Array<{ id: string; title: string }> = []

                        try {
                          if (
                            exp.profession &&
                            exp.workType &&
                            safeCertificateMappingIndex &&
                            typeof safeCertificateMappingIndex === "object" &&
                            Object.keys(safeCertificateMappingIndex || {}).length > 0
                          ) {
                            availableCertificates = getCertificatesForWorkType(
                              exp.profession,
                              exp.workType,
                              safeCertificateMappingIndex,
                            )
                          }
                        } catch (error) {
                          console.error("Error loading certificates:", error)
                          availableCertificates = []
                        }

                        return (
                          <div key={index} className="space-y-4 p-4 border rounded-lg">
                            <div className="flex justify-between items-center">
                              {/* Replaced hardcoded label with i18n */}
                              <h4 className="font-medium">
                                {t.steps.education.experienceNumber}
                                {index + 1}
                              </h4>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeWorkExperience(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>

                            <Select
                              value={exp.profession}
                              onValueChange={(value) => updateWorkExperience(index, "profession", value)}
                            >
                              <SelectTrigger>
                                {/* Replaced hardcoded placeholder with i18n */}
                                <SelectValue placeholder={t.steps.education.professionPlaceholder} />
                              </SelectTrigger>
                              <SelectContent>
                                {professionsList.map((profession) => (
                                  <SelectItem key={profession} value={profession}>
                                    {translateProfessionName(profession, currentLang)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            {exp.profession && (
                              <Select
                                value={exp.workType}
                                onValueChange={(value) => updateWorkExperience(index, "workType", value)}
                              >
                                <SelectTrigger>
                                  {/* Replaced hardcoded placeholder with i18n */}
                                  <SelectValue placeholder={t.steps.education.workTypePlaceholder} />
                                </SelectTrigger>
                                <SelectContent>
                                  {(professionsWithWorkTypes[exp.profession] || []).map((workType) => (
                                    <SelectItem key={workType} value={workType}>
                                      {translateProfession(workType, currentLang)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}

                            {exp.workType && (
                              <Select
                                value={exp.years}
                                onValueChange={(value) => updateWorkExperience(index, "years", value)}
                              >
                                <SelectTrigger>
                                  {/* Replaced hardcoded placeholder with i18n */}
                                  <SelectValue placeholder={t.steps.education.experiencePlaceholder} />
                                </SelectTrigger>
                                <SelectContent>
                                  {translatedYearsOptions.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}

                            {exp.years && availableCertificates.length > 0 && (
                              <Select
                                value={exp.certificate}
                                onValueChange={(value) => updateWorkExperience(index, "certificate", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder={t.steps.education.certificatePlaceholder} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">{t.steps.education.noCertificate}</SelectItem>
                                  {availableCertificates.map((cert) => (
                                    <SelectItem key={cert.id} value={cert.id}>
                                      {cert.title}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        )
                      })}
                      <Button type="button" variant="outline" onClick={addWorkExperience}>
                        <Plus className="h-4 w-4 mr-2" />
                        {t.steps.education.addExperience}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Step 5: Hľadaná pozícia */}
            {currentStep === 5 && (
              <div className="space-y-6">
                {/* Replaced hardcoded title with i18n */}
                <h3 className="text-lg font-semibold">{t.steps.desiredPosition.title}</h3>

                <div className="space-y-4">
                  {/* Replaced hardcoded label with i18n */}
                  <label className="text-sm font-medium">
                    {t.steps.desiredPosition.position} {t.steps.desiredPosition.required}
                  </label>
                  {desiredPositions.map((pos, index) => (
                    <div key={index} className="space-y-4 p-4 border rounded-lg">
                      <div className="flex justify-between items-center">
                        {/* Replaced hardcoded label with i18n */}
                        <h4 className="font-medium">
                          {t.steps.desiredPosition.positionNumber} {index + 1}
                        </h4>
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setDesiredPositions(desiredPositions.filter((_, i) => i !== index))}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <Select
                        value={pos.profession}
                        onValueChange={(value) => {
                          const newPositions = [...desiredPositions]
                          newPositions[index].profession = value
                          newPositions[index].workType = ""
                          setDesiredPositions(newPositions)
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t.steps.desiredPosition.professionPlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {professionsList.map((profession) => (
                            <SelectItem key={profession} value={profession}>
                              {translateProfessionName(profession, currentLang)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {pos.profession && (
                        <Select
                          value={pos.workType}
                          onValueChange={(value) => {
                            const newPositions = [...desiredPositions]
                            newPositions[index].workType = value
                            setDesiredPositions(newPositions)
                          }}
                        >
                          <SelectTrigger>
                            {/* Replaced hardcoded placeholder with i18n */}
                            <SelectValue placeholder={t.steps.desiredPosition.workTypePlaceholder} />
                          </SelectTrigger>
                          <SelectContent>
                            {(professionsWithWorkTypes[pos.profession] || []).map((workType) => (
                              <SelectItem key={workType} value={workType}>
                                {translateProfession(workType, currentLang)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  ))}
                  {/* Replaced hardcoded button text with i18n */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDesiredPositions([...desiredPositions, { profession: "", workType: "" }])}
                  >
                    {t.steps.desiredPosition.addPosition}
                  </Button>
                </div>

                <div className="space-y-2">
                  {/* Replaced hardcoded label with i18n */}
                  <label className="text-sm font-medium">
                    {t.steps.desiredPosition.salary} {t.steps.desiredPosition.required}
                  </label>
                  <Select value={expectedSalary} onValueChange={setExpectedSalary}>
                    <SelectTrigger>
                      <SelectValue placeholder={t.steps.desiredPosition.salaryPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1000">1000 EUR</SelectItem>
                      <SelectItem value="2000">2000 EUR</SelectItem>
                      <SelectItem value="3000">3000 EUR</SelectItem>
                      <SelectItem value="4000">4000 EUR</SelectItem>
                      <SelectItem value="5000">5000 EUR</SelectItem>
                      <SelectItem value="6000">6000 EUR</SelectItem>
                      <SelectItem value="7000">7000 EUR</SelectItem>
                      <SelectItem value="8000">8000 EUR</SelectItem>
                      <SelectItem value="9000">9000 EUR</SelectItem>
                      <SelectItem value="10000">10000 EUR</SelectItem>
                      <SelectItem value="10000+">10000+ EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {/* Simplified Checkbox and used i18n */}
                    <Checkbox
                      id="publish"
                      checked={publishProfile}
                      onCheckedChange={(checked) => setPublishProfile(!!checked)}
                    />
                    <label htmlFor="publish" className="text-sm cursor-pointer">
                      {t.steps.desiredPosition.publishProfile}
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">{t.steps.desiredPosition.publishProfileText}</p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between pt-4">
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                {/* Replaced hardcoded text with i18n */}
                {t.buttons.back}
              </Button>
            )}
            {currentStep < totalSteps && (
              <Button
                type="button"
                onClick={() => {
                  if (canProceedToNextStep()) {
                    setCurrentStep(currentStep + 1)
                  } else {
                    toast({
                      title: "Chýbajúce údaje",
                      description: "Prosím vyplňte všetky povinné polia",
                      variant: "destructive",
                    })
                  }
                }}
                className="ml-auto"
              >
                {/* Replaced hardcoded text with i18n */}
                {t.buttons.next}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
            {currentStep === totalSteps && (
              <div className="ml-auto space-y-2">
                <Button type="button" onClick={handleComplete} disabled={isSaving} className="min-w-[120px]">
                  {isSaving ? (
                    "Ukladám..."
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {t.buttons.complete}
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showGDPRDialog} onOpenChange={setShowGDPRDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>GDPR - Ochrana osobných údajov</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[70vh]">
            <CandidateGDPRNew />
          </div>
          <div className="flex justify-end pt-4">
            <Button onClick={() => setShowGDPRDialog(false)}>Zavrieť</Button>
          </div>
        </DialogContent>
      </Dialog>

      <CVSuccessModal open={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
    </>
  )
}
