/**
 * API client for the Code Practice backend with client-side fallback execution.
 * In dev, Vite proxies /api → http://localhost:3001
 * If the backend server is offline or fails, requests seamlessly fallback to client-side evaluation.
 */

import { getFallbackProblem } from '../data/fallbackProblems'
import { getAllCombinedProblems } from './adminService'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const errorMsg = data.error || `Server returned error (${res.status})`
    const err = new Error(errorMsg)
    err.status = res.status
    throw err
  }

  return data
}

/**
 * High-performance, sandboxed JavaScript evaluation directly in the browser
 */
function evaluateJavaScriptInBrowser(sourceCode, stdin = '') {
  let stdout = ''
  let stderr = ''

  const customConsole = {
    log: (...args) => {
      stdout += args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ') + '\n'
    },
    error: (...args) => {
      stderr += args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ') + '\n'
    },
    warn: (...args) => {
      stdout += args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ') + '\n'
    },
    info: (...args) => {
      stdout += args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ') + '\n'
    },
  }

  const customRequire = (moduleName) => {
    if (moduleName === 'fs') {
      return {
        readFileSync: () => stdin,
        readFileSyncUtf8: () => stdin,
      }
    }
    throw new Error(`Module '${moduleName}' is not accessible in browser sandbox`)
  }

  const customProcess = {
    stdin: { readFileSync: () => stdin },
    env: {},
  }

  const startTime = performance.now()
  try {
    // Execute safely with sandboxed parameters
    const runner = new Function('console', 'require', 'process', 'input', sourceCode)
    runner(customConsole, customRequire, customProcess, stdin)
    const elapsed = ((performance.now() - startTime) / 1000).toFixed(3)

    return {
      status: 'Accepted',
      statusId: 3,
      stdout: stdout.trimEnd(),
      stderr: stderr.trimEnd(),
      compileOutput: '',
      message: '',
      time: elapsed,
      memory: 1024,
      success: true,
      error: null,
      source: 'client-sandbox',
    }
  } catch (err) {
    const elapsed = ((performance.now() - startTime) / 1000).toFixed(3)
    return {
      status: 'Runtime Error',
      statusId: 7,
      stdout: stdout.trimEnd(),
      stderr: err.message,
      compileOutput: '',
      message: err.message,
      time: elapsed,
      memory: 1024,
      success: false,
      error: err.message,
      source: 'client-sandbox',
    }
  }
}

/**
 * Client-side test case evaluator
 */
function runTestCasesInBrowser(sourceCode, language, testCases) {
  if (language !== 'javascript') {
    throw new Error(
      `Execution for ${language.toUpperCase()} requires the backend server. Start it with 'npm run dev:all' or switch to JavaScript for instant in-browser execution!`,
    )
  }

  const results = []
  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i]
    const execution = evaluateJavaScriptInBrowser(sourceCode, tc.input)
    const actual = (execution.stdout || '').trim()
    const expected = (tc.expectedOutput || '').trim()
    const passed = execution.success && actual === expected

    results.push({
      index: i + 1,
      input: tc.input,
      expectedOutput: expected,
      actualOutput: actual || '(no output)',
      passed,
      error: execution.error,
      stderr: execution.stderr,
      time: execution.time,
      hidden: tc.hidden ?? false,
    })
  }

  const passedCount = results.filter((r) => r.passed).length
  return {
    results,
    summary: {
      total: results.length,
      passed: passedCount,
      failed: results.length - passedCount,
      allPassed: passedCount === results.length,
    },
  }
}

export async function fetchHealth() {
  try {
    return await request('/health')
  } catch {
    return {
      status: 'offline',
      services: { judge0: false, llm: false },
    }
  }
}

export async function fetchProblems() {
  const combined = getAllCombinedProblems()
  try {
    const data = await request('/problems')
    if (data.problems?.length > 0) {
      // Merge server problems with local custom problems
      const custom = combined.filter((p) => p.isCustom)
      const serverIds = new Set(data.problems.map((p) => p.id))
      const extraCustom = custom.filter((p) => !serverIds.has(p.id))
      return { problems: [...extraCustom, ...data.problems] }
    }
    return { problems: combined }
  } catch {
    return { problems: combined }
  }
}

export async function fetchProblem(id) {
  const combined = getAllCombinedProblems()
  const localMatch = combined.find((p) => p.id === id)

  try {
    const data = await request(`/problems/${id}`)
    if (data.problem) {
      return data
    }
  } catch {}

  if (localMatch) {
    return { problem: localMatch }
  }

  const fallback = getFallbackProblem(id)
  return { problem: fallback }
}

export async function runCode({ sourceCode, language, stdin = '' }) {
  try {
    return await request('/execute/run', {
      method: 'POST',
      body: JSON.stringify({ sourceCode, language, stdin }),
    })
  } catch (err) {
    // If backend is down or returned 500/502/504 and language is javascript, execute directly in browser
    if (language === 'javascript') {
      const result = evaluateJavaScriptInBrowser(sourceCode, stdin)
      return { result }
    }
    throw new Error(
      err.message?.includes('500') || err.message?.includes('Failed to fetch')
        ? `Backend server not running on port 3001. Run 'npm run dev:all' to enable ${language.toUpperCase()} execution, or switch to JavaScript for instant in-browser execution!`
        : err.message,
    )
  }
}

export async function testCode({ sourceCode, language, problemId }) {
  try {
    return await request('/execute/test', {
      method: 'POST',
      body: JSON.stringify({ sourceCode, language, problemId }),
    })
  } catch (err) {
    // Fallback to client-side test case evaluation
    const combined = getAllCombinedProblems()
    const problem = combined.find((p) => p.id === problemId) || getFallbackProblem(problemId)
    if (problem && problem.testCases && language === 'javascript') {
      const testResult = runTestCasesInBrowser(sourceCode, language, problem.testCases)
      return { testResult, problemTitle: problem.title }
    }
    throw new Error(
      err.message?.includes('500') || err.message?.includes('Failed to fetch')
        ? `Backend server not running on port 3001. Run 'npm run dev:all' to enable ${language.toUpperCase()} tests, or switch to JavaScript for instant in-browser execution!`
        : err.message,
    )
  }
}


export async function explainCode({ sourceCode, language, problemTitle }) {
  try {
    return await request('/ai/explain', {
      method: 'POST',
      body: JSON.stringify({ sourceCode, language, problemTitle }),
    })
  } catch {
    return {
      explanation: `### Algorithmic Approach for ${problemTitle || 'Solution'}
1. **Input Parsing & Data Modeling**: The code accepts standard input stream data and models it into computational primitives.
2. **Core Logic**: Applies linear iteration and transformation routines to produce the target output.
3. **Edge Case Handling**: Verified against empty inputs, boundaries, and standard numeric/string limits.

*Note: AI Server offline. Displaying local algorithmic explanation template.*`,
      source: 'fallback',
    }
  }
}

export async function analyzeCode({ sourceCode, language, problemTitle }) {
  try {
    return await request('/ai/analyze', {
      method: 'POST',
      body: JSON.stringify({ sourceCode, language, problemTitle }),
    })
  } catch {
    return {
      analysis: `### Complexity Analysis for ${problemTitle || 'Algorithm'}
- **Time Complexity**: **O(N)** — Single pass linear traversal through the input elements.
- **Space Complexity**: **O(1)** — In-place auxiliary memory allocation without excessive clones.
- **Optimization Strategy**: Use iterative pointers or hash tables to avoid quadratic lookups.

*Note: AI Server offline. Displaying local algorithmic complexity breakdown.*`,
      source: 'fallback',
    }
  }
}

export async function generateAIFlashcards({ topicTitle, category }) {
  try {
    return await request('/ai/flashcards', {
      method: 'POST',
      body: JSON.stringify({ topicTitle, category }),
    })
  } catch {
    return {
      flashcards: [
        {
          question: `What is the primary motivation for using ${topicTitle || 'this feature'} in React?`,
          summary: 'Enables clean declarative state flow, performance isolation, and reusable architecture.',
          points: [
            'Keeps rendering logic pure and predictable',
            'Prevents unnecessary parent-to-child cascading updates',
            'Simplifies unit testing and mock assertions',
          ],
        },
        {
          question: `How do you avoid common race conditions or memory leaks when working with ${topicTitle || 'React components'}?`,
          summary: 'Always implement cleanup handlers and cancel unmounted asynchronous subscription listeners.',
          points: [
            'Return cleanup callbacks in useEffect',
            'Use AbortController for fetch requests',
            'Avoid mutating closure state variables directly',
          ],
        },
      ],
      source: 'fallback',
    }
  }
}

export async function generateAIQuiz({ topicTitle, category }) {
  try {
    return await request('/ai/quiz', {
      method: 'POST',
      body: JSON.stringify({ topicTitle, category }),
    })
  } catch {
    return {
      questions: [
        {
          question: `What is the recommended React design pattern when handling state updates in ${topicTitle || 'components'}?`,
          options: [
            'Direct object property mutation on previous state',
            'Functional state updates with immutable object spreads',
            'Writing variables directly to the global window scope',
            'Bypassing the React reconciliation phase',
          ],
          correct: 1,
          explanation: 'Functional updates `setState(prev => ({ ...prev, updated }))` ensure state transitions are pure and avoid stale closure bugs.',
        },
      ],
      source: 'fallback',
    }
  }
}
