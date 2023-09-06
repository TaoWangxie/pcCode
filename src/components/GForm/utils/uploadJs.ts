import * as qiniu from "qiniu-js";
import { Event } from "./event";
let event = new Event() // 创建event实例

let callBackFn: any = (val: any) => val,
    acceptExtensionsArr: any,
    fileMaxSizeNum: any,
    beforeUploadFn: any,
    accept: any,
    inputObj: any,
    mesObj: any,
    mesType: any,
    eventFn: any

/**
 * 
 * @param callBack  回调函数 ({ path, name, size })=>{}
 * @param acceptExtensions  自定义文件后缀类型 [xls,xlsx]
 * @param accept input通用文件类型
 * @param fileMaxSize  文件上传大小限制
 * @param beforeUpload  文件上传前函数 (file)=>{}
 * @param message  提示信息对象
 * @param messageType  提示信息类型
 * @param getStatus  获取上传状态 (status) => {}
 * @param isGetFile  isGetFile为true返回file源文件
 */
export const uploadjsFn = (params: any, isGetFile?: boolean) => {
    let input: any
    if (!document.querySelector('#uploadId')) {
        input = document.createElement('input');
        inputObj = input
        input.setAttribute('type', 'file');
        input.setAttribute('id', 'uploadId');
        input.setAttribute('accept', accept);
        input.style.display = "none";
        document.body.appendChild(input);
    } else {
        input = document.querySelector('#uploadId')
    }
    input.onchange = (e) => {
        changeFile(e, params, isGetFile)
    }
    input && (document as any).querySelector('#uploadId').click()
}
// 已有file 上传
export const hasFileUpload = async (params) => {
    let { file } = params
    if (!file) {
        mesObj ? mesObj[mesType]('文件不存在') : Toast('文件不存在')
        eventFn && event.dispatchEvent('getStatus', { code: 100, msg: '文件不存在' })
        return
    }
    validate(file, params).then(() => {
        startUpload(file)
    }).catch((e) => {
        console.log(e);
    })
}

//input上传change事件
const changeFile = async (e: any, params: any, isGetFile: any) => {
    let file = e.target.files[0];
    e.target.value = '';
    validate(file, params).then(() => {
        isGetFile ? callBackFn({ file }) : startUpload(file)
    }).catch((e) => {
        console.error(e);
    })
}
//验证格式 上传前图片处理
export const validate = async (file, valid) => {
    let { acceptExtensions, fileMaxSize, beforeUpload, message, messageType, getStatus } = setParamsData(valid)
    getStatus && event.dispatchEvent('getStatus', { code: 0, msg: '开始上传' })
    return new Promise(async function (resolve: any, reject: any) {
        try {
            const type = getFileType(file)
            if ((acceptExtensions || []).length > 0 && !acceptExtensions.includes(type.toLowerCase())) {
                let msg = `文件格式错误${acceptExtensions.length ? '，仅支持 ' + acceptExtensions.join(',') + ' 类型' : ''}`
                message ? message[messageType](msg) : Toast(msg)
                getStatus && event.dispatchEvent('getStatus', { code: 100, msg: msg })
                inputObj?.value && (inputObj.value = '')
                reject(msg)
            }
            const fileSize = file.size
            if (fileMaxSize < fileSize) {
                console.log(fileSize);
                message ? message[messageType]('文件大小已超出') : Toast('文件大小已超出')
                getStatus && event.dispatchEvent('getStatus', { code: 100, msg: '文件大小已超出' })
                inputObj?.value && (inputObj.value = '')
                reject('文件大小已超出')
            }
            // 如果没返回 true 就停下来
            if (beforeUpload) {
                const customValid = await beforeUpload(file)
                if (!customValid) {
                    inputObj?.value && (inputObj.value = '')
                    reject('beforeUploadFn失败')
                }
            }
            resolve()
        } catch (e) {
            reject(e)
        }
    })
}
// 开始上传
const startUpload = async (file: any) => {
    const { code, data, message } = await getQiniuToken();
    let observer = {
        next(res: any) { },
        error(err: any) {
            console.log('上传失败')
            mesObj ? mesObj['error']('上传失败') : Toast('上传失败', 2000)
            eventFn && event.dispatchEvent('getStatus', { code: -1, msg: '上传失败' })
            callBackFn({
                path: null,
                name: file.name,
                size: (file.size / 1024.00).toFixed(2)
            })
            inputObj && (inputObj.value = '')
        },
        complete(res: any) {
            console.log('上传成功，获得文件地址:', "https://cloudvideo.ziroom.com/" + res.key);
            mesObj ? mesObj['success']('上传成功') : Toast('上传成功', 2000)
            eventFn && event.dispatchEvent('getStatus', { code: 1, msg: '上传完成' })
            callBackFn({
                path: "https://cloudvideo.ziroom.com/" + res.key,
                name: file.name,
                size: (file.size / 1024.00).toFixed(2)
            })
            inputObj && (inputObj.value = '')
        },
    };
    var observable = qiniu.upload(
        file,
        uuid() + "." + getFileType(file), // 上传文件的key，注意结尾最好拼上文件的类型
        data.token,
        {},
        {}
    );
    observable.subscribe(observer);
}

//统一参数赋值
const setParamsData = (params) => {
    let { callBack, acceptExtensions, accept, fileMaxSize, beforeUpload, message, messageType, getStatus } = params
    eventFn = getStatus
    event.removeEventListener('getStatus', eventFn)
    eventFn && event.addEventListener('getStatus', eventFn)
    callBackFn = callBack ? callBack : (val: any) => val
    accept = accept || '*'
    acceptExtensionsArr = acceptExtensions || []
    fileMaxSizeNum = fileMaxSize || Infinity
    beforeUploadFn = beforeUpload ? beforeUpload : (val: any) => val
    mesObj = message || null
    mesType = messageType || 'warning'

    return {
        callBack: callBackFn,
        acceptExtensions: acceptExtensionsArr,
        accept,
        fileMaxSize: fileMaxSizeNum,
        beforeUpload: beforeUploadFn,
        message: mesObj,
        messageType: mesType,
        getStatus: eventFn
    }
}
// 获取文件类型 先拿上传文件的结尾，然后再拿真正的文件类型
const getFileType = (file: any) => {
    const temp = file.name.split(".")
    return temp[temp.length - 1] || file.type.split("/")[1] || ''
}
// 随机生成key，作为上传文件的id
const uuid = () => {
    return "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx".replace(/x/g, function (c) {
        let r = (Math.random() * 16) | 0;
        return r.toString(16);
    });
}
// 获取上传用token
const getQiniuToken = async () => {
    const res = await fetch("https://storagecloud.ziroom.com/getToken").then((response) => {
        return response.text();
    }).then((res) => {
        return JSON.parse(res)
    }).catch(() => {
        // ElMessage.error('获取七牛云token失败')
        mesObj ? mesObj['error']('获取七牛云token失败') : Toast('获取七牛云token失败')
        eventFn && event.dispatchEvent('getStatus', { code: -1, msg: '获取七牛云token失败' })
        console.log('获取七牛云token失败');
    })
    return res
}
//base64转为file
export const base64ImgtoFile = (dataurl: any, filename = 'file') => {
    let arr = dataurl.split(',')
    let mime = arr[0].match(/:(.*?);/)[1]
    let suffix = mime.split('/')[1]
    let bstr = atob(arr[1])
    let n = bstr.length
    let u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], `${filename}.${suffix}`, {
        type: mime
    })
}


export const Toast = (msg, duration?) => {
    duration = isNaN(duration) ? 3000 : duration;
    var m = document.createElement('div');
    m.innerHTML = msg;
    m.style.cssText =
        `font-size: .32rem;
        color: rgb(255, 255, 255);
        background-color: rgba(0, 0, 0, 0.6);
        padding: 10px 15px;
        margin: 0 0 0 -60px;
        border-radius: 4px;
        position: fixed;
        top: 10vh;
        left: 50%;
        width: 130px;
        text-align: center;
        z-index: 9999;`;
    document.body.appendChild(m);
    setTimeout(function () {
        var d = 0.5;
        m.style.opacity = '0';
        setTimeout(function () {
            document.body.removeChild(m)
        }, d * 1000);
    }, duration);
}