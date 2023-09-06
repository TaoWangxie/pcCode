<template>
  <div class="comAttr" v-if="configInfo">
    <div
      class="attr_line flex"
      v-for="(item, index) in configInfo?.fieldList"
      :key="index"
    >
      <div :class="['attr_item', item.type == 'list' ? '' : 'flex']">
        <div
          class="attr_label"
          :style="{ marginBottom: item.type == 'list' ? '10px' : 0 }"
        >
          {{ item.label }}
        </div>
        <div v-if="item.type === 'array'" class="atrr_inline_box">
          <div
            v-for="(it, i) in item.children"
            :key="i"
            class="atrr_inline_item"
            :style="{ width: it.width, flex: it.width ? 'none' : '' }"
          >
            <AttrItem
              :configInfo="configInfo"
              :data="configInfo.data"
              :field="it"
              @handleEvent="handleEventFn"
            ></AttrItem>
          </div>
        </div>
        <div v-else-if="item.type === 'object'" class="atrr_child_box">
          <div
            v-for="(it, i) in item.children"
            :key="i"
            class="atrr_downLine_item"
          >
            <div class="attr_label">{{ it.label }}</div>
            <div class="atrr_value">
              <AttrItem
                :configInfo="configInfo"
                :data="configInfo.data[item.prop]"
                :field="it"
                @handleEvent="handleEventFn"
              ></AttrItem>
            </div>
          </div>
        </div>
        <div
          v-else
          class="atrr_value"
          :style="{ width: item.type == 'list' ? '100%' : 0 }"
        >
          <AttrItem
            :configInfo="configInfo"
            :data="configInfo.data"
            :field="item"
            @handleEvent="handleEventFn"
          ></AttrItem>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import _ from 'lodash'
import { ref, getCurrentInstance, watch } from "vue";
import AttrItem from '../attrItem/index.vue'

const { proxy } = getCurrentInstance() as any

interface Props {
  configInfo: any,
}
const props = withDefaults(defineProps<Props>(), {
  configInfo: () => { }
})

const handleEventFn = (obj) => {
  proxy.$emit("handleEvent", obj);
}

</script>
<style lang="scss" scoped>
.comAttr {
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
  background-color: #fafcff;
  .attr_line_title {
    padding-bottom: 10px;
    font-size: 13px;
  }
  .attr_line {
    margin-bottom: 15px;
    box-sizing: border-box;
    &:last-child {
      margin-bottom: 0;
    }
    .attr_item {
      align-items: center;
      box-sizing: border-box;
      flex: 1;
      font-size: 13px;
      overflow: hidden;
      .attr_label {
        display: inline-block;
        width: 80px;
      }
      .atrr_value {
        flex: 1;
        width: 0;
      }
    }
  }
  .atrr_inline_box {
    display: flex;
    flex: 1;
  }
  .atrr_inline_item {
    flex: 1;
    margin-right: 5px;
    &:last-child {
      margin-right: 0;
    }
  }
  .atrr_child_box {
    width: 100%;
    border: 1px solid #ebeef5;
    box-sizing: border-box;
    background-color: #fff;
    padding: 10px;
  }
  .atrr_downLine_item {
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
.flex {
  display: flex;
}
</style>