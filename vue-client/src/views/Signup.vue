<template>
  <modal :modalClose="pushToHome">
    <signup-form />
  </modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import SignupForm from "../components/SignupForm.vue";
import Modal from "../components/Modal.vue";

export default defineComponent({
  components: {
    signupForm: SignupForm,
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
