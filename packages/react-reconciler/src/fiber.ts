import { Props, Key, Ref, ReactElementType } from 'shared/ReactTypes';
import { WorkTag, FunctionComponent, HostComponent } from './workTags';
import { Flags, NoFlags } from './fiberFlags';
import { Container } from 'hostConfig';

export class FiberNode {
	tag: WorkTag;
	key: Key;
	stateNode: any;
	type: any;
	ref: Ref;

	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	index: number;

	pendingProps: Props;
	memoizedProps: Props | null;
	memoizedState: any;
	alternate: Props | null; // 备用节点
	flags: Flags;
	subtreeFalgs: Flags;
	updateQueue: unknown;
	deletions: FiberNode[] | null; // 需要删除的节点

	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		this.tag = tag;
		this.key = key;
		this.stateNode = null; // dom节点
		this.type = null;

		this.return = null; // 指向父 FiberNode
		this.sibling = null; // 指向兄弟 FiberNode
		this.child = null; // 指向子 FiberNode
		this.index = 0; // 位置下标
		this.ref = null;

		// 工作单元
		this.pendingProps = pendingProps;
		this.memoizedProps = null;
		this.memoizedState = null;
		this.updateQueue = null;

		this.alternate = null;
		this.flags = NoFlags;
		this.subtreeFalgs = NoFlags;
		this.deletions = null;
	}
}

export class FiberRootNode {
	container: Container;
	current: FiberNode;
	finisheWork: FiberNode | null;

	constructor(container: Container, hostRootFiber: FiberNode) {
		this.container = container;
		this.current = hostRootFiber;
		hostRootFiber.stateNode = this;
		this.finisheWork = null;
	}
}

export const createWorkInProgress = (
	current: FiberNode,
	pendingPros: Props
): FiberNode => {
	// workInProgress
	let wip = current.alternate; // 双缓存机制，此处可以获得另外一个相对应的 fiberNode. 之前被存在节点的 alternate 属性中

	if (wip === null) {
		// mount阶段
		wip = new FiberNode(current.tag, pendingPros, current.key);
		wip.type = current.type;
		wip.stateNode = current.stateNode;
		wip.alternate = current;
		current.alternate = wip;
	} else {
		// update 阶段
		wip.pendingProps = pendingPros;
		wip.flags = NoFlags;
		wip.subtreeFalgs = NoFlags;
		wip.deletions = null;
	}

	wip.type = current.type;
	wip.updateQueue = current.updateQueue;
	wip.child = current.child;
	wip.memoizedProps = current.memoizedProps;
	wip.memoizedState = current.memoizedState;

	return wip;
};

export function createFiberFromElement(element: ReactElementType): FiberNode {
	const { type, key, props } = element;
	let fiberTag: WorkTag = FunctionComponent;

	if (typeof type === 'string') {
		fiberTag = HostComponent;
	} else if (typeof type !== 'function' && __DEV__) {
		console.log('未定义的类型', element);
	}

	const fiber = new FiberNode(fiberTag, props, key);
	fiber.type = type;
	return fiber;
}
