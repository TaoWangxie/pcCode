<template>
  <div class="btn_box" :style="{ textAlign: algin }">
    <el-button
      v-for="(btn, index) in list"
      :key="index"
      size="small"
      v-bind="btn"
      @click="handleClick(btn)"
    >
      {{ btn.name }}
    </el-button>
  </div>
</template>
<script setup lang='ts'>
import _ from 'lodash'
import { ref, getCurrentInstance, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'

//props
interface Props {
  list: any;
  algin: any,
}
const props = withDefaults(defineProps<Props>(), {
  list: [],
  algin: 'left',
})

const emits = defineEmits(["handleClick"]);
const handleClick = (btn: any) => {
  emits("handleClick", btn);
}

</script>

<style lang="scss" scoped>
.btn_box {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}
</style>