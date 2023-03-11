import { UpdateQueue, processUpdateQueue } from './updateQueue';
import { HostRoot, HostComponent, HostText, FunctionComponent } from './workTags';
import { FiberNode } from './fiber';
import { ReactElementType } from 'shared/ReactTypes';
import { mountChildFibers, reconcileChildFibers } from './childFiber';
import { renderWithHooks } from './fiberHooks';
// dfs的递阶段
export const beginWork = (wip: FiberNode) => {
	switch (wip.tag) {
		case HostRoot:
			return updateHostRoot(wip);
		case HostComponent:
			return updateHostComponent(wip);
		case HostText: // 叶子节点，直接 return null 即可。随后开启归阶段
			return null;
		case FunctionComponent: // 函数式组件
			return updateFunctionComponent(wip);
		default:
			if (__DEV__) {
				console.log('没有这个类型啊');
			}
			return null;
	}
};

function updateFunctionComponent(wip: FiberNode) {
	const nextChildren = renderWithHooks(wip)
	reconcileChildren(wip, nextChildren)

	return wip.child
}

// 首屏渲染 需要触发首次渲染，所以有更新逻辑
function updateHostRoot(wip: FiberNode) {
	const baseState = wip.memoizedState; // 首屏渲染时，这里是null
	const updateQueue = wip.updateQueue as UpdateQueue<Element>;
	const pending = updateQueue.shared.pending;
	updateQueue.shared.pending = null;
	const { memoizedState } = processUpdateQueue(baseState, pending);
	wip.memoizedState = memoizedState;

	const nextChildren = wip.memoizedState;
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

//  hostComponent 只需要渲染子节点即可，这种宿主原生类型是没办法触发更新的，所以不需要更新逻辑
function updateHostComponent(wip: FiberNode) {
	const nextProps = wip.pendingProps; // 首屏渲染时，这里是null

	const nextChildren = nextProps.children;
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

function reconcileChildren(wip: FiberNode, children?: ReactElementType) {
	const current = wip.alternate;
	if (current !== null) {
		// 更新阶段，需要追踪副作用
		wip.child = reconcileChildFibers(wip, current?.child, children);
	} else {
		// mount阶段，需要追踪副作用
		wip.child = mountChildFibers(wip, null, children);
	}
}
