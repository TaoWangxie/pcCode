<template>
  <div class="Right">
    <Tab :list="tabList" :tabKey="configTab" @changeTab="changeTab"></Tab>
    <div class="right_content">
      <div v-if="useSchema.pageList.length" class="right_content_part">
        <div class="title">页面配置</div>
        <ComAttr
          :configInfo="useSchema.pageList[useSchema.pageIndex].config"
          @handleEvent="handleEventFn"
        ></ComAttr>
      </div>
      <div v-if="useSchema.curGrid" class="right_content_part">
        <div class="title">组件配置</div>
        <ComAttr
          :configInfo="useSchema.curGrid.config"
          @handleEvent="handleEventFn"
        ></ComAttr>
      </div>
    </div>
  </div>
</template>
<script setup lang='ts'>
import _ from 'lodash'
import { ref, onMounted, nextTick, watch } from 'vue'
import { Coin, Setting } from '@element-plus/icons-vue'
import ComAttr from './components/comAttr/index.vue'
import Tab from '../Tab/index.vue'
import { DIALOG_CONFIG, PAGE_CONFIG } from '../../static/commonConfig'
import { useSchemaStore } from '@/store/schema'
const useSchema = useSchemaStore()


let configTab = ref('comConfig')
const tabList = [
  {
    key: 'comConfig',
    icon: Setting
  },
  {
    key: 'pageConfig',
    icon: Coin
  }
]
const changeTab = (val: any) => {
  configTab.value = val
}

const handleEventFn = (val: any) => {
  let { label, value } = val
  if (label === 'temType') {
    let config: any = _.cloneDeep(DIALOG_CONFIG({ fileName: `Dialog${useSchema.pageList.length}`, name: `弹窗${useSchema.pageList.length}` }))
    value !== 'dialog' && (config = _.cloneDeep(PAGE_CONFIG({ fileName: `Page${useSchema.pageList.length}`, name: `页面${useSchema.pageList.length}` })))
    useSchema.setData('pageList', config, `${useSchema.pageIndex}.config`)
  }
  console.log(useSchema.pageList);
}

</script>

<style lang="scss" scoped>
.Right {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #fff;
}
.right_content {
  overflow-y: auto;
  height: calc(100% - 40px);
  border-bottom: 1px solid #ebeef5;
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #d4d7de;
    border-radius: 3px;
  }
  .right_content_part {
    border-bottom: 1px solid #ebeef5;
  }
}
.title {
  position: relative;
  padding: 10px;
  font-size: 14px;
  border-top: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
  &:first-child {
    border-top: 0;
  }
  .icon_box {
    display: flex;
    align-items: center;
    height: 20px;
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    color: #606266;
  }
}
.noData {
  padding: 40px;
  text-align: center;
  font-size: 14px;
  color: #909399;
}
.ace_box {
  width: 100%;
  height: 500px;
  padding: 15px;
  box-sizing: border-box;
  background-color: #fafcff;
}
</style>