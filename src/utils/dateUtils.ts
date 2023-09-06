//发布订阅事件中心
export class dateUtil {
  today: any
  constructor() { }
  //获取当前时间
  getNowTime() {
    let date: any = new Date()
    let times = date.toLocaleString('en-US', { hour12: false }).split(" ")
    let time = times[1]
    let mdy = times[0]
    mdy = mdy.split('/')
    let month = parseInt(mdy[0]);
    let day = parseInt(mdy[1]);
    let year = parseInt(mdy[2])
    this.today = year + '-' + month + '-' + day + ' ' + time
    return this.today
  }
  //时间比较
  //DateOne DateTwo: 2023-03-31 17:49:16
  compareDate(DateOne: any, DateTwo: any) {
    let time1 = new Date(DateOne.replace(/-/g, "/")).getTime();
    ///pattern/是正则表达式的界定符，里面的内容(pattern)是要匹配的内容
    //g 代表全局，所有的- 都替换
    //getTime() 方法可返回距 1970 年 1 月 1 日之间的毫秒数，用于比较时间。
    let time2 = new Date(DateTwo.replace(/-/g, "/")).getTime();
    if (time1 < time2) {//说明DateOne早于DateTwo
      return true;
    } else {
      return false;
    }
  }
  //今天是否是月末
  isLastDateOfCurrentMonth() {
    if (!this.today) return false
    var d = new Date(this.today.replace(/\-/, "/ "));
    var nd = new Date(d.getTime() + 24 * 60 * 60 * 1000); //next day
    return (d.getMonth() != nd.getMonth())
  }
}
//实时时间
export class nowTime {
  callBack: Function = (val) => val;
  newTime = ''
  myTimeDisplay: any = null
  constructor(callBack) {
    this.callBack = callBack
    this.getNowTime();//进入页面调用该方法获取当前时间
    clearInterval(this.myTimeDisplay);//销毁之前定时器
    this.myTimeDisplay = setInterval(() => {
      this.getNowTime(); //每秒更新一次时间
      this.callBack(this.newTime)
    }, 1000);
  }
  getNowTime() {
    let date = new Date();
    let time = date.getFullYear() + '-' +
      this.addZero((date.getMonth() + 1)) + '-' +
      this.addZero(date.getDate()) + ' ' +
      this.addZero(date.getHours()) + ':' +
      this.addZero(date.getMinutes()) + ':' +
      this.addZero(date.getSeconds());
    this.newTime = time;
  }
  addZero(s) {
    return s < 10 ? ('0' + s) : s;
  }
}

//今天是否是月末
//dateData: 2023-03-31 17:49:16 true
export const isLastDateOfCurrentMonth = (dateData: any) => {
  if (!dateData) return false
  var d = new Date(dateData.replace(/\-/, "/ "));
  var nd = new Date(d.getTime() + 24 * 60 * 60 * 1000); //next day
  return (d.getMonth() != nd.getMonth())
};