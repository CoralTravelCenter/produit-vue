<script setup>
import departures from '../config/departures.yaml';

import { computed, onMounted, provide, ref, watchEffect } from "vue";
import { observeElementProp } from "./usefuls";
import RegionSelect from "./RegionSelect.vue";

const props = defineProps(['options', 'productList']);



const { value: departureCityId } = window.global?.getActiveDeparture?.call() ?? {};
const selectedDeparture = ref(
    departures.find(dep => Number(dep.eeID) === Number(departureCityId))
);
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
        </div>
        <div class="product-grid">
            list
        </div>
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
}

.el-select-dropdown {
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

    .product-grid {

    }

}

</style>