import { createApp } from "vue";
import ProduitVue from "../components/ProduitVue.vue";
import ElementPlus from 'element-plus';

const app_instance_id = 'produit-vue-2';
const app_el = document.querySelector(`[data-produit-vue="${ app_instance_id }"]`);

app_el
    .closest('.oti-content-typography')?.classList.remove('oti-content-typography');

import some_hotels from '../config/priority-hotels'

createApp(ProduitVue, {
    options: {
        groupByField: 'arealName',
        chartersOnly: false,
        wildcardOption: 'Все отели'
    },
    productList: some_hotels
})
    .use(ElementPlus)
    .mount(app_el);
