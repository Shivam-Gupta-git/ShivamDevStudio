import { Router } from 'express'
import { executeCode, runTestCases } from '../services/judge0.js'
import { getProblemById } from '../data/problems.js'

const router = Router()

const SUPPORTED_LANGUAGES = ['javascript', 'python', 'java', 'cpp']

/**
 * POST /api/execute/run
 * Body: { sourceCode, language, stdin? }
 * Runs code once and returns stdout/stderr.
 */
router.post('/run', async (req, res) => {
  try {
    const { sourceCode, language, stdin = '' } = req.body

    if (!sourceCode?.trim()) {
      return res.status(400).json({ error: 'sourceCode is required' })
    }
    if (!SUPPORTED_LANGUAGES.includes(language)) {
      return res.status(400).json({
        error: `Unsupported language. Choose from: ${SUPPORTED_LANGUAGES.join(', ')}`,
      })
    }

    const result = await executeCode({ sourceCode, language, stdin })
    res.json({ result })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/**
 * POST /api/execute/test
 * Body: { sourceCode, language, problemId }
 * Runs code against all test cases for a problem.
 */
router.post('/test', async (req, res) => {
  try {
    const { sourceCode, language, problemId } = req.body

    if (!sourceCode?.trim()) {
      return res.status(400).json({ error: 'sourceCode is required' })
    }
    if (!problemId) {
      return res.status(400).json({ error: 'problemId is required' })
    }
    if (!SUPPORTED_LANGUAGES.includes(language)) {
      return res.status(400).json({
        error: `Unsupported language. Choose from: ${SUPPORTED_LANGUAGES.join(', ')}`,
      })
    }

    const problem = getProblemById(problemId)
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' })
    }

    const testResult = await runTestCases({
      sourceCode,
      language,
      testCases: problem.testCases,
    })

    res.json({ testResult, problemTitle: problem.title })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
