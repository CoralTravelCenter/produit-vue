<script setup>
import ProductCard from "./ProductCard.vue";
import { ref, watch } from "vue";

const props = defineProps(['offers','inProgress']);

const showProgress = ref(false);
let showProgressTimeout;
watch(() => props.inProgress, (newValue, oldValue) => {
    console.log('+++ newValue, oldValue: %o, %o', newValue, oldValue);
    if (newValue && !oldValue) {
        showProgressTimeout = setTimeout(() => {
            showProgress.value = true;
        }, 300);
    } else {
        clearTimeout(showProgressTimeout);
        showProgress.value = false;
    }
});

</script>

<template>
    <div class="product-grid">
        <Transition name="slide-inout">
            <el-progress v-if="inProgress && showProgress" :percentage="inProgress" :indeterminate="true" :show-text="false"></el-progress>
        </Transition>
        <div class="offers-list">
            <TransitionGroup name="slide-inout">
                <ProductCard v-for="offer in offers" :offer="offer" :key="offer.Hotel.Id"></ProductCard>
            </TransitionGroup>
        </div>
        <div class="pager">
            pager
        </div>
    </div>
</template>

<style scoped lang="less">
@import "../common/css/layout";
.product-grid {
    display: grid;

    .offers-list {
        display: grid;
        gap: 1em;
    }

    .el-progress {
        overflow: hidden;
        max-height: 5em;
        .transit(opacity);
        .transit(max-height);
        &.slide-inout-enter-from, &.slide-inout-leave-to {
            opacity: 0;
            max-height: 0;
        }

    }
}
</style>