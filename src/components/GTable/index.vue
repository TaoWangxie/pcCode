<template>
  <div ref="tableBox" class="tableBox">
    <!-- 表格 -->
    <el-table
      ref="table"
      v-loading="loading"
      :data="tableData"
      v-bind="setTableAttr"
      :rowKey="rowKey"
      :key="dictTableKey"
      style="flex: 1"
      @select="handleSelect"
      @select-all="handleSelectAll"
      @row-click="rowClick"
    >
      <!-- 多选 -->
      <template v-if="chooseType === 'selection'">
        <el-table-column
          type="selection"
          width="55"
          :align="'center'"
          :fixed="fixedChooseType"
          :selectable="selectEnable"
        />
      </template>
      <!-- 单选 -->
      <template v-else-if="chooseType === 'radio'">
        <el-table-column width="55" :fixed="fixedChooseType" :align="'center'">
          <template #default="scope">
            <el-radio
              v-model="radio"
              :label="scope.row"
              @change="handleRadio(scope.row)"
            />
          </template>
        </el-table-column>
      </template>
      <!-- 序号 -->
      <template v-else-if="!hideConfig.includes('serial')">
        <el-table-column
          type="index"
          :align="'center'"
          :fixed="fixedSerial"
          width="55"
          label="序号"
        />
      </template>
      <template v-for="(item, index) in columns">
        <!-- 插槽 -->
        <template v-if="item.colType === 'slot'">
          <el-table-column
            :key="index"
            v-bind="item"
            min-width="120px"
            show-overflow-tooltip
          >
            <template #default="scope">
              <slot :name="item.prop" :scope="scope" />
            </template>
          </el-table-column>
        </template>
        <template v-else-if="item.colType === 'operate'">
          <el-table-column :key="index" v-bind="item" fixed="right">
            <template #default="scope">
              <div class="btn_box">
                <el-button
                  v-for="(btn, ind) in scope.row.btnList"
                  :key="ind"
                  size="small"
                  type="primary"
                  text
                  :disabled="btn.gray"
                  @click="handleClick(scope.row, scope.$index, btn.code)"
                >
                  {{ item.buttonName }}
                </el-button>
              </div>
            </template>
          </el-table-column>
        </template>
        <template v-else-if="item.colType === 'clickCol'">
          <el-table-column
            :key="index"
            v-bind="item"
            min-width="120px"
            show-overflow-tooltip
          >
            <template #default="scope">
              <div
                class="canClick"
                @click="
                  handleClick(
                    scope.row,
                    scope.$index,
                    item.clickCode || item.prop
                  )
                "
              >
                {{ scope.row[item.prop] }}
              </div>
            </template>
          </el-table-column>
        </template>
        <!-- 普通列 -->
        <template v-else>
          <el-table-column
            :key="index"
            v-bind="item"
            min-width="120px"
            show-overflow-tooltip
          >
            <template #default="scope">
              {{ scope.row[item.prop] }}
            </template>
          </el-table-column>
        </template>
      </template>
      <slot>
        <slot name="append"></slot>
      </slot>
    </el-table>
    <!-- 分页与反选 -->
    <div
      v-if="
        !(hideConfig.includes('pagination') && hideConfig.includes('invert'))
      "
      ref="paginationBox"
      :class="['pagination-style']"
    >
      <!-- 反选 -->
      <span
        class="reverse-left"
        v-if="chooseType === 'selection' && !hideConfig.includes('invert')"
      >
        <el-checkbox v-model="reverseChecked" @change="invertSelect"
          >反选</el-checkbox
        >
      </span>
      <!-- 分页 -->
      <el-pagination
        v-if="!hideConfig.includes('pagination')"
        v-bind="setPaginationAttr()"
        @size-change="pageChange($event, 'pageSize')"
        @current-change="pageChange($event, 'pageNum')"
        small
      />
    </div>
  </div>
</template>

<script setup lang='ts'>
import _ from 'lodash'
import methods from "./methods";
import Sortable from 'sortablejs'
import { useAttrs, ref, getCurrentInstance, watch, nextTick, computed, onMounted } from "vue";
const { proxy } = getCurrentInstance() as any

interface Props {
  ref?: string,
  rowKey?: string,       //对于列表中唯一的字段rowKey默认为id
  data: any,        //列表的数据
  columns: any[],        //传过来的表头信息
  loading?: boolean,        // 表格加载动画开关
  chooseType?: string,        //有没有checkbox
  pagination: any,        // 分页
  hideConfig?: string[],        // 隐藏配置项，用于隐藏部分功能 可用值['pagination', 'invert', 'serial'] 默认隐藏序号列
  defaultSelectList: any,
  selectEnable?: Function,
  fixedChooseType?: any,
  fixedSerial?: any,
}
const props = withDefaults(defineProps<Props>(), {
  ref: 'table',
  rowKey: 'id',
  data: () => [],
  columns: () => [],
  loading: false,
  chooseType: '',
  pagination: () => {
    return {
      total: 4,
      pageNum: 1,
      pageSize: 2,
    }
  },
  hideConfig: () => ["serial"],
  defaultSelectList: [],
  selectEnable: function () { return true; },
  fixedChooseType: false,
  fixedSerial: false
})
let table: any = ref(null)
//表格数据
let tableData = ref([])
// 表格高度
let tableHeight: any = ref(null)
//选中的数组
let selectList: any = ref([])
//单选
let radio = ref('')
// 反选
let reverseChecked = ref(false)
let multipleSelection = ref({})
let tableBox = ref()
let paginationBox = ref()

//默认选中
const toggleSelectionFn = (rows?: any[]) => {
  nextTick(() => {
    if (rows) {
      selectList.value = []
      rows.forEach((row) => {
        rowClick(row)
      })
    } else {
      table.value!.clearSelection()
    }
  })
}
//watch
watch(() => props.data, (val) => {
  tableData.value = val;
}, { deep: true, immediate: true })
watch(() => props.defaultSelectList, (val) => {
  toggleSelectionFn(val)
}, { immediate: true });

//===================Sortable=======================
let tabletbody = ref(null)
const sotrInit = () => {
  nextTick(() => {
    tabletbody.value = table.value.$el.querySelector('tbody')
    rowDrop(tabletbody.value)
  })
}
let dictTableKey = ref(false)
const rowDrop = (dom: any, target?: any) => {
  return Sortable.create(dom, {
    sort: true,
    animation: 150,
    group: { name: 'tableGroup', pull: true, put: true },
    onEnd(obj) {
      const { from, to, newIndex, oldIndex } = obj
      if (from === to) {
        // console.log('左边自己内部拖动', newIndex, oldIndex)
        const currRow = tableData.value.splice(oldIndex, 1)[0]
        // tableData.value.data.splice(newIndex, 0, currRow)
        proxy.$emit("selfDarg", newIndex, currRow);
        dictTableKey.value = !dictTableKey.value;
        console.log(dictTableKey.value);

      } else if (from !== to) {
        console.log(to);
        // console.log('从左边拖到右边', newIndex, oldIndex)
        const currRow: any = tableData.value.splice(oldIndex, 1)[0]
        proxy.$emit("otherDarg", newIndex, currRow);
        // tableData2.value.data.splice(newIndex, 0, currRow)
      }
    }
  })
}
watch(() => dictTableKey.value,
  () => {
    nextTick(() => {
      sotrInit()
    });
  }
);
//===================Sortable=======================
//onMounted
onMounted(() => {
  sotrInit()
})
/**表格默认配置项 */
const setTableAttr = computed(() => {
  let defaultAttr = {
    stripe: false,
    border: true,
    height: tableHeight.value,
    "max-height": 3000,
  };
  let attr = { ...defaultAttr, ...useAttrs() };
  return attr;
})
//全选
const handleSelectAll = (select: any) => {
  selectList.value = _.cloneDeep(select);
  let isHas = select.length > 0;
  tableData.value.forEach((ele: any, i: number) => {
    if (!props.selectEnable(ele)) return;
    table.value.toggleRowSelection(ele, isHas);
    ele.isChecked = isHas ? true : false
  });
  emitSelect();
  multipleSelection.value[props.pagination.pageNum] = selectList.value;
}
//反选
const invertSelect = () => {
  tableData.value.forEach((ele: any, i: number) => {
    rowClick(ele);
  });
  emitSelect();
}
//选择框
const handleSelect = (selection: any, row: any) => {
  rowClick(row);
}
//单选
const handleRadio = (row: any) => {
  tableData.value.forEach((ele: any, i: number) => {
    ele.isChecked = false
  });
  radio.value = row;
  selectList.value = [row];
  row.isChecked = true
  emitSelect();
}
//行点击
const rowClick = (row: any, event?: any, column?: any) => {
  if (!props.chooseType) return
  if (props.chooseType == "radio") {
    handleRadio(row);
  } else {
    if (!row.isChecked) {
      selectList.value.push(row);
    } else {
      selectList.value.forEach((ele: any, i: number) => {
        let is =
          isHasRowKey(ele) || isHasRowKey(row)
            ? isSame(ele, row)
            : ele[props.rowKey] == row[props.rowKey];
        if (is) {
          selectList.value.splice(i, 1);
        }
      });
    }
    table.value.toggleRowSelection(
      row,
      row.isChecked ? false : true
    );
    row.isChecked = !row.isChecked
    emitSelect();
    multipleSelection.value[props.pagination.pageNum] =
      selectList.value;
  }
}
//更新选择列表
const emitSelect = () => {
  proxy.$emit("handleSelect", selectList.value ? selectList.value : []);
}
//跨页选中数据
const check = () => {
  nextTick(() => {
    if (multipleSelection.value[props.pagination.pageNum]) {
      multipleSelection.value[props.pagination.pageNum].map(
        (item: any) => {
          tableData.value.map((val: any) => {
            let is =
              isHasRowKey(item) ||
                isHasRowKey(val)
                ? isSame(item, val)
                : item[props.rowKey] == val[props.rowKey];
            if (is) {
              val.isChecked = item.isChecked
              table.value.toggleRowSelection(val);
              selectList.value.push(val);
            }
          });
        }
      );
    }
  });

}
//判断对象是否相同 只适用当前表格
const isSame = (one, two) => {
  let cur = _.cloneDeep(one)
  let tar = _.cloneDeep(two)
  delete cur.isChecked
  delete tar.isChecked
  let res = JSON.stringify(cur) == JSON.stringify(tar)
  return res
}
//分页配置
const setPaginationAttr = () => {
  let defaultAttr = {
    background: true,
    "page-sizes": [10, 50, 100, 200, 500],
    layout: "total, sizes, prev, pager, next",
    "current-page": props.pagination.pageNum,
    "page-size": props.pagination.pageSize,
    total: props.pagination.total,
  };
  let attr = Object.assign({}, defaultAttr);
  // 判断是否需要分页数量控件
  if (props.pagination.hasOwnProperty("pageSizesVisible")) {
    if (!props.pagination.pageSizesVisible) {
      attr.layout = "prev, pager, next";
    }
  }
  return attr;
}
//分页点击
const pageChange = (val: any, type: string) => {
  selectList.value = [];
  // eslint-disable-next-line vue/no-mutating-props
  props.pagination[type] = val;
  proxy.$emit("update:pagination", props.pagination);
  proxy.$emit(
    type == "pageNum" ? "handlePageChange" : "handleSizeChange",
    val
  );
  check();
}
//是否有唯一
const isHasRowKey = (val: any) => {
  return val[props.rowKey] == undefined;
}

//按钮
const handleClick = (row: any, rindex: any, code: any) => {
  proxy.$emit("handleClick", row, rindex, code);
}

methods

</script>
<style lang="scss" scoped>
.tableBox {
  flex: 1;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow: hidden;
  // todo
  padding: 10px 10px 0 10px;
  box-sizing: border-box;
  .btn_box {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .canClick {
    cursor: pointer;
    color: #409eff;
  }
}
.pagination-style {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 10px 0;
  padding-left: 14px;
  height: 36px;
  .reverse-left {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }
}
::v-deep .cell {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
::v-deep .el-checkbox {
  margin: 0 auto !important;
}
::v-deep .el-table--border .el-table__cell:first-child .cell {
  display: flex;
  align-items: center;
  justify-content: center;
}
::v-deep .el-radio {
  margin-top: 5px;
}
::v-deep .el-radio .el-radio__label {
  display: none;
}
::v-deep .el-table__header {
  table-layout: auto !important;
}
::v-deep .el-table--border::after {
  width: 0;
}
::v-deep .el-table--group,
::v-deep .el-table--border {
  border: 0;
}
::v-deep .el-table--border td:nth-child(1) {
  border-left: 1px solid #dfe6ec;
}
::v-deep .el-table {
  .el-table__header-wrapper,
  .el-table__fixed,
  .el-table__fixed-right {
    .el-table__header {
      th {
        font-weight: bold !important;
        color: #222;
        padding: 0 !important;
        height: 32px;
        line-height: 32px;
        font-size: 13px;
        letter-spacing: 1px;
        text-align: center;
        background: #f8f8f9;
      }
    }
  }
}
::v-deep .el-table--border .el-table__inner-wrapper::after,
::v-deep .el-table--border::after,
::v-deep .el-table--border::before,
::v-deep .el-table__inner-wrapper::before {
  display: none !important;
}
::v-deep .el-table__border-left-patch {
  display: none;
}
::v-deep .operate-style {
  padding: 0;
}
::v-deep .el-table.el-table-hisColumn .el-table__header-wrapper {
  height: auto !important;
}
::v-deep .el-table .el-table__header-wrapper {
  height: auto !important;
}
// 滚动条的宽度
::v-deep ::-webkit-scrollbar {
  width: 6px; // 横向滚动条
  height: 6px; // 纵向滚动条 必写
}
// 滚动条的滑块
::v-deep ::-webkit-scrollbar-thumb {
  background-color: #ddd;
  border-radius: 3px;
}
::v-deep #table {
  margin-top: 10px;
}
::v-deep .el-table {
  tr {
    td.split-column {
      vertical-align: top;
      .cell {
        padding: 0;

        .split-list {
          height: 100%;
          .split-item {
            height: 33px;
            padding: 5px 10px;
            border-bottom: 1px solid #ebeef5;
          }
          .split-item:last-child {
            border-bottom: 0;
          }
        }
      }
    }
  }
}
</style>