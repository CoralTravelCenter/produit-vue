import { createApp } from "vue";
import ProduitVue from "../components/ProduitVue.vue";


createApp(ProduitVue, {
    options: {
        prop: 'list 1'
    }
})
    .mount('[data-produit-vue="produit-vue-1"]');
