<template>
  <div class="gridTagList">
    <el-collapse v-if="list.length > 0" v-model="activeName">
      <el-collapse-item
        v-for="(item, index) in list"
        :key="index"
        :name="index"
      >
        <template #title>
          <div style="padding: 0 15px; box-sizing: border-box">
            {{ item.name }}
          </div>
        </template>
        <div class="gridTag-box">
          <div
            v-for="(tag, tagIn) in item.comList"
            :key="tagIn"
            class="gridTag-item"
            draggable="true"
            unselectable="on"
            @drag="layoutDrag"
            @dragend="layoutDragend(tag)"
            @click="addGrid(tag)"
          >
            <div class="img_box">
              <img src="@/assets/logo.png" alt="" />
            </div>
            <div class="content_box">
              <div class="title">
                {{ tag.name }}
              </div>
              <div class="info">
                {{ tag.info }}
              </div>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <div v-else class="noData">暂无数据</div>
  </div>
</template>

<script setup lang='ts'>
import { reactive, ref, getCurrentInstance, onMounted } from "vue";
const { proxy } = getCurrentInstance() as any

let activeName = ref(0)


interface Props {
  list: Record<string, any>[]
}
const props = withDefaults(defineProps<Props>(), {
  list: () => []
})


const layoutDrag = (data: any) => {
  proxy.mittBus.emit('layoutDrag')
};
const layoutDragend = (item: any) => {
  proxy.mittBus.emit('layoutDragend', item)
};
const addGrid = (item: any) => {
  proxy.mittBus.emit('addGrid', item)
};
</script>

<style lang='scss'>
.gridTagList {
  height: 100%;
  .el-collapse-item {
    box-sizing: border-box;
  }
  .el-collapse {
    border: none;
  }
  .el-scrollbar__view {
    overflow: hidden !important;
  }
  .el-collapse-item__wrap {
    background-color: #f6f7ff;
  }
  .el-collapse-item__header {
    height: 40px;
    line-height: 40px;
  }
}
</style>
<style lang="scss" scoped>
.noData {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 14px;
}
.gridTag-box {
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  flex-wrap: wrap;
  height: auto;
  padding: 10px;
}
.gridTag-item {
  display: flex;
  position: relative;
  width: 100%;
  line-height: 20px;
  margin-bottom: 10px;
  padding: 8px;
  font-size: 12px;
  text-align: center;
  box-sizing: border-box;
  border-radius: 1px;
  border: 1px solid #fff;
  background-color: #fff;
  &:hover {
    cursor: pointer;
    border: 1px dashed #787be8;
    color: #787be8;
  }
  .img_box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    border-radius: 3px;
    background-color: #f5f7fa;
    img {
      display: inline-block;
      width: 60%;
      height: 60%;
    }
  }
  .content_box {
    flex: 1;
    padding: 0 8px;
    text-align: left;
    .title {
      width: 100%;
      color: #000;
      height: 22px;
      font-size: 14px;
      font-weight: bold;
    }
    .info {
      width: 100%;
      word-break: break-word;
      height: 32px;
      font-size: 12px;
      line-height: 16px;
      color: #909399;
    }
  }
}
.img-box {
  position: relative;
  width: 100%;
  height: 70px;
  margin: 0 auto;
}
</style>
