<script setup>
import { ref } from 'vue'

const emit = defineEmits(['toast'])
const activeTab = ref('list')

const employees = [
  { id: 'A001', name: '王大明', dept: '研發部', title: '資深工程師', date: '2020/03/15', status: '在職' },
  { id: 'A002', name: '李小華', dept: '業務部', title: '業務經理', date: '2019/08/01', status: '離職' },
  { id: 'A003', name: '張美玲', dept: '人事部', title: '人事專員', date: '2021/06/20', status: '在職' },
  { id: 'A004', name: '陳志豪', dept: '研發部', title: '工程師', date: '2022/01/10', status: '在職' },
  { id: 'A005', name: '林佳穎', dept: '財務部', title: '會計', date: '2023/04/05', status: '在職' },
  { id: 'A006', name: '張大明', dept: '研發部', title: '工程師', date: '2025/02/01', status: '試用期' },
]

const changes = [
  { name: '張大明', type: '新進到職', desc: '2025/02/01 | 研發部 工程師 | 月薪 $55,000', badge: '到職', color: 'bg-success' },
  { name: '李小華', type: '離職結算', desc: '2025/01/31 | 業務部 業務經理 | 年資 5年5月', badge: '離職', color: 'bg-danger' },
  { name: '王大明', type: '調薪', desc: '2025/01/01 | $72,000 → $78,000 | 調幅 8.3%', badge: '調薪', color: 'bg-success' },
  { name: '陳志豪', type: '晉升', desc: '2025/01/01 | 工程師 → 資深工程師', badge: '晉升', color: 'bg-success' },
]

const newTasks = [
  { name: '張大明', task: '投保作業', desc: '到職日：2025/02/01 | 勞保、健保加保' },
  { name: '張大明', task: '銀行帳號設定', desc: '薪轉帳號待設定' },
]

function getStatusClass(status) {
  const classes = {
    '在職': 'bg-green-100 text-green-700',
    '離職': 'bg-red-100 text-red-700',
    '試用期': 'bg-amber-100 text-amber-700',
  }
  return classes[status] || 'bg-gray-100 text-gray-600'
}
</script>

<template>
  <!-- Tabs -->
  <div class="flex gap-1 mb-6 border-b-2 border-gray-200">
    <button
      v-for="tab in [{ id: 'list', label: '員工清單' }, { id: 'change', label: '異動紀錄' }, { id: 'new', label: '新進作業' }]"
      :key="tab.id"
      @click="activeTab = tab.id"
      class="px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-0.5"
      :class="activeTab === tab.id ? 'text-primary-400 border-primary-400' : 'text-gray-500 border-transparent hover:text-primary-700'"
    >
      {{ tab.label }}
    </button>
  </div>

  <!-- 員工清單 -->
  <template v-if="activeTab === 'list'">
    <div class="flex gap-4 mb-5">
      <input
        type="text"
        placeholder="搜尋員工姓名、工號..."
        class="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400"
      />
      <button @click="emit('toast', '功能展示中')" class="px-5 py-2.5 bg-success text-white rounded-lg hover:bg-green-700 transition-colors">
        + 新增員工
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">工號</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">姓名</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">部門</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">職稱</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">到職日</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">狀態</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="emp in employees" :key="emp.id" class="border-t border-gray-100 hover:bg-gray-50">
            <td class="px-4 py-3 text-sm">{{ emp.id }}</td>
            <td class="px-4 py-3 text-sm font-medium">{{ emp.name }}</td>
            <td class="px-4 py-3 text-sm">{{ emp.dept }}</td>
            <td class="px-4 py-3 text-sm">{{ emp.title }}</td>
            <td class="px-4 py-3 text-sm">{{ emp.date }}</td>
            <td class="px-4 py-3">
              <span class="px-3 py-1 rounded-full text-xs font-medium" :class="getStatusClass(emp.status)">
                {{ emp.status }}
              </span>
            </td>
            <td class="px-4 py-3">
              <button @click="emit('toast', '功能展示中')" class="px-3 py-1.5 bg-primary-100 text-primary-600 rounded-md text-sm hover:bg-primary-200">
                編輯
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>

  <!-- 異動紀錄 -->
  <template v-if="activeTab === 'change'">
    <div class="bg-white p-6 rounded-xl shadow-md">
      <h3 class="text-lg font-semibold text-primary-700 mb-5">異動紀錄</h3>
      <div
        v-for="item in changes"
        :key="item.name + item.type"
        class="flex justify-between items-center p-4 border border-gray-100 rounded-lg mb-3"
      >
        <div>
          <h4 class="font-medium text-primary-700 mb-1">{{ item.name }} - {{ item.type }}</h4>
          <p class="text-sm text-gray-500">{{ item.desc }}</p>
        </div>
        <span class="px-3 py-1 rounded-full text-xs text-white" :class="item.color">
          {{ item.badge }}
        </span>
      </div>
    </div>
  </template>

  <!-- 新進作業 -->
  <template v-if="activeTab === 'new'">
    <div class="bg-white p-6 rounded-xl shadow-md">
      <h3 class="text-lg font-semibold text-primary-700 mb-5">待完成新進作業</h3>
      <div
        v-for="task in newTasks"
        :key="task.task"
        class="flex justify-between items-center p-4 border border-gray-100 rounded-lg mb-3"
      >
        <div>
          <h4 class="font-medium text-primary-700 mb-1">{{ task.name }} - {{ task.task }}</h4>
          <p class="text-sm text-gray-500">{{ task.desc }}</p>
        </div>
        <button @click="emit('toast', '作業已完成')" class="px-4 py-2 bg-success text-white rounded-md text-sm hover:bg-green-700">
          完成
        </button>
      </div>
    </div>
  </template>
</template>
