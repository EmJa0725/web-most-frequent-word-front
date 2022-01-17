import { createApp } from 'vue'
import App from './App.vue'
import Popper from "vue3-popper";
import FontAwesomeIcon from './assets/icons/fontAwesomeIcons'
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

createApp(App)
    .component("font-awesome-icon", FontAwesomeIcon)
    .component("Popper", Popper)
    .mount('#app')

