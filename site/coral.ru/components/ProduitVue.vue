<script setup>
import Dropdown from "primevue/dropdown";

import { ref } from "vue";

const props = defineProps(['options', 'productList']);

const selected = ref();
const options = ref(['opt1', 'opt2', 'opt3']);

const date = ref();

</script>

<template>
    <div>
        {{ props.options.prop }}
        <Dropdown v-model="selected" :options="options"></Dropdown>
    </div>
</template>

<style scoped>

</style>