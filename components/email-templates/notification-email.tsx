interface NotificationEmailProps {
  recipientName: string
  notificationType:
    | "test_assigned"
    | "profile_expiring"
    | "employment_confirmed"
    | "contract_signed"
    | "workflow_update"
  title: string
  message: string
  data?: any
  actionUrl?: string
  actionText?: string
}

export function NotificationEmail({
  recipientName,
  notificationType,
  title,
  message,
  data,
  actionUrl,
  actionText,
}: NotificationEmailProps) {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "test_assigned":
        return "📝"
      case "profile_expiring":
        return "⚠️"
      case "employment_confirmed":
        return "🎉"
      case "contract_signed":
        return "✅"
      case "workflow_update":
        return "📈"
      default:
        return "🔔"
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "test_assigned":
        return "#3b82f6"
      case "profile_expiring":
        return "#ef4444"
      case "employment_confirmed":
        return "#10b981"
      case "contract_signed":
        return "#10b981"
      case "workflow_update":
        return "#0d9488"
      default:
        return "#6b7280"
    }
  }

  const notificationColor = getNotificationColor(notificationType)
  const notificationIcon = getNotificationIcon(notificationType)

  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "#0d9488", fontSize: "28px", margin: "0" }}>SOMVIAC</h1>
        <p style={{ color: "#6b7280", fontSize: "16px", margin: "5px 0 0 0" }}>Slovenský portál pre prácu</p>
      </div>

      {/* Main Content */}
      <div style={{ backgroundColor: "#f9fafb", padding: "30px", borderRadius: "8px", marginBottom: "20px" }}>
        <h2
          style={{
            color: "#1f2937",
            fontSize: "24px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "28px" }}>{notificationIcon}</span>
          {title}
        </h2>

        <p style={{ color: "#374151", fontSize: "16px", lineHeight: "1.6", marginBottom: "20px" }}>
          Ahoj {recipientName},
        </p>

        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "6px",
            marginBottom: "20px",
            borderLeft: `4px solid ${notificationColor}`,
          }}
        >
          <p style={{ color: "#374151", fontSize: "16px", lineHeight: "1.6", margin: "0" }}>{message}</p>
        </div>

        {/* Additional data based on notification type */}
        {notificationType === "test_assigned" && data?.test_names && (
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ color: "#1f2937", fontSize: "18px", marginBottom: "10px" }}>Pridelené testy:</h3>
            <ul style={{ color: "#374151", fontSize: "14px", lineHeight: "1.6", paddingLeft: "20px" }}>
              {data.test_names.map((testName: string, index: number) => (
                <li key={index}>{testName}</li>
              ))}
            </ul>
          </div>
        )}

        {notificationType === "employment_confirmed" && data?.job_details && (
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ color: "#1f2937", fontSize: "18px", marginBottom: "10px" }}>Detaily zamestnania:</h3>
            <div style={{ backgroundColor: "#e0f2f1", padding: "15px", borderRadius: "6px" }}>
              <p style={{ color: "#374151", fontSize: "14px", margin: "5px 0" }}>
                <strong>Pozícia:</strong> {data.job_details.occupation}
              </p>
              {data.job_details.salary && (
                <p style={{ color: "#374151", fontSize: "14px", margin: "5px 0" }}>
                  <strong>Plat:</strong> {data.job_details.salary}
                </p>
              )}
              {data.job_details.start_date && (
                <p style={{ color: "#374151", fontSize: "14px", margin: "5px 0" }}>
                  <strong>Nástup:</strong> {new Date(data.job_details.start_date).toLocaleDateString("sk-SK")}
                </p>
              )}
            </div>
          </div>
        )}

        {notificationType === "profile_expiring" && data?.days_until_expiry && (
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{ backgroundColor: "#fef2f2", padding: "15px", borderRadius: "6px", border: "1px solid #fecaca" }}
            >
              <p style={{ color: "#dc2626", fontSize: "16px", fontWeight: "bold", margin: "0 0 10px 0" }}>
                Váš profil vyprší za {data.days_until_expiry} dní!
              </p>
              <p style={{ color: "#374151", fontSize: "14px", margin: "0" }}>
                Aby váš profil zostal aktívny a firmy vás mohli naďalej kontaktovať, je potrebné ho predĺžiť.
              </p>
            </div>
          </div>
        )}

        {/* CTA Button */}
        {actionUrl && actionText && (
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <a
              href={actionUrl}
              style={{
                backgroundColor: notificationColor,
                color: "white",
                padding: "12px 30px",
                textDecoration: "none",
                borderRadius: "6px",
                fontSize: "16px",
                fontWeight: "bold",
                display: "inline-block",
              }}
            >
              {actionText}
            </a>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", color: "#9ca3af", fontSize: "12px" }}>
        <p>Toto je automaticky generovaná notifikácia zo systému SOMVIAC.</p>
        <p>Ak nechcete dostávať tieto notifikácie, môžete si ich vypnúť vo svojom profile.</p>
        <p style={{ marginTop: "20px" }}>© 2025 SOMVIAC - Slovenský portál pre prácu</p>
      </div>
    </div>
  )
}

// Plain text version
export function getNotificationEmailText({
  recipientName,
  notificationType,
  title,
  message,
  data,
  actionUrl,
  actionText,
}: NotificationEmailProps) {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "test_assigned":
        return "NOVÉ TESTY"
      case "profile_expiring":
        return "UPOZORNENIE"
      case "employment_confirmed":
        return "GRATULUJEME"
      case "contract_signed":
        return "POTVRDENIE"
      case "workflow_update":
        return "AKTUALIZÁCIA"
      default:
        return "NOTIFIKÁCIA"
    }
  }

  let additionalInfo = ""

  if (notificationType === "test_assigned" && data?.test_names) {
    additionalInfo = `\n\nPridelené testy:\n${data.test_names.map((name: string) => `- ${name}`).join("\n")}`
  }

  if (notificationType === "employment_confirmed" && data?.job_details) {
    additionalInfo = `\n\nDetaily zamestnania:\n- Pozícia: ${data.job_details.occupation}`
    if (data.job_details.salary) additionalInfo += `\n- Plat: ${data.job_details.salary}`
    if (data.job_details.start_date)
      additionalInfo += `\n- Nástup: ${new Date(data.job_details.start_date).toLocaleDateString("sk-SK")}`
  }

  if (notificationType === "profile_expiring" && data?.days_until_expiry) {
    additionalInfo = `\n\nVÁŽNE: Váš profil vyprší za ${data.days_until_expiry} dní!\nAby váš profil zostal aktívny, je potrebné ho predĺžiť.`
  }

  return `
SOMVIAC - Slovenský portál pre prácu

${getNotificationIcon(notificationType)}: ${title}

Ahoj ${recipientName},

${message}${additionalInfo}

${actionUrl && actionText ? `\n${actionText}: ${actionUrl}` : ""}

Toto je automaticky generovaná notifikácia zo systému SOMVIAC.
Ak nechcete dostávať tieto notifikácie, môžete si ich vypnúť vo svojom profile.

© 2025 SOMVIAC - Slovenský portál pre prácu
  `.trim()
}
