import { Body, Container, Head, Heading, Html, Preview, Section, Text, Hr, Row, Column } from "@react-email/components"

interface InvoiceEmailProps {
  companyName: string
  companyEmail: string
  companyAddress?: string
  companyId?: string
  invoiceNumber: string
  invoiceDate: string
  coinAmount: number
  totalAmount: number
  paymentMethod: string
  transactionId: string
}

export const InvoiceEmail = ({
  companyName,
  companyEmail,
  companyAddress,
  companyId,
  invoiceNumber,
  invoiceDate,
  coinAmount,
  totalAmount,
  paymentMethod,
  transactionId,
}: InvoiceEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Faktúra za nákup coinov - SOMVIAC</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>SOMVIAC</Heading>
            <Text style={subtitle}>Faktúra za nákup coinov</Text>
          </Section>

          <Section style={invoiceDetails}>
            <Row>
              <Column style={leftColumn}>
                <Text style={label}>Faktúra č.:</Text>
                <Text style={value}>{invoiceNumber}</Text>
              </Column>
              <Column style={rightColumn}>
                <Text style={label}>Dátum:</Text>
                <Text style={value}>{invoiceDate}</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          <Section style={customerDetails}>
            <Heading style={h2}>Odberateľ</Heading>
            <Text style={customerInfo}>
              <strong>{companyName}</strong>
              <br />
              {companyAddress && (
                <>
                  {companyAddress}
                  <br />
                </>
              )}
              {companyId && (
                <>
                  IČO: {companyId}
                  <br />
                </>
              )}
              Email: {companyEmail}
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={itemsSection}>
            <Heading style={h2}>Položky</Heading>
            <Row style={itemHeader}>
              <Column style={itemColumn}>
                <Text style={itemHeaderText}>Popis</Text>
              </Column>
              <Column style={quantityColumn}>
                <Text style={itemHeaderText}>Množstvo</Text>
              </Column>
              <Column style={priceColumn}>
                <Text style={itemHeaderText}>Cena za kus</Text>
              </Column>
              <Column style={totalColumn}>
                <Text style={itemHeaderText}>Celkom</Text>
              </Column>
            </Row>
            <Row style={itemRow}>
              <Column style={itemColumn}>
                <Text style={itemText}>SOMVIAC Coiny</Text>
              </Column>
              <Column style={quantityColumn}>
                <Text style={itemText}>{coinAmount}</Text>
              </Column>
              <Column style={priceColumn}>
                <Text style={itemText}>1,00 €</Text>
              </Column>
              <Column style={totalColumn}>
                <Text style={itemText}>{totalAmount.toFixed(2)} €</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          <Section style={totalSection}>
            <Row>
              <Column style={totalLabelColumn}>
                <Text style={totalLabel}>Celková suma:</Text>
              </Column>
              <Column style={totalValueColumn}>
                <Text style={totalValue}>{totalAmount.toFixed(2)} €</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          <Section style={paymentDetails}>
            <Heading style={h2}>Platobné údaje</Heading>
            <Text style={paymentInfo}>
              <strong>Spôsob platby:</strong> {paymentMethod}
              <br />
              <strong>ID transakcie:</strong> {transactionId}
              <br />
              <strong>Stav:</strong> Zaplatené
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              Ďakujeme za váš nákup coinov v systéme SOMVIAC.
              <br />
              Coiny boli automaticky pripísané na váš účet.
            </Text>
            <Text style={footerNote}>Táto faktúra bola vygenerovaná automaticky systémom SOMVIAC.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const getInvoiceEmailText = ({
  companyName,
  companyEmail,
  companyAddress,
  companyId,
  invoiceNumber,
  invoiceDate,
  coinAmount,
  totalAmount,
  paymentMethod,
  transactionId,
}: InvoiceEmailProps) => {
  return `
SOMVIAC - Faktúra za nákup coinov

Faktúra č.: ${invoiceNumber}
Dátum: ${invoiceDate}

ODBERATEĽ:
${companyName}
${companyAddress || ""}
${companyId ? `IČO: ${companyId}` : ""}
Email: ${companyEmail}

POLOŽKY:
SOMVIAC Coiny - ${coinAmount} ks × 1,00 € = ${totalAmount.toFixed(2)} €

CELKOVÁ SUMA: ${totalAmount.toFixed(2)} €

PLATOBNÉ ÚDAJE:
Spôsob platby: ${paymentMethod}
ID transakcie: ${transactionId}
Stav: Zaplatené

Ďakujeme za váš nákup coinov v systéme SOMVIAC.
Coiny boli automaticky pripísané na váš účet.

Táto faktúra bola vygenerovaná automaticky systémom SOMVIAC.
  `.trim()
}

// Styles
const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "600px",
}

const header = {
  textAlign: "center" as const,
  marginBottom: "32px",
}

const h1 = {
  color: "#0f766e",
  fontSize: "32px",
  fontWeight: "bold",
  margin: "0 0 8px",
}

const subtitle = {
  color: "#6b7280",
  fontSize: "18px",
  margin: "0",
}

const h2 = {
  color: "#374151",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "0 0 16px",
}

const invoiceDetails = {
  marginBottom: "24px",
}

const leftColumn = {
  width: "50%",
  paddingRight: "8px",
}

const rightColumn = {
  width: "50%",
  paddingLeft: "8px",
}

const label = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "0 0 4px",
}

const value = {
  color: "#374151",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 16px",
}

const hr = {
  borderColor: "#e5e7eb",
  margin: "24px 0",
}

const customerDetails = {
  marginBottom: "24px",
}

const customerInfo = {
  color: "#374151",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "0",
}

const itemsSection = {
  marginBottom: "24px",
}

const itemHeader = {
  backgroundColor: "#f9fafb",
  padding: "12px 0",
  borderRadius: "6px 6px 0 0",
}

const itemRow = {
  padding: "12px 0",
  borderBottom: "1px solid #e5e7eb",
}

const itemColumn = {
  width: "40%",
  paddingLeft: "12px",
}

const quantityColumn = {
  width: "15%",
  textAlign: "center" as const,
}

const priceColumn = {
  width: "20%",
  textAlign: "right" as const,
}

const totalColumn = {
  width: "25%",
  textAlign: "right" as const,
  paddingRight: "12px",
}

const itemHeaderText = {
  color: "#374151",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0",
}

const itemText = {
  color: "#374151",
  fontSize: "14px",
  margin: "0",
}

const totalSection = {
  marginBottom: "24px",
}

const totalLabelColumn = {
  width: "75%",
  textAlign: "right" as const,
  paddingRight: "12px",
}

const totalValueColumn = {
  width: "25%",
  textAlign: "right" as const,
}

const totalLabel = {
  color: "#374151",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0",
}

const totalValue = {
  color: "#0f766e",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "0",
}

const paymentDetails = {
  marginBottom: "24px",
}

const paymentInfo = {
  color: "#374151",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "0",
}

const footer = {
  textAlign: "center" as const,
}

const footerText = {
  color: "#374151",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "0 0 16px",
}

const footerNote = {
  color: "#6b7280",
  fontSize: "12px",
  margin: "0",
}
