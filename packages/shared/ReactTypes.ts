export type Type = any;
export type Key = any;
export type Ref = any;
export type Props = any;
export type ElementType = any;

// ReactElement数据结构
export interface ReactElement {
	$$typeof: symbol | number;
	type: ElementType;
	key: Key;
	ref: Ref;
	props: Props;
	__mark: string;
}
