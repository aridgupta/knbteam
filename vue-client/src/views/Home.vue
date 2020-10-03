<template>
  <div
    class="container mx-auto h-screen max-h-screen flex flex-col justify-center items-center"
  >
    <div class="text-5xl font-bold">Knbteam</div>
    <div class="grid gap-4 grid-cols-2">
      <button
        class="transform bg-black hover:scale-105 text-white rounded-md py-2 px-4"
        @click="pushToSignup"
      >
        Signup
      </button>
      <button
        class="transform bg-black hover:scale-105 text-white rounded-md py-2 px-4"
        @click="pushToLogin"
      >
        Login
      </button>
    </div>
  </div>

  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Home",
  setup() {
    const router = useRouter();

    function pushToSignup() {
      router.push({ name: "signup" });
    }

    function pushToLogin() {
      router.push({ name: "login" });
    }
    return {
      pushToSignup,
      pushToLogin
    };
  }
});
</script>
