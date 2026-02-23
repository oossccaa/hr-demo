<script setup>
const emit = defineEmits(['navigate', 'toast'])

const stats = [
  { title: '目前在職員工', value: '70', change: '▲ 3 人 較上月', icon: '👥', color: 'from-primary-400 to-primary-500' },
  { title: '本月薪資總額', value: '$2.8M', change: '▲ 5.2% 較上月', icon: '💰', color: 'from-success to-green-700' },
  { title: '本月新進人員', value: '1', change: '張大明 研發部', icon: '🆕', color: 'from-warning to-danger' },
  { title: '年度人事成本', value: '$33.6M', change: '至 2025/02 累計', icon: '📈', color: 'from-gray-500 to-gray-600' },
]

const activities = [
  { title: '已完成 2025年1月份薪資發放', time: '2025/02/01 09:30', icon: '✓', color: 'from-success to-green-700' },
  { title: '新進員工 張大明 完成報到', time: '2025/02/01 08:30', icon: '👤', color: 'from-primary-400 to-primary-500' },
  { title: '查閱 Q4 人事成本統計報告', time: '2025/01/25 11:15', icon: '📋', color: 'from-gray-500 to-gray-600' },
]

const quickActions = [
  { icon: '📊', label: '查看年度報表', page: 'reports' },
  { icon: '👥', label: '員工資料管理', page: 'personnel' },
  { icon: '⚙️', label: '系統設定', page: 'settings' },
  { icon: '📈', label: '薪資作業', page: 'payroll' },
]
</script>

<template>
  <!-- Stats Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
    <div
      v-for="stat in stats"
      :key="stat.title"
      class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
    >
      <div class="flex justify-between items-start mb-4">
        <span class="text-sm text-gray-500 font-medium">{{ stat.title }}</span>
        <div
          class="w-11 h-11 rounded-lg flex items-center justify-center text-white text-xl bg-gradient-to-br"
          :class="stat.color"
        >
          {{ stat.icon }}
        </div>
      </div>
      <div class="text-3xl font-bold text-primary-700 mb-2">{{ stat.value }}</div>
      <div class="text-sm text-success">{{ stat.change }}</div>
    </div>
  </div>

  <!-- Quick Actions -->
  <div class="bg-white p-6 rounded-xl shadow-md mb-8">
    <h3 class="text-lg font-semibold text-primary-700 mb-5">快速功能</h3>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <button
        v-for="action in quickActions"
        :key="action.label"
        @click="emit('navigate', action.page)"
        class="p-5 bg-gradient-to-br from-primary-400 to-primary-500 text-white rounded-xl text-center hover:scale-[1.03] hover:shadow-lg transition-all"
      >
        <span class="text-2xl block mb-2">{{ action.icon }}</span>
        {{ action.label }}
      </button>
    </div>
  </div>

  <!-- Recent Activity -->
  <div class="bg-white p-6 rounded-xl shadow-md">
    <h3 class="text-lg font-semibold text-primary-700 mb-5">近期活動</h3>
    <div
      v-for="(activity, idx) in activities"
      :key="idx"
      class="flex gap-4 py-4"
      :class="{ 'border-b border-gray-100': idx < activities.length - 1 }"
    >
      <div
        class="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 bg-gradient-to-br"
        :class="activity.color"
      >
        {{ activity.icon }}
      </div>
      <div>
        <h4 class="text-sm font-medium text-primary-700 mb-1">{{ activity.title }}</h4>
        <p class="text-xs text-gray-500">{{ activity.time }}</p>
      </div>
    </div>
  </div>
</template>
