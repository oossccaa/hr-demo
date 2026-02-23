<script setup>
import { ref, reactive, computed } from 'vue'

const emit = defineEmits(['toast'])
const activeTab = ref('insurance')

const insuranceChanges = [
  { type: '勞保加保', name: '張大明', date: '2025/02/01', salary: '$55,400', status: '待申報' },
  { type: '健保加保', name: '張大明', date: '2025/02/01', salary: '$55,400', status: '待申報' },
  { type: '勞保退保', name: '李小華', date: '2025/01/31', salary: '$66,800', status: '已申報' },
  { type: '健保退保', name: '李小華', date: '2025/01/31', salary: '$66,800', status: '已申報' },
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

// ===================== 薪資報表列印 =====================
const employeeList = [
  { id: 'A001', name: '王大明', dept: '研發部', title: '資深工程師', date: '2020/03/15', status: '在職', idNumber: 'A123456789', baseSalary: 78000, mealAllowance: 1800, transportAllowance: 2000, positionAllowance: 5000, deduction: 12500, bankBranchCode: '012345', bankAccount: '00123456789', accountHolder: '王大明' },
  { id: 'A002', name: '李小華', dept: '業務部', title: '業務經理', date: '2019/08/01', status: '離職', idNumber: 'B234567890', baseSalary: 0, mealAllowance: 0, transportAllowance: 0, positionAllowance: 0, deduction: 0, bankBranchCode: '023456', bankAccount: '00234567890', accountHolder: '李小華' },
  { id: 'A003', name: '張美玲', dept: '人事部', title: '人事專員', date: '2021/06/20', status: '在職', idNumber: 'C345678901', baseSalary: 52000, mealAllowance: 1800, transportAllowance: 1500, positionAllowance: 2000, deduction: 7800, bankBranchCode: '034567', bankAccount: '00345678901', accountHolder: '張美玲' },
  { id: 'A004', name: '陳志豪', dept: '研發部', title: '工程師', date: '2022/01/10', status: '在職', idNumber: 'D456789012', baseSalary: 62000, mealAllowance: 1800, transportAllowance: 1500, positionAllowance: 3000, deduction: 10200, bankBranchCode: '045678', bankAccount: '00456789012', accountHolder: '陳志豪' },
  { id: 'A005', name: '林佳穎', dept: '財務部', title: '會計', date: '2023/04/05', status: '在職', idNumber: 'E567890123', baseSalary: 48000, mealAllowance: 1800, transportAllowance: 1200, positionAllowance: 0, deduction: 6500, bankBranchCode: '056789', bankAccount: '00567890123', accountHolder: '林佳穎' },
  { id: 'A006', name: '張大明', dept: '研發部', title: '工程師', date: '2025/02/01', status: '試用期', idNumber: 'F678901234', baseSalary: 55000, mealAllowance: 1800, transportAllowance: 1500, positionAllowance: 0, deduction: 7200, bankBranchCode: '067890', bankAccount: '00678901234', accountHolder: '張大明' },
]

// 詳細薪資明細資料（對應 newPayroll 的加扣項）
const payrollSlips = {
  A001: {
    baseSalary: 78000,
    efficiencyBonus: 3000, responsibilityBonus: 2000, serviceBonus: 0, cooperationBonus: 0,
    weekdayOvertime: 5200, holidayOvertime: 0, nightShiftPay: 0,
    positionAllowance: 5000, mealAllowance: 1800, transportAllowance: 2000,
    safetyBonus: 0, licenseBonus: 0, qualityBonus: 0, companyBonus: 0,
    fullAttendanceBonus: 2000, loanAdvance: 0, toolAdvance: 0,
    laborInsuranceFee: 1134, healthInsuranceFee: 826, groupInsuranceFee: 120,
    incomeTax: 2000, safetyDeduct: 0, burnDeduct: 0, qualityDeduct: 0,
    vehicleDeduct: 0, toolDeduct: 0, loanDeduct: 0,
    waterElecFee: 0, familyFee: 0, pettyCash: 0, leaveDeduct: 0, agencyFee: 0,
  },
  A003: {
    baseSalary: 52000,
    efficiencyBonus: 1000, responsibilityBonus: 0, serviceBonus: 0, cooperationBonus: 0,
    weekdayOvertime: 0, holidayOvertime: 0, nightShiftPay: 0,
    positionAllowance: 2000, mealAllowance: 1800, transportAllowance: 1500,
    safetyBonus: 0, licenseBonus: 0, qualityBonus: 0, companyBonus: 0,
    fullAttendanceBonus: 2000, loanAdvance: 0, toolAdvance: 0,
    laborInsuranceFee: 756, healthInsuranceFee: 551, groupInsuranceFee: 120,
    incomeTax: 0, safetyDeduct: 0, burnDeduct: 0, qualityDeduct: 0,
    vehicleDeduct: 0, toolDeduct: 0, loanDeduct: 0,
    waterElecFee: 0, familyFee: 0, pettyCash: 0, leaveDeduct: 0, agencyFee: 0,
  },
  A004: {
    baseSalary: 62000,
    efficiencyBonus: 2000, responsibilityBonus: 0, serviceBonus: 0, cooperationBonus: 0,
    weekdayOvertime: 8500, holidayOvertime: 0, nightShiftPay: 0,
    positionAllowance: 3000, mealAllowance: 1800, transportAllowance: 1500,
    safetyBonus: 0, licenseBonus: 0, qualityBonus: 0, companyBonus: 0,
    fullAttendanceBonus: 2000, loanAdvance: 0, toolAdvance: 0,
    laborInsuranceFee: 918, healthInsuranceFee: 688, groupInsuranceFee: 120,
    incomeTax: 1000, safetyDeduct: 0, burnDeduct: 0, qualityDeduct: 0,
    vehicleDeduct: 0, toolDeduct: 0, loanDeduct: 0,
    waterElecFee: 0, familyFee: 0, pettyCash: 0, leaveDeduct: 0, agencyFee: 0,
  },
  A005: {
    baseSalary: 48000,
    efficiencyBonus: 0, responsibilityBonus: 0, serviceBonus: 0, cooperationBonus: 0,
    weekdayOvertime: 2000, holidayOvertime: 0, nightShiftPay: 0,
    positionAllowance: 0, mealAllowance: 1800, transportAllowance: 1200,
    safetyBonus: 0, licenseBonus: 0, qualityBonus: 0, companyBonus: 0,
    fullAttendanceBonus: 0, loanAdvance: 0, toolAdvance: 0,
    laborInsuranceFee: 702, healthInsuranceFee: 520, groupInsuranceFee: 120,
    incomeTax: 0, safetyDeduct: 0, burnDeduct: 0, qualityDeduct: 0,
    vehicleDeduct: 0, toolDeduct: 0, loanDeduct: 0,
    waterElecFee: 0, familyFee: 0, pettyCash: 0, leaveDeduct: 0, agencyFee: 0,
  },
  A006: {
    baseSalary: 55000,
    efficiencyBonus: 2000, responsibilityBonus: 0, serviceBonus: 0, cooperationBonus: 0,
    weekdayOvertime: 0, holidayOvertime: 0, nightShiftPay: 0,
    positionAllowance: 0, mealAllowance: 1800, transportAllowance: 1500,
    safetyBonus: 0, licenseBonus: 0, qualityBonus: 0, companyBonus: 0,
    fullAttendanceBonus: 2000, loanAdvance: 0, toolAdvance: 0,
    laborInsuranceFee: 810, healthInsuranceFee: 597, groupInsuranceFee: 120,
    incomeTax: 0, safetyDeduct: 0, burnDeduct: 0, qualityDeduct: 0,
    vehicleDeduct: 0, toolDeduct: 0, loanDeduct: 0,
    waterElecFee: 0, familyFee: 0, pettyCash: 0, leaveDeduct: 0, agencyFee: 0,
  },
}

const monthlyPayroll = {
  A001: { jan: 83000, feb: 83000, mar: 85000, apr: 83000, may: 83000, jun: 88000, jul: 83000, aug: 83000, sep: 83000, oct: 83000, nov: 83000, dec: 95000 },
  A003: { jan: 55000, feb: 55000, mar: 55000, apr: 55000, may: 55000, jun: 58000, jul: 55000, aug: 55000, sep: 55000, oct: 55000, nov: 55000, dec: 60000 },
  A004: { jan: 65000, feb: 65000, mar: 65000, apr: 65000, may: 65000, jun: 68000, jul: 65000, aug: 65000, sep: 65000, oct: 65000, nov: 65000, dec: 75000 },
  A005: { jan: 50000, feb: 50000, mar: 50000, apr: 50000, may: 50000, jun: 52000, jul: 50000, aug: 50000, sep: 50000, oct: 50000, nov: 50000, dec: 55000 },
  A006: { jan: 55000, feb: 55000, mar: 55000, apr: 55000, may: 55000, jun: 55000, jul: 55000, aug: 55000, sep: 55000, oct: 55000, nov: 55000, dec: 60000 },
}

const monthLabels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

const showPrintPreview = ref(false)
const currentReport = ref('')

const employeeListColumns = reactive({
  id: { label: '工號', selected: true },
  name: { label: '姓名', selected: true },
  dept: { label: '部門', selected: true },
  title: { label: '職稱', selected: true },
  date: { label: '到職日', selected: true },
  status: { label: '在職狀態', selected: true },
  idNumber: { label: '身分證字號', selected: false },
  baseSalary: { label: '底薪', selected: false },
  bankAccount: { label: '帳號', selected: false },
})

function openReport(reportId) {
  currentReport.value = reportId
  showPrintPreview.value = true
}

function closePrintPreview() {
  showPrintPreview.value = false
}

function triggerPrint() {
  window.print()
}

const activeEmployees = computed(() => employeeList.filter(e => e.status !== '離職'))

function getNetPay(emp) {
  return emp.baseSalary + emp.mealAllowance + emp.transportAllowance + emp.positionAllowance - emp.deduction
}

function getAnnualTotal(empId) {
  const data = monthlyPayroll[empId]
  if (!data) return 0
  return Object.values(data).reduce((s, v) => s + v, 0)
}

function getSlipAdditions(slip) {
  if (!slip) return 0
  return slip.baseSalary
    + slip.efficiencyBonus + slip.responsibilityBonus + slip.serviceBonus + slip.cooperationBonus
    + slip.weekdayOvertime + slip.holidayOvertime + slip.nightShiftPay
    + slip.positionAllowance + slip.mealAllowance + slip.transportAllowance
    + slip.safetyBonus + slip.licenseBonus + slip.qualityBonus + slip.companyBonus
    + slip.fullAttendanceBonus + slip.loanAdvance + slip.toolAdvance
}

function getSlipDeductions(slip) {
  if (!slip) return 0
  return slip.laborInsuranceFee + slip.healthInsuranceFee + slip.groupInsuranceFee
    + slip.incomeTax + slip.safetyDeduct + slip.burnDeduct + slip.qualityDeduct
    + slip.vehicleDeduct + slip.toolDeduct + slip.loanDeduct
    + slip.waterElecFee + slip.familyFee + slip.pettyCash + slip.leaveDeduct + slip.agencyFee
}

function getSlipNetPay(empId) {
  const slip = payrollSlips[empId]
  return getSlipAdditions(slip) - getSlipDeductions(slip)
}

function fmt(n) {
  return (n || 0).toLocaleString()
}
</script>

<template>
  <!-- Tabs -->
  <div class="flex flex-wrap gap-1 mb-6 border-b-2 border-gray-200">
    <button
      v-for="tab in [
        { id: 'insurance', label: '保險名冊' },
        { id: 'tax', label: '所得稅報表' },
        { id: 'stats', label: '統計報表' },
        { id: 'payrollPrint', label: '薪資報表列印' },
      ]"
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
        <button @click="openReport('ins_labor_join')"
          class="p-5 bg-gradient-to-br from-primary-400 to-primary-500 text-white rounded-xl text-center hover:scale-[1.03] hover:shadow-lg transition-all">
          <span class="text-2xl block mb-2">📋</span>
          勞保加保名冊
        </button>
        <button @click="openReport('ins_labor_leave')"
          class="p-5 bg-gradient-to-br from-primary-400 to-primary-500 text-white rounded-xl text-center hover:scale-[1.03] hover:shadow-lg transition-all">
          <span class="text-2xl block mb-2">📋</span>
          勞保退保名冊
        </button>
        <button @click="openReport('ins_health_join')"
          class="p-5 bg-gradient-to-br from-primary-400 to-primary-500 text-white rounded-xl text-center hover:scale-[1.03] hover:shadow-lg transition-all">
          <span class="text-2xl block mb-2">📋</span>
          健保加保名冊
        </button>
        <button @click="openReport('ins_health_leave')"
          class="p-5 bg-gradient-to-br from-primary-400 to-primary-500 text-white rounded-xl text-center hover:scale-[1.03] hover:shadow-lg transition-all">
          <span class="text-2xl block mb-2">📋</span>
          健保退保名冊
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
              <span class="px-3 py-1 rounded-full text-xs font-medium"
                :class="row.status === '已申報' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'">
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
        <button @click="openReport('tax_withholding')"
          class="p-5 bg-gradient-to-br from-primary-400 to-primary-500 text-white rounded-xl text-center hover:scale-[1.03] hover:shadow-lg transition-all">
          <span class="text-2xl block mb-2">📄</span>
          各類所得扣繳憑單
        </button>
        <button @click="openReport('tax_media')"
          class="p-5 bg-gradient-to-br from-primary-400 to-primary-500 text-white rounded-xl text-center hover:scale-[1.03] hover:shadow-lg transition-all">
          <span class="text-2xl block mb-2">📤</span>
          扣繳申報媒體檔
        </button>
        <button @click="openReport('tax_annual_stats')"
          class="p-5 bg-gradient-to-br from-primary-400 to-primary-500 text-white rounded-xl text-center hover:scale-[1.03] hover:shadow-lg transition-all">
          <span class="text-2xl block mb-2">📊</span>
          年度扣繳統計表
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

  <!-- 薪資報表列印 -->
  <template v-if="activeTab === 'payrollPrint'">
    <div class="bg-white p-6 rounded-xl shadow-md">
      <h3 class="text-lg font-semibold text-primary-700 mb-1">薪資報表列印</h3>
      <p class="text-sm text-gray-500 mb-6">選擇報表類型後，系統將顯示列印預覽</p>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <button @click="openReport('payroll_detail_landscape')"
          class="p-5 bg-gradient-to-br from-primary-400 to-primary-500 text-white rounded-xl text-left hover:scale-[1.03] hover:shadow-lg transition-all">
          <span class="text-2xl block mb-3">📄</span>
          <div class="font-semibold mb-1">各員工薪資明細</div>
          <div class="text-xs opacity-80">橫式 A4 — 逐人詳細明細</div>
        </button>
        <button @click="openReport('payroll_summary_portrait')"
          class="p-5 bg-gradient-to-br from-primary-400 to-primary-500 text-white rounded-xl text-left hover:scale-[1.03] hover:shadow-lg transition-all">
          <span class="text-2xl block mb-3">📋</span>
          <div class="font-semibold mb-1">各員工薪資表</div>
          <div class="text-xs opacity-80">直式 A4 — 加扣項明細</div>
        </button>
        <button @click="openReport('bank_transfer')"
          class="p-5 bg-gradient-to-br from-primary-400 to-primary-500 text-white rounded-xl text-left hover:scale-[1.03] hover:shadow-lg transition-all">
          <span class="text-2xl block mb-3">🏦</span>
          <div class="font-semibold mb-1">公司薪資轉帳明細</div>
          <div class="text-xs opacity-80">含局號、帳號、戶名</div>
        </button>
        <button @click="openReport('annual_payroll')"
          class="p-5 bg-gradient-to-br from-primary-400 to-primary-500 text-white rounded-xl text-left hover:scale-[1.03] hover:shadow-lg transition-all">
          <span class="text-2xl block mb-3">📊</span>
          <div class="font-semibold mb-1">年度薪資給付明細表</div>
          <div class="text-xs opacity-80">各員工全年月別統計</div>
        </button>
        <button @click="openReport('employee_roster')"
          class="p-5 bg-gradient-to-br from-primary-400 to-primary-500 text-white rounded-xl text-left hover:scale-[1.03] hover:shadow-lg transition-all">
          <span class="text-2xl block mb-3">👥</span>
          <div class="font-semibold mb-1">員工總表</div>
          <div class="text-xs opacity-80">可自訂欄位列印</div>
        </button>
      </div>
    </div>
  </template>

  <!-- 列印預覽 Overlay -->
  <div v-if="showPrintPreview" class="fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-6 pb-6 px-4">
    <div class="bg-white rounded-xl w-full max-w-5xl flex flex-col shadow-2xl" style="max-height: 90vh;">

      <!-- 工具列 -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 no-print shrink-0">
        <h2 class="text-lg font-semibold text-primary-700">列印預覽</h2>
        <div class="flex gap-3">
          <button @click="triggerPrint" class="px-5 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 text-sm">列印</button>
          <button @click="closePrintPreview" class="px-5 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 text-sm">關閉</button>
        </div>
      </div>

      <!-- 預覽內容（可滾動）-->
      <div class="flex-1 overflow-y-auto p-6 print-area">

        <!-- ===== 保險名冊系列 ===== -->
        <template v-if="currentReport === 'ins_labor_join'">
          <h1 class="text-xl font-bold text-center mb-1">勞保加保名冊</h1>
          <p class="text-center text-gray-500 text-sm mb-6">2025年2月</p>
          <table class="w-full border-collapse text-sm">
            <thead>
              <tr class="bg-gray-100">
                <th class="border border-gray-400 px-3 py-2 text-center w-10">序號</th>
                <th class="border border-gray-400 px-3 py-2 text-left">員工編號</th>
                <th class="border border-gray-400 px-3 py-2 text-left">姓名</th>
                <th class="border border-gray-400 px-3 py-2 text-left">身分證字號</th>
                <th class="border border-gray-400 px-3 py-2 text-left">到職日</th>
                <th class="border border-gray-400 px-3 py-2 text-right">投保薪資級距</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in insuranceChanges.filter(r => r.type === '勞保加保')" :key="idx">
                <td class="border border-gray-400 px-3 py-2 text-center">{{ idx + 1 }}</td>
                <td class="border border-gray-400 px-3 py-2">A006</td>
                <td class="border border-gray-400 px-3 py-2 font-medium">{{ row.name }}</td>
                <td class="border border-gray-400 px-3 py-2">F678901234</td>
                <td class="border border-gray-400 px-3 py-2">{{ row.date }}</td>
                <td class="border border-gray-400 px-3 py-2 text-right">{{ row.salary }}</td>
              </tr>
            </tbody>
          </table>
        </template>

        <template v-if="currentReport === 'ins_labor_leave'">
          <h1 class="text-xl font-bold text-center mb-1">勞保退保名冊</h1>
          <p class="text-center text-gray-500 text-sm mb-6">2025年1月</p>
          <table class="w-full border-collapse text-sm">
            <thead>
              <tr class="bg-gray-100">
                <th class="border border-gray-400 px-3 py-2 text-center w-10">序號</th>
                <th class="border border-gray-400 px-3 py-2 text-left">員工編號</th>
                <th class="border border-gray-400 px-3 py-2 text-left">姓名</th>
                <th class="border border-gray-400 px-3 py-2 text-left">身分證字號</th>
                <th class="border border-gray-400 px-3 py-2 text-left">退保日</th>
                <th class="border border-gray-400 px-3 py-2 text-right">投保薪資</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in insuranceChanges.filter(r => r.type === '勞保退保')" :key="idx">
                <td class="border border-gray-400 px-3 py-2 text-center">{{ idx + 1 }}</td>
                <td class="border border-gray-400 px-3 py-2">A002</td>
                <td class="border border-gray-400 px-3 py-2 font-medium">{{ row.name }}</td>
                <td class="border border-gray-400 px-3 py-2">B234567890</td>
                <td class="border border-gray-400 px-3 py-2">{{ row.date }}</td>
                <td class="border border-gray-400 px-3 py-2 text-right">{{ row.salary }}</td>
              </tr>
            </tbody>
          </table>
        </template>

        <template v-if="currentReport === 'ins_health_join'">
          <h1 class="text-xl font-bold text-center mb-1">健保加保名冊</h1>
          <p class="text-center text-gray-500 text-sm mb-6">2025年2月</p>
          <table class="w-full border-collapse text-sm">
            <thead>
              <tr class="bg-gray-100">
                <th class="border border-gray-400 px-3 py-2 text-center w-10">序號</th>
                <th class="border border-gray-400 px-3 py-2 text-left">員工編號</th>
                <th class="border border-gray-400 px-3 py-2 text-left">姓名</th>
                <th class="border border-gray-400 px-3 py-2 text-left">身分證字號</th>
                <th class="border border-gray-400 px-3 py-2 text-left">加保日</th>
                <th class="border border-gray-400 px-3 py-2 text-right">投保薪資級距</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in insuranceChanges.filter(r => r.type === '健保加保')" :key="idx">
                <td class="border border-gray-400 px-3 py-2 text-center">{{ idx + 1 }}</td>
                <td class="border border-gray-400 px-3 py-2">A006</td>
                <td class="border border-gray-400 px-3 py-2 font-medium">{{ row.name }}</td>
                <td class="border border-gray-400 px-3 py-2">F678901234</td>
                <td class="border border-gray-400 px-3 py-2">{{ row.date }}</td>
                <td class="border border-gray-400 px-3 py-2 text-right">{{ row.salary }}</td>
              </tr>
            </tbody>
          </table>
        </template>

        <template v-if="currentReport === 'ins_health_leave'">
          <h1 class="text-xl font-bold text-center mb-1">健保退保名冊</h1>
          <p class="text-center text-gray-500 text-sm mb-6">2025年1月</p>
          <table class="w-full border-collapse text-sm">
            <thead>
              <tr class="bg-gray-100">
                <th class="border border-gray-400 px-3 py-2 text-center w-10">序號</th>
                <th class="border border-gray-400 px-3 py-2 text-left">員工編號</th>
                <th class="border border-gray-400 px-3 py-2 text-left">姓名</th>
                <th class="border border-gray-400 px-3 py-2 text-left">身分證字號</th>
                <th class="border border-gray-400 px-3 py-2 text-left">退保日</th>
                <th class="border border-gray-400 px-3 py-2 text-right">投保薪資</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in insuranceChanges.filter(r => r.type === '健保退保')" :key="idx">
                <td class="border border-gray-400 px-3 py-2 text-center">{{ idx + 1 }}</td>
                <td class="border border-gray-400 px-3 py-2">A002</td>
                <td class="border border-gray-400 px-3 py-2 font-medium">{{ row.name }}</td>
                <td class="border border-gray-400 px-3 py-2">B234567890</td>
                <td class="border border-gray-400 px-3 py-2">{{ row.date }}</td>
                <td class="border border-gray-400 px-3 py-2 text-right">{{ row.salary }}</td>
              </tr>
            </tbody>
          </table>
        </template>

        <!-- ===== 所得稅系列 ===== -->
        <template v-if="currentReport === 'tax_withholding'">
          <h1 class="text-xl font-bold text-center mb-1">各類所得扣繳憑單</h1>
          <p class="text-center text-gray-500 text-sm mb-6">2024年度</p>
          <div v-for="emp in activeEmployees" :key="emp.id" class="mb-6 break-inside-avoid border border-gray-400 text-sm">
            <div class="bg-gray-100 px-4 py-2 font-bold border-b border-gray-400 flex justify-between">
              <span>扣繳憑單</span>
              <span>2024年度</span>
            </div>
            <div class="grid grid-cols-2 border-b border-gray-300">
              <div class="px-4 py-2 border-r border-gray-300">扣繳義務人：達利電工股份有限公司</div>
              <div class="px-4 py-2">統一編號：12345678</div>
            </div>
            <div class="grid grid-cols-2 border-b border-gray-300">
              <div class="px-4 py-2 border-r border-gray-300">納稅義務人：{{ emp.name }}</div>
              <div class="px-4 py-2">身分證字號：{{ emp.idNumber }}</div>
            </div>
            <div class="grid grid-cols-3 border-b border-gray-300">
              <div class="px-4 py-2 border-r border-gray-300">所得類別：50 薪資所得</div>
              <div class="px-4 py-2 border-r border-gray-300">給付總額：{{ getAnnualTotal(emp.id).toLocaleString() }}</div>
              <div class="px-4 py-2">扣繳稅額：{{ Math.floor(getAnnualTotal(emp.id) * 0.05).toLocaleString() }}</div>
            </div>
          </div>
        </template>

        <template v-if="currentReport === 'tax_media'">
          <h1 class="text-xl font-bold text-center mb-1">扣繳申報媒體檔</h1>
          <p class="text-center text-gray-500 text-sm mb-6">2024年度</p>
          <table class="w-full border-collapse text-sm">
            <thead>
              <tr class="bg-gray-100">
                <th class="border border-gray-400 px-3 py-2 text-center">序號</th>
                <th class="border border-gray-400 px-3 py-2 text-left">員工姓名</th>
                <th class="border border-gray-400 px-3 py-2 text-left">身分證字號</th>
                <th class="border border-gray-400 px-3 py-2 text-left">所得類別</th>
                <th class="border border-gray-400 px-3 py-2 text-right">給付總額</th>
                <th class="border border-gray-400 px-3 py-2 text-right">扣繳稅額</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(emp, idx) in activeEmployees" :key="emp.id">
                <td class="border border-gray-400 px-3 py-2 text-center">{{ idx + 1 }}</td>
                <td class="border border-gray-400 px-3 py-2">{{ emp.name }}</td>
                <td class="border border-gray-400 px-3 py-2">{{ emp.idNumber }}</td>
                <td class="border border-gray-400 px-3 py-2">50 薪資所得</td>
                <td class="border border-gray-400 px-3 py-2 text-right">{{ getAnnualTotal(emp.id).toLocaleString() }}</td>
                <td class="border border-gray-400 px-3 py-2 text-right">{{ Math.floor(getAnnualTotal(emp.id) * 0.05).toLocaleString() }}</td>
              </tr>
              <tr class="bg-gray-100 font-semibold">
                <td colspan="4" class="border border-gray-400 px-3 py-2 text-right">合計</td>
                <td class="border border-gray-400 px-3 py-2 text-right">
                  {{ activeEmployees.reduce((s, e) => s + getAnnualTotal(e.id), 0).toLocaleString() }}
                </td>
                <td class="border border-gray-400 px-3 py-2 text-right">
                  {{ activeEmployees.reduce((s, e) => s + Math.floor(getAnnualTotal(e.id) * 0.05), 0).toLocaleString() }}
                </td>
              </tr>
            </tbody>
          </table>
        </template>

        <template v-if="currentReport === 'tax_annual_stats'">
          <h1 class="text-xl font-bold text-center mb-1">年度扣繳統計表</h1>
          <p class="text-center text-gray-500 text-sm mb-6">2024年度</p>
          <table class="w-full border-collapse text-sm mb-6">
            <thead>
              <tr class="bg-gray-100">
                <th class="border border-gray-400 px-3 py-2 text-left">所得類別</th>
                <th class="border border-gray-400 px-3 py-2 text-right">人數</th>
                <th class="border border-gray-400 px-3 py-2 text-right">給付總額</th>
                <th class="border border-gray-400 px-3 py-2 text-right">扣繳稅額</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in taxStats" :key="row.type">
                <td class="border border-gray-400 px-3 py-2 font-medium">{{ row.type }}</td>
                <td class="border border-gray-400 px-3 py-2 text-right">{{ row.count }}</td>
                <td class="border border-gray-400 px-3 py-2 text-right">{{ row.total }}</td>
                <td class="border border-gray-400 px-3 py-2 text-right">{{ row.tax }}</td>
              </tr>
            </tbody>
          </table>
        </template>

        <!-- ===== 報表1：各員工薪資明細（橫式）===== -->
        <template v-if="currentReport === 'payroll_detail_landscape'">
          <h1 class="text-xl font-bold text-center mb-1">各員工薪資明細表</h1>
          <p class="text-center text-gray-500 text-sm mb-4">達利電工股份有限公司　2025年2月</p>

          <div v-for="emp in activeEmployees" :key="emp.id" class="mb-5 break-inside-avoid border-2 border-gray-700 text-xs">
            <!-- 標題列 -->
            <div class="flex justify-between items-center bg-gray-200 px-3 py-1.5 border-b border-gray-700">
              <span class="font-bold text-sm">薪資明細表</span>
              <span>2025年2月份</span>
            </div>
            <!-- 員工資訊 -->
            <div class="grid grid-cols-4 border-b border-gray-500 text-xs">
              <div class="px-2 py-1 border-r border-gray-400">工號：{{ emp.id }}</div>
              <div class="px-2 py-1 border-r border-gray-400">姓名：{{ emp.name }}</div>
              <div class="px-2 py-1 border-r border-gray-400">部門：{{ emp.dept }}</div>
              <div class="px-2 py-1">職稱：{{ emp.title }}</div>
            </div>
            <!-- 主體：加項 + 右側統計 -->
            <div class="flex border-b border-gray-500">
              <table class="flex-1 border-r border-gray-500">
                <tbody>
                  <tr class="bg-blue-50">
                    <td colspan="4" class="px-2 py-0.5 font-bold border-b border-gray-400">加　項</td>
                  </tr>
                  <tr>
                    <td class="px-2 py-0.5 border-r border-b border-gray-300 bg-gray-50 w-20">底薪</td>
                    <td class="px-2 py-0.5 border-r border-b border-gray-300 text-right w-20">{{ fmt(payrollSlips[emp.id]?.baseSalary) }}</td>
                    <td class="px-2 py-0.5 border-r border-b border-gray-300 bg-gray-50 w-20">加班費</td>
                    <td class="px-2 py-0.5 border-b border-gray-300 text-right">{{ fmt((payrollSlips[emp.id]?.weekdayOvertime||0)+(payrollSlips[emp.id]?.holidayOvertime||0)) }}</td>
                  </tr>
                  <tr>
                    <td class="px-2 py-0.5 border-r border-b border-gray-300 bg-gray-50">效率獎金</td>
                    <td class="px-2 py-0.5 border-r border-b border-gray-300 text-right">{{ fmt(payrollSlips[emp.id]?.efficiencyBonus) }}</td>
                    <td class="px-2 py-0.5 border-r border-b border-gray-300 bg-gray-50">責任獎金</td>
                    <td class="px-2 py-0.5 border-b border-gray-300 text-right">{{ fmt(payrollSlips[emp.id]?.responsibilityBonus) }}</td>
                  </tr>
                  <tr>
                    <td class="px-2 py-0.5 border-r border-b border-gray-300 bg-gray-50">職務津貼</td>
                    <td class="px-2 py-0.5 border-r border-b border-gray-300 text-right">{{ fmt(payrollSlips[emp.id]?.positionAllowance) }}</td>
                    <td class="px-2 py-0.5 border-r border-b border-gray-300 bg-gray-50">伙食津貼</td>
                    <td class="px-2 py-0.5 border-b border-gray-300 text-right">{{ fmt(payrollSlips[emp.id]?.mealAllowance) }}</td>
                  </tr>
                  <tr>
                    <td class="px-2 py-0.5 border-r border-b border-gray-300 bg-gray-50">交通津貼</td>
                    <td class="px-2 py-0.5 border-r border-b border-gray-300 text-right">{{ fmt(payrollSlips[emp.id]?.transportAllowance) }}</td>
                    <td class="px-2 py-0.5 border-r border-b border-gray-300 bg-gray-50">全勤獎金</td>
                    <td class="px-2 py-0.5 border-b border-gray-300 text-right">{{ fmt(payrollSlips[emp.id]?.fullAttendanceBonus) }}</td>
                  </tr>
                  <tr class="bg-red-50">
                    <td colspan="4" class="px-2 py-0.5 font-bold border-b border-gray-400">扣　項</td>
                  </tr>
                  <tr>
                    <td class="px-2 py-0.5 border-r border-b border-gray-300 bg-gray-50">勞保費</td>
                    <td class="px-2 py-0.5 border-r border-b border-gray-300 text-right text-red-600">{{ fmt(payrollSlips[emp.id]?.laborInsuranceFee) }}</td>
                    <td class="px-2 py-0.5 border-r border-b border-gray-300 bg-gray-50">健保費</td>
                    <td class="px-2 py-0.5 border-b border-gray-300 text-right text-red-600">{{ fmt(payrollSlips[emp.id]?.healthInsuranceFee) }}</td>
                  </tr>
                  <tr>
                    <td class="px-2 py-0.5 border-r border-gray-300 bg-gray-50">團保費</td>
                    <td class="px-2 py-0.5 border-r border-gray-300 text-right text-red-600">{{ fmt(payrollSlips[emp.id]?.groupInsuranceFee) }}</td>
                    <td class="px-2 py-0.5 border-r border-gray-300 bg-gray-50">扣所得稅</td>
                    <td class="px-2 py-0.5 text-right text-red-600">{{ fmt(payrollSlips[emp.id]?.incomeTax) }}</td>
                  </tr>
                </tbody>
              </table>
              <!-- 右側統計欄 -->
              <div class="w-28 flex flex-col text-xs">
                <div class="px-2 py-1 bg-blue-50 border-b border-gray-400 font-bold text-center">加給合計</div>
                <div class="px-2 py-1.5 border-b border-gray-400 text-right font-bold text-green-700">{{ fmt(getSlipAdditions(payrollSlips[emp.id])) }}</div>
                <div class="px-2 py-1 bg-red-50 border-b border-gray-400 font-bold text-center">扣款合計</div>
                <div class="px-2 py-1.5 border-b border-gray-400 text-right font-bold text-red-600">{{ fmt(getSlipDeductions(payrollSlips[emp.id])) }}</div>
                <div class="flex-1 px-2 py-1 bg-primary-50 border-b border-gray-400 font-bold text-center text-primary-700">實領金額</div>
                <div class="px-2 py-2 text-center font-bold text-primary-700 text-sm">{{ fmt(getSlipNetPay(emp.id)) }}</div>
              </div>
            </div>
          </div>
        </template>

        <!-- ===== 報表2：各員工薪資表（直式）===== -->
        <template v-if="currentReport === 'payroll_summary_portrait'">
          <div v-for="emp in activeEmployees" :key="emp.id" class="mb-8 break-inside-avoid">
            <!-- 標題 -->
            <div class="text-center mb-3">
              <h2 class="text-base font-bold">達利電工股份有限公司</h2>
              <p class="text-sm text-gray-600">2025年2月 薪　資　表</p>
            </div>
            <!-- 員工資訊 -->
            <div class="grid grid-cols-4 border border-gray-500 text-xs mb-0">
              <div class="px-2 py-1.5 border-r border-gray-400 bg-gray-50 font-medium">工號</div>
              <div class="px-2 py-1.5 border-r border-gray-400">{{ emp.id }}</div>
              <div class="px-2 py-1.5 border-r border-gray-400 bg-gray-50 font-medium">姓名</div>
              <div class="px-2 py-1.5">{{ emp.name }}</div>
            </div>
            <div class="grid grid-cols-4 border-x border-b border-gray-500 text-xs mb-2">
              <div class="px-2 py-1.5 border-r border-gray-400 bg-gray-50 font-medium">部門</div>
              <div class="px-2 py-1.5 border-r border-gray-400">{{ emp.dept }}</div>
              <div class="px-2 py-1.5 border-r border-gray-400 bg-gray-50 font-medium">職稱</div>
              <div class="px-2 py-1.5">{{ emp.title }}</div>
            </div>
            <!-- 明細表格 -->
            <table class="w-full border-collapse text-xs">
              <thead>
                <tr class="bg-gray-200">
                  <th class="border border-gray-500 px-3 py-1.5 text-left w-32">項目</th>
                  <th class="border border-gray-500 px-3 py-1.5 text-right w-20">天數/時數</th>
                  <th class="border border-gray-500 px-3 py-1.5 text-right">金額</th>
                </tr>
              </thead>
              <tbody>
                <!-- 加項 -->
                <tr class="bg-blue-50">
                  <td colspan="3" class="border border-gray-400 px-3 py-1 font-bold text-blue-800">【加　項】</td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-3 py-1 bg-gray-50">底薪</td>
                  <td class="border border-gray-300 px-3 py-1 text-right text-gray-400">—</td>
                  <td class="border border-gray-300 px-3 py-1 text-right">{{ fmt(payrollSlips[emp.id]?.baseSalary) }}</td>
                </tr>
                <tr v-if="payrollSlips[emp.id]?.weekdayOvertime || payrollSlips[emp.id]?.holidayOvertime">
                  <td class="border border-gray-300 px-3 py-1 bg-gray-50">加班費</td>
                  <td class="border border-gray-300 px-3 py-1 text-right text-gray-400">—</td>
                  <td class="border border-gray-300 px-3 py-1 text-right">{{ fmt((payrollSlips[emp.id]?.weekdayOvertime||0)+(payrollSlips[emp.id]?.holidayOvertime||0)) }}</td>
                </tr>
                <tr v-if="payrollSlips[emp.id]?.efficiencyBonus">
                  <td class="border border-gray-300 px-3 py-1 bg-gray-50">效率獎金</td>
                  <td class="border border-gray-300 px-3 py-1 text-right text-gray-400">—</td>
                  <td class="border border-gray-300 px-3 py-1 text-right">{{ fmt(payrollSlips[emp.id]?.efficiencyBonus) }}</td>
                </tr>
                <tr v-if="payrollSlips[emp.id]?.responsibilityBonus">
                  <td class="border border-gray-300 px-3 py-1 bg-gray-50">責任獎金</td>
                  <td class="border border-gray-300 px-3 py-1 text-right text-gray-400">—</td>
                  <td class="border border-gray-300 px-3 py-1 text-right">{{ fmt(payrollSlips[emp.id]?.responsibilityBonus) }}</td>
                </tr>
                <tr v-if="payrollSlips[emp.id]?.positionAllowance">
                  <td class="border border-gray-300 px-3 py-1 bg-gray-50">職務津貼</td>
                  <td class="border border-gray-300 px-3 py-1 text-right text-gray-400">—</td>
                  <td class="border border-gray-300 px-3 py-1 text-right">{{ fmt(payrollSlips[emp.id]?.positionAllowance) }}</td>
                </tr>
                <tr v-if="payrollSlips[emp.id]?.mealAllowance">
                  <td class="border border-gray-300 px-3 py-1 bg-gray-50">伙食津貼</td>
                  <td class="border border-gray-300 px-3 py-1 text-right text-gray-400">—</td>
                  <td class="border border-gray-300 px-3 py-1 text-right">{{ fmt(payrollSlips[emp.id]?.mealAllowance) }}</td>
                </tr>
                <tr v-if="payrollSlips[emp.id]?.transportAllowance">
                  <td class="border border-gray-300 px-3 py-1 bg-gray-50">交通津貼</td>
                  <td class="border border-gray-300 px-3 py-1 text-right text-gray-400">—</td>
                  <td class="border border-gray-300 px-3 py-1 text-right">{{ fmt(payrollSlips[emp.id]?.transportAllowance) }}</td>
                </tr>
                <tr v-if="payrollSlips[emp.id]?.fullAttendanceBonus">
                  <td class="border border-gray-300 px-3 py-1 bg-gray-50">全勤獎金</td>
                  <td class="border border-gray-300 px-3 py-1 text-right text-gray-400">—</td>
                  <td class="border border-gray-300 px-3 py-1 text-right">{{ fmt(payrollSlips[emp.id]?.fullAttendanceBonus) }}</td>
                </tr>
                <!-- 加項小計 -->
                <tr class="bg-blue-50 font-bold">
                  <td class="border border-gray-500 px-3 py-1.5" colspan="2">加項小計</td>
                  <td class="border border-gray-500 px-3 py-1.5 text-right text-green-700">{{ fmt(getSlipAdditions(payrollSlips[emp.id])) }}</td>
                </tr>
                <!-- 扣項 -->
                <tr class="bg-red-50">
                  <td colspan="3" class="border border-gray-400 px-3 py-1 font-bold text-red-800">【扣　項】</td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-3 py-1 bg-gray-50">勞保費</td>
                  <td class="border border-gray-300 px-3 py-1 text-right text-gray-400">—</td>
                  <td class="border border-gray-300 px-3 py-1 text-right text-red-600">{{ fmt(payrollSlips[emp.id]?.laborInsuranceFee) }}</td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-3 py-1 bg-gray-50">健保費</td>
                  <td class="border border-gray-300 px-3 py-1 text-right text-gray-400">—</td>
                  <td class="border border-gray-300 px-3 py-1 text-right text-red-600">{{ fmt(payrollSlips[emp.id]?.healthInsuranceFee) }}</td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-3 py-1 bg-gray-50">團保費</td>
                  <td class="border border-gray-300 px-3 py-1 text-right text-gray-400">—</td>
                  <td class="border border-gray-300 px-3 py-1 text-right text-red-600">{{ fmt(payrollSlips[emp.id]?.groupInsuranceFee) }}</td>
                </tr>
                <tr v-if="payrollSlips[emp.id]?.incomeTax">
                  <td class="border border-gray-300 px-3 py-1 bg-gray-50">扣所得稅</td>
                  <td class="border border-gray-300 px-3 py-1 text-right text-gray-400">—</td>
                  <td class="border border-gray-300 px-3 py-1 text-right text-red-600">{{ fmt(payrollSlips[emp.id]?.incomeTax) }}</td>
                </tr>
                <!-- 扣項小計 + 實領 -->
                <tr class="bg-red-50 font-bold">
                  <td class="border border-gray-500 px-3 py-1.5" colspan="2">扣項小計</td>
                  <td class="border border-gray-500 px-3 py-1.5 text-right text-red-600">{{ fmt(getSlipDeductions(payrollSlips[emp.id])) }}</td>
                </tr>
                <tr class="bg-primary-50 font-bold">
                  <td class="border-2 border-gray-600 px-3 py-2 text-primary-700 text-sm" colspan="2">實　領　金　額</td>
                  <td class="border-2 border-gray-600 px-3 py-2 text-right text-primary-700 text-base">{{ fmt(getSlipNetPay(emp.id)) }}</td>
                </tr>
              </tbody>
            </table>
            <p class="text-right text-xs text-gray-400 mt-1">本薪資表由 T-ERP 人事薪資管理系統產出</p>
          </div>
        </template>

        <!-- ===== 報表3：公司薪資轉帳明細 ===== -->
        <template v-if="currentReport === 'bank_transfer'">
          <h1 class="text-xl font-bold text-center mb-1">公司薪資轉帳明細</h1>
          <p class="text-center text-gray-500 text-sm mb-6">2025年2月</p>
          <table class="w-full border-collapse text-sm">
            <thead>
              <tr class="bg-gray-100">
                <th class="border border-gray-400 px-3 py-2 text-left">員工編號</th>
                <th class="border border-gray-400 px-3 py-2 text-left">轉存局號</th>
                <th class="border border-gray-400 px-3 py-2 text-left">轉存帳號</th>
                <th class="border border-gray-400 px-3 py-2 text-left">戶名</th>
                <th class="border border-gray-400 px-3 py-2 text-left">身分證字號</th>
                <th class="border border-gray-400 px-3 py-2 text-right">轉存金額</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="emp in activeEmployees" :key="emp.id">
                <td class="border border-gray-400 px-3 py-2">{{ emp.id }}</td>
                <td class="border border-gray-400 px-3 py-2">{{ emp.bankBranchCode }}</td>
                <td class="border border-gray-400 px-3 py-2">{{ emp.bankAccount }}</td>
                <td class="border border-gray-400 px-3 py-2">{{ emp.accountHolder }}</td>
                <td class="border border-gray-400 px-3 py-2">{{ emp.idNumber }}</td>
                <td class="border border-gray-400 px-3 py-2 text-right">{{ getSlipNetPay(emp.id).toLocaleString() }}</td>
              </tr>
              <tr class="bg-gray-100 font-semibold">
                <td colspan="5" class="border border-gray-400 px-3 py-2 text-right">
                  合計（{{ activeEmployees.length }} 人）
                </td>
                <td class="border border-gray-400 px-3 py-2 text-right">
                  {{ activeEmployees.reduce((s, e) => s + getSlipNetPay(e.id), 0).toLocaleString() }}
                </td>
              </tr>
            </tbody>
          </table>
        </template>

        <!-- ===== 報表4：公司年度薪資給付明細表 ===== -->
        <template v-if="currentReport === 'annual_payroll'">
          <h1 class="text-xl font-bold text-center mb-1">公司年度薪資給付明細表</h1>
          <p class="text-center text-gray-500 text-sm mb-6">2024年度</p>
          <div class="overflow-x-auto">
            <table class="border-collapse text-xs min-w-max">
              <thead>
                <tr class="bg-gray-100">
                  <th class="border border-gray-400 px-3 py-2 text-left whitespace-nowrap">員工</th>
                  <th class="border border-gray-400 px-3 py-2 text-left whitespace-nowrap">部門</th>
                  <th v-for="m in monthLabels" :key="m" class="border border-gray-400 px-2 py-2 text-center whitespace-nowrap">{{ m }}</th>
                  <th class="border border-gray-400 px-3 py-2 text-right whitespace-nowrap bg-primary-50">年度合計</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="emp in employeeList.filter(e => monthlyPayroll[e.id])" :key="emp.id">
                  <td class="border border-gray-400 px-3 py-2 whitespace-nowrap">{{ emp.name }}</td>
                  <td class="border border-gray-400 px-3 py-2 whitespace-nowrap">{{ emp.dept }}</td>
                  <td
                    v-for="(val, key) in monthlyPayroll[emp.id]"
                    :key="key"
                    class="border border-gray-400 px-2 py-2 text-right whitespace-nowrap"
                  >
                    {{ val.toLocaleString() }}
                  </td>
                  <td class="border border-gray-400 px-3 py-2 text-right font-bold whitespace-nowrap bg-primary-50">
                    {{ getAnnualTotal(emp.id).toLocaleString() }}
                  </td>
                </tr>
                <tr class="bg-gray-100 font-semibold">
                  <td colspan="2" class="border border-gray-400 px-3 py-2">合計</td>
                  <td
                    v-for="(month, idx) in ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']"
                    :key="idx"
                    class="border border-gray-400 px-2 py-2 text-right whitespace-nowrap"
                  >
                    {{ employeeList.filter(e => monthlyPayroll[e.id]).reduce((s, e) => s + (monthlyPayroll[e.id][month] || 0), 0).toLocaleString() }}
                  </td>
                  <td class="border border-gray-400 px-3 py-2 text-right bg-primary-50">
                    {{ employeeList.filter(e => monthlyPayroll[e.id]).reduce((s, e) => s + getAnnualTotal(e.id), 0).toLocaleString() }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>

        <!-- ===== 報表5：員工總表 ===== -->
        <template v-if="currentReport === 'employee_roster'">
          <div class="mb-6 p-4 bg-gray-50 rounded-lg no-print">
            <p class="text-sm font-medium text-gray-700 mb-3">選擇列印欄位：</p>
            <div class="flex flex-wrap gap-4">
              <label
                v-for="(col, key) in employeeListColumns"
                :key="key"
                class="flex items-center gap-2 cursor-pointer select-none"
              >
                <input type="checkbox" v-model="col.selected" class="w-4 h-4 accent-primary-400" />
                <span class="text-sm">{{ col.label }}</span>
              </label>
            </div>
          </div>
          <h1 class="text-xl font-bold text-center mb-1">員工總表</h1>
          <p class="text-center text-gray-500 text-sm mb-6">2025年2月</p>
          <table class="w-full border-collapse text-sm">
            <thead>
              <tr class="bg-gray-100">
                <th class="border border-gray-400 px-3 py-2 text-center w-10 no-print">#</th>
                <template v-for="(col, key) in employeeListColumns" :key="key">
                  <th v-if="col.selected" class="border border-gray-400 px-3 py-2 text-left whitespace-nowrap">
                    {{ col.label }}
                  </th>
                </template>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(emp, idx) in employeeList" :key="emp.id">
                <td class="border border-gray-400 px-3 py-2 text-center no-print">{{ idx + 1 }}</td>
                <td v-if="employeeListColumns.id.selected" class="border border-gray-400 px-3 py-2">{{ emp.id }}</td>
                <td v-if="employeeListColumns.name.selected" class="border border-gray-400 px-3 py-2">{{ emp.name }}</td>
                <td v-if="employeeListColumns.dept.selected" class="border border-gray-400 px-3 py-2">{{ emp.dept }}</td>
                <td v-if="employeeListColumns.title.selected" class="border border-gray-400 px-3 py-2">{{ emp.title }}</td>
                <td v-if="employeeListColumns.date.selected" class="border border-gray-400 px-3 py-2">{{ emp.date }}</td>
                <td v-if="employeeListColumns.status.selected" class="border border-gray-400 px-3 py-2">{{ emp.status }}</td>
                <td v-if="employeeListColumns.idNumber.selected" class="border border-gray-400 px-3 py-2">{{ emp.idNumber }}</td>
                <td v-if="employeeListColumns.baseSalary.selected" class="border border-gray-400 px-3 py-2 text-right">{{ emp.baseSalary.toLocaleString() }}</td>
                <td v-if="employeeListColumns.bankAccount.selected" class="border border-gray-400 px-3 py-2">{{ emp.bankAccount }}</td>
              </tr>
            </tbody>
          </table>
        </template>

      </div><!-- end print-area -->
    </div><!-- end modal inner -->
  </div><!-- end overlay -->
</template>
