<template>
    <div class="btn_box">
        <GBtnBox
            :list="configInfo.columns"
            :algin="configInfo.algin"
            @handleClick="handleClick"
        ></GBtnBox>
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
        console.log(val);
        configInfo.value = val?.data;
    },
    { deep: true, immediate: true },
);

const handleClick = () => {};
</script>

<style lang="scss" scoped>
.btn_box {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
}
</style>