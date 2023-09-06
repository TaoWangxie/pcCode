<template>
    <div class="Table_box">
        <GTable
            :data="configInfo.data"
            :columns="configInfo.columns"
            :hideConfig="configInfo.hideConfig"
            :pagination="configInfo.page"
            :choose-type="configInfo.chooseType"
            :rowKey="configInfo.rowKey"
            @handlePageChange="getTableList"
            @handleSizeChange="getTableList"
        >
        </GTable>
    </div>
</template>

<script setup lang='ts'>
import { reactive, ref, getCurrentInstance, watch, computed } from 'vue';
const { proxy } = getCurrentInstance() as any;

interface Props {
    config?: any;
}
const props = withDefaults(defineProps<Props>(), {
    config: () => {},
});

let configInfo: any = ref({});

//watch
watch(
    () => props.config,
    (val) => {
        configInfo.value = val?.data;
    },
    { deep: true, immediate: true },
);

const getTableList = () => {};
</script>

<style lang="scss" scoped>
.Table_box {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
}
</style>