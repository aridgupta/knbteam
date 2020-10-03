<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, provide } from "vue";
import useAuth from "./compositions/useAuth";

export default defineComponent({
  name: "App",
  setup() {
    const { auth, login, signup, authError } = useAuth();
    provide("auth", auth);
    provide("signup", signup);
    provide("login", login);
    provide("authError", authError);
  }
});
</script>
