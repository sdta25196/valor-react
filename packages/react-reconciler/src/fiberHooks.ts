import { FiberNode } from './fiber';

export function renderWithHooks(wip: FiberNode) {
  const Component = wip.type  // 函数组件的函数保存在type属性上
  const props = wip.pendingProps
  const children = Component(props)
  return children
}