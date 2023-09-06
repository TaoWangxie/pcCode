<template>
  <div class="filter_box">
    <div ref="filterRef" class="form-block">
      <template v-for="(item, index) in columns" :key="index">
        <div
          v-show="icon === 'close' ? index < colCount : true"
          class="filter-item"
          :style="{
            width: `${item.customWidth}%`,
          }"
        >
          <div class="item-style">
            <span id="label-style-id" class="label-style">{{
              item.label
            }}</span>
            <template v-if="item.colType === 'slot'">
              <slot :name="item.prop" />
            </template>
            <template v-if="item.colType === 'input' || !item.colType">
              <el-input
                v-model="filterData[item.prop]"
                style="flex: 1"
                clearable
                :placeholder="defaultPlaceholder(item)"
                v-bind="item"
                @keyup.enter="handleSearch"
                @blur="handleEvent($event, item.prop)"
              />
            </template>
            <template v-if="item.colType === 'date'">
              <el-date-picker
                v-model="filterData[item.prop]"
                style="flex: 1"
                clearable
                :placeholder="defaultPlaceholder(item)"
                v-bind="item"
                @change="handleEvent($event, item.prop, 'change')"
              />
            </template>
            <template v-if="item.colType === 'select'">
              <el-select
                v-model="filterData[item.prop]"
                style="flex: 1"
                filterable
                clearable
                :placeholder="defaultPlaceholder(item)"
                v-bind="item"
                @change="handleEvent($event, item.prop, 'change')"
              >
                <el-option
                  v-for="(childItem, childIndex) in listTypeInfo[item.list]"
                  :key="childIndex"
                  :label="setOptionLabelvalue(childItem, item)"
                  :value="setOptionLabelvalue(childItem, item, 'value')"
                  :disabled="childItem.disabled"
                />
              </el-select>
            </template>
            <template v-if="item.colType === 'cascader'">
              <el-cascader
                v-model="filterData[item.prop]"
                style="flex: 1"
                :options="listTypeInfo[item.list]"
                :props="
                  listTypeInfo[item.propsOpt] || {
                    label: 'label',
                    value: 'value',
                    children: 'children',
                  }
                "
                :placeholder="defaultPlaceholder(item)"
                v-bind="item"
                @change="handleEvent($event, item.prop, 'change')"
              />
            </template>
          </div>
        </div>
      </template>
      <div class="btn-style">
        <div style="display: flex; height: 100%">
          <el-button type="primary" size="small" @click="handleSearch">
            搜索
          </el-button>
          <el-button size="small" class="bt-class" @click="handleReset(false)">
            重置
          </el-button>
          <slot name="otherBtn" />
        </div>
      </div>
      <div
        v-if="columns.length > colCount"
        :class="['semicircle', icon === 'close' ? 'down' : '']"
        @click="icon === 'open' ? (icon = 'close') : (icon = 'open')"
      >
        <el-icon class="btn_icon">
          <CaretTop />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import _ from 'lodash'
import { ref, getCurrentInstance, watch, onMounted, onActivated, nextTick, onBeforeUnmount } from 'vue'
const { proxy } = getCurrentInstance() as any
import { CaretBottom, CaretTop } from '@element-plus/icons-vue'
//props
interface Props {
  data?: any[],
  columns: any[],
  listTypeInfo?: any,
  isNeedResetExtraParam?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  columns: () => [],
  listTypeInfo: () => { },
  isNeedResetExtraParam: false
})

//data
let icon = ref('open')
let colCount: any = ref(null)
let filterData: any = ref([])

let filterRef: any = ref(null)

watch(() => props.data, (val: any) => {
  filterData.value = _.cloneDeep(val)
}, { deep: true, immediate: true })


onActivated(() => {
  listenerResize()
})
onMounted(() => {
  listenerResize()
})
onBeforeUnmount(() => {
  window.removeEventListener("resize", setColCount);
})

//监听屏幕变化
const listenerResize = () => {
  nextTick(() => {
    setColCount();
    window.addEventListener("resize", setColCount);
  })
}

//默认placeholder
const defaultPlaceholder = (val: any) => {
  let placeholder = ''
  if (!val.colType || val.colType == 'input' || val.colType == 'inputNumber' || val.colType == 'date') {
    placeholder = `请输入${val.label}`
  } else if (val.colType == 'select' || val.colType == 'cascader') {
    placeholder = `请选择${val.label}`
  }
  return placeholder
}

const handleEvent = (event?: any, val?: any, change?: any) => {
  let obj = {
    value: change === "change" ? event : event.target.value,
    label: val,
  };
  proxy.$emit("handleEvent", obj);
}

const emits = defineEmits(["update:data"]);
const handleSearch = () => {
  for (let key in filterData.value) {
    if (filterData.value[key] === "") {
      filterData.value[key] = null;
    }
  }
  emits("update:data", filterData.value);
  proxy.$emit("handleSearch", filterData.value);
}
const handleReset = (specifyParameters = false) => {
  if (specifyParameters) {
    (Array.isArray(specifyParameters)
      ? specifyParameters
      : Object.keys(specifyParameters)
    ).map((key) => (filterData.value[key] = null));
    return;
  }
  // 防止重置额外参数
  if (props.isNeedResetExtraParam) {
    props.columns.forEach(
      (o) => (filterData.value[o.value] = null)
    );
  } else {
    console.log(filterData.value)
    for (let key in filterData.value) {
      console.log(key)
      filterData.value[key] = null;
    }
  }
  emits("update:data", filterData.value);
  proxy.$emit("handleReset", filterData.value);
}

// select选择处理label  value  name id
const setOptionLabelvalue = (cItem: any, item: any, type = "label") => {
  // 此方法为了保证向后兼容
  let label = "";
  let value = "";
  // 存在 listProps 时
  let listProps = item?.listProps;
  if (listProps) {
    label = cItem[listProps?.label];
    value = cItem[listProps?.value];
  } else {
    label = cItem["name"] || cItem["label"];
    value = cItem?.id ?? cItem?.value;
    //提示 如果 不配置listProps 而且 cItem里 name label id value 都存在的话  建议对原始数据进行处理
  }
  if (type === "label") {
    return label;
  } else {
    return value;
  }
}
const setColCount = () => {
  if (props.columns.length < 1) {
    return false;
  }
  let styleAttr: any = window?.getComputedStyle(filterRef.value, null);
  let width = Number.parseInt(styleAttr["width"]);
  let pl = Number.parseInt(styleAttr["padding-left"]);
  let pr = Number.parseInt(styleAttr["padding-right"]);
  let refLabel = filterRef.value.getElementsByClassName("label-style")[0];
  let refFormItem = refLabel?.nextElementSibling;
  let styleLabel: any = window?.getComputedStyle(refLabel, null);

  let styleFormItem = window?.getComputedStyle(refFormItem, null);
  let widthItem =
    Number.parseInt(styleLabel["width"]) +
    Number.parseInt(styleLabel["margin-right"]) +
    Number.parseInt(styleFormItem["width"]);

  colCount.value = Math.floor(
    (width - pl - pr) / (widthItem || 332)
  );
}

defineExpose({ handleReset })

</script>

<style lang="scss" scoped>
.el-input,
.el-select,
.el-date-editor,
.el-cascader,
.el-input-number,
.el-date-editor.el-input,
.el-autocomplete {
  width: 220px;
}
.filter_box {
  background: #fff;
  padding: 10px 10px 5px 10px;
  border-bottom: 1px solid #f1e8e8;
  display: flex;
  flex-wrap: wrap;
  position: relative;
  z-index: 5;
  .item-style {
    margin: 6px auto;
    // height: 24px;
    line-height: 1;
    display: flex;
    align-items: center;

    .label-style {
      display: inline-block;
      justify-self: end;
      width: 100px;
      font-size: 13px;
      white-space: nowrap;
      overflow: hidden;
      -o-text-overflow: ellipsis;
      text-overflow: ellipsis;
      text-align: right;
      margin-right: 12px;
      color: #222222;
    }
  }
  .semicircle {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 30px;
    height: 15px;
    text-align: center;
    color: #999999;
    background-color: #ffffff;
    box-shadow: 0px -3px 8px 0px rgba(29, 58, 102, 0.08);
    border: 1px solid #e8e8e8;
    border-radius: 100px 100px 0 0;
    z-index: 1;
    &:hover {
      cursor: pointer;
      color: #409eff;
    }
    .btn_icon {
      display: inline-block;
      width: 100%;
      height: 100%;
    }
  }
  .down {
    bottom: -15px;
    border-radius: 0 0 100px 100px;
    & > i {
      transform: rotate(180deg);
    }
  }
  .btn-style {
    margin: 8px 0 8px auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
  .form-block {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
  }
}
</style>