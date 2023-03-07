import { Container, appendChildToContainer } from 'hostConfig';
import { HostComponent, HostRoot, HostText } from './workTags';
import { FiberNode, FiberRootNode } from './fiber';
import { MutationMask, NoFlags, Placement } from './fiberFlags';

let nextEffect: FiberNode | null = null;

export const commitMutationEffect = (finishedWork: FiberNode) => {
	nextEffect = finishedWork;

	while (nextEffect !== null) {
		const child: FiberNode | null = nextEffect.child;
		if (
			(nextEffect.subtreeFalgs & MutationMask) !== NoFlags &&
			child !== null
		) {
			nextEffect = child;
		} else {
			// 向上遍历
			up: while (nextEffect !== null) {
				const sibling: FiberNode | null = nextEffect.sibling;
				commitMutationEffectOnFiber(nextEffect);
				if (sibling !== null) {
					nextEffect = sibling;
					break up;
				}
				nextEffect = nextEffect.return;
			}
		}
	}
};

function commitMutationEffectOnFiber(finishedWork: FiberNode) {
	const flags = finishedWork.flags;

	if ((flags & Placement) !== NoFlags) {
		//执行对应的操作方法，然后删除标记
		commitPlacement(finishedWork);

		finishedWork.flags &= ~Placement;
	}
}

function commitPlacement(finishedWork: FiberNode) {
	if (__DEV__) {
		console.log('执行plement操作');
	}

	const hostParent = getHostParent(finishedWork);
	appendPlacementNodeItoContainer(finishedWork, hostParent);
}

function getHostParent(fiber: FiberNode): Container {
	let parent = fiber.return;

	while (parent) {
		const parentTag = parent.tag;

		if (parentTag === HostComponent) {
			return parent.stateNode as Container;
		}

		if (parentTag === HostRoot) {
			return (parent.stateNode as FiberRootNode).container;
		}
		parent = parent.return;

		if (__DEV__) {
			console.log('未找到hostParent');
		}
	}
}

// 寻找dom
function appendPlacementNodeItoContainer(
	finishedWork: FiberNode,
	hostParent: Container
) {
	if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
		appendChildToContainer(finishedWork.stateNode, hostParent);
		return;
	}

	const child = finishedWork.child;

	if (child !== null) {
		appendPlacementNodeItoContainer(child, hostParent);
		let sibling = child.sibling;
		while (sibling !== null) {
			appendPlacementNodeItoContainer(sibling, hostParent);
			sibling = sibling.sibling;
		}
	}
}
