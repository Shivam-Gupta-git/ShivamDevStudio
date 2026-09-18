/**
 * Mock Interview Questions Bank with Rubrics & Benchmarks
 */

export const INTERVIEW_TRACKS = [
  {
    id: 'frontend-core',
    title: 'Frontend Core & React 19 Internals',
    icon: 'Atom',
    description: 'Hooks lifecycle, Concurrent rendering, Fiber reconciliation, and component composition.',
    durationMinutes: 15,
    totalQuestions: 4,
  },
  {
    id: 'perf-state',
    title: 'Performance & State Optimization',
    icon: 'Zap',
    description: 'useMemo/useCallback pitfalls, memory leaks, virtualization, and state normalization.',
    durationMinutes: 20,
    totalQuestions: 4,
  },
  {
    id: 'system-design',
    title: 'Frontend System Design & Architecture',
    icon: 'Network',
    description: 'Auth guards, protected routing, error resilience, caching layers, and micro-frontends.',
    durationMinutes: 20,
    totalQuestions: 4,
  },
  {
    id: 'coding-drill',
    title: 'Live Coding & Algorithm Execution',
    icon: 'Code2',
    description: 'Hands-on problem solving in Monaco IDE with automated test cases.',
    durationMinutes: 25,
    totalQuestions: 3,
  },
]

export const TRACK_QUESTIONS = {
  'frontend-core': [
    {
      id: 'fc-1',
      question: 'Can you explain how React 18/19 Concurrent Rendering differs from Legacy synchronous rendering, and how `useTransition` helps keep interfaces responsive?',
      context: 'The interviewer is assessing your deep understanding of the React Scheduler, Fiber priorities, and time-slicing.',
      expectedKeywords: ['fiber', 'interruptible', 'priority', 'non-blocking', 'urgent', 'time-slicing', 'transition', 'scheduler'],
      followUp: 'What happens if state updates scheduled inside a transition depend on user input that changes again before the render finishes?',
      modelAnswer: {
        summary: 'Legacy React blocked the main thread until the entire tree finished rendering. Concurrent React breaks rendering into interruptible time-slices managed by the Scheduler. `useTransition` marks updates as non-urgent transitions, allowing urgent keystrokes and clicks to immediately interrupt background renders.',
        keyPoints: [
          'Synchronous rendering blocks DOM paint and creates input lag',
          'Concurrent mode assigns priority lanes to different state updates',
          'useTransition yields control back to the browser event loop',
          'Stale transition renders are abandoned cleanly if new urgent updates arrive',
        ],
      },
    },
    {
      id: 'fc-2',
      question: 'What is a stale closure in React hooks, under what exact conditions does it occur, and how do you resolve it?',
      context: 'Evaluating your grasp of JavaScript lexical closures, hook dependency arrays, and functional state updates.',
      expectedKeywords: ['closure', 'dependency array', 'stale', 'functional update', 'useRef', 'useEffect', 'reference'],
      followUp: 'How would you use `useRef` or `useEffectEvent` (experimental) to access the latest value without triggering hook re-execution?',
      modelAnswer: {
        summary: 'A stale closure occurs when a callback function (inside useEffect, useCallback, or an event handler) captures state or props from an earlier render cycle because the variable was omitted from the dependency array.',
        keyPoints: [
          'Captured variables retain their value from the render when the function was created',
          'Fix with accurate dependency arrays in useEffect/useCallback',
          'Use functional updates `setCount(prev => prev + 1)` to eliminate state dependency',
          'Use a mutable ref (`useRef`) to hold latest values without triggering renders',
        ],
      },
    },
    {
      id: 'fc-3',
      question: 'How does React Virtual DOM diffing algorithm achieve O(N) complexity instead of standard O(N^3) tree diffing algorithms?',
      context: 'Testing knowledge of heuristic assumptions made by React reconciliation engine.',
      expectedKeywords: ['heuristic', 'tree diffing', 'key prop', 'element type', 'reconciliation', 'breadth-first', 'same level'],
      followUp: 'Why is using array index as a `key` prop dangerous when sorting or removing items in a list?',
      modelAnswer: {
        summary: 'React uses two heuristic assumptions: 1) Two elements of different types will produce different trees, tearing down the old one. 2) The developer can hint which child elements are stable across renders with a unique `key` prop. React only compares nodes at the same tree level in a single pass.',
        keyPoints: [
          'Assumes elements of different types generate entirely different subtrees',
          'Diffing is performed level-by-level (breadth-first) rather than exhaustive subtree permutations',
          'Stable unique keys allow moving elements without destroying their internal DOM or state',
        ],
      },
    },
    {
      id: 'fc-4',
      question: 'When would you use `useImperativeHandle` with `forwardRef` instead of standard declarative props?',
      context: 'Checking architectural design judgment and understanding of component boundaries.',
      expectedKeywords: ['forwardRef', 'imperative', 'ref', 'custom handle', 'focus', 'scroll', 'media player', 'encapsulation'],
      followUp: 'How does useImperativeHandle preserve encapsulation for complex widgets like modals or video players?',
      modelAnswer: {
        summary: '`useImperativeHandle` customizes the instance value exposed to parent refs when using `forwardRef`. Instead of exposing the raw DOM element, the child exposes an explicit API object with tailored methods like `focus()`, `reset()`, or `play()`.',
        keyPoints: [
          'Should be used sparingly as an escape hatch for imperative DOM operations',
          'Prevents parents from reaching directly into internal child DOM structures',
          'Ideal for reusable library components like video players, rich text editors, and modal dialogs',
        ],
      },
    },
  ],
  'perf-state': [
    {
      id: 'ps-1',
      question: 'Why can premature or incorrect use of `useMemo` and `useCallback` actually degrade performance instead of improving it?',
      context: 'Assessing maturity with React optimization and memory overhead.',
      expectedKeywords: ['overhead', 'memory allocation', 'dependency check', 'shallow compare', 'react.memo', 'profiler', 'premature'],
      followUp: 'How would you measure whether a component actually needs memoization using React DevTools Profiler?',
      modelAnswer: {
        summary: '`useMemo` and `useCallback` have overhead: storing dependency arrays, allocating closure objects, and performing shallow dependency checks on every render. If the computation is cheap or the child is not wrapped in `React.memo`, you pay the overhead without saving any renders.',
        keyPoints: [
          'Function creation in JS is extremely fast; hook dependency checks add overhead',
          'useCallback is only effective when passed to memoized children or hook dependencies',
          'Always measure rendering flame charts with React Profiler before adding memoization',
        ],
      },
    },
    {
      id: 'ps-2',
      question: 'Explain how DOM Virtualization (Windowing) works for rendering 50,000+ items and how it prevents memory exhaustion.',
      context: 'Testing scalability and DOM layout performance expertise.',
      expectedKeywords: ['virtualization', 'windowing', 'scroll offset', 'viewport', 'overscan', 'dom nodes', 'memory'],
      followUp: 'How do you handle items with dynamic, variable heights in a virtualized list?',
      modelAnswer: {
        summary: 'Virtualization only creates DOM nodes for the subset of items currently visible inside the viewport (plus a small overscan buffer). As the user scrolls, nodes outside the viewport are recycled or unmounted, keeping DOM node count constant (~20-50 nodes) regardless of data size.',
        keyPoints: [
          'Maintains constant memory and DOM layout calculation time',
          'Calculates top padding/transform based on scroll offset and item height',
          'Dynamic heights require measuring rendered nodes and maintaining a position index cache',
        ],
      },
    },
    {
      id: 'ps-3',
      question: 'What causes memory leaks in modern React Single Page Applications, and what patterns prevent them?',
      context: 'Assessing production debugging and cleanup discipline.',
      expectedKeywords: ['cleanup', 'abortcontroller', 'event listener', 'setinterval', 'unmounted', 'subscription', 'garbage collection'],
      followUp: 'How do you cancel pending fetch requests when a component unmounts using `AbortController`?',
      modelAnswer: {
        summary: 'Memory leaks occur when unmounted components leave active subscriptions, intervals, DOM event listeners, or unresolved promises that hold references to component state closures, preventing garbage collection.',
        keyPoints: [
          'Always return a cleanup function in `useEffect` to unsubscribe listeners and clear timers',
          'Pass an `AbortController.signal` to fetch calls and abort on unmount',
          'Avoid storing large unbounded arrays in global module singletons',
        ],
      },
    },
    {
      id: 'ps-4',
      question: 'How does state normalization in Redux/Zustand simplify nested updates and improve rendering efficiency?',
      context: 'Checking global state management design principles.',
      expectedKeywords: ['normalization', 'byid', 'allids', 'flat', 'shallow update', 're-render', 'relational', 'entities'],
      followUp: 'What is the performance difference between finding an item by ID in a normalized table vs. deep array filtering?',
      modelAnswer: {
        summary: 'Normalized state structures data like a relational database: entities stored in a flat lookup table keyed by ID (`byId: { [id]: item }`) with ordered arrays of IDs (`allIds: [...]`). This turns O(N) array searches into O(1) lookups and eliminates deep object cloning.',
        keyPoints: [
          'Prevents duplicate data across the state tree',
          'Allows updating a single entity without modifying parent lists or triggering sibling re-renders',
          'Simplifies selectors with memoized granular subscriptions',
        ],
      },
    },
  ],
  'system-design': [
    {
      id: 'sd-1',
      question: 'How would you architect a production-grade Protected Routing & Authentication Guard system in React with token expiration handling?',
      context: 'Evaluating fullstack frontend architecture and security mindset.',
      expectedKeywords: ['protected route', 'auth guard', 'jwt', 'redirect', 'outlet', 'context', 'refresh token', 'interceptor'],
      followUp: 'How do you prevent UI flickering or unauthorized route flashes while asynchronous auth status is verifying?',
      modelAnswer: {
        summary: 'Use an `AuthContext` providing user status and a `<ProtectedRoute>` wrapper around React Router `<Outlet />`. While authentication state is loading, render a splash loader. If unauthenticated, redirect to `/login` with `state: { from: location }` to allow post-login redirect.',
        keyPoints: [
          'Handle three states: authenticated, unauthenticated, and verifying/loading',
          'Use Axios/Fetch HTTP interceptors to catch 401s and trigger silent token refresh',
          'Store tokens securely (HTTP-only cookies or memory + refresh rotation)',
        ],
      },
    },
    {
      id: 'sd-2',
      question: 'How do React Error Boundaries work, what types of errors do they NOT catch, and how do you handle those unhandled exceptions?',
      context: 'Checking resilience engineering and production monitoring experience.',
      expectedKeywords: ['componentdidcatch', 'getderivedstatefromerror', 'error boundary', 'async', 'event handlers', 'ssr', 'fallback ui'],
      followUp: 'How do you catch errors inside asynchronous fetch callbacks or setTimeout that Error Boundaries miss?',
      modelAnswer: {
        summary: 'Error Boundaries are class components implementing `componentDidCatch` or `getDerivedStateFromError` to catch JavaScript errors during rendering, lifecycle methods, and constructors in their subtree, rendering a fallback UI.',
        keyPoints: [
          'Error Boundaries do NOT catch: event handlers, asynchronous code (setTimeout, fetch), SSR errors, or errors in the boundary itself',
          'Async and event handler errors should be caught with try/catch and piped to state or monitoring services (Sentry)',
          'React 19 hooks like useActionState provide built-in async error capturing',
        ],
      },
    },
    {
      id: 'sd-3',
      question: 'Describe an optimal Code-Splitting and Lazy Loading strategy for a large enterprise React application.',
      context: 'Evaluating Core Web Vitals optimization and initial bundle size management.',
      expectedKeywords: ['code splitting', 'react.lazy', 'suspense', 'dynamic import', 'route based', 'bundle size', 'chunking', 'lcp'],
      followUp: 'How do you preload chunks on user hover before they click a link to eliminate navigation delay?',
      modelAnswer: {
        summary: 'Implement route-based code splitting using `React.lazy()` and `<Suspense>` so initial bundles only load entry point code. Heavy modals, charts, and code editors are split into dynamic import chunks loaded on demand or prefetched on hover.',
        keyPoints: [
          'Route-level splitting dramatically improves Largest Contentful Paint (LCP)',
          'Component-level lazy loading for heavy dependencies (Monaco Editor, D3, PDF viewers)',
          'Webpack/Vite prefetch hints (`/* webpackPrefetch: true */` or router intent preloading)',
        ],
      },
    },
    {
      id: 'sd-4',
      question: 'How do you design an offline-first caching and optimistic UI update layer for a collaborative React application?',
      context: 'Testing knowledge of modern real-time state and optimistic reconciliation.',
      expectedKeywords: ['optimistic update', 'rollback', 'react 19 useoptimistic', 'caching', 'indexeddb', 'service worker', 'tanstack query'],
      followUp: 'What is the rollback strategy if the server responds with a 500 error after an optimistic update was already painted?',
      modelAnswer: {
        summary: 'Optimistic UI immediately updates client state and paints UI before the network request finishes, giving instant 0ms perceived latency. Using React 19 `useOptimistic` or TanStack Query mutations, the previous state is snapshot and automatically rolled back if the server fails.',
        keyPoints: [
          'Improves user perceived responsiveness on slow mobile connections',
          'Snapshots previous state for clean rollback with toast error alerts',
          'Service Workers and IndexedDB cache data for offline read/write queues',
        ],
      },
    },
  ],
  'coding-drill': [
    {
      id: 'cd-1',
      question: 'Implement an in-place algorithm to Reverse an Array or String and explain its Time and Space complexity.',
      context: 'Basic two-pointer algorithmic check.',
      expectedKeywords: ['two pointers', 'in-place', 'swap', 'o(n) time', 'o(1) space', 'left right'],
      starterSnippet: `function reverseString(s) {
  // Return reversed string
  return s.split('').reverse().join('');
}`,
      modelAnswer: {
        summary: 'Use two pointers initialized at 0 and length-1, swapping elements while left < right.',
        keyPoints: ['Time Complexity: O(N) linear pass', 'Space Complexity: O(1) auxiliary in-place'],
      },
    },
    {
      id: 'cd-2',
      question: 'Implement the Two Sum algorithm using a Hash Map to achieve O(N) time complexity.',
      context: 'Evaluating hash lookup efficiency vs. brute force O(N^2).',
      expectedKeywords: ['hash map', 'complement', 'o(n) time', 'single pass', 'map.set', 'lookup'],
      starterSnippet: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
  return [];
}`,
      modelAnswer: {
        summary: 'Iterate through array, computing target - current value. Check if complement exists in Map in O(1) time.',
        keyPoints: ['Single pass O(N) time complexity', 'O(N) space complexity for hash map'],
      },
    },
    {
      id: 'cd-3',
      question: 'Implement a custom debounce function in JavaScript with immediate execution option.',
      context: 'Advanced JavaScript utility and timer closure implementation.',
      expectedKeywords: ['debounce', 'settimeout', 'cleartimeout', 'closure', 'apply', 'immediate'],
      starterSnippet: `function debounce(fn, delay) {
  let timerId;
  return function(...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn.apply(this, args), delay);
  };
}`,
      modelAnswer: {
        summary: 'A debounce function delays execution until a quiet period of `delay` milliseconds has elapsed since the last call.',
        keyPoints: ['Uses closure over timerId', 'Clears previous timer on every keystroke/event'],
      },
    },
  ],
}
