<template>
  <form
    @submit.prevent="signupEvent"
    class="grid gap-4 grid-cols-1 grid-flow-row"
  >
    <span class="flex flex-col">
      <label for="name" class="mb-1">Name</label>
      <input
        type="text"
        id="name"
        ref="nameFieldRef"
        v-model="inputs.name"
        class="primary-input"
        :class="{
          error: touched.name && errors.name.length > 1
        }"
        @blur="handleBlur"
        @input="handleChange"
        autofocus
      />
      <span
        v-if="errors.name.length > 1 && touched.name"
        class="text-red-700 text-sm"
        >{{ errors.name }}</span
      >
    </span>
    <span class="flex flex-col">
      <label for="email" class="mb-1">Email</label>
      <input
        type="text"
        id="email"
        v-model="inputs.email"
        class="primary-input"
        :class="{
          error: touched.email && errors.email.length > 1
        }"
        @blur="handleBlur"
        @input="handleChange"
      />
      <span
        v-if="errors.email.length > 1 && touched.email"
        class="text-red-700 text-sm"
        >{{ errors.email }}</span
      >
    </span>
    <span class="flex flex-col">
      <label for="password" class="mb-1">Password</label>
      <input
        type="password"
        id="password"
        v-model="inputs.password"
        class="primary-input"
        :class="{
          error: touched.password && errors.password.length > 1
        }"
        @blur="handleBlur"
        @input="handleChange"
      />
      <span
        v-if="errors.password.length > 1 && touched.password"
        class="text-red-700 text-sm"
        >{{ errors.password }}</span
      >
    </span>
    <span>
      <button
        type="submit"
        class="transform bg-black hover:scale-105 text-white rounded-md py-2 px-4"
      >
        Signup
      </button>
      <div v-if="authError.length > 1" class="text-red-700 text-sm">
        {{ authError.substring(authError.indexOf(":") + 1) }}
      </div>
    </span>
  </form>
  <router-link to="/login" class="text-xs text-blue-700 underline mt-2"
    >Already have an account? Login now</router-link
  >
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, ref } from "vue";
import { SignupInput } from "../apollo-graphql/generated/graphql.types";
import { useFormValidator } from "../compositions/useFormValidator";

type signup = (e: SignupInput) => void;

export default defineComponent({
  name: "SignupForm",
  setup() {
    const initialValues = {
      name: "",
      email: "",
      password: ""
    };
    const nameFieldRef = ref();
    const signup = inject("signup") as signup;
    const authError = inject("authError") as string;

    onMounted(() => nameFieldRef.value.focus());

    function validEmail(email: string) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
    const validate = function(values: typeof initialValues) {
      const errors = { name: "", email: "", password: "" };
      if (values.name == "") {
        errors.name = "Required!";
      } else if (values.name.length < 2) {
        errors.name = "Name must be of at least 2 characters";
      } else errors.name = "";

      if (values.email == "") {
        errors.email = "Required!";
      } else if (!validEmail(values.email)) {
        errors.email = "Please enter a valid email";
      } else errors.email = "";

      if (values.password == "") {
        errors.password = "Required!";
      } else if (values.password.length < 8) {
        errors.password = "Password must be of at least 8 characters";
      } else errors.password = "";

      return Object.assign({}, errors);
    };

    const {
      inputs,
      touched,
      errors,
      handleBlur,
      handleChange,
      isValidated
    } = useFormValidator(initialValues, validate);

    function signupEvent() {
      if (isValidated()) {
        signup({ ...inputs.value });
        inputs.value.name = "";
        inputs.value.email = "";
        inputs.value.password = "";
        nameFieldRef.value.focus();
      }
    }

    return {
      inputs,
      nameFieldRef,
      signupEvent,
      handleBlur,
      handleChange,
      authError,
      touched,
      errors
    };
  }
});
</script>

<style lang="postcss">
.primary-input {
  @apply py-2 px-1 rounded-md;
}
.primary-input:focus {
  @apply outline-none border-blue-700 border-2;
}
.error:focus {
  @apply outline-none border-red-700 border-2;
}
</style>
