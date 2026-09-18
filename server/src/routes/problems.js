import { Router } from 'express'
import {
  problems,
  getProblemById,
  addOrUpdateProblem,
  deleteProblemById,
  resetProblems,
} from '../data/problems.js'

const router = Router()

/** GET /api/problems — list all practice problems */
router.get('/', (_req, res) => {
  const list = problems.map(({ id, title, difficulty, category, description, examples }) => ({
    id,
    title,
    difficulty,
    category,
    description,
    examples,
  }))
  res.json({ problems: list })
})

/** GET /api/problems/:id — full problem with starter code & public test cases */
router.get('/:id', (req, res) => {
  const problem = getProblemById(req.params.id)
  if (!problem) {
    return res.status(404).json({ error: 'Problem not found' })
  }

  // Return test cases without hidden flag values for client display
  res.json({
    problem: {
      ...problem,
      testCases: (problem.testCases || []).map((tc) => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
      })),
    },
  })
})

/** POST /api/problems — create or update a problem */
router.post('/', (req, res) => {
  const problemData = req.body
  if (!problemData || !problemData.title) {
    return res.status(400).json({ error: 'Problem title is required' })
  }

  const saved = addOrUpdateProblem(problemData)
  res.status(201).json({ success: true, problem: saved })
})

/** PUT /api/problems/:id — update a problem */
router.put('/:id', (req, res) => {
  const problemData = { ...req.body, id: req.params.id }
  const saved = addOrUpdateProblem(problemData)
  res.json({ success: true, problem: saved })
})

/** DELETE /api/problems/:id — remove a problem */
router.delete('/:id', (req, res) => {
  const deleted = deleteProblemById(req.params.id)
  if (!deleted) {
    return res.status(404).json({ error: 'Problem not found' })
  }
  res.json({ success: true, deleted })
})

/** POST /api/problems/reset — reset to default problems */
router.post('/reset', (_req, res) => {
  const defaultList = resetProblems()
  res.json({ success: true, problems: defaultList })
})

export default router

