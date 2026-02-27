// Test calibration and normalization utilities

export interface TestNorms {
  testId: string
  mean: number
  standardDeviation: number
  percentiles: Record<number, number>
  sampleSize: number
}

export interface TestCalibration {
  testId: string
  difficulty: "easy" | "medium" | "hard"
  reliability: number
  validity: number
  norms: TestNorms
}

// Mock test norms data
const TEST_NORMS: Record<string, TestNorms> = {
  "logical-reasoning": {
    testId: "logical-reasoning",
    mean: 75,
    standardDeviation: 15,
    percentiles: {
      10: 55,
      25: 65,
      50: 75,
      75: 85,
      90: 95,
    },
    sampleSize: 1000,
  },
  "numerical-reasoning": {
    testId: "numerical-reasoning",
    mean: 70,
    standardDeviation: 18,
    percentiles: {
      10: 48,
      25: 60,
      50: 70,
      75: 82,
      90: 92,
    },
    sampleSize: 1000,
  },
}

export function getTestCalibration(testId: string): TestCalibration | null {
  const norms = TEST_NORMS[testId]
  if (!norms) return null

  return {
    testId,
    difficulty: "medium",
    reliability: 0.85,
    validity: 0.78,
    norms,
  }
}

export function getTestNorms(testId: string): TestNorms | null {
  return TEST_NORMS[testId] || null
}

export function calculatePercentileRank(testId: string, score: number): number {
  const norms = getTestNorms(testId)
  if (!norms) return 50

  // Calculate z-score
  const zScore = (score - norms.mean) / norms.standardDeviation

  // Convert z-score to percentile using approximation
  const percentile = Math.round(normalCDF(zScore) * 100)

  return Math.max(1, Math.min(99, percentile))
}

// Normal cumulative distribution function approximation
function normalCDF(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z))
  const d = 0.3989423 * Math.exp((-z * z) / 2)
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))

  return z > 0 ? 1 - p : p
}

export function interpretScore(
  testId: string,
  score: number,
): {
  level: "very_low" | "low" | "average" | "high" | "very_high"
  description: string
  percentile: number
} {
  const percentile = calculatePercentileRank(testId, score)

  let level: "very_low" | "low" | "average" | "high" | "very_high"
  let description: string

  if (percentile < 10) {
    level = "very_low"
    description = "Výrazne pod priemerom"
  } else if (percentile < 25) {
    level = "low"
    description = "Pod priemerom"
  } else if (percentile < 75) {
    level = "average"
    description = "Priemer"
  } else if (percentile < 90) {
    level = "high"
    description = "Nad priemerom"
  } else {
    level = "very_high"
    description = "Výrazne nad priemerom"
  }

  return { level, description, percentile }
}

export function validateTestResults(
  testId: string,
  answers: any[],
  timeSpent: number,
): {
  valid: boolean
  issues: string[]
} {
  const issues: string[] = []

  // Check if test exists
  if (!getTestNorms(testId)) {
    issues.push("Neznámy test")
  }

  // Check answer count
  if (answers.length === 0) {
    issues.push("Žiadne odpovede")
  }

  // Check time spent (should be at least 1 minute)
  if (timeSpent < 60) {
    issues.push("Test dokončený príliš rýchlo")
  }

  // Check for suspicious patterns (all same answers)
  const uniqueAnswers = new Set(answers.map((a) => a.answer))
  if (uniqueAnswers.size === 1 && answers.length > 5) {
    issues.push("Podozrivý vzor odpovedí")
  }

  return {
    valid: issues.length === 0,
    issues,
  }
}
