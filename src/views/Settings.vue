<script setup>
import { ref } from 'vue'

const emit = defineEmits(['toast'])
const activeTab = ref('attendance')

const attendanceRules = ref([
  { days: 22, amount: 2000 },
  { days: 25, amount: 5000 },
])

const taxRates = [
  { range: '$0 ~ $84,500', rate: '0%' },
  { range: '$84,501 ~ $126,000', rate: '5%' },
  { range: '$126,001 ~ $252,000', rate: '12%' },
  { range: '$252,001 以上', rate: '20%' },
]
</script>

<template>
  <!-- Tabs -->
  <div class="flex gap-1 mb-6 border-b-2 border-gray-200">
    <button
      v-for="tab in [{ id: 'attendance', label: '出勤津貼設定' }, { id: 'insurance', label: '勞健保設定' }, { id: 'tax', label: '所得稅設定' }]"
      :key="tab.id"
      @click="activeTab = tab.id"
      class="px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-0.5"
      :class="activeTab === tab.id ? 'text-primary-400 border-primary-400' : 'text-gray-500 border-transparent hover:text-primary-700'"
    >
      {{ tab.label }}
    </button>
  </div>

  <!-- 出勤津貼設定 -->
  <template v-if="activeTab === 'attendance'">
    <div class="bg-white p-6 rounded-xl shadow-md">
      <h3 class="text-lg font-semibold text-primary-700 mb-5 flex items-center gap-2">
        📅 出勤津貼級距設定
        <span class="bg-success text-white text-xs px-3 py-1 rounded-full">依天數自動計算</span>
      </h3>

      <div class="mb-6 p-5 bg-blue-50 rounded-xl border-l-4 border-blue-400">
        <p class="text-blue-700 text-sm">
          <strong>說明：</strong>系統會根據員工當月實際出勤天數，自動計算對應的出勤津貼。未達最低天數門檻者，不發放津貼。
        </p>
      </div>

      <div class="space-y-4 mb-6">
        <div
          v-for="(rule, idx) in attendanceRules"
          :key="idx"
          class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
        >
          <div class="flex items-center gap-2">
            <span class="text-gray-600 font-medium">出勤滿</span>
            <input
              v-model.number="rule.days"
              type="number"
              class="w-20 px-3 py-2 border border-gray-200 rounded-lg text-center focus:outline-none focus:border-primary-400"
            />
            <span class="text-gray-600 font-medium">天{{ idx === attendanceRules.length - 1 ? '以上' : '' }}</span>
          </div>
          <span class="text-gray-400">→</span>
          <div class="flex items-center gap-2">
            <span class="text-gray-600 font-medium">津貼</span>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                v-model.number="rule.amount"
                type="number"
                class="w-32 pl-8 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400"
              />
            </div>
          </div>
          <button
            v-if="attendanceRules.length > 1"
            @click="attendanceRules.splice(idx, 1)"
            class="ml-auto px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            刪除
          </button>
        </div>
      </div>

      <div class="flex justify-between items-center">
        <button
          @click="attendanceRules.push({ days: 26, amount: 6000 })"
          class="px-5 py-2.5 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-primary-400 hover:text-primary-400 transition-colors"
        >
          + 新增級距
        </button>
        <button
          @click="emit('toast', '出勤津貼設定已儲存')"
          class="px-6 py-2.5 bg-success text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          儲存設定
        </button>
      </div>
    </div>

    <!-- 預覽 -->
    <div class="bg-white p-6 rounded-xl shadow-md mt-6">
      <h3 class="text-lg font-semibold text-primary-700 mb-5">目前設定預覽</h3>
      <div class="flex flex-wrap gap-4">
        <div
          v-for="rule in attendanceRules"
          :key="rule.days"
          class="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200"
        >
          <span class="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
            {{ rule.days }}天{{ rule === attendanceRules[attendanceRules.length - 1] ? '↑' : '' }}
          </span>
          <span class="text-gray-400">→</span>
          <span class="font-bold text-green-600 text-lg">+${{ rule.amount.toLocaleString() }}</span>
        </div>
      </div>
    </div>
  </template>

  <!-- 勞健保設定 -->
  <template v-if="activeTab === 'insurance'">
    <div class="bg-white p-6 rounded-xl shadow-md mb-6">
      <h3 class="text-lg font-semibold text-primary-700 mb-5">勞保費率設定（2025年）</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-2">普通事故費率</label>
          <input type="text" value="11.5%" disabled class="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-2">就業保險費率</label>
          <input type="text" value="1.0%" disabled class="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-2">職災保險費率</label>
          <input type="text" value="0.21%" class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-2">雇主負擔比例</label>
          <input type="text" value="70%" disabled class="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-2">員工負擔比例</label>
          <input type="text" value="20%" disabled class="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-2">投保薪資上限</label>
          <input type="text" value="$45,800" class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400" />
        </div>
      </div>
    </div>

    <div class="bg-white p-6 rounded-xl shadow-md">
      <h3 class="text-lg font-semibold text-primary-700 mb-5">健保費率設定</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-2">健保費率</label>
          <input type="text" value="5.17%" disabled class="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-2">雇主負擔比例</label>
          <input type="text" value="60%" disabled class="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-2">投保金額上限</label>
          <input type="text" value="$219,500" class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400" />
        </div>
      </div>
      <div class="text-right">
        <button @click="emit('toast', '設定已儲存')" class="px-6 py-2.5 bg-success text-white rounded-lg hover:bg-green-700">
          儲存設定
        </button>
      </div>
    </div>
  </template>

  <!-- 所得稅設定 -->
  <template v-if="activeTab === 'tax'">
    <div class="bg-white p-6 rounded-xl shadow-md">
      <h3 class="text-lg font-semibold text-primary-700 mb-5">所得稅扣繳設定</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-2">免稅額（單身）</label>
          <input type="text" value="$92,000" class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-2">免稅額（有配偶）</label>
          <input type="text" value="$184,000" class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400" />
        </div>
      </div>

      <div class="mb-5">
        <label class="block text-sm font-medium text-gray-600 mb-3">扣繳稅率表</label>
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">月薪級距</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">扣繳率</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in taxRates" :key="row.range" class="border-t border-gray-100">
              <td class="px-4 py-3 text-sm">{{ row.range }}</td>
              <td class="px-4 py-3 text-sm font-medium">{{ row.rate }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="text-right">
        <button @click="emit('toast', '設定已儲存')" class="px-6 py-2.5 bg-success text-white rounded-lg hover:bg-green-700">
          儲存設定
        </button>
      </div>
    </div>
  </template>

</template>
