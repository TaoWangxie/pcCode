<template>
  <el-dialog
    draggable
    :model-value="visible"
    :title="title"
    width="70%"
    @close="handleClose"
    top="4vh"
  >
    <div class="NavTabBox">
      <NavTab
        :key:boolean="visible"
        class="NavTab"
        :tabIndex="tabIndex"
        :list="tabList"
        @tabClick="emitTabClick"
      />
    </div>
    <div class="container">
      <v-ace-editor
        v-model:value="pageCode"
        style="height: 100%"
        :lang="aceConfig.lang"
        :theme="aceConfig.theme"
        :options="aceConfig.options"
        :readonly="aceConfig.readOnly"
      />
    </div>
    <template #footer>
      <el-button :icon="DocumentCopy" circle @click="copyClick" />
    </template>
  </el-dialog>
</template>

<script setup lang='ts'>
import { reactive, ref, getCurrentInstance, watch } from "vue";
import NavTab from "./components/navTab/index.vue";
import useClipboard from 'vue-clipboard3';
import { VAceEditor } from "vue3-ace-editor";
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-chrome';
import ace from 'ace-builds';
import { DocumentCopy } from '@element-plus/icons-vue'
//store管理
const { proxy } = getCurrentInstance() as any

//AceEditor
ace.config.set('basePath', 'https://ks3-cn-beijing.ksyun.com/vform2021/ace-mini');
const aceConfig = ref({
  lang: 'json', //解析json
  theme: 'chrome', //主题
  readOnly: false, //是否只读
  options: {
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true,
    tabSize: 2,
    showPrintMargin: false,
    fontSize: 16
  }
});

//props
interface Props {
  visible: boolean,
  title?: string,
  code?: any
}
const props = withDefaults(defineProps<Props>(), {
  visible: false,
  title: '页面代码',
  code: () => {
    return {}
  }
})

//data
let type = ref('vue')
const emits = defineEmits(["update:visible"]);
let pageCode = ref<string>('')
const tabList: any[] = reactive([
  {
    id: 0,
    prop: 'html',
    name: 'Html'
  },
  {
    id: 1,
    prop: 'js',
    name: 'Js'
  },
  {
    id: 2,
    prop: 'css',
    name: 'Css'
  },
])

//watch
watch(() => props.visible, (val: boolean) => {
  if (val) {
    tabIndex.value = 0
    changeCode('html')
  }
})

//一键复制
const { toClipboard } = useClipboard();
const copyClick = async () => {
  try {
    await toClipboard(pageCode.value);
    proxy.$message({
      type: "success",
      showClose: true,
      message: "复制成功",
    });
  } catch (e) {
    console.error(e);
  }
};

let tabIndex = ref(0)
//methods
const emitTabClick = ({ data, index }: any) => {
  tabIndex.value = index
  changeCode(data.prop)
};
const changeCode = (prop: string) => {
  if (props.code) {
    let typeKey = type.value.toString() + prop.toString()
    let str: any = props.code[prop]
    pageCode.value = str
  } else {
    pageCode.value = '暂无数据'
  }

};


//关闭弹窗
const handleClose = () => {
  emits("update:visible", false);
};


</script>

<style lang="scss" scoped>
::v-deep .el-dialog__header {
  padding: 10px !important;
  border-bottom: 1px solid #ebeef5;
}
::v-deep .el-dialog__body {
  padding: 0 10px !important;
}
::v-deep .el-dialog__footer {
  padding: 10px !important;
}
.container {
  height: 60vh;
  border: 1px solid #ebeef5;
}
.NavTabBox {
  height: 40px;
}
</style>
