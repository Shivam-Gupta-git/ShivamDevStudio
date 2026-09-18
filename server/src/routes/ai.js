import { Router } from 'express'
import { explainCode, analyzeEfficiency, generateFlashcards, generateQuiz } from '../services/llm.js'

const router = Router()

const SUPPORTED_LANGUAGES = ['javascript', 'python', 'java', 'cpp']

/**
 * POST /api/ai/explain
 * Body: { sourceCode, language, problemTitle? }
 */
router.post('/explain', async (req, res) => {
  try {
    const { sourceCode, language, problemTitle = 'Practice Problem' } = req.body

    if (!sourceCode?.trim()) {
      return res.status(400).json({ error: 'sourceCode is required' })
    }
    if (!SUPPORTED_LANGUAGES.includes(language)) {
      return res.status(400).json({ error: 'Unsupported language' })
    }

    const data = await explainCode({ sourceCode, language, problemTitle })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/**
 * POST /api/ai/analyze
 * Body: { sourceCode, language, problemTitle? }
 */
router.post('/analyze', async (req, res) => {
  try {
    const { sourceCode, language, problemTitle = 'Practice Problem' } = req.body

    if (!sourceCode?.trim()) {
      return res.status(400).json({ error: 'sourceCode is required' })
    }
    if (!SUPPORTED_LANGUAGES.includes(language)) {
      return res.status(400).json({ error: 'Unsupported language' })
    }

    const data = await analyzeEfficiency({ sourceCode, language, problemTitle })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/**
 * POST /api/ai/flashcards
 * Body: { topicTitle, category? }
 */
router.post('/flashcards', async (req, res) => {
  try {
    const { topicTitle, category = 'React' } = req.body
    if (!topicTitle?.trim()) {
      return res.status(400).json({ error: 'topicTitle is required' })
    }
    const data = await generateFlashcards({ topicTitle, category })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/**
 * POST /api/ai/quiz
 * Body: { topicTitle, category? }
 */
router.post('/quiz', async (req, res) => {
  try {
    const { topicTitle, category = 'React' } = req.body
    if (!topicTitle?.trim()) {
      return res.status(400).json({ error: 'topicTitle is required' })
    }
    const data = await generateQuiz({ topicTitle, category })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
