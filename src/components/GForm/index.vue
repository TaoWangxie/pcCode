<template>
    <el-form
        ref="form"
        class="page-form"
        status-icon
        :class="className"
        :model="data"
        :rules="rules"
        :label-position="labelPosition"
        :label-width="labelWidth"
    >
        <template v-for="(item, index) in getConfigList()">
            <el-form-item
                v-if="item.fieldType !== 'hide'"
                :key="index"
                :prop="item.prop"
                :label="item.label"
                :class="item.className"
                :style="{
                    width: item.customWidth
                        ? `${item.customWidth}%`
                        : `calc(100%/${count})`,
                    marginRight: item.allLine
                        ? item.customWidth
                            ? `${100 - item.customWidth}%`
                            : `${100 - 100 / count}%`
                        : 0,
                }"
            >
                <!-- 插槽 -->
                <template v-if="item.fieldType === 'slot'">
                    <slot :name="item.prop" />
                </template>
                <!-- 输入框 密码框 文本框 -->
                <el-input
                    v-if="
                        item.fieldType === 'input' ||
                        item.fieldType === 'password' ||
                        item.fieldType === 'textarea'
                    "
                    :type="item.fieldType"
                    v-model.trim="data[item.prop]"
                    style="flex: 1"
                    clearable
                    :placeholder="getPlaceholder(item)"
                    v-bind="item"
                    @blur="handleEvent($event, item.prop)"
                />
                <!-- 计数器 -->
                <el-input-number
                    v-if="item.fieldType === 'inputNumber'"
                    v-model="data[item.prop]"
                    style="flex: 1"
                    v-bind="item"
                    @change="handleEvent($event, item.prop, 'change')"
                />
                <!-- 开关 -->
                <el-switch
                    v-if="item.fieldType === 'switch'"
                    v-model="data[item.prop]"
                    v-bind="item"
                    @change="handleEvent($event, item.prop, 'change')"
                />
                <!-- 选择框 -->
                <el-select
                    v-if="item.fieldType === 'select'"
                    v-model="data[item.prop]"
                    style="flex: 1"
                    filterable
                    clearable
                    :placeholder="getPlaceholder(item)"
                    v-bind="item"
                    @change="handleEvent($event, item.prop, 'change')"
                >
                    <el-option
                        v-for="it in listTypeInfo[item.list]"
                        :key="it.value"
                        :label="setOptionLabelvalue(it, item)"
                        :value="
                            item.valueKey
                                ? it
                                : setOptionLabelvalue(it, item, 'value')
                        "
                        :disabled="it.disabled"
                    />
                </el-select>
                <!-- 单选框 -->
                <el-radio-group
                    v-if="item.fieldType === 'radio'"
                    style="flex: 1"
                    v-model="data[item.prop]"
                    v-bind="item"
                    @change="handleEvent($event, item.prop, 'change')"
                >
                    <el-radio
                        v-for="childItem in listTypeInfo[item.list]"
                        :key="childItem.label + index"
                        :label="childItem.label"
                        >{{ childItem.title }}</el-radio
                    >
                </el-radio-group>
                <!-- 多选框 -->
                <el-checkbox-group
                    v-if="item.fieldType === 'checkbox'"
                    v-model="data[item.prop]"
                    v-bind="item.col"
                    @change="handleEvent($event, item.prop, 'change')"
                >
                    <el-checkbox
                        v-for="(childItem, childIndex) in listTypeInfo[
                            item.list
                        ]"
                        :key="childIndex"
                        :disabled="item.disabled"
                        :label="childItem.value"
                    >
                        {{ childItem.label }}
                    </el-checkbox>
                </el-checkbox-group>
                <!-- 日期选择框 -->
                <el-date-picker
                    v-if="item.fieldType === 'date'"
                    v-model="data[item.prop]"
                    style="flex: 1"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :placeholder="getPlaceholder(item)"
                    clearable
                    v-bind="item.col"
                    @change="handleEvent($event, item.prop, 'change')"
                />
                <!-- 上传文件 -->
                <div v-if="item.fieldType === 'upload'" class="upload_box">
                    <div
                        v-if="!uploadFile"
                        class="upload_btn"
                        @click="upload(item.prop)"
                    >
                        上传
                    </div>
                    <div v-else class="upload_file">
                        <img
                            src="https://cloudvideo.ziroom.com/7c2a678f-477e-9630-a315-6677e27661bb.png"
                            alt=""
                        />
                        <div class="upload_info">
                            <div class="name">{{ uploadFile.name }}</div>
                            <div class="size">{{ uploadFile.size }} kb</div>
                        </div>
                        <div class="close" @click="clearFile(item.prop)">
                            <el-icon :size="16"><CircleClose /></el-icon>
                        </div>
                    </div>
                </div>
                <template v-if="item.rightSlot">
                    <slot :name="'right-' + item.prop" />
                </template>
            </el-form-item>
        </template>
    </el-form>
</template>

<script setup lang='ts'>
import _ from 'lodash';
import { ref, reactive, getCurrentInstance, watch } from 'vue';
import { Plus, Document, CircleClose } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { uploadjsFn } from './utils/uploadJs';
const { proxy } = getCurrentInstance() as any;

let form: any = ref(null);

interface Props {
    className?: string;
    data: any;
    columns: Record<string, any>[];
    rules?: any;
    listTypeInfo?: any;
    labelWidth?: string;
    labelPosition?: string;
    whetherDisabled?: boolean;
    count?: number;
}
const props = withDefaults(defineProps<Props>(), {
    className: '',
    data: () => {},
    columns: () => [],
    rules: () => {},
    listTypeInfo: () => {},
    labelWidth: '100px',
    labelPosition: 'top',
    whetherDisabled: false,
    count: 1,
});

let uploadFile: any = ref(null);

/**
 * @method 获取表单信息
 * @desc 📝 检查每一项中是否又show属性,存在为false的情况下不予以显示
 */
const getConfigList = () => {
    /**判断是否为查看, 是否需禁用 */
    let resolveList = _.cloneDeep(props.columns);
    if (props.whetherDisabled) {
        resolveList.map((item: any) => (item.disabled = true));
    } else {
        resolveList.map((item: any) => {
            if (!item.disabled) {
                item.disabled = false;
            }
        });
    }
    /**返回form表单 */
    return resolveList.filter(
        (item: any) =>
            !Object.prototype.hasOwnProperty.call(item, 'show') ||
            (Object.prototype.hasOwnProperty.call(item, 'show') && item.show),
    );
};

/**
 * @method 判断placeholder显示内容
 * @param {Object} row
 * @returns {String} placeholder
 * @desc 📝默认显示内容提示
 */
const getPlaceholder = (row: any) => {
    let placeholder;
    if (
        row.fieldType === 'input' ||
        row.fieldType === 'textarea' ||
        row.fieldType === 'password'
    ) {
        placeholder = '请输入' + row.label;
    } else if (
        row.fieldType === 'select' ||
        row.fieldType === 'time' ||
        row.fieldType === 'date'
    ) {
        placeholder = '请选择' + row.label;
    } else {
        placeholder = row.label;
    }
    return placeholder;
};

// select选择处理label  value  name id
const setOptionLabelvalue = (cItem: any, item: any, type = 'label') => {
    // 此方法为了保证向后兼容
    let label = '';
    let value = '';
    // 存在 listProps 时
    let listProps = item?.listProps;
    if (listProps) {
        // 老版本
        if (listProps?.name) {
            label = cItem[listProps?.name];
            value = cItem[listProps?.id];
        } else if (listProps?.label) {
            // 新
            label = cItem[listProps?.label];
            value = cItem[listProps?.value];
        }
    } else {
        label = cItem['name'] || cItem['label'];
        value = cItem?.id ?? cItem?.value;
        //提示 如果 不配置listProps 而且 cItem里 name label id value 都存在的话  建议对原始数据进行处理
    }
    if (type === 'label') {
        return label;
    } else {
        return value;
    }
};

/**
 * @method 绑定相关事件
 * @param {Event} event
 * @param {String | Number} val
 * @param {String} change
 * @desc 📝事件处理, 当前form项失去焦点时, 获取 value 值和 字段名称
 * @desc 📝change 事件特殊处理: change 只能拿到选中值. 此时的 event 为选中值的 value
 */
const handleEvent = (event: any, val: any, change?: any) => {
    let obj = {
        value: change === 'change' ? event : event.target.value,
        label: val,
    };
    proxy.$emit('handleEvent', obj);
};

const confirmRule = async () => {
    const valid = await new Promise((resolve) => form.value.validate(resolve));
    if (!valid) return false;
    let params = {
        data: proxy.data,
    };
    return Promise.resolve(params);
};

const resetFields = () => {
    form.value.resetFields();
};

//================================utils================================
//设置data值
const utilsSetData = (curObj: any, targetObj: any, replaceObj?: any) => {
    let keys = Object.keys(targetObj);
    let keys2 = replaceObj ? Object.keys(replaceObj) : [];
    Object.keys(curObj).map((item: any) => {
        if (keys.includes(item)) {
            curObj[item] =
                targetObj[item] ||
                targetObj[item] === 0 ||
                targetObj[item] === false
                    ? targetObj[item]
                    : curObj[item];
        } else if (keys2.length && keys2.includes(item)) {
            let prop = targetObj[replaceObj[item]];
            curObj[item] =
                targetObj[replaceObj[item]] ||
                targetObj[replaceObj[item]] === 0 ||
                targetObj[replaceObj[item]] === false
                    ? targetObj[replaceObj[item]]
                    : curObj[item];
        }
    });
    return curObj;
};

const upload = (prop: any) => {
    let params = {
        message: ElMessage,
        callBack: (data: any) => {
            console.log(data);
            uploadFile.value = data;
            props.data[prop] = data.path;
        },
        getStatus: (status: any) => {
            //获取上传状态
            let { code, msg } = status;
            if (code === 0) {
                // loading.value = true
            } else {
                // loading.value = false
            }
            // isDropStart.value = false
        },
    };
    uploadjsFn(params);
};

const clearFile = (prop: any) => {
    uploadFile.value = null;
    props.data[prop] = null;
};

//暴露方法给父组件
defineExpose({ confirmRule, resetFields, utilsSetData });
</script>

<style lang="scss" scoped>
.page-form {
    // 父容器添加负外边距和子内容内边距进行抵消
    margin: 0 -10px;
    .upload_box {
        width: 100%;
        .upload_btn {
            height: 30px;
            width: 100px;
            border: 2px dashed #dcdfe6;
            display: flex;
            align-items: center;
            justify-content: center;
            &:hover {
                cursor: pointer;
                border-color: #409eff;
            }
        }
        .upload_file {
            width: 100%;
            display: flex;
            height: 40px;
            img {
                display: inline-block;
                height: 40px;
                flex-shrink: 0;
            }
            .upload_info {
                flex: 1;
                padding-left: 8px;
                .name {
                    display: flex;
                    align-items: center;
                    height: 20px;
                    font-size: 13px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                .size {
                    display: flex;
                    align-items: center;
                    height: 20px;
                    font-size: 12px;
                    color: #909399;
                }
            }
            .close {
                display: flex;
                align-items: center;
                justify-content: center;
                padding-left: 5px;
                &:hover {
                    cursor: pointer;
                    color: #f87269;
                }
            }
        }
    }

    .el-form-item {
        // 子内容添加右边距，和margin进行抵消
        padding: 5px 10px;
        box-sizing: border-box;
        width: 50%;
        .el-form-item__content {
            .el-input,
            .el-select,
            .el-textarea {
                width: 100%;
            }

            .el-input-number {
                .el-input {
                    width: inherit;
                }
            }
        }
    }
    .el-form-block {
        display: block;
        width: 100%;

        .el-form-item__content {
            .el-input,
            .el-select,
            .el-textarea {
                width: 100%;
            }
        }
    }
}
.page-form-block {
    .el-form-item {
        display: block;

        .el-form-item__content {
            .el-input,
            .el-select,
            .el-textarea {
                width: inherit;
            }

            .el-input-number {
                .el-input {
                    width: inherit;
                }
            }
        }
    }
    .el-form-block {
        display: block;
        width: 100%;
        .el-form-item__content {
            .el-textarea {
                width: 100%;
            }
        }
    }
}
.el-form {
    display: flex;
    justify-content: space-between;
    flex-flow: wrap;
    .el-form-item {
        width: 100%;
        padding: 0 10px !important;
        ::v-deep .el-form-item__label {
            font-weight: 500;
            font-size: 13px;
            margin: 0 !important;
            color: #222222 !important;
        }
    }
}
// 表单label位置为top的reset
.el-form--label-top .el-form-item__label {
    padding-bottom: 0;
}
::v-deep .el-form-item__error {
    left: auto;
}
// 必填项样式重置
.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before,
.el-form-item.is-required:not(.is-no-asterisk)
    .el-form-item__label-wrap
    > .el-form-item__label:before {
    content: '';
    display: inline-block;
    margin-right: 5px;
    height: 10px;
    width: 2px;
    background-color: #f87269;
}
</style>
