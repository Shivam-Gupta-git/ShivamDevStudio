import React, { useReducer, useState } from 'react'
import {
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  RotateCcw,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Layers,
  Tag,
  History,
  Info,
  Sliders,
} from 'lucide-react'

const INITIAL_CART = [
  { id: 1, name: 'React 19 Design Patterns', price: 39, quantity: 1, discount: 0 },
  { id: 2, name: 'TypeScript Architecture Pro', price: 49, quantity: 2, discount: 10 },
]

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return [
        ...state,
        {
          id: Date.now(),
          name: action.payload.name || 'New Resource',
          price: action.payload.price || 25,
          quantity: 1,
          discount: 0,
        },
      ]
    case 'INCREMENT_QUANTITY':
      return state.map((item) =>
        item.id === action.payload ? { ...item, quantity: item.quantity + 1 } : item
      )
    case 'DECREMENT_QUANTITY':
      return state
        .map((item) =>
          item.id === action.payload ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    case 'APPLY_DISCOUNT':
      return state.map((item) =>
        item.id === action.payload.id ? { ...item, discount: action.payload.percent } : item
      )
    case 'REMOVE_ITEM':
      return state.filter((item) => item.id !== action.payload)
    case 'RESET':
      return INITIAL_CART
    default:
      return state
  }
}

export default function UseReducerDemo() {
  const [actionLog, setActionLog] = useState([])
  const [cart, baseDispatch] = useReducer(cartReducer, INITIAL_CART)
  const [newItemName, setNewItemName] = useState('')
  const [newItemPrice, setNewItemPrice] = useState('29')

  // Wrapped dispatch to log every single action transition
  const dispatch = (action) => {
    setActionLog((prev) => [
      {
        id: Date.now() + Math.random(),
        type: action.type,
        payload: action.payload ? JSON.stringify(action.payload) : null,
        time: new Date().toLocaleTimeString(),
      },
      ...prev.slice(0, 5),
    ])
    baseDispatch(action)
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalSavings = cart.reduce(
    (sum, item) => sum + (item.price * item.quantity * item.discount) / 100,
    0
  )
  const totalAmount = subtotal - totalSavings
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleAddItem = (e) => {
    e.preventDefault()
    if (!newItemName.trim()) return
    dispatch({
      type: 'ADD_ITEM',
      payload: { name: newItemName, price: parseFloat(newItemPrice) || 29 },
    })
    setNewItemName('')
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/50 text-xs font-semibold">
        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold">
          <ShoppingBag className="w-4 h-4 text-indigo-500" />
          <span>useReducer State Machine</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Total Items:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-mono font-bold text-xs">
            {totalCount} Units
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cart Item Manager */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-indigo-500" />
              Complex State Dispatcher
            </h3>
            <button
              type="button"
              onClick={() => dispatch({ type: 'RESET' })}
              className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Cart
            </button>
          </div>

          {/* Add Item Input Form */}
          <form onSubmit={handleAddItem} className="flex gap-2">
            <input
              type="text"
              placeholder="Resource / Book Title..."
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="number"
              placeholder="Price"
              value={newItemPrice}
              onChange={(e) => setNewItemPrice(e.target.value)}
              className="w-20 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-mono font-bold focus:outline-none"
            />
            <button
              type="submit"
              className="py-2 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 transition shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </form>

          {/* Cart Items List */}
          <div className="space-y-2.5">
            {cart.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-white"
              >
                <div className="space-y-0.5">
                  <h4 className="font-bold">{item.name}</h4>
                  <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                    <span>${item.price} each</span>
                    {item.discount > 0 && (
                      <span className="text-emerald-400 font-bold">
                        ({item.discount}% OFF)
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => dispatch({ type: 'DECREMENT_QUANTITY', payload: item.id })}
                      className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono font-bold px-1.5 text-indigo-300">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => dispatch({ type: 'INCREMENT_QUANTITY', payload: item.id })}
                      className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                      title="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      dispatch({
                        type: 'APPLY_DISCOUNT',
                        payload: { id: item.id, percent: item.discount > 0 ? 0 : 20 },
                      })
                    }
                    className={`p-2 rounded-xl border transition ${
                      item.discount > 0
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                    title="Toggle 20% Coupon"
                  >
                    <Tag className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
                    className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary Bar */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/50 dark:border-indigo-800/40 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-600 dark:text-slate-300 font-sans font-bold">Total Order Value:</span>
            <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">
              ${totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Live Action Dispatch Log */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 text-slate-100 space-y-3 font-mono text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400 font-sans font-bold flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-indigo-400" /> Redux-Style Action Log
              </span>
              <span className="text-[10px] text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/60 font-bold">
                dispatch(action)
              </span>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-auto">
              {actionLog.length === 0 ? (
                <p className="text-slate-500 italic text-[11px] p-2">Click any cart action above to record dispatched actions...</p>
              ) : (
                actionLog.map((log) => (
                  <div
                    key={log.id}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-0.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-400 uppercase tracking-wide">
                        {log.type}
                      </span>
                      <span className="text-[10px] text-slate-500 font-sans">{log.time}</span>
                    </div>
                    {log.payload && (
                      <p className="text-slate-400 text-[10px] truncate">{log.payload}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Educational Callout */}
      <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 dark:text-white">When to choose useReducer over useState:</strong> Use <code className="text-indigo-500 dark:text-indigo-400">useReducer</code> when you have complex state logic involving multiple sub-values, when the next state depends on the previous in non-trivial ways, or to pass <code>dispatch</code> down through deep trees instead of passing many separate setter callbacks.
        </div>
      </div>
    </div>
  )
}
