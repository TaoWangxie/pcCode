<template>
    <div class="Form_box">
        <GForm
            :data="configInfo.data"
            :columns="configInfo.columns"
            :rules="configInfo.rules"
            :labelPosition="configInfo.labelPosition"
            :list-type-info="configInfo.listTypeInfo"
            :labelWidth="configInfo.labelWidth"
            :whetherDisabled="configInfo.whetherDisabled"
            :count="configInfo.count"
        />
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
</script>

<style lang="scss" scoped>
.Form_box {
    width: 100%;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
}
</style>