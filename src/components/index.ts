import type { App } from 'vue'
import { defineAsyncComponent } from "vue";
export const components = [
    'GFilter',
    'GTable',
    'GEtable',
    'GForm',
    'GBtnBox',
    'DialogTem'
]
export function setupGlobalCom(app: App<Element>) {
    components.forEach(key => {
        app.component(key, defineAsyncComponent(() => import(`./${key}/index.vue`)))
    })
}
