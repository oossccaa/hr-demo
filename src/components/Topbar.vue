<script setup>
defineProps({
  title: String,
})
</script>

<template>
  <div class="no-print bg-white px-8 py-5 shadow-sm flex items-center">
    <h2 class="text-2xl font-semibold text-primary-700">{{ title }}</h2>
  </div>
</template>
