
import { previewStyles } from "../static/defaultStyles";
//注册组件页面

export function registerPlugin(vm: any, layout: any, data: any) {
    let { htmlstr, comData } = handlerComConfigCode(layout, data.html)
    vm.component('PreviewPage', {
        template: `
            <div>
                ${htmlstr}
                <component is="script">
                    
                </component>
                <component is="style">
                    ${data.css}
                    ${previewStyles}
                </component>
            </div>
        `,
        data: () => ({
            ...comData
        }),
    })
}

//处理组件配置代码
function handlerComConfigCode(layout: any, str: string) {
    let htmlstr = str
    //页面数据
    let comData = {}
    layout.map((item: any) => {
        if (item.config.data) {
            let comKey = item.comKey + item.i
            let comCode = `
            <component
                class="component_box"
                is="${item.comKey}"
            />
            `
            let req = new RegExp(`${comKey}`, "g")
            htmlstr = htmlstr.replace(req, comCode);
            // data[]
            let comDataKey = item.comKey.split('Zi')[1]
            let dataName: string = `${comDataKey.charAt(0).toLowerCase() + comDataKey.slice(1)}Data${item.i == 0 ? '' : item.i}`
            comData[dataName] = item.config.data
        }
    })

    return { htmlstr, comData }
}
