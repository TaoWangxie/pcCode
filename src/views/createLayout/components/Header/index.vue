<template>
  <div class="header">
    <div class="content">
      <div
        id="header_item"
        class="header_item"
        v-for="item in btnList"
        :key="item.id"
        @click="btnClick(item)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { reactive, ref, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance() as any
const btnList: any[] = reactive([
  {
    id: '0',
    name: '预览代码'
  },
  {
    id: '1',
    name: '清空'
  },
  {
    id: '2',
    name: '预览'
  },
])
const btnClick = (data: any) => {
  switch (data.id) {
    case '0':
      proxy.mittBus.emit('createLayout')
      break;
    case '1':
      proxy.mittBus.emit("clearLayout")
      break;
    case '2':
      proxy.mittBus.emit("preview")
      break;
    default:
      break
  }
};
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: 40px;
  padding: 0 5px;
  box-sizing: border-box;
  border-bottom: 1px solid #ebeef5;
}
.content {
  height: 100%;
  display: flex;
  padding: 0 20px;
  background-color: #fff;
}
.header_item {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 15px;
  font-size: 14px;
  &:hover {
    cursor: pointer;
    color: #409eff;
  }
}
</style>
