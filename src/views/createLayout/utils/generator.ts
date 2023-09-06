
import {
    domStyleObj,
    sum,
    getRdomFn,
    getHtmlStrFn,
    getCssStrFn,
    getJsStrFn,
    getResultFn,
    setBoxWH,
    getFdomFn,
    calcArea
} from "./common";
import _ from 'lodash'
import { generateI } from "./generateI";
import { useSchemaStore } from '@/store/schema'
const useSchema = useSchemaStore()
import { BTNLIST } from '../static/btnList'
import { getObjByKey } from './common'

/**
 * 布局生成类
 */
const getID = generateI()

/**
 * 获取代码
 * @param {*} sourceData
 * @returns 
 */
export function getCode(page: any) {
    let Fdom = setFdom(page.data)
    if (Fdom) {
        let { Rdom, styleLists }: any = getRdom(Fdom)
        let res: any = {
            html: getHtmlStrFn(Rdom, page, replaceHtmlCode),
            js: getJsStrFn(page, replaceJsCode),
            css: getCssStrFn(styleLists)
        }
        return getResultFn('ok', res)
    } else {
        return getResultFn('error', null)
    }
}

//处理html代码
const replaceHtmlCode = (html: string, page: any) => {
    page.data.map((item: any) => {
        if (item.config && item.config.code) {
            let str = ''
            let key = item.config.data && item.config.data.fieldList ? 'fieldList' : 'columns'
            item.config.data && item.config.data[key] && item.config.data[key].map((it) => {
                if (it.colType == 'slot') {
                    str += `<template #${it.prop}="{scope}"></template>`
                }
            })
            let req = new RegExp(`${item.comKey + item.i}`, "g")
            let code = item.config.code.replace(/\*/g, `_${item.i}`);
            code = code.replace(/\#slot/g, str)
            html = html.replace(req, code);
        }
    })
    html += `<component
                v-if="dialog"
                v-model:visible="visible"
                :is="dom[dialog.com]"
                v-bind="dialog"
            ></component>`
    return html
}
//处理js代码
const replaceJsCode = (page: any) => {
    let codeArr: string[] = []
    let dialog: any = {}
    let importComArr: any[] = []
    let importDialogArr: any[] = []
    page.data.map((item: any) => {
        let funcList: any = _.cloneDeep(item.config.funcList)
        let comData: any = _.cloneDeep(item.config.data)
        //组件配置
        if (comData) {
            let List: any[] = comData && comData.columns
            List && List.map((it) => {
                //去除空值属性
                Object.keys(it).map((key) => {
                    if (!it[key] && it[key] != 0 && it[key] != false) {
                        delete it[key]
                    }
                })
                if (['select', 'radio', 'checkbox'].includes(it?.colType || it?.fieldType)) {
                    it['list'] = `${it.prop}List`
                    comData.listTypeInfo[`${it.prop}List`] = []
                }
                if (it.required) {
                    let typeList = ['select', 'date', 'checkbox']
                    comData.rules[it.prop] = [{ required: true, message: `${typeList.includes(it?.colType || it?.fieldType) ? '请选择' : '请输入'}${it.label}`, trigger: ['blur', 'change'] }]
                }
            })
            let comKey = item.comKey
            let dataName: string = `${comKey}`
            let str: string = `const ${dataName + '_' + item.i} = ${JSON.stringify(comData, null, 4)}`
            importComArr.push(dataName + '_' + item.i)
            codeArr.push(str)
        }
        //弹窗配置
        if (funcList) {
            funcList.map((func: any) => {
                let pageConfig = useSchema.pageList.find((item: any) => item.key == func.connected)
                if (pageConfig.config.data.temType == 'dialog') {
                    dialog[func.code] = {
                        com: pageConfig.config.data.temFileName,
                        title: pageConfig.config.data.temName,
                        width: pageConfig.config.data.temWidth,
                    }
                    !importDialogArr.includes(dialog[func.code].com) &&
                        importDialogArr.push(dialog[func.code].com)
                }
            })
        }
    })
    if (Object.keys(dialog).length) {
        let dialogStr: any = `const dialogs = ${JSON.stringify(dialog, null, 4)}`
        importComArr.push(`dialogs`)
        codeArr.push(dialogStr)
        codeArr.unshift([
            `const dom = shallowReactive({ ${importDialogArr.join(", ")} });`,
            `let visible: any = ref(false);`,
            `let dialog: any = ref(null);`,
        ].join("\n"))
    }
    //import导入配置
    codeArr.unshift([
        `import { methodsFn, ${importComArr.join(", ")} } from "./data/index";`,
        `const { proxy } = getCurrentInstance() as any;`,
        `const methods = methodsFn(proxy);`,
    ].join("\n"))
    importDialogArr.map((item) => {
        let importStr = `import ${item} from ".components/${item}.vue";`
        codeArr.unshift(importStr)
    })
    return codeArr.join("\n")
}

//获取虚拟dom
export function setFdom(sourceData: any) {
    //id初始化
    getID('init')
    //生成虚拟dom
    let Fdom = createFdom(sourceData, useSchema.colNum, getFdomFn(getID), 'row')
    return Fdom
}
//设置真实dom，和样式集合
export function getRdom(Fdom) {
    if (!Fdom) return
    let styleLists = {}
    //样式生成类初始化
    let DomStyleObj = new domStyleObj(styleLists, useSchema.colPx);
    //生成真实dom
    let Rdom = createRdom(Fdom, getRdomFn(), DomStyleObj)
    return {
        Rdom: Rdom,
        styleLists: styleLists
    }
}

//========================================================= Fn ============================================================
/**
 * 根据画布生成虚拟dom （主方法）
 * @param {*} gridArr 画布数据/局部数据
 * @param {*} lineWH 行列宽高
 * @param {*} box 父盒子
 * @param {*} type 行列类型
 */
function createFdom(gridArr: any, lineWH: any, box: any, type: any) {
    //是否是处理行
    let isRow = type === 'row'
    let poskey = isRow ? ['x', 'y'] : ['y', 'x']
    let edgekey = isRow ? ['w', 'h'] : ['h', 'w']
    //布局宽/高
    let layoutWH: string = ''
    //分割线
    let splitLineList: any = []
    //画布数据的类二维数组
    let layoutObj: any = {}
    let gridSumAreaArr: any = []
    gridArr.map((item: any) => {
        gridSumAreaArr.push(calcArea(item.w, item.h))
        if (!layoutObj[item[poskey[1]]]) {
            layoutObj[item[poskey[1]]] = [item]
        } else {
            layoutObj[item[poskey[1]]].push(item)
        }

    })
    Object.keys(layoutObj).map((key, index) => {
        if (index === Object.keys(layoutObj).length - 1) {
            layoutWH = layoutObj[key][0][edgekey[1]] + layoutObj[key][0][poskey[1]]
        }
        sum(layoutObj[key], edgekey[0]) === lineWH && splitLineList.push(key)
    })
    //最外层盒子设置宽高
    if (box.parentId === null) {
        box.width = lineWH
        box.height = layoutWH
        let layoutArea = calcArea(box.width, box.height)
        let gridSumArea = sum(gridSumAreaArr)
        if (layoutArea !== gridSumArea) return null
    }
    //分割线不为0
    if (splitLineList.length > 0) {
        //循环行/列
        splitLineList.map((slXY: any, index: any) => {
            //行/列的底
            let nextSplitLine: any
            if (index === splitLineList.length - 1) {
                nextSplitLine = layoutWH
            } else {
                nextSplitLine = Number(splitLineList[index + 1])
            }
            //当前行所有数据
            let rowGridArr = gridArr.filter((grid: any) => {
                return grid[poskey[1]] >= slXY && grid[poskey[1]] < nextSplitLine
            })
            //宽/高
            let lineWH = nextSplitLine - Number(slXY)
            if (rowGridArr.length === 1) {
                //判断是否为占位符，是的话不添加虚拟dom
                if (rowGridArr[0].isShow) {
                    let newBox: any = getFdomFn(getID, 'default', box.id)
                    setBoxWH(box, newBox, isRow, lineWH, rowGridArr[0].x, rowGridArr[0].y)
                    newBox.children.push(rowGridArr[0])
                    box.children.push(newBox)
                }
            } else {
                let newBox = getFdomFn(getID, isRow ? 'flex' : 'default', box.id)
                setBoxWH(box, newBox, isRow, lineWH, rowGridArr[0].x, rowGridArr[0].y)
                box.children.push(newBox)
                //递归判断有行/列
                createFdom(rowGridArr, lineWH, newBox, isRow ? 'col' : 'row')
            }
        })
    } else {
        console.log('无元素')
        return null
    }
    return box
}

/**
 * 根据虚拟dom生成真实dom, 处理dom属性，生成样式集合
 * @param {*} Fdom 虚拟dom
 * @param {*} Rdom 真实dom
 * @param {*} DomStyleObj 类名操作类
 */
function createRdom(Fdom: any, Rdom: any, DomStyleObj: any) {
    // console.log(Fdom);
    if (!Fdom.type) {
        Rdom.innerHTML = Fdom.comKey + Fdom.i
        if (Fdom.fixedH) {
            DomStyleObj.addClassName(Rdom, [`grid_h_${Fdom.h}`, 'grid_box'])
            DomStyleObj.addStyleH(Fdom.h)
        }
    } else if (Fdom.key !== 'Placeholder') {
        let newBox: any
        //不为最外层盒子
        if (Fdom.parentId != null) {
            newBox = getRdomFn()
            //父盒子是否有flex-row
            if (Rdom.getAttribute("class")?.includes('flex_row')) {
                DomStyleObj.addClassName(newBox, `flex_grid`)
            }
            Rdom.appendChild(newBox)
        } else {
            newBox = Rdom
            DomStyleObj.addClassName(newBox, [`pageBox`])
        }
        //flex布局添加固定样式
        Fdom.type === "flex" && DomStyleObj.addClassName(newBox, `flex_row`)
        //设置盒子flex自适应宽度
        if (Fdom.width === Fdom.parentW) {
            DomStyleObj.addClassName(newBox, `flex_w_cover`)
        } else if (Fdom.parentW) {
            DomStyleObj.addClassName(newBox, `flex_w_${Fdom.width}-${Fdom.parentW}`)
            DomStyleObj.addStyleW(Fdom.width, Fdom.parentW)
        }
        //设置盒子唯一id
        newBox.setAttribute("fdom-id", Fdom.id);
        Fdom.children?.length &&
            Fdom.children.map((item: any) => {
                createRdom(item, newBox, DomStyleObj)
            })
    }
    return Rdom
}













