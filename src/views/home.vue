<template>
    <h1>child-micro3</h1>
    <div>{{ userStoreData.name }}</div>
    <div @click="change">修改</div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/user';

const userStoreData = useUserStore();

const change = () => {
    userStoreData.updateName('李四');
};
</script>