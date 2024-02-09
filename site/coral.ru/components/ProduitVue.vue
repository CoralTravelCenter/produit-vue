<script setup>
import departures from '../config/departures.yaml';

import { computed, onMounted, provide, reactive, ref, watchEffect } from "vue";
import { observeElementProp, waitAMoment } from "./usefuls";
import RegionSelect from "./RegionSelect.vue";

import dayjs from "dayjs";
import locale_ru from 'dayjs/locale/ru'
import {
    fetchPackageOffersWithQueryDescriptor,
    packageQueryWithProduct
} from "./api-adapter";
dayjs.locale(locale_ru);

import hash from 'object-hash';
import ProductGrid from "./ProductGrid.vue";

const props = defineProps(['options', 'productList']);



const { value: departureCityId } = window.global?.getActiveDeparture?.call() ?? {};
const selectedDeparture = ref(
    departures.find(dep => Number(dep.eeID) === Number(departureCityId))
);

provide('selected-departure', selectedDeparture);

observeElementProp(document.querySelector('input.packageSearch__departureInput'), 'value', (new_departure_name) => {
    if (new_departure_name) {
        const found_departure = departures.find(dep => dep.name === new_departure_name);
        if (found_departure) selectedDeparture.value = found_departure;
    }
});

const matchedDepartures = computed(() => {
    return departures.filter(dep => {
        const pattern_input = departureInputPattern.value?.trim();
        if (pattern_input) {
            const words_uc = pattern_input.toUpperCase().split(/\s+/);
            const dep_name_words_uc = (dep.correctName || dep.name).toUpperCase().split(/\s+/);
            return words_uc.reduce((matched, word) => {
                if (!matched) return false;
                const idx = dep_name_words_uc.findIndex(dep_word => dep_word.indexOf(word) === 0);
                if (~idx) {
                    dep_name_words_uc.splice(idx, 1);
                    return true;
                }
                return false;
            }, true);
        }
        return true;
    });
});
const departureInputPattern = ref();

const layoutMode = ref('');
provide('layout-mode', layoutMode);

onMounted(() => {
    const layout = matchMedia('(max-width:768px)');
    layout.addEventListener('change', e => layoutMode.value = e.matches ? 'mobile' : 'desktop');
    layoutMode.value = layout.matches ? 'mobile' : 'desktop';
});

const regionsOptions = computed(() => {
    return Array.from(new Set(props.productList.map(p => p[props.options.groupByField])));
});
const selectedRegion = ref();

const monthsOptions = computed(() => {
    const since_months = props.productList.map(p => dayjs(p.since).format('YYYY-MM'));
    return [...(new Set(since_months))];
});
const selectedMonth = ref();

const matchedProductList = computed(() => {
    if (selectedRegion.value && selectedMonth.value) {
        const selected_dayjs = dayjs(selectedMonth.value);
        return props.productList.filter(p => {
            return (selectedRegion.value === '*' || p[props.options.groupByField] === selectedRegion.value)
                && selected_dayjs.isSame(p.since, 'month');
        });
    }
    return [];
});

const offersList = reactive([]);

const offersLoading = ref(0);

watchEffect(async () => {
    if (selectedDeparture.value && selectedRegion.value && selectedMonth.value) {

    }
    console.log('+++ matched: %o', matchedProductList.value);
    const queries = {};
    for (const product of matchedProductList.value) {
        const q = await packageQueryWithProduct(product, selectedDeparture.value, props.options.chartersOnly);
        const q_hash = hash(q);
        queries[q_hash] ||= {};
        queries[q_hash].query = q;
        queries[q_hash].hotels ||= [];
        queries[q_hash].hotels.push(product.ID);
    }
    console.log('+++ queries: %o', queries);

    offersList.splice(0);
    const queue = Object.values(queries);
    offersLoading.value = 0;
    for (const q of queue) {
        offersLoading.value += 1/queue.length * 100;
        const parsed_offers = await fetchPackageOffersWithQueryDescriptor(q);
        console.log('+++ parsed_offers: %o', parsed_offers);
        offersList.push(...parsed_offers);
        offersList.sort((a, b) => a.Price - b.Price);
    }
    offersLoading.value = 0;
});

</script>

<template>
    <div class="produit-vue">
        <div class="controls">
            <RegionSelect v-model="selectedRegion"
                          :options-list="regionsOptions"
                          :wildcard-option="options.wildcardOption"></RegionSelect>
            <el-select v-model="selectedDeparture"
                       value-key="eeID"
                       filterable
                       default-first-option
                       :filter-method="input => departureInputPattern = input"
                       :teleported="true">
                <template #empty><div style="text-align:center; padding: 1em;">Не найден</div></template>
                <el-option v-for="departure in matchedDepartures"
                           :size="layoutMode.value === 'mobile' ? 'small' : 'default'"
                           :key="departure.eeID"
                           :label="`из ${ departure.fromForm }`"
                           :value="departure">
                    <span>{{ departure.correctName || departure.name }}</span>
                </el-option>
            </el-select>
            <el-select v-model="selectedMonth">
                <el-option v-for="month in monthsOptions"
                           :value="month"
                           :label="dayjs(month).format('MMMM')">
                    <span>{{ dayjs(month).format('MMMM') }}</span>
                </el-option>
            </el-select>
        </div>
        <ProductGrid :offers="offersList" :in-progress="offersLoading"></ProductGrid>
    </div>
</template>

<style lang="less">
@import "../common/css/coral-fonts";
@import "../common/css/coral-colors";

:root {
    --el-font-family: 'museosans'!important;
    //--el-font-size-base: inherit!important;
    --el-font-size-base: 1em!important;
    --el-component-size: 2.5em!important;
    --el-fill-color-light: fade(@coral-main-blue, 8%)!important;
    --el-color-primary: @coral-main-blue;
}

.el-select-dropdown, .el-progress-bar {
    font-family: museosans;
    font-weight: 400;
    --el-color-primary: @coral-main-blue;
    //--el-text-color-regular: black;
}

.tour-guide-module {
    .el-select {
        --el-select-width: unset;
        --el-select-border-color-hover: @coral-main-blue;
        .el-input__wrapper {
            --el-input-border-color: @coral-page-bg;
            box-shadow: inset 0 0 0 2px var(--el-input-border-color);
        }
        .el-select__wrapper {
            font-size: unset;
        }
    }
}

</style>

<style scoped lang="less">
@import "../common/css/layout";

.produit-vue {
    max-width: 1120px;
    margin-left: auto;
    margin-right: auto;
    //border: 1px solid #000;

    .bbox();
    .silly-b2c-font-size(@max-font-size: 14px);
    font-family: museosans;
    font-weight: normal;
    display: grid;
    gap: 1em;

    .controls {
        display: flex;
        align-items: center;
        gap: 1em;
    }

}

</style>