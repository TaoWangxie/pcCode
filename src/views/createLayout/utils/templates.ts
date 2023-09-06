
export function vueTem(str: string) {
    return `<template>
${str}
</template>`
}

export function scriptTem(str: string) {
    return `<script setup lang='ts'>
import _ from 'lodash'
import { ref, getCurrentInstance, watch, computed, onMounted } from 'vue'

${str}

</script>`
}

export function styleTem(str: string) {
    return `<style lang="scss" scoped>

${str}</style>`
}

