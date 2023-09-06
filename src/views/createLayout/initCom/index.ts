import type { App } from 'vue'
import { defineAsyncComponent } from "vue";
export const components = [
    'Table',
    'Form',
    'BtnBox',
]
export function setupInitGlobalCom(app: App<Element>) {
    components.forEach(key => {
        app.component(key, defineAsyncComponent(() => import(`./${key}/index.vue`)))
    })
}
