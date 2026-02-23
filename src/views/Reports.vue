<script setup>
import { ref } from 'vue'

const emit = defineEmits(['toast'])
const activeTab = ref('insurance')

const insuranceChanges = [
  { type: '勞保加保', name: '張大明', date: '2025/02/01', salary: '$55,400', status: '待申報' },
  { type: '健保加保', name: '張大明', date: '2025/02/01', salary: '$55,400', status: '待申報' },
  { type: '勞保退保', name: '李小華', date: '2025/01/31', salary: '$66,800', status: '已申報' },
]

const taxStats = [
  { type: '50 薪資所得', count: 72, total: '$32,500,000', tax: '$1,625,000' },
  { type: '9A 執行業務', count: 3, total: '$450,000', tax: '$45,000' },
]

const deptStats = [
  { dept: '研發部', count: 25, avg: '$68,000', total: '$1,700,000' },
  { dept: '業務部', count: 18, avg: '$55,000', total: '$990,000' },
  { dept: '財務部', count: 8, avg: '$52,000', total: '$416,000' },
  { dept: '人事部', count: 5, avg: '$50,000', total: '$250,000' },
  { dept: '行政部', count: 14, avg: '$42,000', total: '$588,000' },
]
</script>

<template>
  <!-- Tabs -->
  <div class="flex gap-1 mb-6 border-b-2 border-gray-200">
    <button
      v-for="tab in [{ id: 'insurance', label: '保險名冊' }, { id: 'tax', label: '所得稅報表' }, { id: 'stats', label: '統計報表' }]"
      :key="tab.id"
      @click="activeTab = tab.id"
      class="px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-0.5"
      :class="activeTab === tab.id ? 'text-primary-400 border-primary-400' : 'text-gray-500 border-transparent hover:text-primary-700'"
    >
      {{ tab.label }}
    </button>
  </div>

  <!-- 保險名冊 -->
  <template v-if="activeTab === 'insurance'">
    <div class="bg-white p-6 rounded-xl shadow-md">
      <h3 class="text-lg font-semibold text-primary-700 mb-5">勞健保異動名冊</h3>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <button
          v-for="btn in ['勞保加保名冊', '勞保退保名冊', '健保加保名冊', '健保退保名冊']"
          :key="btn"
          @click="emit('toast', '已產出' + btn)"
          class="p-5 bg-gradient-to-br from-primary-400 to-primary-500 text-white rounded-xl text-center hover:scale-[1.03] hover:shadow-lg transition-all"
        >
          <span class="text-2xl block mb-2">📋</span>
          {{ btn }}
        </button>
      </div>

      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">異動類型</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">員工</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">生效日</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">投保薪資</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">狀態</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in insuranceChanges" :key="row.type + row.name" class="border-t border-gray-100 hover:bg-gray-50">
            <td class="px-4 py-3 text-sm">{{ row.type }}</td>
            <td class="px-4 py-3 text-sm font-medium">{{ row.name }}</td>
            <td class="px-4 py-3 text-sm">{{ row.date }}</td>
            <td class="px-4 py-3 text-sm">{{ row.salary }}</td>
            <td class="px-4 py-3">
              <span
                class="px-3 py-1 rounded-full text-xs font-medium"
                :class="row.status === '已申報' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'"
              >
                {{ row.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>

  <!-- 所得稅報表 -->
  <template v-if="activeTab === 'tax'">
    <div class="bg-white p-6 rounded-xl shadow-md mb-6">
      <h3 class="text-lg font-semibold text-primary-700 mb-5">所得稅相關報表</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          v-for="btn in [{ icon: '📄', label: '各類所得扣繳憑單' }, { icon: '📤', label: '扣繳申報媒體檔' }, { icon: '📊', label: '年度扣繳統計表' }]"
          :key="btn.label"
          @click="emit('toast', '已產出' + btn.label)"
          class="p-5 bg-gradient-to-br from-primary-400 to-primary-500 text-white rounded-xl text-center hover:scale-[1.03] hover:shadow-lg transition-all"
        >
          <span class="text-2xl block mb-2">{{ btn.icon }}</span>
          {{ btn.label }}
        </button>
      </div>
    </div>

    <div class="bg-white p-6 rounded-xl shadow-md">
      <h3 class="text-lg font-semibold text-primary-700 mb-5">2024年度扣繳統計</h3>
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">所得類別</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">人數</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">給付總額</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">扣繳稅額</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in taxStats" :key="row.type" class="border-t border-gray-100 hover:bg-gray-50">
            <td class="px-4 py-3 text-sm font-medium">{{ row.type }}</td>
            <td class="px-4 py-3 text-sm">{{ row.count }}</td>
            <td class="px-4 py-3 text-sm">{{ row.total }}</td>
            <td class="px-4 py-3 text-sm">{{ row.tax }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>

  <!-- 統計報表 -->
  <template v-if="activeTab === 'stats'">
    <div class="bg-white p-6 rounded-xl shadow-md mb-6">
      <h3 class="text-lg font-semibold text-primary-700 mb-5">人事統計報表</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          v-for="btn in [{ icon: '📊', label: '部門人力分析' }, { icon: '📈', label: '薪資成本趨勢' }, { icon: '👥', label: '離職率分析' }, { icon: '📋', label: '年資分布統計' }]"
          :key="btn.label"
          @click="emit('toast', '已產出報表')"
          class="p-5 bg-gradient-to-br from-primary-400 to-primary-500 text-white rounded-xl text-center hover:scale-[1.03] hover:shadow-lg transition-all"
        >
          <span class="text-2xl block mb-2">{{ btn.icon }}</span>
          {{ btn.label }}
        </button>
      </div>
    </div>

    <div class="bg-white p-6 rounded-xl shadow-md">
      <h3 class="text-lg font-semibold text-primary-700 mb-5">部門人力統計</h3>
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">部門</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">在職人數</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">平均薪資</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">月人事成本</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in deptStats" :key="row.dept" class="border-t border-gray-100 hover:bg-gray-50">
            <td class="px-4 py-3 text-sm font-medium">{{ row.dept }}</td>
            <td class="px-4 py-3 text-sm">{{ row.count }}</td>
            <td class="px-4 py-3 text-sm">{{ row.avg }}</td>
            <td class="px-4 py-3 text-sm">{{ row.total }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
</template>
