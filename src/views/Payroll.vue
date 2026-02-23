<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const emit = defineEmits(['toast'])
const activeTab = ref('calc')

const stats = [
  { title: '本月應發薪資', value: '$2,845,000', change: '70 位員工', icon: '💵', color: 'from-success to-green-700' },
  { title: '代扣款項合計', value: '$425,000', change: '勞健保+所得稅', icon: '📝', color: 'from-warning to-danger' },
  { title: '實發金額', value: '$2,420,000', change: '預計 02/05 發放', icon: '💰', color: 'from-primary-400 to-primary-500' },
]

const payrollData = [
  { id: 'A001', name: '王大明', dept: '研發部', base: 78000, days: 25, bonus: 5000, overtime: 5200, other: 10000, deduct: 12500 },
  { id: 'A003', name: '張美玲', dept: '人事部', base: 52000, days: 23, bonus: 2000, overtime: 0, other: 3000, deduct: 7800 },
  { id: 'A004', name: '陳志豪', dept: '研發部', base: 62000, days: 22, bonus: 2000, overtime: 8500, other: 10000, deduct: 10200 },
  { id: 'A005', name: '林佳穎', dept: '財務部', base: 48000, days: 20, bonus: 0, overtime: 2000, other: 0, deduct: 6500 },
  { id: 'A006', name: '張大明', dept: '研發部', base: 55000, days: 22, bonus: 2000, overtime: 0, other: 0, deduct: 7200 },
]

const attendanceRules = [
  { days: 22, amount: 2000 },
  { days: 25, amount: 5000 },
]

const history = [
  { month: '2025/02', count: 70, total: '$2,420,000', date: '-', status: '待審核' },
  { month: '2025/01', count: 68, total: '$2,350,000', date: '2025/01/05', status: '已發放' },
  { month: '2024/12', count: 68, total: '$3,890,000', date: '2024/12/05', status: '已發放' },
]

function getAttendanceBonus(days) {
  if (days >= 25) return 5000
  if (days >= 22) return 2000
  return 0
}

function getTotal(row) {
  return row.base + row.bonus + row.overtime + row.other - row.deduct
}

function formatMoney(num) {
  return '$' + num.toLocaleString()
}

// ===================== 新增薪資單 =====================
const employeeList = [
  { id: 'A001', name: '王大明', dept: '研發部', deptType: '內勤', baseSalary: 78000, mealAllowance: 1800, transportAllowance: 2000, positionAllowance: 5000, laborInsuranceFee: 1134, healthInsuranceFee: 826, groupInsuranceFee: 120 },
  { id: 'A003', name: '張美玲', dept: '人事部', deptType: '內勤', baseSalary: 52000, mealAllowance: 1800, transportAllowance: 1500, positionAllowance: 2000, laborInsuranceFee: 756, healthInsuranceFee: 551, groupInsuranceFee: 120 },
  { id: 'A004', name: '陳志豪', dept: '研發部', deptType: '內勤', baseSalary: 62000, mealAllowance: 1800, transportAllowance: 1500, positionAllowance: 3000, laborInsuranceFee: 918, healthInsuranceFee: 688, groupInsuranceFee: 120 },
  { id: 'A005', name: '林佳穎', dept: '財務部', deptType: '內勤', baseSalary: 48000, mealAllowance: 1800, transportAllowance: 1200, positionAllowance: 0, laborInsuranceFee: 702, healthInsuranceFee: 520, groupInsuranceFee: 120 },
  { id: 'A006', name: '張大明', dept: '研發部', deptType: '外勤', baseSalary: 55000, mealAllowance: 1800, transportAllowance: 1500, positionAllowance: 0, laborInsuranceFee: 810, healthInsuranceFee: 597, groupInsuranceFee: 120 },
]

const newPayroll_selectedEmpId = ref('')
const newPayroll_selectedMonth = ref({ month: 1, year: 2025 })
const newPayroll_monthDisplay = computed(() => {
  const m = newPayroll_selectedMonth.value
  if (!m || m.month === undefined) return ''
  return `${m.year}/${String(m.month + 1).padStart(2, '0')}`
})

const newPayroll_emp = computed(() =>
  employeeList.find(e => e.id === newPayroll_selectedEmpId.value) || null
)

const section1Open = ref(true)
const section2Open = ref(true)
const section3Open = ref(true)

// 薪資計算 tab 月份選擇
const calcMonth = ref({ month: 1, year: 2025 })
const calcMonthDisplay = computed(() => {
  const m = calcMonth.value
  if (!m || m.month === undefined) return ''
  return `${m.year}年${m.month + 1}月`
})

const showNewPayrollModal = ref(false)

const additions = reactive({
  baseSalary: 0,
  dayShiftDays: 0, dayShiftRate: 0,
  nightShiftDays: 0, nightShiftRate: 0,
  driverDays: 0, driverRate: 0,
  foremanDays: 0, foremanRate: 0,
  liveWireCount: 0, liveWireRate: 0,
  efficiencyBonus: 0, responsibilityBonus: 0, serviceBonus: 0, cooperationBonus: 0,
  overtimeHours: 0, overtimeRate: 0,
  weekdayOvertime: 0, holidayOvertime: 0,
  positionAllowance: 0, mealAllowance: 0, transportAllowance: 0,
  safetyBonus: 0, licenseBonus: 0, qualityBonus: 0, companyBonus: 0, nightSnack: 0,
  fullAttendanceDays: 0, fullAttendanceBonus: 0,
  loanAdvance: 0, toolAdvance: 0,
})

const deductions = reactive({
  laborInsuranceFee: 0, healthInsuranceFee: 0, groupInsuranceFee: 0,
  incomeTax: 0, safetyDeduct: 0, burnDeduct: 0, qualityDeduct: 0,
  vehicleDeduct: 0, toolDeduct: 0, loanDeduct: 0,
  waterElecFee: 0, familyFee: 0, pettyCash: 0, leaveDeduct: 0, agencyFee: 0,
})

const additionSubtotal = computed(() => {
  return additions.baseSalary
    + additions.dayShiftDays * additions.dayShiftRate
    + additions.nightShiftDays * additions.nightShiftRate
    + additions.driverDays * additions.driverRate
    + additions.foremanDays * additions.foremanRate
    + additions.liveWireCount * additions.liveWireRate
    + additions.efficiencyBonus + additions.responsibilityBonus
    + additions.serviceBonus + additions.cooperationBonus
    + additions.overtimeHours * additions.overtimeRate
    + additions.weekdayOvertime + additions.holidayOvertime
    + additions.positionAllowance + additions.mealAllowance + additions.transportAllowance
    + additions.safetyBonus + additions.licenseBonus + additions.qualityBonus
    + additions.companyBonus + additions.nightSnack
    + (additions.fullAttendanceDays >= 22 ? additions.fullAttendanceBonus : 0)
    + additions.loanAdvance + additions.toolAdvance
})

const deductionSubtotal = computed(() =>
  Object.values(deductions).reduce((sum, v) => sum + (Number(v) || 0), 0)
)

const netPay = computed(() => additionSubtotal.value - deductionSubtotal.value)

watch(newPayroll_emp, (emp) => {
  if (!emp) return
  additions.baseSalary = emp.baseSalary
  additions.mealAllowance = emp.mealAllowance
  additions.transportAllowance = emp.transportAllowance
  additions.positionAllowance = emp.positionAllowance
  deductions.laborInsuranceFee = emp.laborInsuranceFee
  deductions.healthInsuranceFee = emp.healthInsuranceFee
  deductions.groupInsuranceFee = emp.groupInsuranceFee
})

function saveNewPayroll() {
  if (!newPayroll_emp.value) {
    emit('toast', '請先選擇員工')
    return
  }
  emit('toast', `已儲存 ${newPayroll_emp.value.name} ${newPayroll_monthDisplay.value} 薪資單`)
  showNewPayrollModal.value = false
}

// ===================== 考勤管理 =====================
const attendance_month = ref({ month: 1, year: 2025 })
const attendance_monthDisplay = computed(() => {
  const m = attendance_month.value
  if (!m || m.month === undefined) return ''
  return `${m.year}/${String(m.month + 1).padStart(2, '0')}`
})

const attendanceData = reactive(
  employeeList.map(emp => ({
    id: emp.id, name: emp.name, dept: emp.dept,
    required: 22, dayShift: 20, nightShift: 0, actual: 20, holiday: 2,
    tpcClass: 0, personalLeave: 0, absent: 0, unreported: 0,
    paternityLeave: 0, training: 0, companyTrip: 0, typhoonLeave: 0,
  }))
)

const attendanceFieldLabels = {
  required: '應出勤天數',
  dayShift: '日班天數',
  nightShift: '夜班天數',
  actual: '實出勤天數',
  holiday: '假日休假',
  tpcClass: '台電上課',
  personalLeave: '事假',
  absent: '未出勤（曠）',
  unreported: '未請',
  paternityLeave: '陪產假',
  training: '上課',
  companyTrip: '員工旅遊',
  typhoonLeave: '颱風假',
}

function getAttendanceTotal(row) {
  return row.dayShift + row.nightShift + row.holiday
    + row.tpcClass + row.personalLeave + row.absent
    + row.unreported + row.paternityLeave + row.training
    + row.companyTrip + row.typhoonLeave
}

const showAttendancePrint = ref(false)
const printingEmployee = ref(null)

function printAttendance(row) {
  printingEmployee.value = row
  showAttendancePrint.value = true
}

function triggerPrint() {
  window.print()
}

// ===================== 變動津貼 Modal =====================
const showBonusModal = ref(false)
const bonusModalTitle = ref('')
const bonusModalEmps = reactive([])

function openBonusModal(title) {
  bonusModalTitle.value = title
  bonusModalEmps.splice(0, bonusModalEmps.length,
    ...employeeList.map(emp => ({ ...emp, bonusAmount: 0 }))
  )
  showBonusModal.value = true
}

function saveBonusModal() {
  showBonusModal.value = false
  emit('toast', bonusModalTitle.value + ' 已儲存')
}

// ===================== 發放紀錄 Modal =====================
const showHistoryModal = ref(false)
const selectedHistory = ref(null)

const historyDetails = {
  '2025/01': [
    { id: 'A001', name: '王大明', dept: '研發部', base: 78000, allowance: 8800, bonus: 5000, overtime: 5200, deduct: 12500, net: 84500 },
    { id: 'A003', name: '張美玲', dept: '人事部', base: 52000, allowance: 5300, bonus: 3000, overtime: 0, deduct: 7800, net: 52500 },
    { id: 'A004', name: '陳志豪', dept: '研發部', base: 62000, allowance: 6300, bonus: 2000, overtime: 8500, deduct: 10200, net: 68600 },
    { id: 'A005', name: '林佳穎', dept: '財務部', base: 48000, allowance: 3000, bonus: 0, overtime: 2000, deduct: 6500, net: 46500 },
    { id: 'A006', name: '張大明', dept: '研發部', base: 55000, allowance: 3300, bonus: 2000, overtime: 0, deduct: 7200, net: 53100 },
  ],
  '2024/12': [
    { id: 'A001', name: '王大明', dept: '研發部', base: 78000, allowance: 8800, bonus: 12000, overtime: 8500, deduct: 12500, net: 94800 },
    { id: 'A003', name: '張美玲', dept: '人事部', base: 52000, allowance: 5300, bonus: 8000, overtime: 0, deduct: 7800, net: 57500 },
    { id: 'A004', name: '陳志豪', dept: '研發部', base: 62000, allowance: 6300, bonus: 8000, overtime: 12000, deduct: 10200, net: 78100 },
    { id: 'A005', name: '林佳穎', dept: '財務部', base: 48000, allowance: 3000, bonus: 5000, overtime: 0, deduct: 6500, net: 49500 },
    { id: 'A006', name: '張大明', dept: '研發部', base: 55000, allowance: 3300, bonus: 5000, overtime: 0, deduct: 7200, net: 56100 },
  ],
}

function openHistoryModal(row) {
  selectedHistory.value = row
  showHistoryModal.value = true
}
</script>

<template>
  <!-- Tabs -->
  <div class="flex flex-wrap gap-1 mb-6 border-b-2 border-gray-200">
    <button
      v-for="tab in [
        { id: 'calc', label: '薪資計算' },
        { id: 'attendance', label: '出勤津貼' },
        { id: 'var', label: '變動津貼' },
        { id: 'history', label: '發放紀錄' },
        { id: 'attendanceMgmt', label: '考勤管理' },
      ]"
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
      <div v-for="stat in stats" :key="stat.title" class="bg-white p-6 rounded-xl shadow-md">
        <div class="flex justify-between items-start mb-4">
          <span class="text-sm text-gray-500 font-medium">{{ stat.title }}</span>
          <div class="w-11 h-11 rounded-lg flex items-center justify-center text-white text-xl bg-gradient-to-br" :class="stat.color">
            {{ stat.icon }}
          </div>
        </div>
        <div class="text-3xl font-bold text-primary-700 mb-2">{{ stat.value }}</div>
        <div class="text-sm text-success">{{ stat.change }}</div>
      </div>
    </div>

    <div class="bg-white p-6 rounded-xl shadow-md">
      <div class="flex items-center justify-between mb-5">
        <div class="flex items-center gap-3">
          <h3 class="text-lg font-semibold text-primary-700">{{ calcMonthDisplay }} 薪資明細</h3>
          <VueDatePicker v-model="calcMonth" month-picker :enable-time-picker="false" auto-apply style="width:160px" />
        </div>
        <button
          @click="showNewPayrollModal = true"
          class="px-5 py-2.5 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-colors text-sm font-medium"
        >
          + 新增薪資表
        </button>
      </div>
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
                <span class="px-2 py-1 rounded-full text-xs font-medium" :class="row.days >= 22 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'">
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
        22天 → +$2,000 ｜ 25天以上 → +$5,000
      </div>
      <div class="mt-5 flex justify-end gap-3">
        <button @click="emit('toast', '已匯出薪資明細')" class="px-5 py-2.5 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200">匯出 Excel</button>
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
      <div class="mb-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-l-4 border-success">
        <strong class="text-green-700 block mb-3">本月出勤津貼級距</strong>
        <div class="flex flex-wrap gap-6">
          <div v-for="rule in attendanceRules" :key="rule.days" class="flex items-center gap-2 min-w-0">
            <span class="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700">{{ rule.days }}天</span>
            <span class="text-gray-400">→</span>
            <span class="font-bold text-green-600">+{{ formatMoney(rule.amount) }}</span>
          </div>
        </div>
      </div>
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
            <td class="px-4 py-3"><span class="font-bold text-lg">{{ row.days }}天</span></td>
            <td class="px-4 py-3 text-lg font-bold" :class="row.bonus > 0 ? 'text-green-600' : 'text-gray-400'">
              {{ row.bonus > 0 ? '+' + formatMoney(row.bonus) : '$0' }}
            </td>
            <td class="px-4 py-3">
              <span class="px-3 py-1 rounded-full text-xs font-medium" :class="row.days >= 22 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'">
                {{ row.days >= 22 ? '已計算' : '未達標' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="mt-5 flex justify-between items-center">
        <div class="text-gray-600">
          本月出勤津貼總額：<span class="text-2xl font-bold text-green-600">$11,000</span>
          <span class="text-sm text-gray-500 ml-2">（4人符合）</span>
        </div>
        <button @click="activeTab = 'attendanceMgmt'" class="px-5 py-2.5 bg-success text-white rounded-lg hover:bg-green-700">編輯出勤天數</button>
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
          <button @click="openBonusModal('研發部 - 專案獎金')" class="px-4 py-2 bg-success text-white rounded-md text-sm hover:bg-green-700">輸入</button>
        </div>
        <div class="flex justify-between items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
          <div>
            <h4 class="font-medium text-primary-700 mb-1">業務部 - 業績獎金</h4>
            <p class="text-sm text-gray-500">5 位員工 | 待輸入</p>
          </div>
          <button @click="openBonusModal('業務部 - 業績獎金')" class="px-4 py-2 bg-success text-white rounded-md text-sm hover:bg-green-700">輸入</button>
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
              <span class="px-3 py-1 rounded-full text-xs font-medium" :class="row.status === '已發放' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'">
                {{ row.status }}
              </span>
            </td>
            <td class="px-4 py-3">
              <button @click="openHistoryModal(row)" class="px-3 py-1.5 bg-primary-100 text-primary-600 rounded-md text-sm hover:bg-primary-200">查看</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>

  <!-- 新增薪資表 Modal（橫式大版面） -->
  <div v-if="showNewPayrollModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-[1400px] max-h-[94vh] flex flex-col">

      <!-- Header：標題 + 員工/月份選擇 -->
      <div class="flex items-center gap-4 px-5 py-3 border-b border-gray-200 shrink-0 bg-gradient-to-r from-primary-50 to-white">
        <h2 class="text-lg font-bold text-primary-700 shrink-0">新增薪資表</h2>
        <select v-model="newPayroll_selectedEmpId" class="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400 min-w-[160px]">
          <option value="">— 選取員工 —</option>
          <option v-for="emp in employeeList" :key="emp.id" :value="emp.id">{{ emp.id }} {{ emp.name }}</option>
        </select>
        <VueDatePicker v-model="newPayroll_selectedMonth" month-picker :enable-time-picker="false" auto-apply style="width:150px" />
        <div v-if="newPayroll_emp" class="flex items-center gap-2 min-w-0">
          <span class="text-sm text-gray-600 font-medium">{{ newPayroll_emp.dept }}</span>
          <span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="newPayroll_emp.deptType === '外勤' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'">
            {{ newPayroll_emp.deptType }}
          </span>
        </div>
        <button @click="showNewPayrollModal = false" class="ml-auto text-gray-400 hover:text-gray-600 text-2xl leading-none w-8 h-8 flex items-center justify-center shrink-0">&times;</button>
      </div>

      <!-- Body：左加項 ＋ 右扣項/結果 -->
      <div class="flex-1 overflow-y-auto p-4">
        <div class="grid grid-cols-3 gap-4">

          <!-- ===== 左側：加項（佔 2 欄）===== -->
          <div class="col-span-2 space-y-3">

            <!-- 工資項目 -->
            <div class="border border-gray-200 rounded-xl overflow-hidden">
              <div class="px-4 py-1.5 bg-primary-50 border-b border-gray-200 flex items-center justify-between">
                <span class="text-sm font-semibold text-primary-700">工資項目</span>
              </div>
              <div class="p-4 space-y-3">
                <!-- 底薪 -->
                <div class="flex items-center gap-3">
                  <label class="text-xs font-medium text-gray-500 w-16 shrink-0">底薪</label>
                  <input v-model.number="additions.baseSalary" type="number" min="0"
                    class="px-2 py-1.5 border border-gray-200 rounded w-32 text-sm focus:outline-none focus:border-primary-400" />
                  <span class="text-xs text-gray-400">自動帶入</span>
                </div>
                <!-- 外勤工資 列1 -->
                <div class="grid grid-cols-3 gap-3">
                  <div class="flex items-center gap-1.5 border border-gray-200 rounded-lg px-2 py-1.5 min-w-0">
                    <span class="text-xs text-gray-600 font-medium w-8 shrink-0">白天</span>
                    <input v-model.number="additions.dayShiftDays" type="number" min="0" placeholder="天"
                      class="px-1 py-1 border border-gray-200 rounded w-10 text-xs focus:outline-none focus:border-primary-400 text-center min-w-0" />
                    <span class="text-gray-400 text-xs shrink-0">×</span>
                    <input v-model.number="additions.dayShiftRate" type="number" min="0" placeholder="工資"
                      class="px-1 py-1 border border-gray-200 rounded w-16 text-xs focus:outline-none focus:border-primary-400 min-w-0" />
                  </div>
                  <div class="flex items-center gap-1.5 border border-gray-200 rounded-lg px-2 py-1.5 min-w-0">
                    <span class="text-xs text-gray-600 font-medium w-8 shrink-0">夜間</span>
                    <input v-model.number="additions.nightShiftDays" type="number" min="0" placeholder="天"
                      class="px-1 py-1 border border-gray-200 rounded w-10 text-xs focus:outline-none focus:border-primary-400 text-center min-w-0" />
                    <span class="text-gray-400 text-xs shrink-0">×</span>
                    <input v-model.number="additions.nightShiftRate" type="number" min="0" placeholder="工資"
                      class="px-1 py-1 border border-gray-200 rounded w-16 text-xs focus:outline-none focus:border-primary-400 min-w-0" />
                  </div>
                  <div class="flex items-center gap-1.5 border border-gray-200 rounded-lg px-2 py-1.5 min-w-0">
                    <span class="text-xs text-gray-600 font-medium w-8 shrink-0">司機</span>
                    <input v-model.number="additions.driverDays" type="number" min="0" placeholder="天"
                      class="px-1 py-1 border border-gray-200 rounded w-10 text-xs focus:outline-none focus:border-primary-400 text-center min-w-0" />
                    <span class="text-gray-400 text-xs shrink-0">×</span>
                    <input v-model.number="additions.driverRate" type="number" min="0" placeholder="費率"
                      class="px-1 py-1 border border-gray-200 rounded w-16 text-xs focus:outline-none focus:border-primary-400 min-w-0" />
                  </div>
                </div>
                <!-- 外勤工資 列2 -->
                <div class="grid grid-cols-3 gap-3">
                  <div class="flex items-center gap-1.5 border border-gray-200 rounded-lg px-2 py-1.5 min-w-0">
                    <span class="text-xs text-gray-600 font-medium w-8 shrink-0">領班</span>
                    <input v-model.number="additions.foremanDays" type="number" min="0" placeholder="天"
                      class="px-1 py-1 border border-gray-200 rounded w-10 text-xs focus:outline-none focus:border-primary-400 text-center min-w-0" />
                    <span class="text-gray-400 text-xs shrink-0">×</span>
                    <input v-model.number="additions.foremanRate" type="number" min="0" placeholder="費率"
                      class="px-1 py-1 border border-gray-200 rounded w-16 text-xs focus:outline-none focus:border-primary-400 min-w-0" />
                  </div>
                  <div class="flex items-center gap-1.5 border border-gray-200 rounded-lg px-2 py-1.5 min-w-0">
                    <span class="text-xs text-gray-600 font-medium w-8 shrink-0">活電</span>
                    <input v-model.number="additions.liveWireCount" type="number" min="0" placeholder="條"
                      class="px-1 py-1 border border-gray-200 rounded w-10 text-xs focus:outline-none focus:border-primary-400 text-center min-w-0" />
                    <span class="text-gray-400 text-xs shrink-0">×</span>
                    <input v-model.number="additions.liveWireRate" type="number" min="0" placeholder="費率"
                      class="px-1 py-1 border border-gray-200 rounded w-16 text-xs focus:outline-none focus:border-primary-400 min-w-0" />
                  </div>
                  <div></div>
                </div>
              </div>
            </div>

            <!-- 獎金 -->
            <div class="border border-gray-200 rounded-xl overflow-hidden">
              <div class="px-4 py-1.5 bg-green-50 border-b border-gray-200">
                <span class="text-sm font-semibold text-green-700">獎金</span>
              </div>
              <div class="p-4 grid grid-cols-5 gap-x-4 gap-y-3">
                <div class="flex flex-col gap-1">
                  <label class="text-xs text-gray-500">效率獎金</label>
                  <input v-model.number="additions.efficiencyBonus" type="number" min="0" class="px-2 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-primary-400 w-full" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-xs text-gray-500">責任獎金</label>
                  <input v-model.number="additions.responsibilityBonus" type="number" min="0" class="px-2 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-primary-400 w-full" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-xs text-gray-500">服務獎金</label>
                  <input v-model.number="additions.serviceBonus" type="number" min="0" class="px-2 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-primary-400 w-full" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-xs text-gray-500">協力獎金</label>
                  <input v-model.number="additions.cooperationBonus" type="number" min="0" class="px-2 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-primary-400 w-full" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-xs text-gray-500">工安獎金</label>
                  <input v-model.number="additions.safetyBonus" type="number" min="0" class="px-2 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-primary-400 w-full" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-xs text-gray-500">證照獎金</label>
                  <input v-model.number="additions.licenseBonus" type="number" min="0" class="px-2 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-primary-400 w-full" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-xs text-gray-500">品質獎金</label>
                  <input v-model.number="additions.qualityBonus" type="number" min="0" class="px-2 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-primary-400 w-full" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-xs text-gray-500">公司加給</label>
                  <input v-model.number="additions.companyBonus" type="number" min="0" class="px-2 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-primary-400 w-full" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-xs text-gray-500">夜班點心</label>
                  <input v-model.number="additions.nightSnack" type="number" min="0" class="px-2 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-primary-400 w-full" />
                </div>
              </div>
            </div>

            <!-- 加班 -->
            <div class="border border-gray-200 rounded-xl overflow-hidden">
              <div class="px-4 py-1.5 bg-blue-50 border-b border-gray-200">
                <span class="text-sm font-semibold text-blue-700">加班</span>
              </div>
              <div class="p-4 grid grid-cols-3 gap-4">
                <div class="flex items-center gap-2 min-w-0">
                  <label class="text-xs text-gray-500 w-20 shrink-0">時間 × 費率</label>
                  <input v-model.number="additions.overtimeHours" type="number" min="0" placeholder="時"
                    class="px-2 py-1.5 border border-gray-200 rounded w-12 text-sm focus:outline-none focus:border-primary-400 text-center min-w-0" />
                  <span class="text-gray-400 text-xs shrink-0">×</span>
                  <input v-model.number="additions.overtimeRate" type="number" min="0" placeholder="費率"
                    class="px-2 py-1.5 border border-gray-200 rounded w-20 text-sm focus:outline-none focus:border-primary-400 min-w-0" />
                </div>
                <div class="flex items-center gap-2 min-w-0">
                  <label class="text-xs text-gray-500 w-16 shrink-0">平日加班</label>
                  <input v-model.number="additions.weekdayOvertime" type="number" min="0"
                    class="px-2 py-1.5 border border-gray-200 rounded w-24 text-sm focus:outline-none focus:border-primary-400 min-w-0" />
                </div>
                <div class="flex items-center gap-2 min-w-0">
                  <label class="text-xs text-gray-500 w-16 shrink-0">假日加班</label>
                  <input v-model.number="additions.holidayOvertime" type="number" min="0"
                    class="px-2 py-1.5 border border-gray-200 rounded w-24 text-sm focus:outline-none focus:border-primary-400 min-w-0" />
                </div>
              </div>
            </div>

            <!-- 津貼 / 全勤 / 預付 -->
            <div class="border border-gray-200 rounded-xl overflow-hidden">
              <div class="px-4 py-1.5 bg-purple-50 border-b border-gray-200">
                <span class="text-sm font-semibold text-purple-700">津貼 · 全勤 · 預付</span>
              </div>
              <div class="p-4 grid grid-cols-4 gap-3">
                <div class="flex items-center gap-2 min-w-0">
                  <label class="text-xs text-gray-500 w-16 shrink-0">職務津貼</label>
                  <input v-model.number="additions.positionAllowance" type="number" min="0"
                    class="px-2 py-1.5 border border-gray-200 rounded w-20 text-sm focus:outline-none focus:border-primary-400 min-w-0" />
                </div>
                <div class="flex items-center gap-2 min-w-0">
                  <label class="text-xs text-gray-500 w-16 shrink-0">伙食津貼</label>
                  <input v-model.number="additions.mealAllowance" type="number" min="0"
                    class="px-2 py-1.5 border border-gray-200 rounded w-20 text-sm focus:outline-none focus:border-primary-400 min-w-0" />
                </div>
                <div class="flex items-center gap-2 min-w-0">
                  <label class="text-xs text-gray-500 w-16 shrink-0">交通津貼</label>
                  <input v-model.number="additions.transportAllowance" type="number" min="0"
                    class="px-2 py-1.5 border border-gray-200 rounded w-20 text-sm focus:outline-none focus:border-primary-400 min-w-0" />
                </div>
                <div></div>
                <div class="flex items-center gap-2 min-w-0">
                  <label class="text-xs text-gray-500 w-16 shrink-0">全勤天數</label>
                  <input v-model.number="additions.fullAttendanceDays" type="number" min="0"
                    class="px-2 py-1.5 border border-gray-200 rounded w-20 text-sm focus:outline-none focus:border-primary-400 min-w-0" />
                </div>
                <div class="flex items-center gap-2 min-w-0">
                  <label class="text-xs text-gray-500 w-16 shrink-0">全勤獎金</label>
                  <input v-model.number="additions.fullAttendanceBonus" type="number" min="0"
                    :disabled="additions.fullAttendanceDays < 22"
                    class="px-2 py-1.5 border border-gray-200 rounded w-20 text-sm focus:outline-none focus:border-primary-400 disabled:bg-gray-100 min-w-0" />
                  <span v-if="additions.fullAttendanceDays >= 22" class="text-xs text-green-600 font-medium shrink-0">✓達標</span>
                </div>
                <div class="flex items-center gap-2 min-w-0">
                  <label class="text-xs text-gray-500 w-16 shrink-0">借款預支</label>
                  <input v-model.number="additions.loanAdvance" type="number" min="0"
                    class="px-2 py-1.5 border border-gray-200 rounded w-20 text-sm focus:outline-none focus:border-primary-400 min-w-0" />
                </div>
                <div class="flex items-center gap-2 min-w-0">
                  <label class="text-xs text-gray-500 w-16 shrink-0">工具預付</label>
                  <input v-model.number="additions.toolAdvance" type="number" min="0"
                    class="px-2 py-1.5 border border-gray-200 rounded w-20 text-sm focus:outline-none focus:border-primary-400 min-w-0" />
                </div>
              </div>
            </div>

            <!-- 加項小計 -->
            <div class="flex justify-between items-center px-5 py-3 bg-green-50 rounded-xl border border-green-200">
              <span class="font-semibold text-green-700">加項小計</span>
              <span class="text-2xl font-bold text-green-600">{{ formatMoney(additionSubtotal) }}</span>
            </div>
          </div>

          <!-- ===== 右側：扣項 + 結果（佔 1 欄）===== -->
          <div class="flex flex-col gap-3">

            <!-- 扣項 -->
            <div class="border border-gray-200 rounded-xl overflow-hidden flex-1">
              <div class="px-4 py-1.5 bg-red-50 border-b border-gray-200">
                <span class="text-sm font-semibold text-red-700">扣項</span>
              </div>
              <div class="p-3 space-y-1.5">
                <div class="flex items-center justify-between gap-2">
                  <label class="text-xs text-gray-500">勞保費 <span class="text-gray-300">自動</span></label>
                  <input v-model.number="deductions.laborInsuranceFee" type="number" min="0"
                    class="px-2 py-1 border border-gray-200 rounded w-24 text-sm text-right focus:outline-none focus:border-primary-400" />
                </div>
                <div class="flex items-center justify-between gap-2">
                  <label class="text-xs text-gray-500">健保費 <span class="text-gray-300">自動</span></label>
                  <input v-model.number="deductions.healthInsuranceFee" type="number" min="0"
                    class="px-2 py-1 border border-gray-200 rounded w-24 text-sm text-right focus:outline-none focus:border-primary-400" />
                </div>
                <div class="flex items-center justify-between gap-2">
                  <label class="text-xs text-gray-500">團保費 <span class="text-gray-300">自動</span></label>
                  <input v-model.number="deductions.groupInsuranceFee" type="number" min="0"
                    class="px-2 py-1 border border-gray-200 rounded w-24 text-sm text-right focus:outline-none focus:border-primary-400" />
                </div>
                <div class="flex items-center justify-between gap-2">
                  <label class="text-xs text-gray-500">扣所得稅</label>
                  <input v-model.number="deductions.incomeTax" type="number" min="0"
                    class="px-2 py-1 border border-gray-200 rounded w-24 text-sm text-right focus:outline-none focus:border-primary-400" />
                </div>
                <div class="border-t border-gray-100 pt-1.5 space-y-1.5">
                  <div class="flex items-center justify-between gap-2">
                    <label class="text-xs text-gray-500">工安扣款</label>
                    <input v-model.number="deductions.safetyDeduct" type="number" min="0"
                      class="px-2 py-1 border border-gray-200 rounded w-24 text-sm text-right focus:outline-none focus:border-primary-400" />
                  </div>
                  <div class="flex items-center justify-between gap-2">
                    <label class="text-xs text-gray-500">燒損扣款</label>
                    <input v-model.number="deductions.burnDeduct" type="number" min="0"
                      class="px-2 py-1 border border-gray-200 rounded w-24 text-sm text-right focus:outline-none focus:border-primary-400" />
                  </div>
                  <div class="flex items-center justify-between gap-2">
                    <label class="text-xs text-gray-500">品質扣款</label>
                    <input v-model.number="deductions.qualityDeduct" type="number" min="0"
                      class="px-2 py-1 border border-gray-200 rounded w-24 text-sm text-right focus:outline-none focus:border-primary-400" />
                  </div>
                  <div class="flex items-center justify-between gap-2">
                    <label class="text-xs text-gray-500">車輛扣款</label>
                    <input v-model.number="deductions.vehicleDeduct" type="number" min="0"
                      class="px-2 py-1 border border-gray-200 rounded w-24 text-sm text-right focus:outline-none focus:border-primary-400" />
                  </div>
                  <div class="flex items-center justify-between gap-2">
                    <label class="text-xs text-gray-500">工具扣款</label>
                    <input v-model.number="deductions.toolDeduct" type="number" min="0"
                      class="px-2 py-1 border border-gray-200 rounded w-24 text-sm text-right focus:outline-none focus:border-primary-400" />
                  </div>
                  <div class="flex items-center justify-between gap-2">
                    <label class="text-xs text-gray-500">借支扣款</label>
                    <input v-model.number="deductions.loanDeduct" type="number" min="0"
                      class="px-2 py-1 border border-gray-200 rounded w-24 text-sm text-right focus:outline-none focus:border-primary-400" />
                  </div>
                  <div class="flex items-center justify-between gap-2">
                    <label class="text-xs text-gray-500">水電費</label>
                    <input v-model.number="deductions.waterElecFee" type="number" min="0"
                      class="px-2 py-1 border border-gray-200 rounded w-24 text-sm text-right focus:outline-none focus:border-primary-400" />
                  </div>
                  <div class="flex items-center justify-between gap-2">
                    <label class="text-xs text-gray-500">眷屬費</label>
                    <input v-model.number="deductions.familyFee" type="number" min="0"
                      class="px-2 py-1 border border-gray-200 rounded w-24 text-sm text-right focus:outline-none focus:border-primary-400" />
                  </div>
                  <div class="flex items-center justify-between gap-2">
                    <label class="text-xs text-gray-500">零用金</label>
                    <input v-model.number="deductions.pettyCash" type="number" min="0"
                      class="px-2 py-1 border border-gray-200 rounded w-24 text-sm text-right focus:outline-none focus:border-primary-400" />
                  </div>
                  <div class="flex items-center justify-between gap-2">
                    <label class="text-xs text-gray-500">事假扣款</label>
                    <input v-model.number="deductions.leaveDeduct" type="number" min="0"
                      class="px-2 py-1 border border-gray-200 rounded w-24 text-sm text-right focus:outline-none focus:border-primary-400" />
                  </div>
                  <div class="flex items-center justify-between gap-2">
                    <label class="text-xs text-gray-500">仲介服務費</label>
                    <input v-model.number="deductions.agencyFee" type="number" min="0"
                      class="px-2 py-1 border border-gray-200 rounded w-24 text-sm text-right focus:outline-none focus:border-primary-400" />
                  </div>
                </div>
              </div>
              <!-- 扣項小計 -->
              <div class="flex justify-between items-center px-4 py-2 bg-red-50 border-t border-red-200">
                <span class="text-sm font-semibold text-red-700">扣項小計</span>
                <span class="font-bold text-red-600">{{ formatMoney(deductionSubtotal) }}</span>
              </div>
            </div>

            <!-- 結果 -->
            <div class="border-2 border-primary-300 rounded-xl overflow-hidden shrink-0">
              <div class="px-4 py-1.5 bg-primary-50 border-b border-primary-200">
                <span class="text-sm font-semibold text-primary-700">計算結果</span>
              </div>
              <div class="p-4 space-y-2">
                <div class="flex justify-between py-1.5 border-b border-gray-100">
                  <span class="text-sm text-gray-600">加項小計</span>
                  <span class="font-semibold text-green-600">{{ formatMoney(additionSubtotal) }}</span>
                </div>
                <div class="flex justify-between py-1.5 border-b border-gray-100">
                  <span class="text-sm text-gray-600">扣項小計</span>
                  <span class="font-semibold text-red-500">－{{ formatMoney(deductionSubtotal) }}</span>
                </div>
                <div class="flex justify-between items-center py-2 px-3 bg-primary-100 rounded-xl mt-1">
                  <span class="font-bold text-primary-700">實領金額</span>
                  <span class="text-2xl font-bold text-primary-700">{{ formatMoney(netPay) }}</span>
                </div>
              </div>
              <div class="px-4 py-3 border-t border-gray-200 flex justify-end">
                <button @click="saveNewPayroll" class="px-6 py-2 bg-success text-white rounded-lg hover:bg-green-700 font-medium transition-colors text-sm">
                  儲存薪資單
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 考勤管理 -->
  <template v-if="activeTab === 'attendanceMgmt'">
    <!-- 月份選擇 -->
    <div class="flex items-center gap-4 mb-5 no-print">
      <label class="text-sm font-medium text-gray-600">考勤月份</label>
      <VueDatePicker v-model="attendance_month" month-picker :enable-time-picker="false" auto-apply style="width:160px" />
      <span class="text-sm text-gray-500 font-medium">{{ attendance_monthDisplay }} 考勤紀錄</span>
    </div>

    <!-- 考勤表格 -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap sticky left-0 bg-gray-50">員工</th>
              <th class="px-2 py-3 text-center font-semibold text-gray-600 whitespace-nowrap">應出勤</th>
              <th class="px-2 py-3 text-center font-semibold text-gray-600 whitespace-nowrap">日班</th>
              <th class="px-2 py-3 text-center font-semibold text-gray-600 whitespace-nowrap">夜班</th>
              <th class="px-2 py-3 text-center font-semibold text-gray-600 whitespace-nowrap">實出勤</th>
              <th class="px-2 py-3 text-center font-semibold text-gray-600 whitespace-nowrap">假日</th>
              <th class="px-2 py-3 text-center font-semibold text-gray-600 whitespace-nowrap">台電上課</th>
              <th class="px-2 py-3 text-center font-semibold text-gray-600 whitespace-nowrap">事假</th>
              <th class="px-2 py-3 text-center font-semibold text-gray-600 whitespace-nowrap">曠職</th>
              <th class="px-2 py-3 text-center font-semibold text-gray-600 whitespace-nowrap">未請</th>
              <th class="px-2 py-3 text-center font-semibold text-gray-600 whitespace-nowrap">陪產假</th>
              <th class="px-2 py-3 text-center font-semibold text-gray-600 whitespace-nowrap">上課</th>
              <th class="px-2 py-3 text-center font-semibold text-gray-600 whitespace-nowrap">員工旅遊</th>
              <th class="px-2 py-3 text-center font-semibold text-gray-600 whitespace-nowrap">颱風假</th>
              <th class="px-2 py-3 text-center font-semibold text-primary-700 whitespace-nowrap bg-primary-50">總天數</th>
              <th class="px-2 py-3 text-center font-semibold text-gray-600 whitespace-nowrap no-print">列印</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in attendanceData" :key="row.id" class="border-t border-gray-100 hover:bg-gray-50">
              <td class="px-3 py-2 font-medium whitespace-nowrap sticky left-0 bg-white">
                <div class="text-sm">{{ row.name }}</div>
                <div class="text-xs text-gray-400">{{ row.dept }}</div>
              </td>
              <td class="px-1 py-2 text-center">
                <input v-model.number="row.required" type="number" min="0"
                  class="w-12 text-center px-1 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-primary-400" />
              </td>
              <td class="px-1 py-2 text-center">
                <input v-model.number="row.dayShift" type="number" min="0"
                  class="w-12 text-center px-1 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-primary-400" />
              </td>
              <td class="px-1 py-2 text-center">
                <input v-model.number="row.nightShift" type="number" min="0"
                  class="w-12 text-center px-1 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-primary-400" />
              </td>
              <td class="px-1 py-2 text-center">
                <input v-model.number="row.actual" type="number" min="0"
                  class="w-12 text-center px-1 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-primary-400" />
              </td>
              <td class="px-1 py-2 text-center">
                <input v-model.number="row.holiday" type="number" min="0"
                  class="w-12 text-center px-1 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-primary-400" />
              </td>
              <td class="px-1 py-2 text-center">
                <input v-model.number="row.tpcClass" type="number" min="0"
                  class="w-12 text-center px-1 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-primary-400" />
              </td>
              <td class="px-1 py-2 text-center">
                <input v-model.number="row.personalLeave" type="number" min="0"
                  class="w-12 text-center px-1 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-primary-400" />
              </td>
              <td class="px-1 py-2 text-center">
                <input v-model.number="row.absent" type="number" min="0"
                  class="w-12 text-center px-1 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-primary-400" />
              </td>
              <td class="px-1 py-2 text-center">
                <input v-model.number="row.unreported" type="number" min="0"
                  class="w-12 text-center px-1 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-primary-400" />
              </td>
              <td class="px-1 py-2 text-center">
                <input v-model.number="row.paternityLeave" type="number" min="0"
                  class="w-12 text-center px-1 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-primary-400" />
              </td>
              <td class="px-1 py-2 text-center">
                <input v-model.number="row.training" type="number" min="0"
                  class="w-12 text-center px-1 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-primary-400" />
              </td>
              <td class="px-1 py-2 text-center">
                <input v-model.number="row.companyTrip" type="number" min="0"
                  class="w-12 text-center px-1 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-primary-400" />
              </td>
              <td class="px-1 py-2 text-center">
                <input v-model.number="row.typhoonLeave" type="number" min="0"
                  class="w-12 text-center px-1 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-primary-400" />
              </td>
              <td class="px-3 py-2 text-center font-bold text-primary-700 bg-primary-50">
                {{ getAttendanceTotal(row) }}
              </td>
              <td class="px-2 py-2 text-center no-print">
                <button @click="printAttendance(row)"
                  class="px-3 py-1 bg-primary-100 text-primary-600 rounded-md text-xs hover:bg-primary-200 whitespace-nowrap">
                  列印
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>

  <!-- 變動津貼輸入 Modal -->
  <div v-if="showBonusModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-primary-700">{{ bonusModalTitle }}</h2>
        <button @click="showBonusModal = false" class="text-gray-400 hover:text-gray-600 text-2xl leading-none w-8 h-8 flex items-center justify-center">&times;</button>
      </div>
      <div class="flex-1 overflow-y-auto p-6">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">工號</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">姓名</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">部門</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">獎金金額</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="emp in bonusModalEmps" :key="emp.id" class="border-t border-gray-100 hover:bg-gray-50">
              <td class="px-4 py-3 text-sm">{{ emp.id }}</td>
              <td class="px-4 py-3 text-sm font-medium">{{ emp.name }}</td>
              <td class="px-4 py-3 text-sm">{{ emp.dept }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-1">
                  <span class="text-gray-500 text-sm">$</span>
                  <input v-model.number="emp.bonusAmount" type="number" min="0"
                    class="px-3 py-1.5 border border-gray-200 rounded-lg w-32 focus:outline-none focus:border-primary-400 text-sm" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="mt-4 pt-4 border-t border-gray-200 flex justify-between text-sm text-gray-600">
          <span>合計：</span>
          <span class="font-bold text-green-600">${{ bonusModalEmps.reduce((s,e) => s + (e.bonusAmount||0), 0).toLocaleString() }}</span>
        </div>
      </div>
      <div class="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
        <button @click="showBonusModal = false" class="px-5 py-2.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">取消</button>
        <button @click="saveBonusModal" class="px-5 py-2.5 bg-success text-white rounded-lg hover:bg-green-700 transition-colors">儲存</button>
      </div>
    </div>
  </div>

  <!-- 發放紀錄詳情 Modal -->
  <div v-if="showHistoryModal && selectedHistory" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col">
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-primary-700">
          {{ selectedHistory.month }} 薪資發放明細
          <span class="text-sm font-normal text-gray-500 ml-2">共 {{ selectedHistory.count }} 人</span>
        </h2>
        <button @click="showHistoryModal = false" class="text-gray-400 hover:text-gray-600 text-2xl leading-none w-8 h-8 flex items-center justify-center">&times;</button>
      </div>
      <div class="flex-1 overflow-y-auto p-6">
        <div class="mb-5 grid grid-cols-3 gap-4">
          <div class="p-4 bg-green-50 rounded-lg text-center">
            <div class="text-xs text-gray-500 mb-1">發放總金額</div>
            <div class="text-xl font-bold text-green-600">{{ selectedHistory.total }}</div>
          </div>
          <div class="p-4 bg-blue-50 rounded-lg text-center">
            <div class="text-xs text-gray-500 mb-1">發放日期</div>
            <div class="text-base font-medium">{{ selectedHistory.date === '-' ? '尚未發放' : selectedHistory.date }}</div>
          </div>
          <div class="p-4 rounded-lg text-center" :class="selectedHistory.status === '已發放' ? 'bg-green-50' : 'bg-amber-50'">
            <div class="text-xs text-gray-500 mb-1">狀態</div>
            <div class="text-base font-medium" :class="selectedHistory.status === '已發放' ? 'text-green-700' : 'text-amber-700'">
              {{ selectedHistory.status }}
            </div>
          </div>
        </div>
        <template v-if="historyDetails[selectedHistory.month]">
          <table class="w-full text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left font-semibold text-gray-600">姓名</th>
                <th class="px-4 py-3 text-left font-semibold text-gray-600">部門</th>
                <th class="px-4 py-3 text-right font-semibold text-gray-600">本薪</th>
                <th class="px-4 py-3 text-right font-semibold text-gray-600">津貼</th>
                <th class="px-4 py-3 text-right font-semibold text-gray-600">獎金</th>
                <th class="px-4 py-3 text-right font-semibold text-gray-600">加班</th>
                <th class="px-4 py-3 text-right font-semibold text-red-500">代扣</th>
                <th class="px-4 py-3 text-right font-semibold text-primary-700">實發</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in historyDetails[selectedHistory.month]" :key="row.id" class="border-t border-gray-100 hover:bg-gray-50">
                <td class="px-4 py-3 font-medium">{{ row.name }}</td>
                <td class="px-4 py-3 text-gray-500">{{ row.dept }}</td>
                <td class="px-4 py-3 text-right">{{ formatMoney(row.base) }}</td>
                <td class="px-4 py-3 text-right">{{ formatMoney(row.allowance) }}</td>
                <td class="px-4 py-3 text-right text-green-600">{{ row.bonus > 0 ? '+' + formatMoney(row.bonus) : '—' }}</td>
                <td class="px-4 py-3 text-right">{{ row.overtime > 0 ? formatMoney(row.overtime) : '—' }}</td>
                <td class="px-4 py-3 text-right text-red-500">-{{ formatMoney(row.deduct) }}</td>
                <td class="px-4 py-3 text-right font-bold text-primary-700">{{ formatMoney(row.net) }}</td>
              </tr>
              <tr class="bg-gray-50 font-semibold border-t-2 border-gray-300">
                <td colspan="2" class="px-4 py-3 text-right text-sm">合計</td>
                <td class="px-4 py-3 text-right text-sm">{{ formatMoney(historyDetails[selectedHistory.month].reduce((s,r)=>s+r.base,0)) }}</td>
                <td class="px-4 py-3 text-right text-sm">{{ formatMoney(historyDetails[selectedHistory.month].reduce((s,r)=>s+r.allowance,0)) }}</td>
                <td class="px-4 py-3 text-right text-sm text-green-600">+{{ formatMoney(historyDetails[selectedHistory.month].reduce((s,r)=>s+r.bonus,0)) }}</td>
                <td class="px-4 py-3 text-right text-sm">{{ formatMoney(historyDetails[selectedHistory.month].reduce((s,r)=>s+r.overtime,0)) }}</td>
                <td class="px-4 py-3 text-right text-sm text-red-500">-{{ formatMoney(historyDetails[selectedHistory.month].reduce((s,r)=>s+r.deduct,0)) }}</td>
                <td class="px-4 py-3 text-right font-bold text-primary-700">{{ formatMoney(historyDetails[selectedHistory.month].reduce((s,r)=>s+r.net,0)) }}</td>
              </tr>
            </tbody>
          </table>
        </template>
        <div v-else class="text-center text-gray-400 py-8">暫無明細資料</div>
      </div>
      <div class="flex justify-end px-6 py-4 border-t border-gray-200">
        <button @click="showHistoryModal = false" class="px-5 py-2.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">關閉</button>
      </div>
    </div>
  </div>

  <!-- 考勤列印預覽 -->
  <div v-if="showAttendancePrint" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-xl w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh]">
      <!-- 工具列 -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 no-print">
        <h2 class="font-semibold text-primary-700">考勤列印預覽</h2>
        <div class="flex gap-2">
          <button @click="triggerPrint" class="px-4 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 text-sm">列印</button>
          <button @click="showAttendancePrint = false" class="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 text-sm">關閉</button>
        </div>
      </div>
      <!-- 列印內容 -->
      <div class="flex-1 overflow-y-auto p-8 print-area">
        <h1 class="text-xl font-bold text-center mb-1">考勤紀錄表</h1>
        <p class="text-center text-gray-600 text-sm mb-6">
          {{ printingEmployee?.name }} ｜ {{ printingEmployee?.dept }} ｜ {{ attendance_monthDisplay }}
        </p>
        <table class="w-full border-collapse border border-gray-400 text-sm">
          <tbody>
            <tr v-for="(label, field) in attendanceFieldLabels" :key="field">
              <td class="px-4 py-2 bg-gray-50 font-medium border border-gray-400 w-40">{{ label }}</td>
              <td class="px-4 py-2 border border-gray-400">{{ printingEmployee?.[field] ?? 0 }} 天</td>
            </tr>
            <tr class="bg-primary-50">
              <td class="px-4 py-2 font-bold border border-gray-400">總天數</td>
              <td class="px-4 py-2 font-bold border border-gray-400">
                {{ printingEmployee ? getAttendanceTotal(printingEmployee) : 0 }} 天
              </td>
            </tr>
          </tbody>
        </table>
        <p class="mt-8 text-xs text-gray-400 text-center">本表由 T-ERP 人事薪資管理系統產出</p>
      </div>
    </div>
  </div>
</template>
