import axios from 'axios'
import vm from 'node:vm'
import { spawn, execFile } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { promisify } from 'node:util'

// Configurable timeout for local execution (ms). Default 10000ms (10 seconds).
const LOCAL_EXEC_TIMEOUT_MS = process.env.LOCAL_EXEC_TIMEOUT_MS ? parseInt(process.env.LOCAL_EXEC_TIMEOUT_MS, 10) : 10000
const execFileAsync = promisify(execFile)

/**
 * Judge0 language IDs used by this project.
 * Execution is fully sandboxed inside Judge0 containers when Judge0 is active,
 * or executed locally via system runtimes when Judge0 is offline.
 */
const LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
}

const STATUS = {
  1: 'In Queue',
  2: 'Processing',
  3: 'Accepted',
  4: 'Wrong Answer',
  5: 'Time Limit Exceeded',
  6: 'Compilation Error',
  7: 'Runtime Error (SIGSEGV)',
  8: 'Runtime Error (SIGXFSZ)',
  9: 'Runtime Error (SIGFPE)',
  10: 'Runtime Error (SIGABRT)',
  11: 'Runtime Error (NZEC)',
  12: 'Runtime Error (Other)',
  13: 'Internal Error',
  14: 'Exec Format Error',
}

export function isJudge0Configured() {
  return Boolean(process.env.JUDGE0_BASE_URL || process.env.JUDGE0_RAPIDAPI_KEY)
}

function getClient() {
  const baseURL = process.env.JUDGE0_BASE_URL || 'http://localhost:2358'
  const headers = { 'Content-Type': 'application/json' }

  // RapidAPI headers when using hosted Judge0
  if (process.env.JUDGE0_RAPIDAPI_KEY) {
    headers['X-RapidAPI-Key'] = process.env.JUDGE0_RAPIDAPI_KEY
    headers['X-RapidAPI-Host'] =
      process.env.JUDGE0_RAPIDAPI_HOST || 'judge0-ce.p.rapidapi.com'
  }

  return axios.create({ baseURL, headers, timeout: 5000 })
}

function decodeField(value) {
  if (!value) return ''
  try {
    return Buffer.from(value, 'base64').toString('utf8')
  } catch {
    return value
  }
}

function encodeField(value) {
  return Buffer.from(value, 'utf8').toString('base64')
}

function runJavaScriptLocally(sourceCode, stdin = '') {
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
    throw new Error(`Module '${moduleName}' is restricted in local sandbox`)
  }

  const sandbox = {
    console: customConsole,
    require: customRequire,
    input: stdin,
    process: {
      stdin: { readFileSync: () => stdin },
      env: {},
    },
    Buffer,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    queueMicrotask,
    Math,
    Date,
    JSON,
    Array,
    Object,
    String,
    Number,
    Boolean,
    RegExp,
    Set,
    Map,
    WeakSet,
    WeakMap,
    Promise,
    BigInt,
    Symbol,
    parseInt,
    parseFloat,
    isNaN,
    isFinite,
    Infinity,
    NaN,
    undefined,
    structuredClone: typeof structuredClone !== 'undefined' ? structuredClone : (v) => JSON.parse(JSON.stringify(v)),
  }

  const context = vm.createContext(sandbox)
  const startTime = Date.now()

  try {
    const script = new vm.Script(sourceCode)
    script.runInContext(context, { timeout: 3000 })
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(3)
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
    }
  } catch (err) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(3)
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
    }
  }
}

function runProcess(cmd, args, inputStr = '', timeoutMs = LOCAL_EXEC_TIMEOUT_MS) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { stdio: ['pipe', 'pipe', 'pipe'] })
    let stdout = ''
    let stderr = ''
    let killed = false

    const timer = setTimeout(() => {
      killed = true
      proc.kill('SIGKILL')
    }, timeoutMs)

    proc.stdout.on('data', (d) => {
      stdout += d.toString()
    })
    proc.stderr.on('data', (d) => {
      stderr += d.toString()
    })

    proc.on('close', (code) => {
      clearTimeout(timer)
      if (killed) {
        reject(new Error('Time Limit Exceeded (5s)'))
      } else {
        resolve({ code, stdout, stderr })
      }
    })

    proc.on('error', (err) => {
      clearTimeout(timer)
      reject(err)
    })

    if (inputStr) {
      proc.stdin.write(inputStr.endsWith('\n') ? inputStr : inputStr + '\n')
    }
    proc.stdin.end()
  })
}

async function runLocalCode({ sourceCode, language, stdin = '' }) {
  if (language === 'javascript') {
    return runJavaScriptLocally(sourceCode, stdin)
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'code-practice-'))
  const startTime = Date.now()

  try {
    if (language === 'python') {
      const scriptPath = path.join(tmpDir, 'script.py')
      fs.writeFileSync(scriptPath, sourceCode)

      const { code, stdout, stderr } = await runProcess('python3', ['-u', scriptPath], stdin, 5000)
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(3)

      return {
        status: code === 0 ? 'Accepted' : 'Runtime Error',
        statusId: code === 0 ? 3 : 7,
        stdout: stdout.trimEnd(),
        stderr: stderr.trimEnd(),
        compileOutput: '',
        message: stderr.trimEnd(),
        time: elapsed,
        memory: 2048,
        success: code === 0,
        error: code === 0 ? null : stderr.trimEnd() || 'Runtime Error',
      }
    }

    if (language === 'cpp') {
      const sourcePath = path.join(tmpDir, 'main.cpp')
      const binPath = path.join(tmpDir, 'main')
      fs.writeFileSync(sourcePath, sourceCode)

      try {
        await runProcess('g++', ['-O2', sourcePath, '-o', binPath], '', 10000)
      } catch (compileErr) {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(3)
        return {
          status: 'Compilation Error',
          statusId: 6,
          stdout: '',
          stderr: compileErr.stderr || compileErr.message,
          compileOutput: compileErr.stderr || compileErr.message,
          message: 'Compilation failed',
          time: elapsed,
          memory: 0,
          success: false,
          error: compileErr.stderr || compileErr.message,
        }
      }

      const { code, stdout, stderr } = await runProcess(binPath, [], stdin, 5000)
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(3)

      return {
        status: code === 0 ? 'Accepted' : 'Runtime Error',
        statusId: code === 0 ? 3 : 7,
        stdout: stdout.trimEnd(),
        stderr: stderr.trimEnd(),
        compileOutput: '',
        message: stderr.trimEnd(),
        time: elapsed,
        memory: 2048,
        success: code === 0,
        error: code === 0 ? null : stderr.trimEnd() || 'Runtime Error',
      }
    }

    if (language === 'java') {
      const match = sourceCode.match(/public\s+class\s+([A-Za-z0-9_]+)/)
      const className = match ? match[1] : 'Main'
      const javaPath = path.join(tmpDir, `${className}.java`)
      fs.writeFileSync(javaPath, sourceCode)

      try {
        await runProcess('javac', [javaPath], '', 10000)
      } catch (compileErr) {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(3)
        return {
          status: 'Compilation Error',
          statusId: 6,
          stdout: '',
          stderr: compileErr.stderr || compileErr.message,
          compileOutput: compileErr.stderr || compileErr.message,
          message: 'Compilation failed',
          time: elapsed,
          memory: 0,
          success: false,
          error: compileErr.stderr || compileErr.message,
        }
      }

      const { code, stdout, stderr } = await runProcess('java', ['-cp', tmpDir, className], stdin, 5000)
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(3)

      return {
        status: code === 0 ? 'Accepted' : 'Runtime Error',
        statusId: code === 0 ? 3 : 7,
        stdout: stdout.trimEnd(),
        stderr: stderr.trimEnd(),
        compileOutput: '',
        message: stderr.trimEnd(),
        time: elapsed,
        memory: 4096,
        success: code === 0,
        error: code === 0 ? null : stderr.trimEnd() || 'Runtime Error',
      }
    }
  } catch (err) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(3)
    const isTimeout = err.message.includes('Time Limit Exceeded')
    return {
      status: isTimeout ? 'Time Limit Exceeded' : 'Runtime Error',
      statusId: isTimeout ? 5 : 7,
      stdout: '',
      stderr: err.message,
      compileOutput: '',
      message: err.message,
      time: elapsed,
      memory: 2048,
      success: false,
      error: err.message,
    }
  } finally {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true })
    } catch {}
  }
}

/**
 * Submit code to Judge0 or execute locally.
 */
export async function executeCode({ sourceCode, language, stdin = '' }) {
  const languageId = LANGUAGE_IDS[language]
  if (!languageId) {
    throw new Error(`Unsupported language: ${language}`)
  }

  // If Judge0 is not configured, immediately use high-speed local runtime
  if (!isJudge0Configured()) {
    return runLocalCode({ sourceCode, language, stdin })
  }

  const client = getClient()

  const payload = {
    source_code: encodeField(sourceCode),
    language_id: languageId,
    stdin: stdin ? encodeField(stdin) : undefined,
    // Safety limits — prevent infinite loops / memory bombs
    cpu_time_limit: 2,
    memory_limit: 128000,
    wall_time_limit: 5,
  }

  let submission
  try {
    const { data } = await client.post('/submissions?base64_encoded=true&wait=false', payload)
    submission = data
  } catch (_err) {
    // If Judge0 container or API key is not active, fallback to local system runtime execution
    return runLocalCode({ sourceCode, language, stdin })
  }

  // Poll for result (max ~15 seconds)
  let result = submission
  const token = submission.token
  for (let i = 0; i < 30; i++) {
    if (result.status && result.status.id > 2) break
    await sleep(500)
    const { data } = await client.get(`/submissions/${token}?base64_encoded=true`)
    result = data
  }

  const statusId = result.status?.id
  const stdout = decodeField(result.stdout).trimEnd()
  const stderr = decodeField(result.stderr)
  const compileOutput = decodeField(result.compile_output)
  const message = decodeField(result.message)

  return {
    status: STATUS[statusId] || 'Unknown',
    statusId,
    stdout,
    stderr,
    compileOutput,
    message,
    time: result.time,
    memory: result.memory,
    success: statusId === 3,
    error:
      statusId === 6
        ? compileOutput || 'Compilation failed'
        : statusId >= 7 && statusId <= 12
          ? stderr || message || 'Runtime error'
          : statusId === 5
            ? 'Time limit exceeded'
            : null,
  }
}

/**
 * Run code against multiple test cases and compare outputs.
 */
export async function runTestCases({ sourceCode, language, testCases }) {
  const results = []

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i]
    const execution = await executeCode({
      sourceCode,
      language,
      stdin: tc.input,
    })

    const actual = execution.stdout.trim()
    const expected = tc.expectedOutput.trim()
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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
