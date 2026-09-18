import { FALLBACK_PROBLEMS } from '../data/fallbackProblems'
import { topicQuizzes } from '../data/topicQuizzes'

const STORAGE_KEYS = {
  PROBLEMS: 'shivamdev_custom_problems',
  QUIZZES: 'shivamdev_custom_quizzes',
  FLASHCARDS: 'shivamdev_custom_flashcards',
}

// -------------------------------------------------------------
// 1. Coding & DSA Practice Problems
// -------------------------------------------------------------

export function getCustomProblems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROBLEMS)
    return raw ? JSON.parse(raw) : []
  } catch (err) {
    console.error('Failed to read custom problems from localStorage:', err)
    return []
  }
}

export function getAllCombinedProblems() {
  const custom = getCustomProblems()
  const customIds = new Set(custom.map((p) => p.id))
  const filteredFallbacks = FALLBACK_PROBLEMS.filter((p) => !customIds.has(p.id))
  return [...custom, ...filteredFallbacks]
}

export function saveProblem(problemData) {
  const custom = getCustomProblems()
  const index = custom.findIndex((p) => p.id === problemData.id)

  let updatedList
  if (index >= 0) {
    updatedList = [...custom]
    updatedList[index] = { ...updatedList[index], ...problemData, updatedAt: new Date().toISOString() }
  } else {
    const newProblem = {
      ...problemData,
      id: problemData.id || `problem-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isCustom: true,
    }
    updatedList = [newProblem, ...custom]
  }

  localStorage.setItem(STORAGE_KEYS.PROBLEMS, JSON.stringify(updatedList))

  // Attempt async sync to backend if server is running
  fetch('/api/problems', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(problemData),
  }).catch(() => {})

  return updatedList
}

export function deleteProblem(problemId) {
  const custom = getCustomProblems()
  const filtered = custom.filter((p) => p.id !== problemId)
  localStorage.setItem(STORAGE_KEYS.PROBLEMS, JSON.stringify(filtered))

  fetch(`/api/problems/${problemId}`, {
    method: 'DELETE',
  }).catch(() => {})

  return filtered
}

export function resetProblemsToDefault() {
  localStorage.removeItem(STORAGE_KEYS.PROBLEMS)
  fetch('/api/problems/reset', { method: 'POST' }).catch(() => {})
  return FALLBACK_PROBLEMS
}

// -------------------------------------------------------------
// 2. Topic Interview Quizzes
// -------------------------------------------------------------

export function getCustomQuizzes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUIZZES)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function getCombinedTopicQuizzes(topicId) {
  const customQuizzes = getCustomQuizzes()
  const topicCustom = customQuizzes[topicId] || []
  const defaultList = topicQuizzes[topicId] || []
  return [...topicCustom, ...defaultList]
}

export function saveTopicQuizQuestion(topicId, questionObj) {
  const allCustom = getCustomQuizzes()
  const topicList = allCustom[topicId] || []
  const updatedTopicList = [
    {
      ...questionObj,
      id: questionObj.id || `q-${Date.now()}`,
      isCustom: true,
      createdAt: new Date().toISOString(),
    },
    ...topicList,
  ]

  const next = { ...allCustom, [topicId]: updatedTopicList }
  localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(next))
  return updatedTopicList
}

export function deleteTopicQuizQuestion(topicId, questionId) {
  const allCustom = getCustomQuizzes()
  const topicList = allCustom[topicId] || []
  const updatedTopicList = topicList.filter((q) => q.id !== questionId)
  const next = { ...allCustom, [topicId]: updatedTopicList }
  localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(next))
  return updatedTopicList
}

// -------------------------------------------------------------
// 3. Topic Flashcards
// -------------------------------------------------------------

export function getCustomFlashcards() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FLASHCARDS)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function saveTopicFlashcard(topicId, cardObj) {
  const allCustom = getCustomFlashcards()
  const topicCards = allCustom[topicId] || []
  const updatedCards = [
    {
      ...cardObj,
      id: cardObj.id || `fc-${Date.now()}`,
      isCustom: true,
      createdAt: new Date().toISOString(),
    },
    ...topicCards,
  ]

  const next = { ...allCustom, [topicId]: updatedCards }
  localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(next))
  return updatedCards
}

export function deleteTopicFlashcard(topicId, cardId) {
  const allCustom = getCustomFlashcards()
  const topicCards = allCustom[topicId] || []
  const updatedCards = topicCards.filter((c) => c.id !== cardId)
  const next = { ...allCustom, [topicId]: updatedCards }
  localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(next))
  return updatedCards
}

// -------------------------------------------------------------
// 4. Full Data Backup, Export & Import
// -------------------------------------------------------------

export function exportAllAdminData() {
  return {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    customProblems: getCustomProblems(),
    customQuizzes: getCustomQuizzes(),
    customFlashcards: getCustomFlashcards(),
  }
}

export function importAllAdminData(jsonData) {
  if (!jsonData || typeof jsonData !== 'object') {
    throw new Error('Invalid JSON data format')
  }

  if (Array.isArray(jsonData.customProblems)) {
    localStorage.setItem(STORAGE_KEYS.PROBLEMS, JSON.stringify(jsonData.customProblems))
  }
  if (jsonData.customQuizzes && typeof jsonData.customQuizzes === 'object') {
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(jsonData.customQuizzes))
  }
  if (jsonData.customFlashcards && typeof jsonData.customFlashcards === 'object') {
    localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(jsonData.customFlashcards))
  }

  return true
}
