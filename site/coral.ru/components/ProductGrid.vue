<script setup>
import ProductCard from "./ProductCard.vue";

const props = defineProps(['offers']);
</script>

<template>
    <div class="product-grid">
        <div class="offers-list">
            <ProductCard v-for="offer in offers" :offer="offer" :key="offer.Hotel.Id"></ProductCard>
        </div>
        <div class="pager">
            pager
        </div>
    </div>
</template>

<style scoped lang="less">
.product-grid {
    display: grid;

    .offers-list {
        display: grid;
        gap: 1em;
    }

}
</style>