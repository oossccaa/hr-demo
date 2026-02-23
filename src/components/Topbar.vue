<script setup>
defineProps({
  title: String,
  role: String
})

const emit = defineEmits(['switch-role'])
</script>

<template>
  <div class="bg-white px-8 py-5 shadow-sm flex justify-between items-center">
    <h2 class="text-2xl font-semibold text-primary-700">{{ title }}</h2>
    <div class="flex gap-2">
      <button
        @click="emit('switch-role', 'admin')"
        class="px-4 py-2 rounded-md border-2 border-primary-400 transition-all"
        :class="role === 'admin' ? 'bg-primary-400 text-white' : 'bg-white text-primary-400 hover:bg-primary-50'"
      >
        Admin
      </button>
      <button
        @click="emit('switch-role', 'maintainer')"
        class="px-4 py-2 rounded-md border-2 border-primary-400 transition-all"
        :class="role === 'maintainer' ? 'bg-primary-400 text-white' : 'bg-white text-primary-400 hover:bg-primary-50'"
      >
        Maintainer
      </button>
    </div>
  </div>
</template>
