<script setup>

import { ref } from "vue";

const props = defineProps(['options', 'productList']);

const selected = ref();
const options = ref(['opt1', 'opt2', 'opt3']);

</script>

<template>
    <div>
        {{ props.options.prop }}
        <Dropdown v-model="selected" :options="options" unstyled>
            <template #header>HEADER</template>
        </Dropdown>
    </div>
</template>

<style scoped>

</style>