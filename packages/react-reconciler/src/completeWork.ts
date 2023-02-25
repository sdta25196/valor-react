import { FiberNode } from './fiber';
// dfs的归阶段
export const completeWork = (fiber: FiberNode) => {
	console.log(fiber);
};
