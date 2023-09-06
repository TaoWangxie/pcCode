import { createApp } from "vue";
import App from "./App.vue";
import store from '@/store'
import router from '@/router'
import element from "element-plus";
import 'element-plus/dist/index.css'
import mitt from 'mitt'
import _ from 'lodash'
import VueGridLayout from '../v3-grid-layout.es'
import '../style.css'
import { setupInitGlobalCom } from '@/views/createLayout/initCom/index'
import { setupGlobalCom } from '@/components/index'


const $window: any = window

// 监听基座下发的数据变化
// console.log(6, window)
if ($window.eventCenterForChildApp_1) {
  $window.eventCenterForChildApp_1.addDataListener((data: any) => {
    // 当基座下发跳转指令时进行跳转
    if (data.path && typeof data.path === 'string') {
      console.log(12, data.path)
      data.path = data.path.replace(/^#/, '')
      // console.log(13, router.currentRoute.value.path)
      // 当基座下发path时进行跳转
      if (data.path && data.path !== router.currentRoute.value.path) {
        // console.log('child-micro3响应事件', data)
        router.push(data.path)
      }
    }
  }, true)
}


let app = createApp(App)
// 挂载pinia
app.use(store)
app.use(router)
app.use(element)
app.use(VueGridLayout)
setupGlobalCom(app)
setupInitGlobalCom(app)
//事件总线
app.config.globalProperties.mittBus = mitt()
app.config.globalProperties.$vm = app;
app.mount("#child-micro3")

/**
 * 用于解决主应用和子应用都是vue-router4时相互冲突，导致点击浏览器返回按钮，路由错误的问题。
 * 相关issue：https://github.com/micro-zoe/micro-app/issues/155
 * 当前vue-router版本：4.0.12
 */
fixBugForVueRouter4(router)
function fixBugForVueRouter4(router: any) {
  // 判断主应用是main-app 主应用是 vue-router4
  if ($window.location.href.includes('/main-app')) {
    /**
     * 重要说明：
     * 1、这里主应用下发的基础路由为：`/main-xxx/app-vite`，其中 `/main-xxx` 是主应用的基础路由，需要去掉，我们只取`/app-vite`，不同项目根据实际情况调整
     *
     * 2、因为vite关闭了沙箱，又是hash路由，我们这里写死realBaseRoute为：/app-vite#
     */
    const realBaseRoute = '/child-micro3#'

    router.beforeEach(() => {
      if (typeof $window.history.state?.current === 'string') {
        $window.history.state.current = $window.history.state.current.replace(new RegExp(realBaseRoute, 'g'), '')
      }
    })

    router.afterEach(() => {
      if (typeof $window.history.state === 'object') {
        $window.history.state.current = realBaseRoute + ($window.history.state.current || '')
      }
    })
  }
}

/** ********************监听事件***********************/
$window.addEventListener(`unmount-child-micro3`, destroy$windowListen, true)

function destroy$windowListen() {
  $window.eventCenterForChildApp_1?.clearDataListener()
  // console.log(34, '监听卸载事件')
  $window.removeEventListener('unmount-child-micro3', destroy$windowListen, true)
}
// 判断是否为微前端环境
/*if($window.__MICRO_APP_BASE_APPLICATION__){
  console.log(34, $window.__MICRO_APP_NAME__)
  $window[`micro-app-child-micro3`]= { unmount }
  console.log(37, $window)
  // 注册事件
  console.log('--微应用状态')
}else{
  console.log('--独立应用状态')
}
function unmount() {
  console.log(44, 'umount-----------------')
}*/
