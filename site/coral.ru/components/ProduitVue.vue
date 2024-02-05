<script setup>
import departures from '../config/departures.yaml';
import Dropdown from "primevue/dropdown";

import { ref } from "vue";

const props = defineProps(['options', 'productList']);

const selectedDeparture = ref(departures[0]);
const departureOptions = ref(departures);

const date = ref();

</script>

<template>
    <div>
        {{ props.options.prop }}
        <Dropdown v-model="selectedDeparture" filter
                  :options="departureOptions" option-label="name">
            <template #value="{ value }">из {{ value.fromForm }}</template>
            <template #header>город вылета</template>
            <template #option="{ option }">{{ option.correctName ?? option.name }}</template>
        </Dropdown>
    </div>
</template>

<style scoped>

</style>