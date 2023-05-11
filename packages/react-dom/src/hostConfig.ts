import { HostText } from './../../react-reconciler/src/workTags';
import { FiberNode } from 'react-reconciler/src/fiber';

export type Container = Element;
export type Instance = Element;
export type TextInstance = Text;

export const createInstance = (type: string, props: any): Instance => {
	console.log(props);

	const element = document.createElement(type);

	return element;
};

export const appendInitialChilld = (
	parent: Instance,
	child: Instance
): void => {
	parent.appendChild(child);
};

export const createTextInitialChilld = (content: string) => {
	return document.createTextNode(content);
};

export const appendChildToContainer = appendInitialChilld;

export function commitUpdate(fiber: FiberNode) {
	switch (fiber.tag) {
		case HostText:
			const text = fiber.memoizedProps.content;
			return commitTextUpdate(fiber.stateNode, text);
		default:
			if (__DEV__) {
				console.warn('未实现的Update类型', fiber);
			}
			break;
	}
}

export function commitTextUpdate(textInstance: TextInstance, content: string) {
	textInstance.textContent = content;
}
