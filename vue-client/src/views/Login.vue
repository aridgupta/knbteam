<template>
  <modal :modalClose="pushToHome">
    <login-form />
  </modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import Modal from "../components/Modal.vue";
import LoginForm from "../components/LoginForm.vue";

export default defineComponent({
  components: {
    loginForm: LoginForm,
    modal: Modal
  },
  setup() {
    const router = useRouter();
    function pushToHome() {
      router.push({ path: "/" });
    }

    return { pushToHome };
  }
});
</script>

<style></style>
