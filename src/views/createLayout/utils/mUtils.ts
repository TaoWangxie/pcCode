/**
 * 公共方法
 * */
/**
 * 存储sessionStorage
 */
 export const setSessionStorage = (name:any, content:any) => {
	if (!name) return;
	if (typeof content !== 'string') {
		content = JSON.stringify(content);
	}
	window.sessionStorage.setItem(name, content);
}

/**
 * 获取sessionStorage
 */
export const getSessionStorage = (name:any) => {
	if (!name) return;
	let data = window.sessionStorage.getItem(name)

	return data ? JSON.parse(data) : undefined;
}

/**
 * 存储localStorage
 */
export const setLocalStorage = (name:any, content:any) => {
	if (!name) return;
	if (typeof content !== 'string') {
		content = JSON.stringify(content);
	}
	window.localStorage.setItem(name, content);
}

/**
 * 获取localStorage
 */
export const getLocalStorage = (name:any) => {
	if (!name) return;
	let data = window.localStorage.getItem(name)

	return data ? JSON.parse(data) : undefined;
}

/**
 * 删除localStorage
 */
export const removeLocalStorage = (name:any) => {
	if (!name) return;
	window.localStorage.removeItem(name);
}



