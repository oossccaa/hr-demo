<script setup>
import { ref, reactive, computed } from 'vue'

const emit = defineEmits(['toast'])
const activeTab = ref('list')

const employees = reactive([
  {
    id: 'A001', name: '王大明', dept: '研發部', title: '資深工程師', date: '2020/03/15', status: '在職',
    idNumber: 'A123456789', birthday: '1985/05/20', phone: '0912-345-678', deptType: '內勤',
    baseSalary: 78000, mealAllowance: 1800, transportAllowance: 2000, positionAllowance: 5000,
    healthInsuranceTier: 80100, laborInsuranceTier: 80100, groupInsurance: '有',
    bankBranchCode: '012345', bankAccount: '00123456789', accountHolder: '王大明',
  },
  {
    id: 'A002', name: '李小華', dept: '業務部', title: '業務經理', date: '2019/08/01', status: '離職',
    idNumber: 'B234567890', birthday: '1980/11/08', phone: '0923-456-789', deptType: '外勤',
    baseSalary: 0, mealAllowance: 0, transportAllowance: 0, positionAllowance: 0,
    healthInsuranceTier: 0, laborInsuranceTier: 0, groupInsurance: '無',
    bankBranchCode: '023456', bankAccount: '00234567890', accountHolder: '李小華',
  },
  {
    id: 'A003', name: '張美玲', dept: '人事部', title: '人事專員', date: '2021/06/20', status: '在職',
    idNumber: 'C345678901', birthday: '1990/03/15', phone: '0934-567-890', deptType: '內勤',
    baseSalary: 52000, mealAllowance: 1800, transportAllowance: 1500, positionAllowance: 2000,
    healthInsuranceTier: 53700, laborInsuranceTier: 53700, groupInsurance: '有',
    bankBranchCode: '034567', bankAccount: '00345678901', accountHolder: '張美玲',
  },
  {
    id: 'A004', name: '陳志豪', dept: '研發部', title: '工程師', date: '2022/01/10', status: '在職',
    idNumber: 'D456789012', birthday: '1995/07/22', phone: '0945-678-901', deptType: '內勤',
    baseSalary: 62000, mealAllowance: 1800, transportAllowance: 1500, positionAllowance: 3000,
    healthInsuranceTier: 66800, laborInsuranceTier: 66800, groupInsurance: '有',
    bankBranchCode: '045678', bankAccount: '00456789012', accountHolder: '陳志豪',
  },
  {
    id: 'A005', name: '林佳穎', dept: '財務部', title: '會計', date: '2023/04/05', status: '在職',
    idNumber: 'E567890123', birthday: '1992/09/30', phone: '0956-789-012', deptType: '內勤',
    baseSalary: 48000, mealAllowance: 1800, transportAllowance: 1200, positionAllowance: 0,
    healthInsuranceTier: 50600, laborInsuranceTier: 50600, groupInsurance: '有',
    bankBranchCode: '056789', bankAccount: '00567890123', accountHolder: '林佳穎',
  },
  {
    id: 'A006', name: '張大明', dept: '研發部', title: '工程師', date: '2025/02/01', status: '試用期',
    idNumber: 'F678901234', birthday: '1999/02/14', phone: '0967-890-123', deptType: '外勤',
    baseSalary: 55000, mealAllowance: 1800, transportAllowance: 1500, positionAllowance: 0,
    healthInsuranceTier: 55400, laborInsuranceTier: 55400, groupInsurance: '有',
    bankBranchCode: '067890', bankAccount: '00678901234', accountHolder: '張大明',
  },
])

const changes = [
  { name: '張大明', type: '新進到職', desc: '2025/02/01 | 研發部 工程師 | 月薪 $55,000', badge: '到職', color: 'bg-success' },
  { name: '李小華', type: '離職結算', desc: '2025/01/31 | 業務部 業務經理 | 年資 5年5月', badge: '離職', color: 'bg-danger' },
  { name: '王大明', type: '調薪', desc: '2025/01/01 | $72,000 → $78,000 | 調幅 8.3%', badge: '調薪', color: 'bg-success' },
  { name: '陳志豪', type: '晉升', desc: '2025/01/01 | 工程師 → 資深工程師', badge: '晉升', color: 'bg-success' },
]

// Edit / Add modal state
const showEditModal = ref(false)
const editModalTab = ref('basic')
const editingEmployee = ref(null)
const editingIndex = ref(-1)
const isNewEmployee = ref(false)

function openEditModal(emp, idx) {
  editingEmployee.value = { ...emp }
  editingIndex.value = idx
  editModalTab.value = 'basic'
  isNewEmployee.value = false
  showEditModal.value = true
}

function openAddModal() {
  const nextId = 'A' + String(employees.length + 1).padStart(3, '0')
  editingEmployee.value = {
    id: nextId, name: '', dept: '', title: '', date: '', status: '在職',
    idNumber: '', birthday: '', phone: '', deptType: '內勤',
    baseSalary: 0, mealAllowance: 1800, transportAllowance: 0, positionAllowance: 0,
    healthInsuranceTier: 0, laborInsuranceTier: 0, groupInsurance: '有',
    bankBranchCode: '', bankAccount: '', accountHolder: '',
  }
  editingIndex.value = -1
  editModalTab.value = 'basic'
  isNewEmployee.value = true
  showEditModal.value = true
}

function saveEmployee() {
  if (isNewEmployee.value) {
    employees.push({ ...editingEmployee.value })
    emit('toast', '員工已新增')
  } else {
    Object.assign(employees[editingIndex.value], editingEmployee.value)
    emit('toast', '員工資料已儲存')
  }
  showEditModal.value = false
  isNewEmployee.value = false
}

function closeEditModal() {
  showEditModal.value = false
  editingEmployee.value = null
  isNewEmployee.value = false
}

function getStatusClass(status) {
  const classes = {
    '在職': 'bg-green-100 text-green-700',
    '離職': 'bg-red-100 text-red-700',
    '試用期': 'bg-amber-100 text-amber-700',
  }
  return classes[status] || 'bg-gray-100 text-gray-600'
}

// ===================== 複合搜尋 =====================
const searchText = ref('')
const filterDept = ref('')
const filterTitle = ref('')
const filterStatus = ref('')
const filterDeptType = ref('')

const uniqueDepts = computed(() => [...new Set(employees.map(e => e.dept))])
const uniqueTitles = computed(() => [...new Set(employees.map(e => e.title))])

const filteredEmployees = computed(() => {
  const q = searchText.value.toLowerCase()
  return employees.filter(emp => {
    const matchText = !q || emp.id.toLowerCase().includes(q) || emp.name.includes(searchText.value)
    const matchDept = !filterDept.value || emp.dept === filterDept.value
    const matchTitle = !filterTitle.value || emp.title === filterTitle.value
    const matchStatus = !filterStatus.value || emp.status === filterStatus.value
    const matchDeptType = !filterDeptType.value || emp.deptType === filterDeptType.value
    return matchText && matchDept && matchTitle && matchStatus && matchDeptType
  })
})

function clearFilters() {
  searchText.value = ''
  filterDept.value = ''
  filterTitle.value = ''
  filterStatus.value = ''
  filterDeptType.value = ''
}
</script>

<template>
  <!-- Tabs -->
  <div class="flex gap-1 mb-6 border-b-2 border-gray-200">
    <button
      v-for="tab in [{ id: 'list', label: '員工清單' }, { id: 'change', label: '異動紀錄' }]"
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
    <div class="mb-5 space-y-3">
      <!-- 模糊搜尋（工號 / 姓名）+ 新增按鈕 -->
      <div class="flex gap-3">
        <input
          v-model="searchText"
          type="text"
          placeholder="搜尋工號或姓名…"
          class="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400"
        />
        <button @click="openAddModal" class="px-5 py-2.5 bg-success text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap">
          + 新增員工
        </button>
      </div>
      <!-- 下拉篩選列 -->
      <div class="flex flex-wrap gap-3 items-center">
        <select v-model="filterDept" class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400">
          <option value="">部門（全部）</option>
          <option v-for="d in uniqueDepts" :key="d" :value="d">{{ d }}</option>
        </select>
        <select v-model="filterTitle" class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400">
          <option value="">職稱（全部）</option>
          <option v-for="t in uniqueTitles" :key="t" :value="t">{{ t }}</option>
        </select>
        <select v-model="filterStatus" class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400">
          <option value="">狀態（全部）</option>
          <option>在職</option>
          <option>離職</option>
          <option>試用期</option>
        </select>
        <select v-model="filterDeptType" class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400">
          <option value="">類別（全部）</option>
          <option>內勤</option>
          <option>外勤</option>
        </select>
        <button
          v-if="searchText || filterDept || filterTitle || filterStatus || filterDeptType"
          @click="clearFilters"
          class="px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          清除篩選
        </button>
        <span v-if="filteredEmployees.length !== employees.length" class="text-sm text-gray-400">
          顯示 {{ filteredEmployees.length }} / {{ employees.length }} 筆
        </span>
      </div>
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
          <tr v-for="(emp, index) in filteredEmployees" :key="emp.id" class="border-t border-gray-100 hover:bg-gray-50">
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
              <button @click="openEditModal(emp, employees.findIndex(e => e.id === emp.id))" class="px-3 py-1.5 bg-primary-100 text-primary-600 rounded-md text-sm hover:bg-primary-200">
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

  <!-- 編輯/新增員工 Modal -->
  <div v-if="showEditModal && editingEmployee" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">

      <!-- Modal Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-primary-700">{{ isNewEmployee ? '新增員工' : '編輯員工資料 — ' + editingEmployee.name }}</h2>
        <button @click="closeEditModal" class="text-gray-400 hover:text-gray-600 text-2xl leading-none w-8 h-8 flex items-center justify-center">&times;</button>
      </div>

      <!-- Modal Tabs -->
      <div class="flex gap-1 px-6 pt-4 border-b border-gray-200">
        <button
          v-for="tab in [{ id: 'basic', label: '基本資料' }, { id: 'salary', label: '薪資資料' }, { id: 'insurance', label: '保險資料' }]"
          :key="tab.id"
          @click="editModalTab = tab.id"
          class="px-5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-0.5"
          :class="editModalTab === tab.id ? 'text-primary-400 border-primary-400' : 'text-gray-500 border-transparent hover:text-primary-700'"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Modal Body -->
      <div class="flex-1 overflow-y-auto p-6">

        <!-- Tab 1: 基本資料 -->
        <div v-if="editModalTab === 'basic'" class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-600">姓名</label>
            <input v-model="editingEmployee.name" type="text" class="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-600">身分證字號</label>
            <input v-model="editingEmployee.idNumber" type="text" class="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-600">到職日</label>
            <input v-model="editingEmployee.date" type="text" placeholder="YYYY/MM/DD" class="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-600">生日</label>
            <input v-model="editingEmployee.birthday" type="text" placeholder="YYYY/MM/DD" class="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-600">聯絡電話</label>
            <input v-model="editingEmployee.phone" type="text" class="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-600">部門別</label>
            <select v-model="editingEmployee.deptType" class="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400">
              <option>內勤</option>
              <option>外勤</option>
            </select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-600">職稱</label>
            <input v-model="editingEmployee.title" type="text" class="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-600">在職狀態</label>
            <select v-model="editingEmployee.status" class="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400">
              <option>在職</option>
              <option>離職</option>
              <option>試用期</option>
            </select>
          </div>
        </div>

        <!-- Tab 2: 薪資資料 -->
        <div v-if="editModalTab === 'salary'" class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-600">月薪（底薪）</label>
            <input v-model.number="editingEmployee.baseSalary" type="number" min="0" class="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-600">伙食津貼 <span class="text-xs text-warning font-normal">（上限 $1,800）</span></label>
            <input v-model.number="editingEmployee.mealAllowance" type="number" min="0" max="1800" class="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-600">交通津貼</label>
            <input v-model.number="editingEmployee.transportAllowance" type="number" min="0" class="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-600">職務津貼</label>
            <input v-model.number="editingEmployee.positionAllowance" type="number" min="0" class="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400" />
          </div>
          <div class="col-span-2 p-3 bg-primary-50 rounded-lg text-sm text-primary-700">
            月薪合計：{{ (editingEmployee.baseSalary + editingEmployee.mealAllowance + editingEmployee.transportAllowance + editingEmployee.positionAllowance).toLocaleString() }} 元
          </div>
        </div>

        <!-- Tab 3: 保險資料 -->
        <div v-if="editModalTab === 'insurance'" class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-600">健保投保級距</label>
            <input v-model.number="editingEmployee.healthInsuranceTier" type="number" min="0" class="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-600">勞保投保級距</label>
            <input v-model.number="editingEmployee.laborInsuranceTier" type="number" min="0" class="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-600">團保</label>
            <select v-model="editingEmployee.groupInsurance" class="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400">
              <option>有</option>
              <option>無</option>
            </select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-600">銀行轉帳局號</label>
            <input v-model="editingEmployee.bankBranchCode" type="text" class="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-600">銀行帳號</label>
            <input v-model="editingEmployee.bankAccount" type="text" class="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-600">戶名</label>
            <input v-model="editingEmployee.accountHolder" type="text" class="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400" />
          </div>
        </div>

      </div>

      <!-- Modal Footer -->
      <div class="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
        <button @click="closeEditModal" class="px-5 py-2.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
          取消
        </button>
        <button @click="saveEmployee" class="px-5 py-2.5 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-colors">
          儲存
        </button>
      </div>

    </div>
  </div>
</template>
