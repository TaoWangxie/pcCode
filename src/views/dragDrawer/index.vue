<template>
  <div class="dragDrawer">
    <div class="grid_item">
      <dargBox :initLength="300" dragPos="left">
        <div class="box"></div>
      </dargBox>
    </div>
    <div class="grid_item" style="flex: 1">
      <dargBox :initLength="300" dragPos="top">
        <div class="box"></div>
      </dargBox>
    </div>
    <div class="grid_item">
      <dargBox :initLength="300" dragPos="right">
        <div class="box"></div>
      </dargBox>
    </div>
  </div>
</template>
<script setup lang='ts'>
import _ from 'lodash'
import { ref, getCurrentInstance, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { numAdd, numSub, numMulti } from '@/utils/index'
import dargBox from './dargBox/index.vue'





</script>

<style lang="scss" scoped>
.dragDrawer {
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #fff;
  .grid_item {
    height: 100%;
  }
  .box {
    width: 100%;
    height: 100%;
    background-color: #d4d7de;
  }
}
</style>