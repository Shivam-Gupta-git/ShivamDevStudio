import propsCode from '../components/Props/Props.jsx?raw'
import stateCode from '../components/State/State.jsx?raw'
import conditionalCode from '../components/Small Topics/Conditional_Rendering.jsx?raw'
import controlledCode from '../components/1.ControlledComp.jsx?raw'
import uncontrolledCode from '../components/2.UnControlledComp.jsx?raw'
import formsCode from '../components/Controller Component/ControllerComponent.jsx?raw'
import refCode from '../components/Small Topics/Ref.jsx?raw'
import forwardRefCode from '../components/3.ForwardRef.jsx?raw'
import useStateCode from '../components/4.UseState.jsx?raw'
import useEffectCode from '../components/5.useEffect.jsx?raw'
import useMemoCode from '../components/8.UseMemo.jsx?raw'
import useMemoParentCode from '../components/6.useMemo.jsx?raw'
import reactMemoCode from '../components/7.React.Memo.jsx?raw'
import useCallbackCode from '../components/UseCallback/Parent.jsx?raw'
import customHookCode from '../components/CustomeHook/CustomeHook.jsx?raw'
import lazyLoadingCode from '../components/Lazy Loading/LazyLoading.jsx?raw'
import protectedRoutingCode from '../components/Protected Routing/ProtectedRouter.jsx?raw'
import useReducerCode from '../components/UseReducer/UseReducer.jsx?raw'
import useContextCode from '../components/UseContext/UseContextDemo.jsx?raw'
import useImperativeHandleCode from '../components/UseImperativeHandle/UseImperativeHandleDemo.jsx?raw'
import errorBoundaryCode from '../components/ErrorBoundary/ErrorBoundaryDemo.jsx?raw'
import useTransitionCode from '../components/ConcurrentMode/UseTransitionDemo.jsx?raw'
import listVirtualizationCode from '../components/Virtualization/VirtualListDemo.jsx?raw'
import portalsCode from '../components/Portals/PortalsDemo.jsx?raw'
import debounceCode from '../components/DebounceThrottle/DebounceDemo.jsx?raw'
import optimisticCode from '../components/OptimisticUI/OptimisticDemo.jsx?raw'
import deferredValueCode from '../components/ConcurrentMode/UseDeferredValueDemo.jsx?raw'

const codeMap = {
  props: propsCode,
  state: stateCode,
  'conditional-rendering': conditionalCode,
  'controlled-components': controlledCode,
  'uncontrolled-components': uncontrolledCode,
  forms: formsCode,
  'use-ref': refCode,
  'forward-ref': forwardRefCode,
  'use-state': useStateCode,
  'use-effect': useEffectCode,
  'use-memo': useMemoCode,
  'use-memo-parent': useMemoParentCode,
  'react-memo': reactMemoCode,
  'use-callback': useCallbackCode,
  'custom-hook': customHookCode,
  'lazy-loading': lazyLoadingCode,
  'protected-routing': protectedRoutingCode,
  'use-reducer': useReducerCode,
  'use-context': useContextCode,
  'use-imperative-handle': useImperativeHandleCode,
  'error-boundary': errorBoundaryCode,
  'use-transition': useTransitionCode,
  'list-virtualization': listVirtualizationCode,
  portals: portalsCode,
  'debounce-throttle': debounceCode,
  'optimistic-ui': optimisticCode,
  'use-deferred-value': deferredValueCode,
}

export function getTopicCode(topicId) {
  return codeMap[topicId] ?? ''
}

export function searchAllTopicCode(query) {
  if (!query || query.trim().length < 2) return []
  const q = query.toLowerCase().trim()
  const results = []

  Object.entries(codeMap).forEach(([topicId, sourceCode]) => {
    if (!sourceCode) return
    const lines = sourceCode.split('\n')
    lines.forEach((line, index) => {
      if (line.toLowerCase().includes(q)) {
        results.push({
          topicId,
          lineNumber: index + 1,
          lineContent: line.trim(),
        })
      }
    })
  })

  return results
}
