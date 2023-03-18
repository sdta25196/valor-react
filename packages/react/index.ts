import currentDispatcher, {
	Dispatcher,
	resolveDispatcher
} from './src/currentDispatcher';
import { jsx, jsxDEV, isValidElement as _isValidElement } from './src/jsx';

export const useState: Dispatcher['useState'] = (initialState: any) => {
	const dispatcher = resolveDispatcher();
	return dispatcher.useState(initialState);
};

// hooks的数据共享层
export const _SECRET_INTERNALS_DO_NOT_YSE_OR_YOU_WILL_BE_FIRED = {
	currentDispatcher
};

export const version = '0.0.0'
export const createElement = jsx
export const isValidElement = _isValidElement
