// import { ref, getCurrentInstance } from "vue";
import store from '@/store';
let { editor: $editor } = store.state as any
import context from '@/main'

const ctrlKey = 17,
    shiftKey = 16,
    vKey = 86, // 粘贴
    cKey = 67, // 复制
    xKey = 88, // 剪切

    yKey = 89, // 重做
    zKey = 90, // 撤销

    lKey = 76, // 锁定
    uKey = 85, // 解锁

    sKey = 83, // 保存
    pKey = 80, // 预览
    dKey = 68, // 删除
    deleteKey = 46, // 删除
    eKey = 69, // 清空画布
    
    wKey = 87, 
    aKey = 65,

    spKey = 32

export const keycodes = [32, 46, 65, 67, 68, 69, 76, 80, 83, 85, 86, 87, 88, 89, 90]

// 与组件状态无关的操作
const basemap = {
    [cKey]: copy,
    [vKey]: paste,
    [yKey]: redo,
    [zKey]: undo,
    [sKey]: save,
}

// 组件锁定状态下可以执行的操作
const keyMap = {
    ...basemap,
}



// 全局监听按键操作并执行相应命令
export function listenGlobalKeyDown() {
    window.onkeydown = (e) => {
        // e.preventDefault()
        keyMap[e.keyCode] && keyMap[e.keyCode]()
    }
    window.onkeyup = (e) => {
        
    }
}
// 取消全局监听按键操作并执行相应命令
export function cancelListenGlobalKeyDown() {
    (window.onkeydown as any) = "";
    (window.onkeyup as any) = ''
}



function copy() {
    console.log('copy');
}
function paste() {
    console.log('paste');
}
function redo() {
    console.log('redo');
}
function undo() {
    console.log('undo');
}
function save() {
    // store.commit('save')
    console.log('save');
}
