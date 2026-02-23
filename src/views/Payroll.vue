<script setup>
import { ref } from 'vue'

const emit = defineEmits(['toast'])
const activeTab = ref('calc')

const stats = [
  { title: '本月應發薪資', value: '$2,845,000', change: '70 位員工', icon: '💵', color: 'from-success to-green-700' },
  { title: '代扣款項合計', value: '$425,000', change: '勞健保+所得稅', icon: '📝', color: 'from-warning to-danger' },
  { title: '實發金額', value: '$2,420,000', change: '預計 02/05 發放', icon: '💰', color: 'from-primary-400 to-primary-500' },
]

const payrollData = [
  { id: 'A001', name: '王大明', dept: '研發部', base: 78000, days: 25, bonus: 5000, overtime: 5200, other: 10000, deduct: 12500 },
  { id: 'A003', name: '張美玲', dept: '人事部', base: 52000, days: 23, bonus: 3000, overtime: 0, other: 3000, deduct: 7800 },
  { id: 'A004', name: '陳志豪', dept: '研發部', base: 62000, days: 22, bonus: 2000, overtime: 8500, other: 10000, deduct: 10200 },
  { id: 'A005', name: '林佳穎', dept: '財務部', base: 48000, days: 20, bonus: 0, overtime: 2000, other: 0, deduct: 6500 },
  { id: 'A006', name: '張大明', dept: '研發部', base: 55000, days: 22, bonus: 2000, overtime: 0, other: 0, deduct: 7200 },
]

const attendanceRules = [
  { days: 22, amount: 2000 },
  { days: 23, amount: 3000 },
  { days: 24, amount: 4000 },
  { days: 25, amount: 5000 },
]

const history = [
  { month: '2025/02', count: 70, total: '$2,420,000', date: '-', status: '待審核' },
  { month: '2025/01', count: 68, total: '$2,350,000', date: '2025/01/05', status: '已發放' },
  { month: '2024/12', count: 68, total: '$3,890,000', date: '2024/12/05', status: '已發放' },
]

function getAttendanceBonus(days) {
  if (days >= 25) return 5000
  if (days >= 24) return 4000
  if (days >= 23) return 3000
  if (days >= 22) return 2000
  return 0
}

function getTotal(row) {
  return row.base + row.bonus + row.overtime + row.other - row.deduct
}

function formatMoney(num) {
  return '$' + num.toLocaleString()
}
</script>

<template>
  <!-- Tabs -->
  <div class="flex gap-1 mb-6 border-b-2 border-gray-200">
    <button
      v-for="tab in [{ id: 'calc', label: '薪資計算' }, { id: 'attendance', label: '出勤津貼' }, { id: 'var', label: '變動津貼' }, { id: 'history', label: '發放紀錄' }]"
      :key="tab.id"
      @click="activeTab = tab.id"
      class="px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-0.5"
      :class="activeTab === tab.id ? 'text-primary-400 border-primary-400' : 'text-gray-500 border-transparent hover:text-primary-700'"
    >
      {{ tab.label }}
    </button>
  </div>

  <!-- 薪資計算 -->
  <template v-if="activeTab === 'calc'">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div
        v-for="stat in stats"
        :key="stat.title"
        class="bg-white p-6 rounded-xl shadow-md"
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

    <div class="bg-white p-6 rounded-xl shadow-md">
      <h3 class="text-lg font-semibold text-primary-700 mb-5">2025年2月 薪資明細</h3>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-3 py-3 text-left text-sm font-semibold text-gray-600">工號</th>
              <th class="px-3 py-3 text-left text-sm font-semibold text-gray-600">姓名</th>
              <th class="px-3 py-3 text-left text-sm font-semibold text-gray-600">部門</th>
              <th class="px-3 py-3 text-left text-sm font-semibold text-gray-600">本薪</th>
              <th class="px-3 py-3 text-left text-sm font-semibold text-gray-600">出勤天數</th>
              <th class="px-3 py-3 text-left text-sm font-semibold text-gray-600">出勤津貼</th>
              <th class="px-3 py-3 text-left text-sm font-semibold text-gray-600">加班費</th>
              <th class="px-3 py-3 text-left text-sm font-semibold text-gray-600">獎金</th>
              <th class="px-3 py-3 text-left text-sm font-semibold text-gray-600">代扣</th>
              <th class="px-3 py-3 text-left text-sm font-semibold text-gray-600">實發</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in payrollData" :key="row.id" class="border-t border-gray-100 hover:bg-gray-50">
              <td class="px-3 py-3 text-sm">{{ row.id }}</td>
              <td class="px-3 py-3 text-sm font-medium">{{ row.name }}</td>
              <td class="px-3 py-3 text-sm">{{ row.dept }}</td>
              <td class="px-3 py-3 text-sm">{{ formatMoney(row.base) }}</td>
              <td class="px-3 py-3">
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="row.days >= 22 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'"
                >
                  {{ row.days }}天
                </span>
              </td>
              <td class="px-3 py-3 text-sm font-semibold" :class="row.bonus > 0 ? 'text-green-600' : 'text-gray-400'">
                {{ row.bonus > 0 ? '+' + formatMoney(row.bonus) : '$0' }}
              </td>
              <td class="px-3 py-3 text-sm">{{ formatMoney(row.overtime) }}</td>
              <td class="px-3 py-3 text-sm">{{ formatMoney(row.other) }}</td>
              <td class="px-3 py-3 text-sm text-red-500">-{{ formatMoney(row.deduct) }}</td>
              <td class="px-3 py-3 text-sm font-bold">{{ formatMoney(getTotal(row)) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
        <strong>出勤津貼規則：</strong>
        22天 → +$2,000 ｜ 23天 → +$3,000 ｜ 24天 → +$4,000 ｜ 25天以上 → +$5,000
      </div>

      <div class="mt-5 flex justify-end gap-3">
        <button @click="emit('toast', '已匯出薪資明細')" class="px-5 py-2.5 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200">
          匯出 Excel
        </button>
        <button @click="emit('toast', '已提交審核')" class="px-5 py-2.5 bg-success text-white rounded-lg hover:bg-green-700">
          提交審核
        </button>
      </div>
    </div>
  </template>

  <!-- 出勤津貼 -->
  <template v-if="activeTab === 'attendance'">
    <div class="bg-white p-6 rounded-xl shadow-md mb-6">
      <h3 class="text-lg font-semibold text-primary-700 mb-5 flex items-center gap-2">
        📅 出勤津貼計算
        <span class="bg-success text-white text-xs px-3 py-1 rounded-full">自動計算</span>
      </h3>

      <!-- 級距說明 -->
      <div class="mb-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-l-4 border-success">
        <strong class="text-green-700 block mb-3">本月出勤津貼級距</strong>
        <div class="flex flex-wrap gap-6">
          <div v-for="rule in attendanceRules" :key="rule.days" class="flex items-center gap-2">
            <span class="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700">{{ rule.days }}天</span>
            <span class="text-gray-400">→</span>
            <span class="font-bold text-green-600">+{{ formatMoney(rule.amount) }}</span>
          </div>
        </div>
      </div>

      <!-- 員工出勤表 -->
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">工號</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">姓名</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">部門</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">出勤天數</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">出勤津貼</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">狀態</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in payrollData" :key="row.id" class="border-t border-gray-100 hover:bg-gray-50">
            <td class="px-4 py-3 text-sm">{{ row.id }}</td>
            <td class="px-4 py-3 text-sm font-medium">{{ row.name }}</td>
            <td class="px-4 py-3 text-sm">{{ row.dept }}</td>
            <td class="px-4 py-3">
              <span class="font-bold text-lg">{{ row.days }}天</span>
            </td>
            <td class="px-4 py-3 text-lg font-bold" :class="row.bonus > 0 ? 'text-green-600' : 'text-gray-400'">
              {{ row.bonus > 0 ? '+' + formatMoney(row.bonus) : '$0' }}
            </td>
            <td class="px-4 py-3">
              <span
                class="px-3 py-1 rounded-full text-xs font-medium"
                :class="row.days >= 22 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'"
              >
                {{ row.days >= 22 ? '已計算' : '未達標' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="mt-5 flex justify-between items-center">
        <div class="text-gray-600">
          本月出勤津貼總額：<span class="text-2xl font-bold text-green-600">$12,000</span>
          <span class="text-sm text-gray-500 ml-2">（4人符合）</span>
        </div>
        <button @click="emit('toast', '功能展示中')" class="px-5 py-2.5 bg-success text-white rounded-lg hover:bg-green-700">
          編輯出勤天數
        </button>
      </div>
    </div>
  </template>

  <!-- 變動津貼 -->
  <template v-if="activeTab === 'var'">
    <div class="bg-white p-6 rounded-xl shadow-md">
      <h3 class="text-lg font-semibold text-primary-700 mb-5 flex items-center gap-2">
        其他變動津貼
        <span class="bg-danger text-white text-xs px-3 py-1 rounded-full">8 筆待處理</span>
      </h3>
      <div class="space-y-3">
        <div class="flex justify-between items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
          <div>
            <h4 class="font-medium text-primary-700 mb-1">研發部 - 專案獎金</h4>
            <p class="text-sm text-gray-500">8 位員工 | 總金額 $80,000</p>
          </div>
          <button @click="emit('toast', '功能展示中')" class="px-4 py-2 bg-success text-white rounded-md text-sm hover:bg-green-700">
            輸入
          </button>
        </div>
        <div class="flex justify-between items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
          <div>
            <h4 class="font-medium text-primary-700 mb-1">業務部 - 業績獎金</h4>
            <p class="text-sm text-gray-500">5 位員工 | 待輸入</p>
          </div>
          <button @click="emit('toast', '功能展示中')" class="px-4 py-2 bg-success text-white rounded-md text-sm hover:bg-green-700">
            輸入
          </button>
        </div>
        <div class="flex justify-between items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
          <div>
            <h4 class="font-medium text-primary-700 mb-1">全公司 - 加班費</h4>
            <p class="text-sm text-gray-500">12 位員工 | 總金額 $45,000</p>
          </div>
          <span class="bg-success text-white text-xs px-3 py-1 rounded-full">已完成</span>
        </div>
      </div>
    </div>
  </template>

  <!-- 發放紀錄 -->
  <template v-if="activeTab === 'history'">
    <div class="bg-white p-6 rounded-xl shadow-md">
      <h3 class="text-lg font-semibold text-primary-700 mb-5">薪資發放紀錄</h3>
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">年月</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">人數</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">總金額</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">發放日</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">狀態</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in history" :key="row.month" class="border-t border-gray-100 hover:bg-gray-50">
            <td class="px-4 py-3 text-sm font-medium">{{ row.month }}</td>
            <td class="px-4 py-3 text-sm">{{ row.count }}</td>
            <td class="px-4 py-3 text-sm">{{ row.total }}</td>
            <td class="px-4 py-3 text-sm">{{ row.date }}</td>
            <td class="px-4 py-3">
              <span
                class="px-3 py-1 rounded-full text-xs font-medium"
                :class="row.status === '已發放' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'"
              >
                {{ row.status }}
              </span>
            </td>
            <td class="px-4 py-3">
              <button class="px-3 py-1.5 bg-primary-100 text-primary-600 rounded-md text-sm hover:bg-primary-200">
                查看
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
</template>
