import { NoFlags } from './fiberFlags';
import {
	Container,
	createInstance,
	appendInitialChilld,
	createTextInitialChilld
} from 'hostConfig';
import { FunctionComponent, HostComponent, HostRoot, HostText } from './workTags';
import { FiberNode } from './fiber';

// dfs的归阶段
export const completeWork = (wip: FiberNode) => {
	const newProps = wip.pendingProps;
	const current = wip.alternate;

	switch (wip.tag) {
		case HostComponent:
			// 构建离屏dom树
			if (current !== null && wip.stateNode) {
				// update
			} else {
				// mount
				// 构建 dom
				const instance = createInstance(wip.type, newProps);
				// 插入 dom 树
				appendAllChildren(instance, wip);
				wip.stateNode = instance;
			}
			bubbleProperties(wip);
			return null;
		case HostText:
			// 构建离屏dom树
			if (current !== null && wip.stateNode) {
				// update
			} else {
				// mount
				// 构建 dom
				const instance = createTextInitialChilld(newProps.content);
				wip.stateNode = instance;
			}
			bubbleProperties(wip);
			return null;
		case HostRoot:
			bubbleProperties(wip);
			return null;
		case FunctionComponent: // 函数式组件
			bubbleProperties(wip);
			return null;
		default:
			if (__DEV__) {
				console.log('未处理类型', wip);
			}
			return null;
	}
};

function appendAllChildren(parent: Container, wip: FiberNode) {
	let node = wip.child;
	while (node != null) {
		if (node.tag === HostComponent || node.tag === HostText) {
			appendInitialChilld(parent, node?.stateNode);
		} else if (node.child !== null) {
			node.child.return = node;
			node = node.child;
			continue;
		}

		if (node === wip) {
			return;
		}

		while (node.sibling === null) {
			if (node.return === null || node.return === wip) {
				return;
			}
			node = node?.return;
		}
		node.sibling.return = node.return;
		node = node.sibling;
	}
}

function bubbleProperties(wip: FiberNode) {
	let subtreeFalgs = NoFlags;
	let child = wip.child;

	while (child !== null) {
		subtreeFalgs |= child.subtreeFalgs;
		subtreeFalgs |= child.flags;
		child.return = wip;
		child = child.sibling;
	}
	wip.subtreeFalgs |= subtreeFalgs;
}
