<script setup>
import departures from '../config/departures.yaml';

import { ref } from "vue";

const props = defineProps(['options', 'productList']);

</script>

<template>
    <div class="produit-vue">
        <div class="controls">
            controls
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
    .bbox();
    .silly-b2c-font-size(@max-font-size: 14px);
    font-family: museosans;
    font-weight: normal;
    display: grid;
    gap: 1em;
}

</style>