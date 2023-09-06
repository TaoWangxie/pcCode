
// 利用闭包为每个元素创建一个独一无二的 ID
export function generateI(i = 0) {
    let id = i
    return function (type: any) {
        if (type === 'init') return id = 0
        return id++
    }
}
