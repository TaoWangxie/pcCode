<template>
  <div class="navTab">
    <div class="content">
      <div
        id="navTab_item"
        :class="['navTab_item', tabIndex === index ? 'active' : '']"
        v-for="(item, index) in list"
        :key="item.id + index"
        @click="tabClick(item, index)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { reactive, ref, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance() as any




interface Props {
  tabIndex: number,
  list: Record<string, any>[]
}
const props = withDefaults(defineProps<Props>(), {
  tabIndex: 0,
  list: () => []
})

const tabClick = (val: any, index: number) => {
  proxy.$emit('tabClick', {
    data: val,
    index: index
  })
};
</script>

<style lang="scss" scoped>
.navTab {
  width: 100%;
  height: 100%;
}
.content {
  height: 100%;
  display: flex;
  background-color: #fff;
}
.navTab_item {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 20px;
  font-size: 14px;
  transition: all 0.2s;
  &:hover {
    cursor: pointer;
  }
}
.active {
  color: #409eff;
  background-color: #f5f7fa;
  border-radius: 10px 10px 0 0;
}
</style>
