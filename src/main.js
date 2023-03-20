import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// Noti
import Notifications from "@kyvg/vue3-notification";

const vuetify = createVuetify({
	components,
	directives,
});

createApp(App).use(vuetify).use(Notifications).mount("#app");

// createApp(App).mount("#app");
