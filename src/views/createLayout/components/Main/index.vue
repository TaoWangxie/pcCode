<template>
  <div class="main">
    <div id="content">
      <grid-layout
        ref="gridlayoutRef"
        id="gridlayout"
        class="gridlayout"
        :layout="useSchema.sourceData"
        :col-num="useSchema.colNum"
        :row-height="10"
        :is-draggable="true"
        :is-resizable="true"
        :margin="[5, 5]"
      >
        <grid-item
          id="gridItem"
          :class="['gridItem', `gridItem_${item.i}`]"
          v-for="item in useSchema.sourceData"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :key="item.i"
        >
          <div
            :class="[
              'grid_item_box',
              item.comKey == 'Placeholder' ? 'grid_placeholder' : '',
              useSchema.curGrid && useSchema.curGrid.i === item.i
                ? 'active'
                : '',
            ]"
            @click="gridClick(item)"
          >
            <div v-if="item.comKey !== 'Placeholder'" class="grid_item_header">
              {{ item.comName }}
              <span class="grid_info">--{{ item.i }}</span>
            </div>
            <component
              v-if="item.comKey"
              class="component"
              :is="item.comKey"
              :ctx="item"
              :config="item.config"
            >
            </component>
            <span class="grid_item_close" @click.stop="removeGrid(item)">
              <el-icon :size="15">
                <Close />
              </el-icon>
            </span>
          </div>
        </grid-item>
      </grid-layout>
    </div>
  </div>
  <!-- 代码预览 -->
  <PreviewCode
    v-model:visible="previewCodeVisible"
    title="代码预览"
    :code="pageCode"
  >
  </PreviewCode>
</template>
<script setup lang='ts'>
import _ from 'lodash'
import { ref, getCurrentInstance, onMounted, onBeforeMount, nextTick, watch } from 'vue';
import { Close } from '@element-plus/icons-vue'
import { getCode } from "../../utils/generator";
import { generateID } from "@/utils/generateID";
import { INDEX_CONFIG } from '../../static/commonConfig'
import PreviewCode from '../../components/exportCode/index.vue'
import { useSchemaStore } from '@/store/schema'
const useSchema = useSchemaStore()
const { proxy } = getCurrentInstance() as any;


// 页面加载前
onBeforeMount(() => {
  proxy.mittBus.on('addGrid', (data: any) => { addGrid(data) })
  proxy.mittBus.on('createLayout', (data: any) => { createLayout() })
})
onMounted(async () => {
  if (!useSchema.pageList.length) {
    let page = {
      name: '主页',
      key: 'tem_index',
      data: [],
      config: INDEX_CONFIG
    }
    await useSchema.addList('pageList', page)
    await useSchema.setData('sourceData', useSchema.pageList[0].data)
  }
})

let previewCodeVisible: any = ref(false)
let pageCode: any = ref({})
//生成布局代码
const createLayout = () => {
  let { state, data } = getCode(useSchema.pageList[useSchema.pageIndex])
  if (state === 'ok') {
    pageCode.value = data
    previewCodeVisible.value = true
    console.log(useSchema.pageList);
    console.log(useSchema.sourceData);
  } else {
    proxy.$message({
      message: '布局有缺失空间，请补齐',
      type: 'warning'
    });
  }
}

//添加组件
const addGrid = (data: any) => {
  let isShow = data.key === 'Placeholder' ? false : true
  let key = 'com_' + generateID()
  let grid: any = {
    x: 0,
    y: useSchema.sourceData.length + (12 || 12), // puts it at the bottom
    w: data.w || 4,
    h: data.h || 12,
    i: key,
    comKey: data.key,
    comName: data.name,
    fixedH: true,
    isShow: isShow,
    static: false,
    config: _.cloneDeep(data.config),
  }
  useSchema.addList('sourceData', grid)
}
//选中组件
const gridClick = async (val: any) => {
  if (val.comKey === "Placeholder") return
  let grid = useSchema.sourceData.find((e: any) => e.i == val.i)
  useSchema.setData('curGrid', grid)
  console.log(useSchema.curGrid);
}
//移除组件
const removeGrid = (grid:any) => {
  const index = useSchema.sourceData.findIndex((e: any) => e.i == grid.i);
  useSchema.deleteList('sourceData', index)
  if (useSchema.curGrid && grid.i === useSchema.curGrid.i) {
    useSchema.setData('curGrid', null)
  }
}


</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: calc(100% - 74px);
  background-color: #ebeef5;
}
#content {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #d4d7de;
    border-radius: 3px;
  }
}
.active {
  .grid_item_header {
    background-color: #409eff;
    color: #fff;
  }
  .grid_info {
    color: #fff !important;
  }
}
.grid_item_box {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .component {
    height: calc(100% - 30px);
  }
  .grid_item_header {
    position: relative;
    height: 30px;
    font-size: 14px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    box-sizing: border-box;
    .grid_info {
      font-size: 12px;
      color: #606266;
    }
  }
  .grid_item_close {
    position: absolute;
    top: 5px;
    right: 5px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    z-index: 9;
    &:hover {
      cursor: pointer;
      color: #409eff;
      background-color: rgba(255, 255, 255, 0.6);
    }
  }
}
.grid_placeholder {
  background-color: rgba(64, 158, 255, 0.5);
}
</style>