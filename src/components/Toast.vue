<script setup>
defineProps({
  message: String,
  visible: Boolean
})
</script>

<template>
  <Transition name="toast">
    <div
      v-if="visible"
      class="fixed bottom-8 right-8 bg-primary-700 text-white px-6 py-4 rounded-lg shadow-lg z-50"
    >
      {{ message }}
    </div>
  </Transition>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
