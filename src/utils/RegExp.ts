
//字符串正则匹配替换
export const Replace = () => {
  let text = 'my name is hu,you NAME is zhang';
  // 因为字符串是不可修改的对象所以要赋值给一个新变量, 也可以对其重新赋值
  text = text.replace(/name/gi, 'like'); // 标志g表示全局匹配,标志i表示不区分大小写
  console.log(text); // my like is hu,you like is zhang
}

//动态正则匹配替换
export const dynamicsReplace = () => {
  const obj = {
    k1: 20,
    k2: 10
  }
  let str = '{#k1}/{#k2}/{#k1}'
  // 方式一
  Object.keys(obj).forEach(key => {
    const reg = new RegExp(`{#${key}}`, 'g')
    str = str.replace(reg, obj[key])
  })
  // 方式二
  // Object.keys(obj).forEach(key => {
  //   str = str.replace(eval(`/{#${key}}/g`), obj[key])
  // })
  console.log(str);
}