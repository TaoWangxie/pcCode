<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    append-to-body
    destroy-on-close
    draggable
    :close-on-click-modal="false"
    :width="width"
    @close="handleClose"
    top="12vh"
  >
    <div class="dialog_container">
      <slot />
    </div>
    <template #footer>
      <div class="submit_box">
        <el-button type="" @click="handleClose">关闭</el-button>
        <el-button type="primary" :loading="btnLoading" @click="handleConfirm"
          >确认</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { ref, getCurrentInstance, watch, defineExpose } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus';

//props
interface Props {
  visible: any;
  title: string,
  width: number
}
const props = withDefaults(defineProps<Props>(), {
  visible: false,
  title: '弹窗',
  width: 500
})


//确认
const btnLoading = ref(false)
const handleConfirm = async () => {
  // btnLoading.value = true
  handleClose()
  emits("handleConfirm");
}


//关闭弹窗================
let dialogVisible = ref(props.visible)
const emits = defineEmits(["update:visible", "refreshList", 'updateVisible', 'handleConfirm']);
watch(() => props.visible, (val: boolean) => {
  emits("updateVisible", val);
  if (val) { }
})
const handleClose = () => {
  emits("update:visible", false);
};


//暴露方法给父组件
defineExpose({ dialogVisible });
</script>
<style lang="scss" scoped>
.dialog_container {
}
</style>