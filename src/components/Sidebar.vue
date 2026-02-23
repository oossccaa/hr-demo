<script setup>
defineProps({
  user: Object,
  currentPage: String
})

const emit = defineEmits(['navigate'])

const navItems = [
  { id: 'dashboard', icon: '📊', label: '儀表板' },
  { id: 'personnel', icon: '👥', label: '人事管理' },
  { id: 'payroll', icon: '💰', label: '薪資作業' },
  { id: 'reports', icon: '📋', label: '名冊與報表' },
  { id: 'settings', icon: '⚙️', label: '系統設定' },
  { id: 'logout', icon: '🚪', label: '登出' },
]
</script>

<template>
  <aside class="w-64 bg-gradient-to-br from-primary-600 to-primary-700 text-white fixed h-screen overflow-y-auto">
    <!-- Logo -->
    <div class="p-6 border-b border-white/10">
      <h1 class="text-xl font-semibold mb-1">💼 T-ERP 人事薪資</h1>
      <p class="text-xs opacity-80">輕量化管理系統</p>
    </div>

    <!-- User Info -->
    <div class="p-5 bg-black/10 flex items-center gap-3">
      <div class="w-11 h-11 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-lg">
        {{ user.avatar }}
      </div>
      <div>
        <h3 class="text-sm font-medium">{{ user.name }}</h3>
        <p class="text-xs opacity-70">{{ user.role }}</p>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="py-5">
      <div
        v-for="item in navItems"
        :key="item.id"
        @click="emit('navigate', item.id)"
        class="flex items-center gap-3 px-5 py-3 cursor-pointer transition-all border-l-[3px] border-transparent hover:bg-white/10 hover:border-white"
        :class="{ 'bg-white/15 border-white': currentPage === item.id }"
      >
        <span>{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </div>
    </nav>
  </aside>
</template>
