interface WorkflowUpdateEmailProps {
  recipientName: string
  userType: "candidate" | "company" | "recruiter"
  fromState: string
  toState: string
  nextSteps?: string[]
  actionUrl?: string
}

export function WorkflowUpdateEmail({
  recipientName,
  userType,
  fromState,
  toState,
  nextSteps,
  actionUrl,
}: WorkflowUpdateEmailProps) {
  const getStateLabel = (state: string, userType: string) => {
    const stateLabels = {
      candidate: {
        registered: "Registrovaný",
        profile_completed: "Profil dokončený",
        basic_tests_completed: "Základné testy dokončené",
        ready_for_matching: "Pripravený na zaradenie",
        in_process: "V procese",
        employed: "Zamestnaný",
      },
      company: {
        registered: "Registrovaná",
        contract_signed: "Zmluva podpísaná",
        credits_purchased: "Kredity zakúpené",
        active_searching: "Aktívne vyhľadávanie",
        testing_candidates: "Testovanie kandidátov",
        hiring_process: "Náborový proces",
      },
      recruiter: {
        registered: "Registrovaný",
        contract_signed: "Zmluva podpísaná",
        inviting_candidates: "Pozývanie kandidátov",
        inviting_companies: "Pozývanie firiem",
        active_recruiting: "Aktívny recruiting",
      },
    }

    return stateLabels[userType as keyof typeof stateLabels]?.[state as keyof any] || state
  }

  const getNextStepsForState = (state: string, userType: string) => {
    const nextStepsMap = {
      candidate: {
        profile_completed: ["Dokončite základné testy", "Nahrajte si CV", "Vyplňte všetky povinné údaje"],
        basic_tests_completed: ["Váš profil je teraz aktívny", "Firmy vás môžu kontaktovať", "Sledujte notifikácie"],
        ready_for_matching: ["Čakajte na kontakt od firiem", "Udržiavajte profil aktuálny"],
        in_process: ["Spolupracujte s firmou", "Dokončite náborový proces"],
        employed: ["Gratulujeme k novému zamestnaniu!"],
      },
      company: {
        contract_signed: ["Zakúpte kredity", "Minimálne 50 kreditov na začiatok"],
        credits_purchased: ["Začnite vyhľadávať kandidátov", "Použite filtre pre presné výsledky"],
        active_searching: ["Prideľte testy vybraným kandidátom", "Hodnoťte výsledky testov"],
        testing_candidates: ["Odhaľte kontakty na najlepších kandidátov", "Začnite náborový proces"],
        hiring_process: ["Dokončite náborový proces", "Potvrďte zamestnanie kandidáta"],
      },
      recruiter: {
        contract_signed: ["Začnite pozývať kandidátov", "Pozývajte firmy do systému"],
        inviting_candidates: ["Pokračujte v pozývaní kandidátov", "Začnite pozývať aj firmy"],
        inviting_companies: ["Pokračujte v pozývaní firiem", "Začnite pozývať aj kandidátov"],
        active_recruiting: ["Spájajte kandidátov s firmami", "Zarábajte provízie z úspešných umiestnení"],
      },
    }

    return nextStepsMap[userType as keyof typeof nextStepsMap]?.[state as keyof any] || []
  }

  const currentStateLabel = getStateLabel(toState, userType)
  const suggestedNextSteps = nextSteps || getNextStepsForState(toState, userType)

  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "#0d9488", fontSize: "28px", margin: "0" }}>SOMVIAC</h1>
        <p style={{ color: "#6b7280", fontSize: "16px", margin: "5px 0 0 0" }}>Slovenský portál pre prácu</p>
      </div>

      {/* Main Content */}
      <div style={{ backgroundColor: "#f9fafb", padding: "30px", borderRadius: "8px", marginBottom: "20px" }}>
        <h2 style={{ color: "#1f2937", fontSize: "24px", marginBottom: "20px" }}>📈 Aktualizácia vašeho stavu</h2>

        <p style={{ color: "#374151", fontSize: "16px", lineHeight: "1.6", marginBottom: "20px" }}>
          Ahoj {recipientName},
        </p>

        <div
          style={{
            backgroundColor: "#e0f2f1",
            padding: "20px",
            borderRadius: "6px",
            marginBottom: "20px",
            borderLeft: "4px solid #10b981",
          }}
        >
          <p style={{ color: "#374151", fontSize: "16px", lineHeight: "1.6", margin: "0 0 10px 0" }}>
            Váš stav v systéme sa aktualizoval na:
          </p>
          <p style={{ color: "#059669", fontSize: "20px", fontWeight: "bold", margin: "0" }}>{currentStateLabel}</p>
        </div>

        {suggestedNextSteps.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ color: "#1f2937", fontSize: "18px", marginBottom: "15px" }}>Ďalšie kroky:</h3>
            <ul style={{ color: "#374151", fontSize: "14px", lineHeight: "1.6", paddingLeft: "20px" }}>
              {suggestedNextSteps.map((step, index) => (
                <li key={index} style={{ marginBottom: "5px" }}>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Progress indicator */}
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ color: "#1f2937", fontSize: "18px", marginBottom: "15px" }}>Váš pokrok:</h3>
          <div style={{ backgroundColor: "#e5e7eb", height: "8px", borderRadius: "4px", overflow: "hidden" }}>
            <div
              style={{
                backgroundColor: "#10b981",
                height: "100%",
                width: "60%", // This would be calculated based on actual progress
                borderRadius: "4px",
              }}
            />
          </div>
          <p style={{ color: "#6b7280", fontSize: "12px", marginTop: "5px" }}>
            Pokračujte v ďalších krokoch pre dosiahnutie 100% dokončenia
          </p>
        </div>

        {/* CTA Button */}
        {actionUrl && (
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <a
              href={actionUrl}
              style={{
                backgroundColor: "#0d9488",
                color: "white",
                padding: "12px 30px",
                textDecoration: "none",
                borderRadius: "6px",
                fontSize: "16px",
                fontWeight: "bold",
                display: "inline-block",
              }}
            >
              Pokračovať v procese
            </a>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", color: "#9ca3af", fontSize: "12px" }}>
        <p>Toto je automaticky generovaná aktualizácia zo systému SOMVIAC.</p>
        <p>Ak nechcete dostávať tieto notifikácie, môžete si ich vypnúť vo svojom profile.</p>
        <p style={{ marginTop: "20px" }}>© 2025 SOMVIAC - Slovenský portál pre prácu</p>
      </div>
    </div>
  )
}

// Plain text version
export function getWorkflowUpdateEmailText({
  recipientName,
  userType,
  fromState,
  toState,
  nextSteps,
  actionUrl,
}: WorkflowUpdateEmailProps) {
  const getStateLabel = (state: string, userType: string) => {
    const stateLabels = {
      candidate: {
        registered: "Registrovaný",
        profile_completed: "Profil dokončený",
        basic_tests_completed: "Základné testy dokončené",
        ready_for_matching: "Pripravený na zaradenie",
        in_process: "V procese",
        employed: "Zamestnaný",
      },
      company: {
        registered: "Registrovaná",
        contract_signed: "Zmluva podpísaná",
        credits_purchased: "Kredity zakúpené",
        active_searching: "Aktívne vyhľadávanie",
        testing_candidates: "Testovanie kandidátov",
        hiring_process: "Náborový proces",
      },
      recruiter: {
        registered: "Registrovaný",
        contract_signed: "Zmluva podpísaná",
        inviting_candidates: "Pozývanie kandidátov",
        inviting_companies: "Pozývanie firiem",
        active_recruiting: "Aktívny recruiting",
      },
    }

    return stateLabels[userType as keyof typeof stateLabels]?.[state as keyof any] || state
  }

  const currentStateLabel = getStateLabel(toState, userType)
  const nextStepsText =
    nextSteps && nextSteps.length > 0 ? `\n\nĎalšie kroky:\n${nextSteps.map((step) => `- ${step}`).join("\n")}` : ""

  return `
SOMVIAC - Slovenský portál pre prácu

AKTUALIZÁCIA STAVU

Ahoj ${recipientName},

Váš stav v systéme sa aktualizoval na: ${currentStateLabel}${nextStepsText}

${actionUrl ? `\nPokračovať v procese: ${actionUrl}` : ""}

Toto je automaticky generovaná aktualizácia zo systému SOMVIAC.
Ak nechcete dostávať tieto notifikácie, môžete si ich vypnúť vo svojom profile.

© 2025 SOMVIAC - Slovenský portál pre prácu
  `.trim()
}
