interface InvitationEmailProps {
  invitedEmail: string
  invitedType: "recruiter" | "candidate"
  invitedByName: string
  personalMessage?: string
  invitationCode: string
  invitationUrl: string
}

export function InvitationEmail({
  invitedEmail,
  invitedType,
  invitedByName,
  personalMessage,
  invitationCode,
  invitationUrl,
}: InvitationEmailProps) {
  const isRecruiter = invitedType === "recruiter"

  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "#0d9488", fontSize: "28px", margin: "0" }}>SOMVIAC</h1>
        <p style={{ color: "#6b7280", fontSize: "16px", margin: "5px 0 0 0" }}>Slovenský portál pre prácu</p>
      </div>

      {/* Main Content */}
      <div style={{ backgroundColor: "#f9fafb", padding: "30px", borderRadius: "8px", marginBottom: "20px" }}>
        <h2 style={{ color: "#1f2937", fontSize: "24px", marginBottom: "20px" }}>
          {isRecruiter ? "🤝 Pozvánka na spoluprácu" : "💼 Pozvánka na registráciu"}
        </h2>

        <p style={{ color: "#374151", fontSize: "16px", lineHeight: "1.6", marginBottom: "20px" }}>Ahoj,</p>

        <p style={{ color: "#374151", fontSize: "16px", lineHeight: "1.6", marginBottom: "20px" }}>
          <strong>{invitedByName}</strong> ťa pozval do SOMVIAC systému ako{" "}
          <strong>{isRecruiter ? "recruiter" : "kandidát"}</strong>.
        </p>

        {personalMessage && (
          <div
            style={{
              backgroundColor: "#e0f2f1",
              padding: "15px",
              borderRadius: "6px",
              marginBottom: "20px",
              borderLeft: "4px solid #0d9488",
            }}
          >
            <p style={{ color: "#374151", fontSize: "14px", fontStyle: "italic", margin: "0" }}>"{personalMessage}"</p>
          </div>
        )}

        <div style={{ marginBottom: "30px" }}>
          <h3 style={{ color: "#1f2937", fontSize: "18px", marginBottom: "15px" }}>
            {isRecruiter ? "Ako recruiter získaš:" : "Ako kandidát získaš:"}
          </h3>
          <ul style={{ color: "#374151", fontSize: "14px", lineHeight: "1.6", paddingLeft: "20px" }}>
            {isRecruiter ? (
              <>
                <li>Provízie z úspešne umiestnených kandidátov</li>
                <li>Možnosť pozývať ďalších recruiterov a kandidátov</li>
                <li>Prístup k databáze kvalifikovaných kandidátov</li>
                <li>Nástroje pre efektívne sprostredkovanie práce</li>
              </>
            ) : (
              <>
                <li>Prístup k exkluzívnym pracovným ponukám</li>
                <li>Personalizované odporúčania práce</li>
                <li>Podporu od skúsených recruiterov</li>
                <li>Možnosť vytvoriť si profesionálny profil</li>
              </>
            )}
          </ul>
        </div>

        {/* CTA Button */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <a
            href={invitationUrl}
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
            Prijať pozvánku a registrovať sa
          </a>
        </div>

        <p style={{ color: "#6b7280", fontSize: "12px", textAlign: "center", margin: "0" }}>
          Alebo skopíruj tento odkaz do prehliadača: <br />
          <span style={{ wordBreak: "break-all" }}>{invitationUrl}</span>
        </p>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", color: "#9ca3af", fontSize: "12px" }}>
        <p>Táto pozvánka je platná 30 dní od odoslania.</p>
        <p>Ak si nemyslíš, že by si mal/a dostať tento email, môžeš ho ignorovať.</p>
        <p style={{ marginTop: "20px" }}>© 2025 SOMVIAC - Slovenský portál pre prácu</p>
      </div>
    </div>
  )
}

// Plain text version for email clients that don't support HTML
export function getInvitationEmailText({
  invitedEmail,
  invitedType,
  invitedByName,
  personalMessage,
  invitationUrl,
}: InvitationEmailProps) {
  const isRecruiter = invitedType === "recruiter"

  return `
SOMVIAC - Slovenský portál pre prácu

${isRecruiter ? "Pozvánka na spoluprácu" : "Pozvánka na registráciu"}

Ahoj,

${invitedByName} ťa pozval do SOMVIAC systému ako ${isRecruiter ? "recruiter" : "kandidát"}.

${personalMessage ? `Osobná správa: "${personalMessage}"` : ""}

${isRecruiter ? "Ako recruiter získaš:" : "Ako kandidát získaš:"}
${
  isRecruiter
    ? `
- Provízie z úspešne umiestnených kandidátov
- Možnosť pozývať ďalších recruiterov a kandidátov  
- Prístup k databáze kvalifikovaných kandidátov
- Nástroje pre efektívne sprostredkovanie práce
`
    : `
- Prístup k exkluzívnym pracovným ponukám
- Personalizované odporúčania práce
- Podporu od skúsených recruiterov
- Možnosť vytvoriť si profesionálny profil
`
}

Prijať pozvánku: ${invitationUrl}

Táto pozvánka je platná 30 dní od odoslania.
Ak si nemyslíš, že by si mal/a dostať tento email, môžeš ho ignorovať.

© 2025 SOMVIAC - Slovenský portál pre prácu
  `.trim()
}
