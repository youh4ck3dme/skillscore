// Name validation utility to prevent inappropriate or invalid names

const OFFENSIVE_WORDS = ["kokotko", "kokot", "debil", "idiot", "kkt", "test", "testing", "asdf", "qwerty"]

const MIN_NAME_LENGTH = 2
const MAX_NAME_LENGTH = 50

export function validateName(name: string, fieldName = "Meno"): { valid: boolean; error?: string } {
  // Trim whitespace
  const trimmed = name.trim()

  // Check length
  if (trimmed.length < MIN_NAME_LENGTH) {
    return {
      valid: false,
      error: `${fieldName} musí mať aspoň ${MIN_NAME_LENGTH} znaky`,
    }
  }

  if (trimmed.length > MAX_NAME_LENGTH) {
    return {
      valid: false,
      error: `${fieldName} môže mať maximálne ${MAX_NAME_LENGTH} znakov`,
    }
  }

  // Check for numbers
  if (/\d/.test(trimmed)) {
    return {
      valid: false,
      error: `${fieldName} nemôže obsahovať čísla`,
    }
  }

  // Check for special characters (allow only letters, spaces, hyphens, and accents)
  if (!/^[a-zA-ZáäčďéěíľĺňóôŕšťúůýžÁÄČĎÉĚÍĽĹŇÓÔŔŠŤÚŮÝŽ\s-]+$/.test(trimmed)) {
    return {
      valid: false,
      error: `${fieldName} môže obsahovať len písmená, medzery a pomlčky`,
    }
  }

  // Check for offensive words
  const lowerName = trimmed.toLowerCase()
  for (const word of OFFENSIVE_WORDS) {
    if (lowerName.includes(word)) {
      return {
        valid: false,
        error: `${fieldName} obsahuje nepovolené slová. Prosím, použite svoje skutočné meno.`,
      }
    }
  }

  return { valid: true }
}

export function normalizeName(name: string): string {
  // Trim and capitalize first letter of each word
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}
