import { createApp } from "vue";
import ProduitVue from "../components/ProduitVue.vue";

createApp(ProduitVue, {
    options: {
        prop: 'list 1'
    }
})
    .use(primevue.config.default)
    .component('Dropdown', primevue.dropdown)
    .mount('[data-produit-vue="produit-vue-1"]');
