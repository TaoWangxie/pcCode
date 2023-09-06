<template>
  <div class="pageTab">
    <div class="content">
      <div
        :class="['tab_item', useSchema.pageIndex == index ? 'active' : '']"
        v-for="(item, index) in useSchema.pageList"
        :key="index"
        @click="btnClick(index)"
      >
        <div class="tab_name">
          {{ item.config.type == "index" ? "主页" : item.config.data.temName }}
        </div>
        <div
          v-if="item.type !== 'index'"
          class="tab_close"
          @click.stop="close(index, item.key)"
        >
          <el-icon :size="12">
            <CloseBold />
          </el-icon>
        </div>
        <span
          v-if="
            useSchema.pageIndex != index && index != useSchema.pageIndex - 1
          "
        ></span>
      </div>
      <div class="addTab" @click="add">
        <el-icon :size="16">
          <Plus />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { reactive, ref, getCurrentInstance } from "vue";
import { Plus, CloseBold } from '@element-plus/icons-vue'
import { DIALOG_CONFIG } from '../../static/commonConfig'
import { generateI } from '../../utils/generateI'
import { generateID } from "@/utils/generateID";
import { useSchemaStore } from '@/store/schema'
const useSchema = useSchemaStore()
const { proxy } = getCurrentInstance() as any

let getID: any
if (useSchema.pageList > 1) {
  let ids = useSchema.pageList.map((item: any) => item.index)
  let max = Math.max(...ids)
  getID = generateI(Number(max) + 1)
} else {
  getID = generateI()
}

const add = async () => {
  useSchema.pageList.length == 1 && getID('init')
  let index = getID()
  let key = 'tem_' + generateID()
  let page = {
    name: `弹窗${index}`,
    key: key,
    index: index,
    data: [],
    config: DIALOG_CONFIG({ fileName: `Dialog${index}`, name: `弹窗${index}` })
  }
  await useSchema.addList('pageList', page)
  await btnClick(useSchema.pageList.length - 1)
  let func = {
    key: key,
    name: useSchema.pageList[useSchema.pageIndex].config.data.temName,
    config: {}
  }
  useSchema.addList('funcList', func)
  console.log(useSchema.funcList);
}
const close = async (index: number, key: any) => {
  if (useSchema.pageIndex === index) {
    await btnClick(0)
  } else if (useSchema.pageIndex > index) {
    await useSchema.setData('pageIndex', useSchema.pageIndex - 1)
  }
  await useSchema.deleteList('pageList', index)
  let ind: any = useSchema.funcList.findIndex((item: any) => {
    return item.key === key
  })
  useSchema.deleteList('funcList', ind)
  console.log(useSchema.funcList);
}
const btnClick = async (index: number) => {
  if (useSchema.pageIndex === index) return
  await useSchema.setData('pageIndex', index)
  await useSchema.setData('sourceData', useSchema.pageList[index].data)
  useSchema.setData('curGrid', null)
  console.log(useSchema.pageList);
};
</script>

<style lang="scss" scoped>
.pageTab {
  width: 100%;
  height: 34px;
  box-sizing: border-box;
  background-color: #ebedf0;
  border-bottom: 1px solid #ebeef5;
}
.content {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 5px;
}
.tab_item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  flex: 1;
  max-width: 150px;
  font-size: 12px;
  padding: 0 6px;
  border-radius: 10px 10px 0 0;
  user-select: none;
  transition: all 0.2s;
  &:hover {
    cursor: default;
    background-color: #f5f7fa;
  }
  .tab_name {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .tab_close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    border-radius: 50%;
    transition: all 0.2s;
    &:hover {
      background-color: #d4d7de;
    }
  }
  span {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    display: inline-block;
    width: 1px;
    height: 20px;
    background-color: #a8abb2;
  }
}
.addTab {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  width: 28px;
  border-radius: 50%;
  margin-left: 5px;
  transition: all 0.3s;
  &:hover {
    background-color: #d4d7de;
  }
}
.active {
  background-color: #fff !important;
}
</style>
