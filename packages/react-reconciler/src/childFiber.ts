import { ChildDeletion, Placement } from './fiberFlags';
import { HostText } from './workTags';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { Props, ReactElementType } from 'shared/ReactTypes';
import { FiberNode, createFiberFromElement, createWorkInProgress } from './fiber';

function childReconciler(shouldTrackEffects: boolean) {
	function deleteChild(returnFiber: FiberNode, childToDelete: FiberNode) {
		if (!shouldTrackEffects) { // 如果不需要追踪副作用就return掉
			return
		}
		const deletions = returnFiber.deletions
		if (deletions === null) {
			returnFiber.deletions = [childToDelete]
			returnFiber.flags |= ChildDeletion
		} else {
			deletions.push(childToDelete)
		}
	}

	function reconcileSingleElement(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		element: ReactElementType
	) {
		const key = element.key;
		// update 阶段
		work: if (currentFiber !== null) {
			// key 相同
			if (currentFiber.key === key) {
				if (element.$$typeof === REACT_ELEMENT_TYPE) {
					// type 相同
					if (currentFiber.type === element.type) {
						const existing = useFiber(currentFiber, element.props)
						existing.return = returnFiber
						return existing
					}
					// key想同，type不同 也要删除旧的
					deleteChild(returnFiber, currentFiber)
					break work
				} else {
					if (__DEV__) {
						console.warn("还未实现的react类型", element)
						break work
					}
				}
			} else {
				// 删除旧的
				deleteChild(returnFiber, currentFiber)
			}
		}

		// 根据element 创建Fiber
		const fiber = createFiberFromElement(element);
		fiber.return = returnFiber;
		return fiber;
	}

	function reconcileSingleTextNode(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		content: string | number
	) {
		// update 阶段
		if (currentFiber !== null) {
			if (currentFiber.tag === HostText) {
				const existing = useFiber(currentFiber, { content })
				existing.return = returnFiber
				return existing
			}
			// fiber tag改变了，需要删除
			deleteChild(returnFiber, currentFiber)
		}
		// 根据element 创建Fiber
		const fiber = new FiberNode(HostText, { content }, null);
		fiber.return = returnFiber;
		return fiber;
	}

	function placeSingleChild(fiber: FiberNode) {
		if (shouldTrackEffects && fiber.alternate == null) {
			fiber.flags |= Placement;
		}
		return fiber;
	}

	return function reconcileChildFibers(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		newChild?: ReactElementType
	) {
		// 判断当前 fiber 的类型
		if (typeof newChild === 'object' && newChild !== null) {
			switch (newChild.$$typeof) {
				case REACT_ELEMENT_TYPE:
					return placeSingleChild(
						reconcileSingleElement(returnFiber, currentFiber, newChild)
					);
				default:
					if (__DEV__) {
						console.log('未实现的reconcile类型', newChild.$$typeof);
					}
					break;
			}
		}

		// TODO 多节点的情况 ul > li*3

		// hostText
		if (typeof newChild === 'string' || typeof newChild === 'number') {
			return placeSingleChild(
				reconcileSingleTextNode(returnFiber, currentFiber, newChild)
			);
		}

		// 兜底情况，删除
		if (currentFiber) {
			deleteChild(returnFiber, currentFiber)
		}

		if (__DEV__) {
			console.log('未实现的reconcile类型1', newChild);
		}

		return null;
	};
}

// fiber复用逻辑
function useFiber(fiber: FiberNode, paddingProps: Props): FiberNode {
	const clone = createWorkInProgress(fiber, paddingProps)
	clone.index = 0
	clone.sibling = null
	return clone
}

export const reconcileChildFibers = childReconciler(true);
export const mountChildFibers = childReconciler(false);
