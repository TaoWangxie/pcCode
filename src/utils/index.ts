
//加法
export const numAdd = (num1:any, num2:any): any => {
	var baseNum, baseNum1, baseNum2;
	try {
		baseNum1 = num1.toString().split(".")[1].length;
	} catch (e) {
		baseNum1 = 0;
	}
	try {
		baseNum2 = num2.toString().split(".")[1].length;
	} catch (e) {
		baseNum2 = 0;
	}
	baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
	return (num1 * baseNum + num2 * baseNum) / baseNum;
};

//减法
export const numSub = (num1:any, num2:any): any => {
	var baseNum, baseNum1, baseNum2;
	var precision;// 精度
	try {
		baseNum1 = num1.toString().split(".")[1].length;
	} catch (e) {
		baseNum1 = 0;
	}
	try {
		baseNum2 = num2.toString().split(".")[1].length;
	} catch (e) {
		baseNum2 = 0;
	}
	baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
	precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
	return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
};

//乘法
export const numMulti = (num1:any, num2:any) => {
	var baseNum = 0;
	try {
		baseNum += num1.toString().split(".")[1].length;
	} catch (e) {
	}
	try {
		baseNum += num2.toString().split(".")[1].length;
	} catch (e) {
	}
	return Number(num1.toString().replace(".", "")) * Number(num2.toString().replace(".", "")) / Math.pow(10, baseNum);
};
export const nummul = (a:any, b:any) => {
	a = isNaN(a) ? 0 : a
	b = isNaN(b) ? 0 : b
	var c = 0,
		d = a.toString(),
		e = b.toString();
	try {
		c += d.split(".")[1].length;
	} catch (f) {
		f == f
	}
	try {
		c += e.split(".")[1].length;
	} catch (f) {
		f == f
	}
	return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}

//判断对象是否有属性
export function hasOwn(obj: any, propName: any) {
	return Object.prototype.hasOwnProperty.call(obj, propName);
}

/**
 * 监听dom自身点击
 * @param id id名
 * @param inCb 不在范围内回调
 * @param outCb 在范围内回调
 */
export function monitorSelfClick(id: any, inCb?: any, outCb?: any) {
	document.addEventListener('click', (e: any) => {
		let isSelf: any = document.getElementById(id)?.contains(e.target)  // 这个是自己的区域
		if (!isSelf) {
			//   console.log('没在区域里面-->>>')
			inCb && inCb()
		} else {
			//   console.log('在区域里--->>>>>')
			outCb && outCb()
		}
	})
}

export function swap(arr:any, i:any, j:any) {
	const temp = arr[i]
	arr[i] = arr[j]
	arr[j] = temp
}

/**
 * 存储sessionStorage
 */
export const setSessionStorage = (name: any, content: any) => {
	if (!name) return;
	if (typeof content !== 'string') {
		content = JSON.stringify(content);
	}
	window.sessionStorage.setItem(name, content);
}

/**
 * 获取sessionStorage
 */
export const getSessionStorage = (name: any) => {
	if (!name) return;
	let data = window.sessionStorage.getItem(name)

	return data ? JSON.parse(data) : undefined;
}

//判断dom是否在可视区域
export function isInview(clientRect:any, viewHeight:any, viewWidth:any) {
	return clientRect.bottom < 0 || clientRect.top > viewHeight || clientRect.right < 0 || clientRect.left > viewWidth
}
//判断鼠标移动方向
let lastX:any = null,
	lastY:any = null;
export function mouseMoveDirection(e:any) {
	let curX = e.clientX,
		curY = e.clientY,
		direction = ['中', '中'];
	// 初始化坐标
	if (lastX == null || lastY == null) {
		lastX = curX;
		lastY = curY;
		return;
	}
	if (curX > lastX) {
		direction[0] = '右';
	} else if (curX < lastX) {
		direction[0] = '左';
	} else {
		direction[0] = '中,';
	}
	if (curY > lastY) {
		direction[1] = '下';
	} else if (curY < lastY) {
		direction[1] = '上';
	} else {
		direction[1] = '中';
	}
	lastX = curX;
	lastY = curY;
	return direction
}