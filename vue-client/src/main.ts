import { DefaultApolloClient } from "@vue/apollo-composable";
import { createApp } from "vue";
import { apolloClient } from "./apollo-client";
import App from "./App.vue";
import router from "./router";
import "./assets/tailwind.css";

createApp(App)
  .provide(DefaultApolloClient, apolloClient)
  .use(router)
  .mount("#app");
