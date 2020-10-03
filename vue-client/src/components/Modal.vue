<template>
  <teleport to="body">
    <div
      class="w-full flex justify-center items-center h-screen max-h-screen absolute top-0 right-0 bottom-0 left-0 bg-opacity-50 bg-gray-700"
    >
      <div
        class="w-full absolute top-0 left-0 h-screen max-h-screen bg-transparent z-10"
        @click.self="modalClose"
      ></div>
      <div
        class="grid grid-cols-1 w-11/12 md:w-4/12 p-6 bg-gray-300 rounded-md z-20"
      >
        <slot></slot>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Modal",
  props: ["modalClose"],
  setup(props) {
    const { modalClose } = props;

    return { modalClose };
  }
});
</script>

<style></style>
