

<template>
  <div :class="['drag_layout', `border_${dragPos}`, flex_horizontal]">
    <div
      v-if="['right', 'bottom'].includes(dragPos)"
      :class="['drag_button', direction]"
      @mousedown="handleMouseDown"
      @click="handleMouseClick"
    >
      <div :class="['drag_button_icon', isShrink && 'button-shrink']">
        <el-icon>
          <CaretRight v-if="dragPos == 'right'" />
          <CaretBottom v-else />
        </el-icon>
      </div>
    </div>
    <div
      class="drag_box"
      :class="[drag_direction_shrink, isMouseDown && 'drag_box_no_select']"
      :style="{
        width: drag_width,
        height: drag_height,
      }"
    >
      <div class="drag_shell">
        <slot></slot>
      </div>
    </div>
    <div
      v-if="['top', 'left'].includes(dragPos)"
      :class="['drag_button', direction]"
      @mousedown="handleMouseDown"
      @click="handleMouseClick"
    >
      <div :class="['drag_button_icon', isShrink && 'button-shrink']">
        <el-icon>
          <CaretLeft v-if="dragPos == 'left'" />
          <CaretTop v-else />
        </el-icon>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import _ from 'lodash'
import { CaretLeft, CaretRight, CaretTop, CaretBottom } from '@element-plus/icons-vue'
//props
interface Props {
  initShrink: any,
  initLength: any,
  dragPos: any,
}
const props = withDefaults(defineProps<Props>(), {
  initShrink: false,
  initLength: 300,
  dragPos: 'left'
})

const direction = computed(() => {
  return ['right', 'left'].includes(props.dragPos) ? 'horizontal' : 'vertical'
})
const flex_horizontal = computed(() => {
  return ['right', 'left'].includes(props.dragPos) ? 'flex_horizontal' : ''
})
const drag_direction_shrink = computed(() => {
  return isShrink.value ? ['bottom', 'top'].includes(props.dragPos) ? 'drag_horizontal_shrink' : 'drag_vertical_shrink' : ''
})
const drag_width = computed(() => {
  return ['right', 'left'].includes(props.dragPos) ? `${dragLength.value}px` : 'auto'
})
const drag_height = computed(() => {
  return ['bottom', 'top'].includes(props.dragPos) ? `${dragLength.value}px` : 'auto'
})

const isShrink = ref(props.initShrink); // 是否最小化
const isMouseDown = ref(false) // 鼠标是否按压
const isMouseMove = ref(false) // 鼠标是否按压
const startMosePostion = ref([0, 0]) // 鼠标开始时的位置
const startdragBoxLength = ref(300) // 按下鼠标时，容器本来的宽度
const dragLength = ref(props.initLength) // 容器的初始宽度
const minWidth = 100

// 监听是否在移动，绑定或删除事件
watch(() => isMouseDown.value, (val) => {
  if (val) {
    document.body.style.userSelect = "none" // 移动的时候别选取文本
    window.addEventListener('mousemove', handleMouseMove, false)
    window.addEventListener('mouseup', handleMouseUp, false)
  } else {
    document.body.style.userSelect = "auto"
    window.removeEventListener('mousemove', handleMouseMove, false)
    window.removeEventListener('mouseup', handleMouseUp, false)
  }
})

const handleMouseClick = () => {
  if (!isMouseMove.value) {
    isShrink.value = !isShrink.value;

    // 如果点击展开时发现链接太短，就最少展开100
    if (!isShrink.value && dragLength.value < minWidth) {
      dragLength.value = props.initLength
      // startdragBoxLength.value = minWidth // 拖动关闭的情况，不再记录之前的宽度，下次展开
      // dragLength.value = minWidth // 拖动关闭的情况，不再记录之前的宽度，下次展开
    }

  }
};

const handleMouseDown = (event: MouseEvent) => {
  const { pageX, pageY } = event
  isMouseDown.value = true // 开始按下
  startMosePostion.value = [pageX, pageY] // 记录初始xy
  startdragBoxLength.value = dragLength.value // 记录初始容器宽度
}

const handleMouseUp = (event: MouseEvent) => {
  isMouseDown.value = false
  startMosePostion.value = [0, 0]

  // 如果移动距离太短，视为点击
  if (Math.abs(startdragBoxLength.value - dragLength.value) >= 5) isMouseMove.value = true

  // 如果抬起鼠标宽度太短了，就直接收起
  if (isMouseMove.value && dragLength.value < minWidth) {
    isShrink.value = true
  }

  // 延迟触发。因为up触发在click之前，但是这个状态是给click用的。保证click使用完成后再重置
  setTimeout(() => isMouseMove.value = false)
}

const handleMouseMove = (event: MouseEvent) => {
  if (!isMouseDown.value) return // 不在移动时不监听
  const [startX, startY] = startMosePostion.value
  const { pageX, pageY } = event
  let moveDistance = 0
  if (['right', 'left'].includes(props.dragPos)) {
    moveDistance = props.dragPos == 'left' ? startX - pageX : pageX - startX
  } else {
    moveDistance = props.dragPos == 'top' ? startY - pageY : pageY - startY
  }

  if (isShrink.value) {
    isShrink.value = false
    startdragBoxLength.value = 0 // 拖动关闭的情况，不再记录之前的宽度，下次展开
    dragLength.value = 0 // 拖动关闭的情况，不再记录之前的宽度，下次展开
  }

  handleChangeContainerWidth(moveDistance)
}

// 截流，控制宽度
const handleChangeContainerWidth = _.throttle((moveDistance: number) => {
  dragLength.value = Math.max(startdragBoxLength.value - moveDistance, 0)
}, 100)

</script>

<style lang='scss' scoped>
.drag_layout {
  overflow: hidden;
  width: initial;
  height: initial;
}
.flex_horizontal {
  display: flex;
  flex-direction: row;
  height: 100%;
}
.drag_box {
  overflow: hidden;
  box-sizing: border-box;
  transition: all 0.1s;
  overflow: hidden;
}
.drag_box_no_select {
  user-select: none;
}
.drag_shell {
  width: 100%;
  height: 100%;
}
.drag_horizontal_shrink {
  height: 0px !important;
  padding: 0 !important;
}
.drag_vertical_shrink {
  width: 0px !important;
  padding: 0 !important;
}
.drag_button {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s;
  &:hover {
    cursor: pointer;
    background-color: #f5f7fa;
  }
}
.horizontal {
  width: 20px;
  height: 100%;
}
.vertical {
  height: 20px;
  width: 100%;
}

.border_left {
  border-right: 1px solid #ebeef5;
}
.border_right {
  border-left: 1px solid #ebeef5;
}
.border_top {
  border-bottom: 1px solid #ebeef5;
}
.border_bottom {
  border-top: 1px solid #ebeef5;
}

.drag_button_icon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  transform: rotate(0deg);
  transition: all 0.3s;
}
.button-shrink {
  transform: rotate(180deg);
}
// 滚动条的宽度
.drag_box::-webkit-scrollbar {
  display: block;
  width: 6px; // 横向滚动条
  height: 6px; // 纵向滚动条 必写
}
// 滚动条的滑块
.drag_box::-webkit-scrollbar-thumb {
  background-color: #ddd;
  border-radius: 3px;
}
</style>