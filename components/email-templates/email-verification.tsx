interface EmailVerificationProps {
  displayName: string
  verificationUrl: string
  userType: "candidate" | "company" | "recruiter"
}

export function EmailVerificationEmail({ displayName, verificationUrl, userType }: EmailVerificationProps) {
  const userTypeLabels = {
    candidate: "Kandidát",
    company: "Firma",
    recruiter: "Rekrúter",
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ backgroundColor: "#f8f9fa", padding: "20px", textAlign: "center" }}>
        <h1 style={{ color: "#0d9488", margin: "0", fontSize: "24px" }}>SOMVIAC</h1>
        <p style={{ color: "#6b7280", margin: "5px 0 0 0", fontSize: "14px" }}>Slovenský portál pre prácu</p>
      </div>

      <div style={{ padding: "30px 20px" }}>
        <h2 style={{ color: "#1f2937", marginBottom: "20px" }}>Potvrďte svoj email</h2>

        <p style={{ color: "#4b5563", lineHeight: "1.6", marginBottom: "20px" }}>Dobrý deň {displayName},</p>

        <p style={{ color: "#4b5563", lineHeight: "1.6", marginBottom: "20px" }}>
          Ďakujeme za registráciu v SOMVIAC systéme ako <strong>{userTypeLabels[userType]}</strong>. Pre dokončenie
          registrácie je potrebné potvrdiť vašu emailovú adresu.
        </p>

        <div style={{ textAlign: "center", margin: "30px 0" }}>
          <a
            href={verificationUrl}
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
            Potvrdiť email
          </a>
        </div>

        <p style={{ color: "#6b7280", fontSize: "14px", lineHeight: "1.6", marginBottom: "20px" }}>
          Ak nefunguje tlačidlo, skopírujte a vložte tento odkaz do vašeho prehliadača:
        </p>

        <p
          style={{
            color: "#0d9488",
            fontSize: "14px",
            wordBreak: "break-all",
            backgroundColor: "#f3f4f6",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        >
          {verificationUrl}
        </p>

        <div
          style={{
            backgroundColor: "#fef3c7",
            border: "1px solid #f59e0b",
            borderRadius: "6px",
            padding: "15px",
            marginBottom: "20px",
          }}
        >
          <p style={{ color: "#92400e", fontSize: "14px", margin: "0", lineHeight: "1.5" }}>
            <strong>Dôležité:</strong> Tento odkaz je platný 24 hodín. Ak sa nepodarí potvrdiť email včas, budete si
            môcť vyžiadať nový potvrdzovací email.
          </p>
        </div>

        <p style={{ color: "#4b5563", lineHeight: "1.6", marginBottom: "10px" }}>Po potvrdení emailu budete môcť:</p>

        <ul style={{ color: "#4b5563", lineHeight: "1.6", paddingLeft: "20px" }}>
          {userType === "candidate" && (
            <>
              <li>Vytvoriť a upravovať váš profil</li>
              <li>Prehliadať ponuky práce</li>
              <li>Kontaktovať firmy</li>
            </>
          )}
          {userType === "company" && (
            <>
              <li>Vytvoriť profil firmy</li>
              <li>Pridávať ponuky práce</li>
              <li>Vyhľadávať kandidátov</li>
              <li>Nakupovať coiny pre kontaktovanie kandidátov</li>
            </>
          )}
          {userType === "recruiter" && (
            <>
              <li>Vytvoriť váš rekrúterský profil</li>
              <li>Sprostredkovávať prácu</li>
              <li>Zarábať provízie</li>
              <li>Pozývať ďalších rekrúterov</li>
            </>
          )}
        </ul>
      </div>

      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "20px",
          textAlign: "center",
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <p style={{ color: "#6b7280", fontSize: "12px", margin: "0 0 10px 0" }}>
          Ak ste si nevyžiadali túto registráciu, môžete tento email ignorovať.
        </p>
        <p style={{ color: "#6b7280", fontSize: "12px", margin: "0" }}>© 2025 SOMVIAC. Všetky práva vyhradené.</p>
      </div>
    </div>
  )
}

export function getEmailVerificationText(
  displayName: string,
  verificationUrl: string,
  userType: "candidate" | "company" | "recruiter",
): string {
  const userTypeLabels = {
    candidate: "Kandidát",
    company: "Firma",
    recruiter: "Rekrúter",
  }

  return `
Dobrý deň ${displayName},

Ďakujeme za registráciu v SOMVIAC systéme ako ${userTypeLabels[userType]}.

Pre dokončenie registrácie je potrebné potvrdiť vašu emailovú adresu kliknutím na tento odkaz:

${verificationUrl}

Tento odkaz je platný 24 hodín.

S pozdravom,
SOMVIAC tím
  `.trim()
}
