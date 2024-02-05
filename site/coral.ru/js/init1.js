import { createApp } from "vue";
import ProduitVue from "../components/ProduitVue.vue";
import PrimeVue from "primevue/config";

createApp(ProduitVue, {
    options: {
        prop: 'list 1'
    }
})
    .use(PrimeVue)
    // .component('Dropdown', primevue.dropdown)
    // .component('MultiSelect', primevue.multiselect)
    // .component('Calendar', primevue.calendar)
    .mount('[data-produit-vue="produit-vue-1"]');
