<template>
  <el-dialog
    :model-value="visible"
    :title="'配置动作'"
    append-to-body
    destroy-on-close
    draggable
    :close-on-click-modal="false"
    width="700px"
    @close="handleClose"
    top="12vh"
  >
    <div class="CreateFunc">
      <div class="btn_box">
        <el-button type="primary" size="small" @click="addTable()"
          >添加</el-button
        >
      </div>
      <div class="table_box">
        <Etable
          ref="etable"
          :data="tableData.data"
          :columns="tableData.columns"
          :hideConfig="tableData.hideConfig"
          :pagination="tableData.page"
          :choose-type="tableData.chooseType"
          :rowKey="tableData.rowKey"
          :columnTooltip="false"
        >
          <template #operate="{ scope }">
            <div class="operate_box">
              <el-button
                type="danger"
                link
                size="small"
                @click="handlerDelete(scope.$index)"
                >删除</el-button
              >
            </div>
          </template>
        </Etable>
      </div>
    </div>
    <template #footer>
      <div class="submit_box">
        <el-button type="primary" @click="handlerSubmit">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { ref, getCurrentInstance, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import { useSchemaStore } from '@/store/schema'
const useSchema = useSchemaStore()

//props
interface Props {
  visible: any;
}
const props = withDefaults(defineProps<Props>(), {
  visible: false,
})


//关闭弹窗================
const emits = defineEmits(["update:visible", "refreshList"]);
watch(() => props.visible, (val: boolean) => {
  if (val) {
    tableData.value.data = _.cloneDeep(useSchema.curGrid.config.funcList)
  }
})
const handleClose = () => {
  emits("update:visible", false);
};

let tableData: any = ref({
  data: [],
  columns: [
    {
      label: "事件码",
      prop: "code",
      colType: "input",
      col: {
        clearable: true
      },
    },
    {
      label: "备注",
      prop: "remark",
      colType: "input",
      col: {
        clearable: true
      },
    },
    {
      label: "关联",
      prop: "connected",
      colType: "input",
      col: {
        clearable: true
      },
    },
    {
      label: "操作",
      prop: "operate",
      colType: "slot",
      width: 100,
      fixed: 'right'
    },
  ],
  listTypeInfo: {
    typeList: []
  },
  hideConfig: ['checkbox', 'serial']
})
const addTable = () => {
  tableData.value.data.push({
    code: '',
    remark: '',
    connected: ''
  })
}
//删除
const handlerDelete = (index: any) => {
  tableData.value.data.splice(index, 1)
}
//提交
const btnLoading = ref(false)
const handlerSubmit = async () => {
  useSchema.setData('curGrid', tableData.value.data, 'config.funcList')
  console.log(useSchema.sourceData);
  handleClose()
}


</script>
<style lang="scss" scoped>
.CreateFunc {
  padding: 0 20px;
  .btn_box {
    display: flex;
    justify-content: flex-end;
    padding-bottom: 6px;
    .el-button + .el-button {
      margin-left: 0;
    }
  }
  .table_box {
    height: 280px;
  }
}
</style>