import axios from 'axios'

/**
 * LLM service for code explanation and efficiency analysis.
 * Supports Google Gemini, OpenAI, Groq, OpenRouter, and OpenAI-compatible providers.
 * Falls back gracefully to structured offline responses when no valid API key is set or when API calls fail.
 */

function isPlaceholderKey(key) {
  if (!key || typeof key !== 'string') return true
  const trimmed = key.trim().toLowerCase()
  return (
    trimmed === '' ||
    trimmed.includes('your_') ||
    trimmed.includes('_here') ||
    trimmed.includes('api_key_here')
  )
}

function getClient() {
  const geminiKey = process.env.GEMINI_API_KEY
  const openaiKey = process.env.OPENAI_API_KEY

  // 1. Google Gemini — Uses Google's OpenAI compatibility layer with Bearer auth
  if (!isPlaceholderKey(geminiKey)) {
    const baseURL = 'https://generativelanguage.googleapis.com/v1beta/openai/'
    return axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${geminiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 60000,
    })
  }

  // 2. OpenAI / Groq / OpenRouter — Uses standard Bearer token header
  if (!isPlaceholderKey(openaiKey)) {
    const baseURL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
    const headers = {
      Authorization: `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    }
    if (process.env.JUDGE0_RAPIDAPI_KEY) {
      headers['X-RapidAPI-Key'] = process.env.JUDGE0_RAPIDAPI_KEY
      headers['X-RapidAPI-Host'] = process.env.JUDGE0_RAPIDAPI_HOST || 'judge0-ce.p.rapidapi.com'
    }
    return axios.create({ baseURL, headers, timeout: 60000 })
  }

  return null
}

async function chatCompletion(systemPrompt, userPrompt) {
  const client = getClient()
  if (!client) return null

  const isGemini = !isPlaceholderKey(process.env.GEMINI_API_KEY)
  let model = process.env.OPENAI_MODEL
  if (isGemini) {
    if (!model || model.startsWith('gpt-')) {
      model = 'gemma-4-31b-it'
    }
  } else if (!model) {
    model = 'gpt-4o-mini'
  }

  try {
    const { data } = await client.post('/chat/completions', {
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    })

    let text = data.choices[0]?.message?.content?.trim() || ''
    text = text.replace(/<thought>[\s\S]*?<\/thought>/gi, '').trim()
    return text
  } catch (error) {
    console.error('LLM API Error:', error.response?.status, error.response?.data || error.message)

    // If Gemini model returned error (e.g. 404 or 429), retry with fallback model gemma-4-26b-a4b-it
    if (isGemini && model !== 'gemma-4-26b-a4b-it') {
      try {
        const { data } = await client.post('/chat/completions', {
          model: 'gemma-4-26b-a4b-it',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.3,
          max_tokens: 2000,
        })
        let text = data.choices[0]?.message?.content?.trim() || ''
        text = text.replace(/<thought>[\s\S]*?<\/thought>/gi, '').trim()
        return text
      } catch (retryErr) {
        console.error('LLM Fallback Model Error:', retryErr.response?.data || retryErr.message)
      }
    }
    return null
  }
}

/**
 * Generate a beginner-friendly step-by-step explanation of the code.
 */
export async function explainCode({ sourceCode, language, problemTitle }) {
  const systemPrompt = `You are a friendly programming tutor. Explain code clearly for beginners and intermediate learners.
Structure your response with these sections using markdown:
## Overview
## Step-by-Step Breakdown
## Key Concepts
## Tips for Beginners
Keep explanations concise but thorough. Use simple language.`

  const userPrompt = `Explain this ${language} solution for the problem "${problemTitle}":

\`\`\`${language}
${sourceCode}
\`\`\``

  const llmResponse = await chatCompletion(systemPrompt, userPrompt)

  if (llmResponse) {
    return { explanation: llmResponse, source: 'llm' }
  }

  // Offline fallback when no API key is configured or call failed
  return {
    explanation: `## Overview
This ${language} program solves **${problemTitle}**. Add a valid \`GEMINI_API_KEY\` or \`OPENAI_API_KEY\` to your server \`.env\` file to get real-time AI explanations.

## Step-by-Step Breakdown
1. **Read input** — The program reads data from standard input (stdin).
2. **Process** — It applies the logic required by the problem (calculations, loops, conditions).
3. **Output** — Results are printed to stdout, which Judge0 captures for testing.

## Key Concepts
- **stdin/stdout**: Standard way competitive programming problems receive input and return output.
- **Variables**: Store intermediate values during computation.
- **Control flow**: \`if/else\` and loops direct which code runs.

## Tips for Beginners
- Run the code with the example inputs first before submitting.
- Read error messages carefully — compilation errors show the line number.
- Test edge cases like empty input, negative numbers, or single-element arrays.`,
    source: 'fallback',
  }
}

/**
 * Analyze time/space complexity and suggest optimizations.
 */
export async function analyzeEfficiency({ sourceCode, language, problemTitle }) {
  const systemPrompt = `You are a senior software engineer specializing in algorithms and code optimization.
Analyze the given code and respond in markdown with these sections:
## Time Complexity
State Big O notation and explain why.
## Space Complexity
State Big O notation and explain why.
## Inefficiencies
List specific inefficient patterns found (or state none found).
## Suggested Improvements
Give concrete alternative approaches or optimizations.
Be specific and educational.`

  const userPrompt = `Analyze the efficiency of this ${language} solution for "${problemTitle}":

\`\`\`${language}
${sourceCode}
\`\`\``

  const llmResponse = await chatCompletion(systemPrompt, userPrompt)

  if (llmResponse) {
    return { analysis: llmResponse, source: 'llm' }
  }

  return {
    analysis: `## Time Complexity
**O(n)** — Typical for problems that process each input element once. Add a valid \`GEMINI_API_KEY\` or \`OPENAI_API_KEY\` to your server \`.env\` file for custom AI complexity analysis.

## Space Complexity
**O(1)** to **O(n)** — Depends on whether extra arrays or data structures are allocated.

## Inefficiencies
- **Nested loops**: If you have loops inside loops, consider whether a hash map or sorting could reduce complexity.
- **Redundant computation**: Avoid recalculating the same value inside loops.
- **Unnecessary memory**: Don't store all intermediate results if only the final answer is needed.

## Suggested Improvements
1. Use built-in functions (\`max()\`, \`Math.max()\`) when they fit.
2. Early-exit loops when the answer is found.
3. Choose the right data structure (Set for lookups, Map for counting).`,
    source: 'fallback',
  }
}

/**
 * Generate dynamic interview flashcards for a React topic.
 */
export async function generateFlashcards({ topicTitle, category = 'React' }) {
  const systemPrompt = `You are a Principal React Architect interviewing candidates for Senior/Staff Frontend positions.
Generate 3 challenging, top-tier interview questions for the React topic "${topicTitle}".
Respond STRICTLY with valid JSON in this exact structure without markdown backticks:
{
  "flashcards": [
    {
      "question": "The interview question string?",
      "summary": "Concise 1-2 sentence senior-level answer summary.",
      "points": ["Key technical point 1", "Key technical point 2", "Best practice / pitfall to avoid"]
    }
  ]
}`

  const userPrompt = `Generate 3 top-tier interview flashcards for "${topicTitle}" (${category}).`

  const llmResponse = await chatCompletion(systemPrompt, userPrompt)

  if (llmResponse) {
    try {
      const cleanJson = llmResponse.replace(/```json/g, '').replace(/```/g, '').trim()
      const parsed = JSON.parse(cleanJson)
      if (parsed.flashcards?.length > 0) {
        return { flashcards: parsed.flashcards, source: 'llm' }
      }
    } catch (e) {
      console.error('Failed to parse LLM flashcards JSON:', e)
    }
  }

  // Structured fallback flashcards
  return {
    flashcards: [
      {
        question: `How does ${topicTitle} fit into React 18 Concurrent Rendering architecture?`,
        summary: `${topicTitle} integrates with React's fiber architecture to enable smooth, non-blocking UI updates and consistent state boundaries.`,
        points: ['Ensures predictable rendering behavior', 'Avoids unnecessary DOM mutations', 'Adheres to React immutability principles'],
      },
      {
        question: `What are the most common performance pitfalls when using ${topicTitle} in production?`,
        summary: `Misconfiguring state dependencies or over-using dynamic objects can cause accidental re-renders across child component subtrees.`,
        points: ['Keep dependencies minimal and primitive', 'Use React.memo or useCallback when passing functions to children', 'Profile component re-renders using React DevTools'],
      },
      {
        question: `How would you test components utilizing ${topicTitle} with React Testing Library?`,
        summary: `Test user-centric outcomes (DOM changes, state feedback) rather than testing internal implementation details.`,
        points: ['Use screen.getByRole or getByText', 'Simulate user actions with userEvent', 'Verify accessibility and error states'],
      },
    ],
    source: 'fallback',
  }
}

/**
 * Generate dynamic multiple-choice quiz questions for a React topic.
 */
export async function generateQuiz({ topicTitle, category = 'React' }) {
  const systemPrompt = `You are a Principal React Architect interviewing candidates for Senior/Staff Frontend positions.
Generate 10 challenging, top-tier multiple-choice interview quiz questions for the React topic "${topicTitle}".
Respond STRICTLY with valid JSON in this exact structure without markdown backticks:
{
  "questions": [
    {
      "question": "The interview question string?",
      "options": ["Option 0 text", "Option 1 text", "Option 2 text", "Option 3 text"],
      "correct": 1,
      "explanation": "Detailed senior-level explanation why Option 1 is correct and others are wrong."
    }
  ]
}`

  const userPrompt = `Generate 10 top-tier multiple-choice interview quiz questions for "${topicTitle}" (${category}).`

  const llmResponse = await chatCompletion(systemPrompt, userPrompt)

  if (llmResponse) {
    try {
      const cleanJson = llmResponse.replace(/```json/g, '').replace(/```/g, '').trim()
      const parsed = JSON.parse(cleanJson)
      if (parsed.questions?.length > 0) {
        return { questions: parsed.questions, source: 'llm' }
      }
    } catch (e) {
      console.error('Failed to parse LLM quiz JSON:', e)
    }
  }

  // Fallback 10 multiple-choice quiz questions
  return {
    questions: [
      {
        question: `How does ${topicTitle} maintain predictability in complex React applications?`,
        options: [
          'By bypassing React virtual DOM reconciliation',
          'By enforcing immutable state transitions and clean component boundaries',
          'By executing database SQL commands directly inside JSX',
          'By disabling all browser event listeners',
        ],
        correct: 1,
        explanation: `${topicTitle} ensures predictable component behavior by maintaining immutable state flow and clean fiber architecture boundaries.`,
      },
      {
        question: `Which scenario represents an anti-pattern when using ${topicTitle}?`,
        options: [
          'Validating props with TypeScript or PropTypes',
          'Mutating state directly or causing side-effects during render',
          'Keeping components small, modular, and focused',
          'Using functional state setters when next state depends on previous',
        ],
        correct: 1,
        explanation: 'Mutating state directly or executing side-effects during render causes unpredictable re-renders and memory leaks.',
      },
      {
        question: `What is the recommended approach to test components built with ${topicTitle}?`,
        options: [
          'Test private state variables directly',
          'Use React Testing Library to assert on user-facing DOM behavior',
          'Disable assertion checks in CI/CD pipelines',
          'Rely exclusively on manual browser refreshes',
        ],
        correct: 1,
        explanation: 'React Testing Library promotes testing components from the user perspective (screen.getByRole / userEvent).',
      },
      {
        question: `How does React 18 Fiber architecture process component updates involving ${topicTitle}?`,
        options: [
          'By locking the main UI thread during rendering',
          'By breaking work into incremental units prioritized by concurrent scheduler',
          'By executing synchronous blocking loops',
          'By restarting the browser engine',
        ],
        correct: 1,
        explanation: 'React 18 Fiber architecture breaks rendering into non-blocking work units to keep the UI fluid.',
      },
      {
        question: `What is the primary benefit of keeping components using ${topicTitle} pure?`,
        options: [
          'Ensures components produce identical JSX given identical inputs without side-effects',
          'Allows direct modification of global window objects',
          'Skips React reconciliation engine',
          'Generates CSS stylesheets automatically',
        ],
        correct: 0,
        explanation: 'Pure components given identical props/state return predictable JSX, preventing unexpected render bugs.',
      },
      {
        question: `How does shallow comparison affect component re-renders when using ${topicTitle}?`,
        options: [
          'It compares object references (===) rather than deep nested key values',
          'It performs a 50-level deep object inspection',
          'It converts objects to XML strings',
          'It clears browser cache',
        ],
        correct: 0,
        explanation: 'Shallow equality checks object references for equality, making shallow prop comparison extremely fast.',
      },
      {
        question: `When should you optimize components using ${topicTitle}?`,
        options: [
          'Prematurely on every single single-line component',
          'After measuring re-render bottlenecks using React DevTools Profiler',
          'Never in production applications',
          'Only when upgrading Node.js versions',
        ],
        correct: 1,
        explanation: 'Measure first using React DevTools Profiler to identify actual rendering bottlenecks before optimizing.',
      },
      {
        question: `What happens when dependencies are omitted from hooks used alongside ${topicTitle}?`,
        options: [
          'Hooks capture stale closures referencing outdated state or props',
          'React auto-fills missing dependencies at runtime',
          'The application immediately crashes with a syntax error',
          'Browser memory is freed automatically',
        ],
        correct: 0,
        explanation: 'Missing hook dependencies create stale closures where callback scope references old variable values.',
      },
      {
        question: `Why is immutability essential when working with ${topicTitle}?`,
        options: [
          'It enables cheap reference comparisons and predictable change tracking',
          'It prevents JavaScript garbage collection',
          'It forces all components to render synchronously',
          'It encrypts state data in memory',
        ],
        correct: 0,
        explanation: 'Immutability allows React to detect state changes instantly via cheap reference equality (`old !== new`).',
      },
      {
        question: `What is a common cause of infinite re-render loops in components using ${topicTitle}?`,
        options: [
          'Calling state setter function unconditionally inside component render body',
          'Wrapping components in React.memo',
          'Passing primitive string props to child components',
          'Using strict mode in development',
        ],
        correct: 0,
        explanation: 'Executing state setters inside render triggers an immediate state update, causing an infinite render loop.',
      },
    ],
    source: 'fallback',
  }
}

export function isLlmConfigured() {
  const geminiKey = process.env.GEMINI_API_KEY
  const openaiKey = process.env.OPENAI_API_KEY
  const aiKey = process.env.AI_API_KEY
  return !isPlaceholderKey(geminiKey) || !isPlaceholderKey(openaiKey) || !isPlaceholderKey(aiKey)
}
