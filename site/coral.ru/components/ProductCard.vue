<script setup>
import { inject } from "vue";

const props = defineProps(['offer']);

const selectedDeparture = inject('selected-departure');

</script>

<template>
    <div class="product-card">
        <div class="visual-details">
            <div class="visual" :style="{ backgroundImage: `url(//content.coral.ru/resize/800x600/${ offer.Hotel.Images[0].ImageUrl })` }"></div>
            <div class="details">
                <div class="location">{{ offer?.Hotel?.Location?.Area }}</div>
                <h3 class="name">{{ offer?.Hotel?.Name }}</h3>
                <ul class="terms">
                    <li class="departure">{{ selectedDeparture.correctName ?? selectedDeparture.name }}</li>
                </ul>
            </div>
        </div>
        <div class="pricing">
            {{ offer?.Price }}
        </div>
    </div>
</template>

<style scoped lang="less">
@import "../common/css/coral-colors";
@import "../common/css/layout";
.product-card {
    display: flex;
    background-color: white;
    border-radius: 1em;
    box-shadow: 0 0 0 1px fade(black, 6%);
    color: black;
    >* {
        padding: .5em;
    }
    .visual-details {
        width: 70%;
        display: flex;
    }
    .visual {
        width: 38%;
        .proportional(4/3);
        background: center / cover no-repeat;
        border-radius: .7em;
    }
    .details {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 1em;
        padding: 0 2em;
        >* {
            line-height: 1;
            margin: 0;
        }
        .location {
            font-weight: 300;
        }
        h3.name {
            font-size: (20/14em);
            font-weight: bold;
        }
        ul.terms {
            list-style: none;
            margin: 0;
            padding: 0;
            font-weight: 300;
        }
    }
    .pricing {
        width: 30%;
        border-left: 1px solid fade(black, 10%);
    }
}
</style>