
// 利用闭包为每个元素创建一个独一无二的 ID
// export function generateID(i = 0) {
//     let id = i
//     return function(type:any){
//         if(type === 'init')return id = 0
//         return id++
//     }
// }
export function generateID(){
    return Number(Math.random().toString().substr(3,8) + Date.now()).toString(36)
}