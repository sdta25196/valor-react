import internals from 'shared/internals';
import { FiberNode } from './fiber';
import { Dispatcher } from 'react/src/currentDispatcher';

let currentlyRenderingFiber: FiberNode | null = null // 当前正在render的fiber
let workInProgressHook: Hook | null = null

const { currentDispatcher } = internals

interface Hook {
	memoizedState: any;
	updateQueue: any;
	next: Hook | null
}

export function renderWithHooks(wip: FiberNode) {
	// 保存当前正在 render 的 fiber
	currentlyRenderingFiber = wip
	wip.memoizedState = null

	const current = wip.alternate

	if (current !== null) {
		// uodate
	} else {
		// mount
		currentDispatcher.current = HooksDispatcherOnMount
	}

	const Component = wip.type; // 函数组件的函数保存在type属性上
	const props = wip.pendingProps;
	const children = Component(props);

	// 重置
	currentlyRenderingFiber = null
	return children;
}


const HooksDispatcherOnMount: Dispatcher = {
	useState: mountState
}

function mountState<State>(
	initialState: (() => State) | State
): [State, Dispacth<State>] {

	return []
}

function mountWorkInProgressHook(): Hook {

}