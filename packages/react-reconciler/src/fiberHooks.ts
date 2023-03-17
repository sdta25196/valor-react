import { UpdateQueue, createUpdate, createUpdateQueue, enqueueUpdate } from './updateQueue';
import internals from 'shared/internals';
import { FiberNode } from './fiber';
import { Dispatcher, Dispatch } from 'react/src/currentDispatcher';
import { Action } from 'shared/ReactTypes';
import { scheduleUpdataOnFiber } from './workLoop';

let currentlyRenderingFiber: FiberNode | null = null; // 当前正在render的fiber
let workInProgressHook: Hook | null = null;

const { currentDispatcher } = internals;

interface Hook {
	memoizedState: any;
	updateQueue: any;
	next: Hook | null;
}

export function renderWithHooks(wip: FiberNode) {
	// 保存当前正在 render 的 fiber
	currentlyRenderingFiber = wip;
	// 重置操作
	wip.memoizedState = null;

	const current = wip.alternate;

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
	currentlyRenderingFiber = null;
	return children;
}

const HooksDispatcherOnMount: Dispatcher = {
	useState: mountState
}

function mountState<State>(
	initialState: (() => State) | State
): [State, Dispatch<State>] {
	const hook = mountWorkInProgressHook()

	let memoizedState
	if (initialState instanceof Function) {
		memoizedState = initialState()
	} else {
		memoizedState = initialState
	}

	const queue = createUpdateQueue<State>()
	hook.updateQueue = queue
	hook.memoizedState = memoizedState

	// @ts-ignore
	const dispatch = dispatchSetState.bind(null, currentlyRenderingFiber, queue)
	queue.dispatch = dispatch
	return [memoizedState, dispatch]
}

function dispatchSetState<State>(
	fiber: FiberNode,
	updateQueue: UpdateQueue<State>,
	action: Action<State>
) {
	const update = createUpdate(action)
	enqueueUpdate(updateQueue, update)
	scheduleUpdataOnFiber(fiber)
}

function mountWorkInProgressHook(): Hook {

	const hook: Hook = {
		memoizedState: null,
		updateQueue: null,
		next: null
	}

	if (workInProgressHook === null) {
		// mount 第一个hook
		if (currentlyRenderingFiber === null) {
			throw new Error("必须在函数组件内床hook")
		} else {
			workInProgressHook = hook
			currentlyRenderingFiber.memoizedState = workInProgressHook
		}
	} else {
		// mount 后续的hook
		workInProgressHook.next = hook
		workInProgressHook = hook // 更新 workInProgressHook 指向的节点
	}

	return workInProgressHook

}
