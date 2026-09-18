/**
 * Mock Interview Evaluation & Scoring Service
 */

const SESSIONS_STORAGE_KEY = 'shivamdev_mock_interview_sessions'

export function evaluateAnswer({ questionObj, candidateText, codeSnippet = '', trackId }) {
  const text = (candidateText || '').toLowerCase()
  const code = (codeSnippet || '').toLowerCase()
  const fullResponse = `${text} ${code}`

  // 1. Keyword & Terminology Match Score (0 - 40 pts)
  const keywords = questionObj.expectedKeywords || []
  let matchedKeywords = []
  if (keywords.length > 0) {
    matchedKeywords = keywords.filter((kw) => fullResponse.includes(kw.toLowerCase()))
  }
  const keywordRatio = keywords.length > 0 ? matchedKeywords.length / keywords.length : 0.8
  const keywordScore = Math.round(keywordRatio * 40)

  // 2. Depth & Completeness Score (0 - 30 pts)
  const wordCount = candidateText ? candidateText.trim().split(/\s+/).length : 0
  let depthScore = 15
  if (wordCount >= 60 || codeSnippet.length > 50) depthScore = 30
  else if (wordCount >= 30) depthScore = 24
  else if (wordCount >= 10) depthScore = 18

  // 3. Structure & Best Practice Rubric (0 - 30 pts)
  const hasCodeOrStructure =
    fullResponse.includes('complexity') ||
    fullResponse.includes('o(') ||
    fullResponse.includes('use') ||
    fullResponse.includes('return') ||
    fullResponse.includes('clean') ||
    fullResponse.includes('state') ||
    codeSnippet.length > 20
  const structureScore = hasCodeOrStructure ? 28 : 20

  const totalScore = Math.min(100, Math.max(45, keywordScore + depthScore + structureScore))

  return {
    score: totalScore,
    matchedKeywords,
    missedKeywords: keywords.filter((kw) => !matchedKeywords.includes(kw)),
    wordCount,
    feedback:
      totalScore >= 85
        ? 'Excellent! Senior-level grasp with precise terminology and architectural clarity.'
        : totalScore >= 70
        ? 'Good response! Covers primary concepts well; review benchmark points for full mastery.'
        : 'Solid effort. Incorporate more keyword precision and edge-case handling in your explanation.',
  }
}

export function calculateFinalScorecard({ trackId, trackTitle, candidateName, answersList }) {
  const totalCount = answersList.length
  if (totalCount === 0) return null

  const sumScores = answersList.reduce((acc, a) => acc + (a.evaluation?.score || 75), 0)
  const averageScore = Math.round(sumScores / totalCount)

  let grade = 'A'
  let readiness = 'Senior React Staff Engineer Ready'
  if (averageScore >= 92) {
    grade = 'A+'
    readiness = 'Distinguished Senior Staff Engineer'
  } else if (averageScore >= 82) {
    grade = 'A'
    readiness = 'Senior React Developer Ready'
  } else if (averageScore >= 70) {
    grade = 'B+'
    readiness = 'Mid-to-Senior Developer Ready'
  } else {
    grade = 'B'
    readiness = 'Junior-to-Mid Developer'
  }

  const scorecard = {
    id: `interview-${Date.now()}`,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    trackId,
    trackTitle,
    candidateName: candidateName || 'Shivam Gupta',
    overallScore: averageScore,
    grade,
    readiness,
    categories: {
      reactInternals: Math.min(100, Math.round(averageScore * 1.02)),
      performance: Math.min(100, Math.round(averageScore * 0.98)),
      architecture: Math.min(100, Math.round(averageScore * 1.01)),
      codeQuality: Math.min(100, Math.round(averageScore * 0.96)),
    },
    answers: answersList,
    certificateId: `SG-CERT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
  }

  // Save to history
  try {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY)
    const history = raw ? JSON.parse(raw) : []
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify([scorecard, ...history.slice(0, 9)]))
  } catch {}

  return scorecard
}

export function getInterviewHistory() {
  try {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}
