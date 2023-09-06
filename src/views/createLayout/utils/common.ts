
import { defaultStyles } from "../static/defaultStyles";
import { HTMLFormat } from "./HTMLFormat";
import { formatCss } from "./CSSFormat";
import { useSchemaStore } from '@/store/schema'
const useSchema = useSchemaStore()
//dom类名操作
export class domStyleObj {
    styleLists: any;
    colPx: number;
    constructor(styleLists: any, colPx: number) {
        //样式集合
        this.styleLists = styleLists
        //列栅格高度px
        this.colPx = colPx
    }
    //添加页面所有类名
    addClassName(Rdom: any, className: any) {
        let classNameArr = Array.isArray(className) ? className : [className]
        classNameArr.map((item) => {
            Rdom.classList.add(item);
            if (hasOwn(defaultStyles, item) && !hasOwn(this.styleLists, item)) {
                this.styleLists[item] = defaultStyles[item]
            }
        })
    }
    //添加flex宽度方法
    addStyleW(width: any, parentW: any) {
        let className = `flex_w_${width}-${parentW}`
        let style = `.${className}{
            flex: 0 0 calc(100%*${width}/${parentW})
        }`
        this.addStyleFn(className, style)
    }
    //添加flex高度方法
    addStyleH(height: any) {
        let className = `grid_h_${height}`
        let style = `.${className}{
            height: ${height * this.colPx}px
        }`
        this.addStyleFn(className, style)
    }
    addStyleFn(className: any, style: any) {
        if (!this.styleLists[className]) {
            this.styleLists[className] = style
        }
    }
}

//=========================================================utils=========================================================

/**
 * 获取格式化html代码
 * @param {*} Rdom 真实dom
 * @param callBack 回调函数，处理html代码
 * @returns 
 */
export function getHtmlStrFn(Rdom: any, page: any, callBack: Function) {
    let dom: any = document.createElement('div')
    dom.appendChild(Rdom)
    let html = callBack(dom.innerHTML, page)
    dom = Rdom = null
    return HTMLFormat(html)
}
/**
 * 获取格式化js代码
 * @param callBack 回调函数，处理js代码
 * @returns 
 */
export function getJsStrFn(page: any, callBack: Function) {
    let code = callBack(page)
    return code
}
/**
 * 获取格式化 css
 * @param {*} styleLists 样式集合
 * @returns 
 */
export function getCssStrFn(styleLists: any) {
    let styleArr = Object.values(styleLists)
    let styleStr = `${styleArr.join('\n')}`
    return formatCss(styleStr)
}



//数组值之和
export function sum(arr: any, val?: any) {
    if (val) {
        return arr.reduce((sum: any, e: any) => sum + Number(e[val] || 0), 0)
    } else {
        return arr.reduce((sum: any, e: any) => sum + Number(e || 0), 0)
    }

}
//获取真实dom盒子
export function getRdomFn() {
    let dom = document.createElement('div')
    return dom;
}
//添加换行
export function insertLineFeed(dom: any) {
    var lineFeed = document.createTextNode('\n');
    dom.appendChild(lineFeed)
}

//判断对象是否有属性
export function hasOwn(obj: any, propName: any) {
    return Object.prototype.hasOwnProperty.call(obj, propName);
}
//返回结果及状态
export function getResultFn(state: any, data: any) {
    return {
        state: state,
        data: data
    }
}
/**
 * 设置虚拟盒子宽高
 * @param {*} box 虚拟dom盒子
 * @param {*} newBox 新虚拟dom
 * @param {*} isRow 是否行为处理
 * @param {*} lineWH 行列宽高
 */
export function setBoxWH(box: any, newBox: any, isRow: any, lineWH: any, left: any, top: any) {
    newBox.top = top
    newBox.left = left
    if (isRow) {
        newBox.height = lineWH
        newBox.width = box.width
        newBox.parentW = box.width
    } else {
        newBox.width = lineWH
        newBox.height = box.height
        newBox.parentW = box.width
    }
}

/**
 * 获取原始虚拟dom盒子
 * @param {*} type dom类型
 * @param {*} parentId 虚拟dom父id
 * @returns 
 */
export function getFdomFn(getID: any, type = 'default', parentId = null) {
    let id = getID()
    let divBox = {
        id: id,
        parentId: parentId,
        parentW: null,
        tagType: 'div',
        type: type,
        children: [],
        width: null,
        height: null,
        top: null,
        left: null,
        style: {
            data: {
                width: '',
                height: ''
            },
            fieldList: [
                { label: "宽", prop: "width", type: "select", list: 'widthList' },
                { label: "高", prop: "height", type: "select", list: 'heightList' },
            ],
            listTypeInfo: {
                widthList: [
                    {
                        id: 'auto',
                        name: 'auto'
                    },
                    {
                        id: 'full',
                        name: '100%'
                    },
                    {
                        id: 'flex',
                        name: 'flex:1'
                    },
                ],
                heightList: [
                    {
                        id: 'auto',
                        name: 'auto'
                    },
                    {
                        id: 'full',
                        name: '100%'
                    },
                ]
            }

        }
    }
    return divBox
}
//计算矩形面积
export function calcArea(width: any, height: any) {
    return width * height
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

/**
 * 判断一个数组中所有对象的某个属性值是否相同
 * @param arr 数组
 * @param attr 属性
 * @returns 
 */
export function checkArrayObjValueRepeat(arr: any[], attr: string) {
    var set = new Set; //创建个集合Set对象（用object对象也可以）
    for (var i = 0; i < arr.length; i++) {
        if (set.has(arr[i][attr])) { //判断每个对象里number属性的值是否在集合Set
            return true; //判断为true时提前退出pf函数
        } else {
            set.add(arr[i][attr]); //将number属性的值添加到集合Set中
        }
    }
    return false;
}


export function getObjByKey(arr: any, key: any, targetKey: any) {
    let objs = arr.filter((item: any) => {
        return item[targetKey] == key
    })
    return objs[0] ? objs[0] : ''
}