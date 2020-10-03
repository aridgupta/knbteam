import { DefaultApolloClient } from "@vue/apollo-composable";
import { createApp } from "vue";
import { apolloClient } from "./apollo-client";
import App from "./App.vue";
import "./assets/tailwind.css";
import router from "./router";

createApp(App)
  .provide(DefaultApolloClient, apolloClient)
  .use(router)
  .mount("#app");
