export type WorkTag =
	| typeof FunctionComponent
	| typeof HostRoot
	| typeof HostComponent
	| typeof HostText;

export const FunctionComponent = 0;
export const HostRoot = 3; // HostRoot是指ReactDOM.render的渲染起点
export const HostComponent = 5; // HostComponent对标元素节点
export const HostText = 6; // HostText对标文本节点。
