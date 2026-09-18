import React, { memo, useRef } from 'react'
import { ShieldCheck, ShieldAlert, Zap } from 'lucide-react'

function Child({ countChild, childHandler, useCallbackEnabled }) {
  const childRenderCountRef = useRef(0)
  childRenderCountRef.current += 1

  return (
    <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 text-slate-100 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <span className="flex items-center gap-1.5 font-bold text-xs">
          {useCallbackEnabled ? (
            <>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">Child Wrapped in React.memo</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span className="text-rose-400">Child Re-renders (Unstable Prop)</span>
            </>
          )}
        </span>
        <span className="text-[11px] font-mono font-bold bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-800/60 text-indigo-400">
          Child Renders: #{childRenderCountRef.current}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs p-3 rounded-2xl bg-slate-900 border border-slate-800">
        <span className="text-slate-400">Child Internal State:</span>
        <span className="font-mono font-bold text-white text-base">{countChild}</span>
      </div>

      <button
        type="button"
        onClick={childHandler}
        className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition"
      >
        <Zap className="w-4 h-4" />
        <span>Click to Call Parent Callback Prop</span>
      </button>

      <p className="text-[11px] text-slate-400 text-center leading-relaxed">
        {useCallbackEnabled
          ? '✓ Child skips re-rendering when Parent updates because the callback reference is identical.'
          : '⚠️ Child re-renders every time Parent updates because a new inline function prop was passed!'}
      </p>
    </div>
  )
}

export default memo(Child)