import { createApp } from "vue";
import ProduitVue from "../components/ProduitVue.vue";
import ElementPlus from 'element-plus';

const app_instance_id = 'produit-vue-1';
const app_el = document.querySelector(`[data-produit-vue="${ app_instance_id }"]`);

app_el
    .closest('.oti-content-typography')
    .classList.remove('oti-content-typography');

createApp(ProduitVue, {
    options: {
        prop: 'list 1'
    }
})
    .use(ElementPlus)
    .mount(app_el);
