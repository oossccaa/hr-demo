<script setup>
import { ref, reactive, computed } from 'vue'

const emit = defineEmits(['toast'])

// ─── Utility ─────────────────────────────────────────────────────────────────
const today = new Date()
const thisYear = today.getFullYear()
const thisMonth = today.getMonth() + 1

function isThisMonth(dateStr) {
  if (!dateStr) return false
  const parts = dateStr.split('/').map(Number)
  return parts[0] === thisYear && parts[1] === thisMonth
}

function daysUntil(dateStr) {
  if (!dateStr) return null
  const target = new Date(dateStr.replace(/\//g, '-'))
  return Math.ceil((target - today) / 86400000)
}

function fmt(n) { return (n || 0).toLocaleString() }
function fmtKm(n) { return `${(n || 0).toLocaleString()} km` }

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const activeTab = ref('overview')
const tabs = [
  { id: 'overview',     label: '車輛總覽' },
  { id: 'vehicles',     label: '車籍管理' },
  { id: 'repairs',      label: '維修紀錄' },
  { id: 'maintenance',  label: '保養紀錄' },
]

// ─── 員工清單（供指派駕駛使用）────────────────────────────────────────────────
const driverOptions = [
  { id: '', name: '（未指定）' },
  { id: 'A001', name: 'A001 王大明' },
  { id: 'A003', name: 'A003 陳小華' },
  { id: 'A004', name: 'A004 林建志' },
  { id: 'A005', name: 'A005 張美玲' },
  { id: 'A006', name: 'A006 劉志遠' },
]

// ─── 車輛資料 ─────────────────────────────────────────────────────────────────
const vehicles = reactive([
  {
    id: 'V001', plate: 'ABC-1234', brand: '豐田', model: 'Hiace',
    year: 2020, color: '白色', fuelType: '汽油', engineCC: 2400,
    purchaseDate: '2020/03/15', regNumber: 'AB-000001',
    dept: '工務部', assignedDriver: 'A001', status: '使用中',
    odometer: 87500, notes: '主要載工具用車',
    lastInspectionDate: '2024/02/10', nextInspectionDate: '2026/02/28',
    compulsoryStart: '2025/04/01', compulsoryEnd: '2026/04/01',
    accidentStart:   '2025/04/01', accidentEnd:   '2026/04/01',
  },
  {
    id: 'V002', plate: 'DEF-5678', brand: '三菱', model: 'Canter 3.5T',
    year: 2019, color: '白色', fuelType: '柴油', engineCC: 3000,
    purchaseDate: '2019/07/20', regNumber: 'DE-000002',
    dept: '工務部', assignedDriver: 'A003', status: '使用中',
    odometer: 132000, notes: '工程物料運送',
    lastInspectionDate: '2025/05/05', nextInspectionDate: '2026/05/05',
    compulsoryStart: '2025/02/01', compulsoryEnd: '2026/02/28',
    accidentStart:   '2025/02/01', accidentEnd:   '2026/02/28',
  },
  {
    id: 'V003', plate: 'GHI-9012', brand: '福特', model: 'Transit',
    year: 2021, color: '銀色', fuelType: '汽油', engineCC: 2000,
    purchaseDate: '2021/11/01', regNumber: 'GH-000003',
    dept: '業務部', assignedDriver: 'A004', status: '使用中',
    odometer: 56000, notes: '業務人員巡訪用車',
    lastInspectionDate: '2025/07/15', nextInspectionDate: '2026/07/15',
    compulsoryStart: '2025/03/01', compulsoryEnd: '2026/03/01',
    accidentStart:   '2025/02/10', accidentEnd:   '2026/02/28',
  },
  {
    id: 'V004', plate: 'JKL-3456', brand: '日產', model: 'Urvan',
    year: 2016, color: '白色', fuelType: '汽油', engineCC: 2400,
    purchaseDate: '2016/05/10', regNumber: 'JK-000004',
    dept: '工務部', assignedDriver: '', status: '停保',
    odometer: 198000, notes: '已停駛，待決定是否報廢',
    lastInspectionDate: '2023/10/01', nextInspectionDate: '2024/10/01',
    compulsoryStart: '2023/09/01', compulsoryEnd: '2024/09/01',
    accidentStart:   '2023/09/01', accidentEnd:   '2024/09/01',
  },
  {
    id: 'V005', plate: 'MNO-7890', brand: '鈴木', model: 'Carry',
    year: 2022, color: '藍色', fuelType: '汽油', engineCC: 1200,
    purchaseDate: '2022/04/18', regNumber: 'MN-000005',
    dept: '行政部', assignedDriver: 'A005', status: '使用中',
    odometer: 34000, notes: '辦公室日常採購用',
    lastInspectionDate: '2025/11/20', nextInspectionDate: '2026/11/20',
    compulsoryStart: '2025/12/01', compulsoryEnd: '2026/12/01',
    accidentStart:   '2025/12/01', accidentEnd:   '2026/12/01',
  },
  {
    id: 'V006', plate: 'PQR-2345', brand: '豐田', model: 'Land Cruiser',
    year: 2012, color: '黑色', fuelType: '柴油', engineCC: 4500,
    purchaseDate: '2012/09/01', regNumber: 'PQ-000006',
    dept: '工務部', assignedDriver: '', status: '報廢',
    odometer: 320000, notes: '2025/01 辦理報廢登記',
    lastInspectionDate: '2023/08/01', nextInspectionDate: '',
    compulsoryStart: '', compulsoryEnd: '',
    accidentStart:   '', accidentEnd:   '',
  },
])

// ─── 維修 / 保養紀錄 ──────────────────────────────────────────────────────────
const serviceRecords = reactive([
  {
    id: 'R001', vehicleId: 'V001', type: '維修',
    date: '2026/01/08', shop: '台北合格汽修廠', odometer: 85000, nextOdometer: null,
    items: [
      { name: '更換前煞車片', qty: 4, unitPrice: 750 },
      { name: '更換後煞車片', qty: 4, unitPrice: 650 },
      { name: '工資',         qty: 1, unitPrice: 2000 },
    ],
    notes: '煞車異音，檢查後確認全套更換',
  },
  {
    id: 'R002', vehicleId: 'V001', type: '保養',
    date: '2025/10/20', shop: '豐田原廠保養廠', odometer: 80000, nextOdometer: 85000,
    items: [
      { name: '機油（全合成 5W40）', qty: 6, unitPrice: 350 },
      { name: '機油芯',              qty: 1, unitPrice: 250 },
      { name: '空氣芯',              qty: 1, unitPrice: 380 },
      { name: '工資',                qty: 1, unitPrice: 800 },
    ],
    notes: '定期5萬公里大保養',
  },
  {
    id: 'R003', vehicleId: 'V002', type: '維修',
    date: '2025/12/15', shop: '三菱商用車服務中心', odometer: 128000, nextOdometer: null,
    items: [
      { name: '更換電瓶 95AH', qty: 1, unitPrice: 4800 },
      { name: '工資',          qty: 1, unitPrice: 500 },
    ],
    notes: '電瓶無法啟動',
  },
  {
    id: 'R004', vehicleId: 'V002', type: '保養',
    date: '2025/11/10', shop: '三菱商用車服務中心', odometer: 125000, nextOdometer: 130000,
    items: [
      { name: '柴油機油（10W40）', qty: 8, unitPrice: 280 },
      { name: '機油芯',            qty: 1, unitPrice: 320 },
      { name: '柴油芯',            qty: 1, unitPrice: 450 },
      { name: '工資',              qty: 1, unitPrice: 900 },
    ],
    notes: '',
  },
  {
    id: 'R005', vehicleId: 'V003', type: '維修',
    date: '2025/09/03', shop: '福特原廠服務中心', odometer: 50000, nextOdometer: null,
    items: [
      { name: '更換雨刷片', qty: 2, unitPrice: 300 },
      { name: '輪胎旋轉',  qty: 1, unitPrice: 600 },
      { name: '工資',      qty: 1, unitPrice: 500 },
    ],
    notes: '',
  },
  {
    id: 'R006', vehicleId: 'V005', type: '保養',
    date: '2026/01/25', shop: '鈴木聯合汽修', odometer: 32000, nextOdometer: 37000,
    items: [
      { name: '機油（礦物油 5W30）', qty: 3, unitPrice: 180 },
      { name: '機油芯',              qty: 1, unitPrice: 180 },
      { name: '工資',                qty: 1, unitPrice: 500 },
    ],
    notes: '',
  },
])

function recordTotal(record) {
  return record.items.reduce((sum, i) => sum + (i.qty * i.unitPrice), 0)
}

// ─── 總覽 Computed ────────────────────────────────────────────────────────────
const statTotal    = computed(() => vehicles.filter(v => v.status !== '報廢').length)
const statActive   = computed(() => vehicles.filter(v => v.status === '使用中').length)
const statStopped  = computed(() => vehicles.filter(v => v.status === '停保').length)
const statScrapped = computed(() => vehicles.filter(v => v.status === '報廢').length)

const inspectionThisMonth  = computed(() => vehicles.filter(v => isThisMonth(v.nextInspectionDate) && v.status !== '報廢'))
const compulsoryThisMonth  = computed(() => vehicles.filter(v => isThisMonth(v.compulsoryEnd) && v.status !== '報廢'))
const accidentThisMonth    = computed(() => vehicles.filter(v => isThisMonth(v.accidentEnd) && v.status !== '報廢'))

// ─── 車籍管理 ─────────────────────────────────────────────────────────────────
const searchText   = ref('')
const filterStatus = ref('')
const filterDept   = ref('')

const uniqueDepts = computed(() => [...new Set(vehicles.map(v => v.dept))])

const filteredVehicles = computed(() => {
  const q = searchText.value.toLowerCase()
  return vehicles.filter(v => {
    const matchText   = !q || v.plate.toLowerCase().includes(q) || v.brand.includes(searchText.value) || v.model.includes(searchText.value)
    const matchStatus = !filterStatus.value || v.status === filterStatus.value
    const matchDept   = !filterDept.value   || v.dept   === filterDept.value
    return matchText && matchStatus && matchDept
  })
})

function getStatusClass(status) {
  if (status === '使用中') return 'bg-success/10 text-success border border-success/20'
  if (status === '停保')   return 'bg-warning/10 text-warning border border-warning/20'
  return 'bg-danger/10 text-danger border border-danger/20'
}

function getDaysClass(days) {
  if (days === null) return ''
  if (days < 0)  return 'text-danger font-semibold'
  if (days <= 30) return 'text-warning font-semibold'
  return 'text-gray-500'
}

// --- Vehicle Modal ---
const showVehicleModal  = ref(false)
const vehicleModalTab   = ref('basic')
const isNewVehicle      = ref(false)
const editingVehicle    = ref({})

function openNewVehicle() {
  editingVehicle.value = {
    id: `V${String(vehicles.length + 1).padStart(3, '0')}`,
    plate: '', brand: '', model: '', year: new Date().getFullYear(),
    color: '白色', fuelType: '汽油', engineCC: 0,
    purchaseDate: '', regNumber: '', dept: '', assignedDriver: '', status: '使用中',
    odometer: 0, notes: '',
    lastInspectionDate: '', nextInspectionDate: '',
    compulsoryStart: '', compulsoryEnd: '',
    accidentStart: '', accidentEnd: '',
  }
  isNewVehicle.value = true
  vehicleModalTab.value = 'basic'
  showVehicleModal.value = true
}

function openEditVehicle(v) {
  editingVehicle.value = { ...v }
  isNewVehicle.value = false
  vehicleModalTab.value = 'basic'
  showVehicleModal.value = true
}

function saveVehicle() {
  if (isNewVehicle.value) {
    vehicles.push({ ...editingVehicle.value })
    emit('toast', `已新增車輛 ${editingVehicle.value.plate}`)
  } else {
    const idx = vehicles.findIndex(v => v.id === editingVehicle.value.id)
    if (idx !== -1) Object.assign(vehicles[idx], editingVehicle.value)
    emit('toast', `車輛 ${editingVehicle.value.plate} 資料已儲存`)
  }
  showVehicleModal.value = false
}

// ─── 車輛詳情 Modal ───────────────────────────────────────────────────────────
const showDetailModal  = ref(false)
const detailVehicle    = ref(null)
const detailExpandedId = ref(null)

function openDetailModal(v) {
  detailVehicle.value    = v
  detailExpandedId.value = null
  showDetailModal.value  = true
}

const detailRepairs      = computed(() => detailVehicle.value
  ? serviceRecords.filter(r => r.vehicleId === detailVehicle.value.id && r.type === '維修').sort((a, b) => b.date.localeCompare(a.date))
  : [])
const detailMaintenances = computed(() => detailVehicle.value
  ? serviceRecords.filter(r => r.vehicleId === detailVehicle.value.id && r.type === '保養').sort((a, b) => b.date.localeCompare(a.date))
  : [])

function toggleDetailExpand(id) {
  detailExpandedId.value = detailExpandedId.value === id ? null : id
}

// ─── 維修 / 保養紀錄 ──────────────────────────────────────────────────────────
const filterRecordVehicle = ref('')
const expandedRecordId    = ref(null)

function getRecordsByType(type) {
  return serviceRecords.filter(r => {
    const matchType    = r.type === type
    const matchVehicle = !filterRecordVehicle.value || r.vehicleId === filterRecordVehicle.value
    return matchType && matchVehicle
  }).sort((a, b) => b.date.localeCompare(a.date))
}

function getVehicleName(vehicleId) {
  const v = vehicles.find(v => v.id === vehicleId)
  return v ? `${v.plate} ${v.brand} ${v.model}` : vehicleId
}

function toggleExpand(id) {
  expandedRecordId.value = expandedRecordId.value === id ? null : id
}

// --- Record Modal ---
const showRecordModal  = ref(false)
const recordModalType  = ref('維修')
const isNewRecord      = ref(false)
const editingRecord    = ref({ vehicleId: '', date: '', shop: '', odometer: 0, nextOdometer: null, items: [], notes: '' })

function openNewRecord(type, prefilledVehicleId = '') {
  recordModalType.value = type
  editingRecord.value = {
    id: `R${String(serviceRecords.length + 1).padStart(3, '0')}`,
    vehicleId: prefilledVehicleId || filterRecordVehicle.value || '',
    type, date: '', shop: '', odometer: 0,
    nextOdometer: type === '保養' ? 0 : null,
    items: [{ name: '', qty: 1, unitPrice: 0 }],
    notes: '',
  }
  isNewRecord.value = true
  showRecordModal.value = true
}

function openEditRecord(r) {
  recordModalType.value = r.type
  editingRecord.value = { ...r, items: r.items.map(i => ({ ...i })) }
  isNewRecord.value = false
  showRecordModal.value = true
}

function deleteRecord(id) {
  if (!confirm('確定刪除此筆紀錄？')) return
  const idx = serviceRecords.findIndex(r => r.id === id)
  if (idx !== -1) serviceRecords.splice(idx, 1)
  emit('toast', '紀錄已刪除')
}

function addItem() {
  editingRecord.value.items.push({ name: '', qty: 1, unitPrice: 0 })
}

function removeItem(idx) {
  editingRecord.value.items.splice(idx, 1)
}

function editingTotal() {
  return editingRecord.value.items.reduce((sum, i) => sum + (i.qty * i.unitPrice), 0)
}

function saveRecord() {
  if (!editingRecord.value.vehicleId) { emit('toast', '請選擇車輛'); return }
  if (!editingRecord.value.date)      { emit('toast', '請填寫日期'); return }
  if (isNewRecord.value) {
    serviceRecords.push({ ...editingRecord.value, items: editingRecord.value.items.map(i => ({ ...i })) })
    emit('toast', `已新增${editingRecord.value.type}紀錄`)
  } else {
    const idx = serviceRecords.findIndex(r => r.id === editingRecord.value.id)
    if (idx !== -1) Object.assign(serviceRecords[idx], { ...editingRecord.value, items: editingRecord.value.items.map(i => ({ ...i })) })
    emit('toast', `${editingRecord.value.type}紀錄已更新`)
  }
  showRecordModal.value = false
}
</script>

<template>
  <!-- ── Tab Bar ─────────────────────────────────────────────────────────── -->
  <div class="flex gap-1 border-b border-gray-200 mb-6">
    <button
      v-for="tab in tabs" :key="tab.id"
      @click="activeTab = tab.id"
      class="px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors"
      :class="activeTab === tab.id
        ? 'bg-white border border-b-white border-gray-200 -mb-px text-primary-700'
        : 'text-gray-500 hover:text-gray-700'"
    >{{ tab.label }}</button>
  </div>

  <!-- ══════════════════════════════════════════════════════════════════════
       Tab 1：車輛總覽
  ═══════════════════════════════════════════════════════════════════════ -->
  <div v-if="activeTab === 'overview'">

    <!-- 統計卡 -->
    <div class="grid grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <p class="text-xs text-gray-500 mb-1">在用車輛數</p>
        <p class="text-3xl font-bold text-primary-700">{{ statTotal }}</p>
        <p class="text-xs text-gray-400 mt-1">（不含報廢）</p>
      </div>
      <div class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <p class="text-xs text-gray-500 mb-1">使用中</p>
        <p class="text-3xl font-bold text-success">{{ statActive }}</p>
      </div>
      <div class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <p class="text-xs text-gray-500 mb-1">停保</p>
        <p class="text-3xl font-bold text-warning">{{ statStopped }}</p>
      </div>
      <div class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <p class="text-xs text-gray-500 mb-1">報廢</p>
        <p class="text-3xl font-bold text-danger">{{ statScrapped }}</p>
      </div>
    </div>

    <!-- 本月提醒 -->
    <div class="grid grid-cols-3 gap-4 mb-6">

      <!-- 本月驗車 -->
      <div class="bg-white rounded-xl border border-orange-200 shadow-sm overflow-hidden">
        <div class="px-4 py-2.5 bg-orange-50 border-b border-orange-200 flex items-center gap-2">
          <span class="text-base">🔍</span>
          <span class="text-sm font-semibold text-orange-700">本月需驗車</span>
          <span class="ml-auto bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">{{ inspectionThisMonth.length }}</span>
        </div>
        <div class="p-3 space-y-2 min-h-[60px]">
          <p v-if="inspectionThisMonth.length === 0" class="text-xs text-gray-400 py-2 text-center">本月無需驗車</p>
          <div v-for="v in inspectionThisMonth" :key="v.id"
            class="flex items-center justify-between gap-2 p-2 rounded-lg bg-orange-50 border border-orange-100">
            <div>
              <p class="text-sm font-medium text-gray-800">{{ v.plate }}</p>
              <p class="text-xs text-gray-500">{{ v.brand }} {{ v.model }}</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-orange-600 font-medium">{{ v.nextInspectionDate }}</p>
              <span class="text-xs px-1.5 py-0.5 rounded" :class="getStatusClass(v.status)">{{ v.status }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 本月強制險到期 -->
      <div class="bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden">
        <div class="px-4 py-2.5 bg-red-50 border-b border-red-200 flex items-center gap-2">
          <span class="text-base">🛡️</span>
          <span class="text-sm font-semibold text-red-700">本月強制險到期</span>
          <span class="ml-auto bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">{{ compulsoryThisMonth.length }}</span>
        </div>
        <div class="p-3 space-y-2 min-h-[60px]">
          <p v-if="compulsoryThisMonth.length === 0" class="text-xs text-gray-400 py-2 text-center">本月無強制險到期</p>
          <div v-for="v in compulsoryThisMonth" :key="v.id"
            class="flex items-center justify-between gap-2 p-2 rounded-lg bg-red-50 border border-red-100">
            <div>
              <p class="text-sm font-medium text-gray-800">{{ v.plate }}</p>
              <p class="text-xs text-gray-500">{{ v.brand }} {{ v.model }}</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-red-600 font-medium">{{ v.compulsoryEnd }}</p>
              <span class="text-xs px-1.5 py-0.5 rounded" :class="getStatusClass(v.status)">{{ v.status }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 本月意外險到期 -->
      <div class="bg-white rounded-xl border border-purple-200 shadow-sm overflow-hidden">
        <div class="px-4 py-2.5 bg-purple-50 border-b border-purple-200 flex items-center gap-2">
          <span class="text-base">📋</span>
          <span class="text-sm font-semibold text-purple-700">本月意外險到期</span>
          <span class="ml-auto bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full">{{ accidentThisMonth.length }}</span>
        </div>
        <div class="p-3 space-y-2 min-h-[60px]">
          <p v-if="accidentThisMonth.length === 0" class="text-xs text-gray-400 py-2 text-center">本月無意外險到期</p>
          <div v-for="v in accidentThisMonth" :key="v.id"
            class="flex items-center justify-between gap-2 p-2 rounded-lg bg-purple-50 border border-purple-100">
            <div>
              <p class="text-sm font-medium text-gray-800">{{ v.plate }}</p>
              <p class="text-xs text-gray-500">{{ v.brand }} {{ v.model }}</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-purple-600 font-medium">{{ v.accidentEnd }}</p>
              <span class="text-xs px-1.5 py-0.5 rounded" :class="getStatusClass(v.status)">{{ v.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速清單 -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="px-5 py-3 border-b border-gray-200 bg-gray-50">
        <span class="text-sm font-semibold text-gray-700">所有車輛快覽</span>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="px-4 py-2.5 text-left font-semibold text-gray-600">車牌</th>
              <th class="px-4 py-2.5 text-left font-semibold text-gray-600">廠牌型號</th>
              <th class="px-4 py-2.5 text-left font-semibold text-gray-600">部門</th>
              <th class="px-4 py-2.5 text-left font-semibold text-gray-600">狀態</th>
              <th class="px-4 py-2.5 text-left font-semibold text-gray-600">驗車到期</th>
              <th class="px-4 py-2.5 text-left font-semibold text-gray-600">強制險到期</th>
              <th class="px-4 py-2.5 text-left font-semibold text-gray-600">意外險到期</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="v in vehicles" :key="v.id" class="border-b border-gray-100 hover:bg-gray-50">
              <td class="px-4 py-2.5 font-medium text-primary-700">{{ v.plate }}</td>
              <td class="px-4 py-2.5 text-gray-700">{{ v.brand }} {{ v.model }}</td>
              <td class="px-4 py-2.5 text-gray-500">{{ v.dept }}</td>
              <td class="px-4 py-2.5">
                <span class="text-xs px-2 py-0.5 rounded-full" :class="getStatusClass(v.status)">{{ v.status }}</span>
              </td>
              <td class="px-4 py-2.5" :class="isThisMonth(v.nextInspectionDate) ? 'text-orange-600 font-semibold' : 'text-gray-500'">
                {{ v.nextInspectionDate || '—' }}
              </td>
              <td class="px-4 py-2.5" :class="isThisMonth(v.compulsoryEnd) ? 'text-red-600 font-semibold' : 'text-gray-500'">
                {{ v.compulsoryEnd || '—' }}
              </td>
              <td class="px-4 py-2.5" :class="isThisMonth(v.accidentEnd) ? 'text-purple-600 font-semibold' : 'text-gray-500'">
                {{ v.accidentEnd || '—' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════════════
       Tab 2：車籍管理
  ═══════════════════════════════════════════════════════════════════════ -->
  <div v-if="activeTab === 'vehicles'">

    <!-- 搜尋列 -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4 flex flex-wrap gap-3 items-center">
      <input v-model="searchText" placeholder="搜尋車牌 / 廠牌 / 型號..."
        class="px-3 py-2 border border-gray-200 rounded-lg text-sm w-56 focus:outline-none focus:border-primary-400" />
      <select v-model="filterStatus"
        class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400">
        <option value="">全部狀態</option>
        <option>使用中</option>
        <option>停保</option>
        <option>報廢</option>
      </select>
      <select v-model="filterDept"
        class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400">
        <option value="">全部部門</option>
        <option v-for="d in uniqueDepts" :key="d">{{ d }}</option>
      </select>
      <button @click="searchText=''; filterStatus=''; filterDept=''"
        class="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg">清除篩選</button>
      <div class="ml-auto">
        <button @click="openNewVehicle"
          class="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
          + 新增車輛
        </button>
      </div>
    </div>

    <!-- 車輛表格 -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="px-4 py-2.5 text-left font-semibold text-gray-600 w-8">#</th>
              <th class="px-4 py-2.5 text-left font-semibold text-gray-600">車牌</th>
              <th class="px-4 py-2.5 text-left font-semibold text-gray-600">廠牌型號</th>
              <th class="px-4 py-2.5 text-left font-semibold text-gray-600">年份</th>
              <th class="px-4 py-2.5 text-left font-semibold text-gray-600">部門</th>
              <th class="px-4 py-2.5 text-left font-semibold text-gray-600">指定駕駛</th>
              <th class="px-4 py-2.5 text-left font-semibold text-gray-600">里程</th>
              <th class="px-4 py-2.5 text-left font-semibold text-gray-600">狀態</th>
              <th class="px-4 py-2.5 text-center font-semibold text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(v, idx) in filteredVehicles" :key="v.id" class="border-b border-gray-100 hover:bg-gray-50">
              <td class="px-4 py-2.5 text-gray-400 text-xs">{{ idx + 1 }}</td>
              <td class="px-4 py-2.5 font-medium text-primary-700">{{ v.plate }}</td>
              <td class="px-4 py-2.5 text-gray-700">{{ v.brand }} {{ v.model }}</td>
              <td class="px-4 py-2.5 text-gray-500">{{ v.year }}</td>
              <td class="px-4 py-2.5 text-gray-500">{{ v.dept }}</td>
              <td class="px-4 py-2.5 text-gray-500">
                {{ driverOptions.find(d => d.id === v.assignedDriver)?.name || '—' }}
              </td>
              <td class="px-4 py-2.5 text-gray-500">{{ fmtKm(v.odometer) }}</td>
              <td class="px-4 py-2.5">
                <span class="text-xs px-2 py-0.5 rounded-full" :class="getStatusClass(v.status)">{{ v.status }}</span>
              </td>
              <td class="px-4 py-2.5 text-center">
                <div class="flex items-center justify-center gap-2">
                <button @click="openDetailModal(v)"
                  class="text-xs px-3 py-1 rounded bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200">
                  詳情
                </button>
                <button @click="openEditVehicle(v)"
                  class="text-xs px-3 py-1 rounded bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-100">
                  編輯
                </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredVehicles.length === 0">
              <td colspan="9" class="px-4 py-6 text-center text-gray-400 text-sm">無符合條件的車輛</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════════════
       Tab 3：維修紀錄
  ═══════════════════════════════════════════════════════════════════════ -->
  <div v-if="activeTab === 'repairs'">
    <div class="flex items-center gap-3 mb-4">
      <select v-model="filterRecordVehicle"
        class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400">
        <option value="">全部車輛</option>
        <option v-for="v in vehicles" :key="v.id" :value="v.id">{{ v.plate }} {{ v.brand }} {{ v.model }}</option>
      </select>
      <div class="ml-auto">
        <button @click="openNewRecord('維修')"
          class="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
          + 新增維修紀錄
        </button>
      </div>
    </div>

    <div class="space-y-3">
      <p v-if="getRecordsByType('維修').length === 0" class="text-center text-gray-400 py-8">尚無維修紀錄</p>
      <div v-for="r in getRecordsByType('維修')" :key="r.id"
        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="flex items-center gap-4 px-5 py-3.5">
          <div class="flex-1 grid grid-cols-5 gap-4">
            <div>
              <p class="text-xs text-gray-400">日期</p>
              <p class="text-sm font-medium text-gray-800">{{ r.date }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400">車輛</p>
              <p class="text-sm text-primary-700 font-medium">{{ vehicles.find(v=>v.id===r.vehicleId)?.plate || r.vehicleId }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400">廠商</p>
              <p class="text-sm text-gray-700">{{ r.shop }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400">施工里程</p>
              <p class="text-sm text-gray-700">{{ fmtKm(r.odometer) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400">金額</p>
              <p class="text-sm font-semibold text-gray-800">$ {{ fmt(recordTotal(r)) }}</p>
            </div>
          </div>
          <div class="flex gap-2 shrink-0">
            <button @click="toggleExpand(r.id)"
              class="text-xs px-3 py-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50">
              {{ expandedRecordId === r.id ? '收合' : '明細' }}
            </button>
            <button @click="openEditRecord(r)"
              class="text-xs px-3 py-1 rounded bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-100">
              編輯
            </button>
            <button @click="deleteRecord(r.id)"
              class="text-xs px-3 py-1 rounded bg-danger/5 text-danger hover:bg-danger/10 border border-danger/15">
              刪除
            </button>
          </div>
        </div>
        <!-- 展開明細 -->
        <div v-if="expandedRecordId === r.id" class="border-t border-gray-100 px-5 pb-4 pt-3 bg-gray-50">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-xs text-gray-500 border-b border-gray-200">
                <th class="pb-1 text-left font-medium">項目</th>
                <th class="pb-1 text-right font-medium w-16">數量</th>
                <th class="pb-1 text-right font-medium w-24">單價</th>
                <th class="pb-1 text-right font-medium w-24">小計</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in r.items" :key="idx" class="border-b border-gray-100">
                <td class="py-1.5 text-gray-700">{{ item.name }}</td>
                <td class="py-1.5 text-right text-gray-600">{{ item.qty }}</td>
                <td class="py-1.5 text-right text-gray-600">$ {{ fmt(item.unitPrice) }}</td>
                <td class="py-1.5 text-right font-medium text-gray-800">$ {{ fmt(item.qty * item.unitPrice) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="pt-2 text-right font-semibold text-gray-700">合計</td>
                <td class="pt-2 text-right font-bold text-primary-700">$ {{ fmt(recordTotal(r)) }}</td>
              </tr>
            </tfoot>
          </table>
          <p v-if="r.notes" class="mt-2 text-xs text-gray-500 bg-white border border-gray-100 rounded px-3 py-2">備註：{{ r.notes }}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════════════
       Tab 4：保養紀錄
  ═══════════════════════════════════════════════════════════════════════ -->
  <div v-if="activeTab === 'maintenance'">
    <div class="flex items-center gap-3 mb-4">
      <select v-model="filterRecordVehicle"
        class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400">
        <option value="">全部車輛</option>
        <option v-for="v in vehicles" :key="v.id" :value="v.id">{{ v.plate }} {{ v.brand }} {{ v.model }}</option>
      </select>
      <div class="ml-auto">
        <button @click="openNewRecord('保養')"
          class="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
          + 新增保養紀錄
        </button>
      </div>
    </div>

    <div class="space-y-3">
      <p v-if="getRecordsByType('保養').length === 0" class="text-center text-gray-400 py-8">尚無保養紀錄</p>
      <div v-for="r in getRecordsByType('保養')" :key="r.id"
        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="flex items-center gap-4 px-5 py-3.5">
          <div class="flex-1 grid grid-cols-5 gap-4">
            <div>
              <p class="text-xs text-gray-400">日期</p>
              <p class="text-sm font-medium text-gray-800">{{ r.date }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400">車輛</p>
              <p class="text-sm text-primary-700 font-medium">{{ vehicles.find(v=>v.id===r.vehicleId)?.plate || r.vehicleId }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400">廠商</p>
              <p class="text-sm text-gray-700">{{ r.shop }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400">施工里程</p>
              <p class="text-sm text-gray-700">{{ fmtKm(r.odometer) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400">下次建議里程</p>
              <p class="text-sm text-gray-700">{{ r.nextOdometer ? fmtKm(r.nextOdometer) : '—' }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3 shrink-0">
            <p class="text-sm font-semibold text-gray-800">$ {{ fmt(recordTotal(r)) }}</p>
            <button @click="toggleExpand(r.id)"
              class="text-xs px-3 py-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50">
              {{ expandedRecordId === r.id ? '收合' : '明細' }}
            </button>
            <button @click="openEditRecord(r)"
              class="text-xs px-3 py-1 rounded bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-100">
              編輯
            </button>
            <button @click="deleteRecord(r.id)"
              class="text-xs px-3 py-1 rounded bg-danger/5 text-danger hover:bg-danger/10 border border-danger/15">
              刪除
            </button>
          </div>
        </div>
        <!-- 展開明細 -->
        <div v-if="expandedRecordId === r.id" class="border-t border-gray-100 px-5 pb-4 pt-3 bg-gray-50">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-xs text-gray-500 border-b border-gray-200">
                <th class="pb-1 text-left font-medium">項目</th>
                <th class="pb-1 text-right font-medium w-16">數量</th>
                <th class="pb-1 text-right font-medium w-24">單價</th>
                <th class="pb-1 text-right font-medium w-24">小計</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in r.items" :key="idx" class="border-b border-gray-100">
                <td class="py-1.5 text-gray-700">{{ item.name }}</td>
                <td class="py-1.5 text-right text-gray-600">{{ item.qty }}</td>
                <td class="py-1.5 text-right text-gray-600">$ {{ fmt(item.unitPrice) }}</td>
                <td class="py-1.5 text-right font-medium text-gray-800">$ {{ fmt(item.qty * item.unitPrice) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="pt-2 text-right font-semibold text-gray-700">合計</td>
                <td class="pt-2 text-right font-bold text-primary-700">$ {{ fmt(recordTotal(r)) }}</td>
              </tr>
            </tfoot>
          </table>
          <p v-if="r.notes" class="mt-2 text-xs text-gray-500 bg-white border border-gray-100 rounded px-3 py-2">備註：{{ r.notes }}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════════════
       Modal：車輛詳情（維修 + 保養紀錄）
  ═══════════════════════════════════════════════════════════════════════ -->
  <div v-if="showDetailModal && detailVehicle" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[92vh]">

      <!-- Header -->
      <div class="flex items-center gap-3 px-6 py-4 border-b border-gray-200 shrink-0">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-lg font-bold text-primary-700">{{ detailVehicle.plate }}</span>
            <span class="text-sm text-gray-600">{{ detailVehicle.brand }} {{ detailVehicle.model }}</span>
            <span class="text-xs px-2 py-0.5 rounded-full" :class="getStatusClass(detailVehicle.status)">{{ detailVehicle.status }}</span>
          </div>
          <p class="text-xs text-gray-400 mt-0.5">{{ detailVehicle.dept }} ／ {{ detailVehicle.year }} 年款 ／ {{ fmtKm(detailVehicle.odometer) }}</p>
        </div>
        <div class="ml-auto flex items-center gap-2">
          <button @click="openEditVehicle(detailVehicle); showDetailModal=false"
            class="text-xs px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-100">
            編輯車籍
          </button>
          <button @click="showDetailModal=false" class="text-gray-400 hover:text-gray-600 text-xl leading-none ml-2">×</button>
        </div>
      </div>

      <!-- 基本資訊摘要 -->
      <div class="px-6 py-3 bg-gray-50 border-b border-gray-200 shrink-0">
        <div class="grid grid-cols-3 gap-x-6 gap-y-1 text-xs">
          <div class="flex items-center justify-between">
            <span class="text-gray-400">驗車到期</span>
            <span :class="isThisMonth(detailVehicle.nextInspectionDate) ? 'text-orange-600 font-semibold' : 'text-gray-700'">
              {{ detailVehicle.nextInspectionDate || '—' }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-400">強制險到期</span>
            <span :class="isThisMonth(detailVehicle.compulsoryEnd) ? 'text-red-600 font-semibold' : 'text-gray-700'">
              {{ detailVehicle.compulsoryEnd || '—' }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-400">意外險到期</span>
            <span :class="isThisMonth(detailVehicle.accidentEnd) ? 'text-purple-600 font-semibold' : 'text-gray-700'">
              {{ detailVehicle.accidentEnd || '—' }}
            </span>
          </div>
        </div>
      </div>

      <!-- 紀錄內容 -->
      <div class="overflow-y-auto flex-1 p-6 space-y-6">

        <!-- 維修紀錄 -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-sm font-semibold text-gray-700">🔧 維修紀錄
              <span class="ml-1 text-xs font-normal text-gray-400">（{{ detailRepairs.length }} 筆）</span>
            </h4>
            <button @click="openNewRecord('維修', detailVehicle.id)"
              class="text-xs px-3 py-1 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-100">
              + 新增維修
            </button>
          </div>
          <div class="space-y-2">
            <p v-if="detailRepairs.length === 0" class="text-xs text-gray-400 text-center py-3 border border-dashed border-gray-200 rounded-lg">尚無維修紀錄</p>
            <div v-for="r in detailRepairs" :key="r.id"
              class="border border-gray-200 rounded-xl overflow-hidden">
              <div class="flex items-center gap-3 px-4 py-2.5 bg-white">
                <div class="flex-1 grid grid-cols-4 gap-3 text-sm">
                  <div>
                    <p class="text-xs text-gray-400">日期</p>
                    <p class="font-medium text-gray-800">{{ r.date }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-400">廠商</p>
                    <p class="text-gray-700">{{ r.shop }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-400">里程</p>
                    <p class="text-gray-700">{{ fmtKm(r.odometer) }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-400">金額</p>
                    <p class="font-semibold text-gray-800">$ {{ fmt(recordTotal(r)) }}</p>
                  </div>
                </div>
                <button @click="toggleDetailExpand(r.id)"
                  class="text-xs px-2.5 py-1 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 shrink-0">
                  {{ detailExpandedId === r.id ? '收合' : '明細' }}
                </button>
                <button @click="openEditRecord(r)"
                  class="text-xs px-2.5 py-1 rounded bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-100 shrink-0">
                  編輯
                </button>
              </div>
              <div v-if="detailExpandedId === r.id" class="border-t border-gray-100 px-4 pb-3 pt-2 bg-gray-50">
                <table class="w-full text-xs">
                  <thead>
                    <tr class="text-gray-400 border-b border-gray-200">
                      <th class="pb-1 text-left font-medium">項目</th>
                      <th class="pb-1 text-right font-medium w-12">數量</th>
                      <th class="pb-1 text-right font-medium w-20">單價</th>
                      <th class="pb-1 text-right font-medium w-20">小計</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, idx) in r.items" :key="idx" class="border-b border-gray-100">
                      <td class="py-1 text-gray-700">{{ item.name }}</td>
                      <td class="py-1 text-right text-gray-600">{{ item.qty }}</td>
                      <td class="py-1 text-right text-gray-600">$ {{ fmt(item.unitPrice) }}</td>
                      <td class="py-1 text-right font-medium text-gray-800">$ {{ fmt(item.qty * item.unitPrice) }}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="3" class="pt-1.5 text-right font-semibold text-gray-700">合計</td>
                      <td class="pt-1.5 text-right font-bold text-primary-700">$ {{ fmt(recordTotal(r)) }}</td>
                    </tr>
                  </tfoot>
                </table>
                <p v-if="r.notes" class="mt-1.5 text-xs text-gray-500 bg-white border border-gray-100 rounded px-2 py-1">備註：{{ r.notes }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 保養紀錄 -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-sm font-semibold text-gray-700">🛢️ 保養紀錄
              <span class="ml-1 text-xs font-normal text-gray-400">（{{ detailMaintenances.length }} 筆）</span>
            </h4>
            <button @click="openNewRecord('保養', detailVehicle.id)"
              class="text-xs px-3 py-1 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-100">
              + 新增保養
            </button>
          </div>
          <div class="space-y-2">
            <p v-if="detailMaintenances.length === 0" class="text-xs text-gray-400 text-center py-3 border border-dashed border-gray-200 rounded-lg">尚無保養紀錄</p>
            <div v-for="r in detailMaintenances" :key="r.id"
              class="border border-gray-200 rounded-xl overflow-hidden">
              <div class="flex items-center gap-3 px-4 py-2.5 bg-white">
                <div class="flex-1 grid grid-cols-4 gap-3 text-sm">
                  <div>
                    <p class="text-xs text-gray-400">日期</p>
                    <p class="font-medium text-gray-800">{{ r.date }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-400">廠商</p>
                    <p class="text-gray-700">{{ r.shop }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-400">施工里程</p>
                    <p class="text-gray-700">{{ fmtKm(r.odometer) }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-400">下次建議里程</p>
                    <p class="text-gray-700">{{ r.nextOdometer ? fmtKm(r.nextOdometer) : '—' }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <span class="text-sm font-semibold text-gray-700">$ {{ fmt(recordTotal(r)) }}</span>
                  <button @click="toggleDetailExpand(r.id)"
                    class="text-xs px-2.5 py-1 rounded border border-gray-200 text-gray-500 hover:bg-gray-50">
                    {{ detailExpandedId === r.id ? '收合' : '明細' }}
                  </button>
                  <button @click="openEditRecord(r)"
                    class="text-xs px-2.5 py-1 rounded bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-100">
                    編輯
                  </button>
                </div>
              </div>
              <div v-if="detailExpandedId === r.id" class="border-t border-gray-100 px-4 pb-3 pt-2 bg-gray-50">
                <table class="w-full text-xs">
                  <thead>
                    <tr class="text-gray-400 border-b border-gray-200">
                      <th class="pb-1 text-left font-medium">項目</th>
                      <th class="pb-1 text-right font-medium w-12">數量</th>
                      <th class="pb-1 text-right font-medium w-20">單價</th>
                      <th class="pb-1 text-right font-medium w-20">小計</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, idx) in r.items" :key="idx" class="border-b border-gray-100">
                      <td class="py-1 text-gray-700">{{ item.name }}</td>
                      <td class="py-1 text-right text-gray-600">{{ item.qty }}</td>
                      <td class="py-1 text-right text-gray-600">$ {{ fmt(item.unitPrice) }}</td>
                      <td class="py-1 text-right font-medium text-gray-800">$ {{ fmt(item.qty * item.unitPrice) }}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="3" class="pt-1.5 text-right font-semibold text-gray-700">合計</td>
                      <td class="pt-1.5 text-right font-bold text-primary-700">$ {{ fmt(recordTotal(r)) }}</td>
                    </tr>
                  </tfoot>
                </table>
                <p v-if="r.notes" class="mt-1.5 text-xs text-gray-500 bg-white border border-gray-100 rounded px-2 py-1">備註：{{ r.notes }}</p>
              </div>
            </div>
          </div>
        </div>

      </div><!-- /body -->
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════════════
       Modal：車籍新增 / 編輯
  ═══════════════════════════════════════════════════════════════════════ -->
  <div v-if="showVehicleModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
        <h3 class="text-base font-semibold text-gray-800">{{ isNewVehicle ? '新增車輛' : `編輯車輛 ${editingVehicle.plate}` }}</h3>
        <button @click="showVehicleModal=false" class="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
      </div>

      <!-- Modal Tabs -->
      <div class="flex border-b border-gray-200 shrink-0 px-6">
        <button v-for="t in [{id:'basic',label:'基本資料'},{id:'inspection',label:'驗車資料'},{id:'insurance',label:'保險資料'}]"
          :key="t.id" @click="vehicleModalTab = t.id"
          class="py-2.5 px-4 text-sm font-medium border-b-2 transition-colors"
          :class="vehicleModalTab===t.id ? 'border-primary-500 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-700'">
          {{ t.label }}
        </button>
      </div>

      <!-- Modal Body -->
      <div class="overflow-y-auto flex-1 p-6">

        <!-- 基本資料 -->
        <div v-if="vehicleModalTab === 'basic'" class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs text-gray-500 mb-1">車牌號碼 *</label>
            <input v-model="editingVehicle.plate" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400" placeholder="ABC-1234" />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">行照號碼</label>
            <input v-model="editingVehicle.regNumber" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400" />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">廠牌</label>
            <input v-model="editingVehicle.brand" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400" placeholder="豐田" />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">型號</label>
            <input v-model="editingVehicle.model" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400" placeholder="Hiace" />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">出廠年份</label>
            <input v-model.number="editingVehicle.year" type="number" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400" />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">車身顏色</label>
            <input v-model="editingVehicle.color" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400" />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">燃料類型</label>
            <select v-model="editingVehicle.fuelType" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400">
              <option>汽油</option>
              <option>柴油</option>
              <option>電動</option>
              <option>油電</option>
            </select>
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">排氣量（cc）</label>
            <input v-model.number="editingVehicle.engineCC" type="number" min="0" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400" />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">購車日期</label>
            <input v-model="editingVehicle.purchaseDate" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400" placeholder="YYYY/MM/DD" />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">當前里程（km）</label>
            <input v-model.number="editingVehicle.odometer" type="number" min="0" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400" />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">所屬部門</label>
            <input v-model="editingVehicle.dept" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400" />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">指定駕駛</label>
            <select v-model="editingVehicle.assignedDriver" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400">
              <option v-for="d in driverOptions" :key="d.id" :value="d.id">{{ d.name }}</option>
            </select>
          </div>
          <div class="col-span-2">
            <label class="block text-xs text-gray-500 mb-1">車輛狀態</label>
            <div class="flex gap-3">
              <label v-for="s in ['使用中','停保','報廢']" :key="s" class="flex items-center gap-2 cursor-pointer">
                <input type="radio" v-model="editingVehicle.status" :value="s" class="accent-primary-600" />
                <span class="text-sm" :class="s==='使用中'?'text-success':s==='停保'?'text-warning':'text-danger'">{{ s }}</span>
              </label>
            </div>
          </div>
          <div class="col-span-2">
            <label class="block text-xs text-gray-500 mb-1">備註</label>
            <textarea v-model="editingVehicle.notes" rows="2" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400 resize-none"></textarea>
          </div>
        </div>

        <!-- 驗車資料 -->
        <div v-if="vehicleModalTab === 'inspection'" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs text-gray-500 mb-1">上次驗車日期</label>
              <input v-model="editingVehicle.lastInspectionDate" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400" placeholder="YYYY/MM/DD" />
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">下次驗車日期</label>
              <input v-model="editingVehicle.nextInspectionDate" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400" placeholder="YYYY/MM/DD" />
            </div>
          </div>
          <div v-if="editingVehicle.nextInspectionDate" class="p-3 rounded-lg"
            :class="daysUntil(editingVehicle.nextInspectionDate) !== null && daysUntil(editingVehicle.nextInspectionDate) < 0 ? 'bg-danger/5 border border-danger/20' : daysUntil(editingVehicle.nextInspectionDate) <= 30 ? 'bg-warning/5 border border-warning/20' : 'bg-gray-50 border border-gray-200'">
            <p class="text-sm" :class="getDaysClass(daysUntil(editingVehicle.nextInspectionDate))">
              <span v-if="daysUntil(editingVehicle.nextInspectionDate) < 0">已逾期 {{ Math.abs(daysUntil(editingVehicle.nextInspectionDate)) }} 天</span>
              <span v-else>距離驗車還有 {{ daysUntil(editingVehicle.nextInspectionDate) }} 天</span>
            </p>
          </div>
        </div>

        <!-- 保險資料 -->
        <div v-if="vehicleModalTab === 'insurance'" class="space-y-5">
          <div>
            <p class="text-xs font-semibold text-gray-600 mb-2">強制責任險</p>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-gray-500 mb-1">保險起日</label>
                <input v-model="editingVehicle.compulsoryStart" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400" placeholder="YYYY/MM/DD" />
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1">保險迄日</label>
                <input v-model="editingVehicle.compulsoryEnd" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400" placeholder="YYYY/MM/DD" />
              </div>
            </div>
            <div v-if="editingVehicle.compulsoryEnd" class="mt-2 px-3 py-2 rounded bg-gray-50 border border-gray-200">
              <p class="text-xs" :class="getDaysClass(daysUntil(editingVehicle.compulsoryEnd))">
                <span v-if="daysUntil(editingVehicle.compulsoryEnd) !== null && daysUntil(editingVehicle.compulsoryEnd) < 0">強制險已逾期 {{ Math.abs(daysUntil(editingVehicle.compulsoryEnd)) }} 天</span>
                <span v-else>強制險剩餘 {{ daysUntil(editingVehicle.compulsoryEnd) }} 天</span>
              </p>
            </div>
          </div>
          <div>
            <p class="text-xs font-semibold text-gray-600 mb-2">任意（意外）險</p>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-gray-500 mb-1">保險起日</label>
                <input v-model="editingVehicle.accidentStart" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400" placeholder="YYYY/MM/DD" />
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1">保險迄日</label>
                <input v-model="editingVehicle.accidentEnd" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400" placeholder="YYYY/MM/DD" />
              </div>
            </div>
            <div v-if="editingVehicle.accidentEnd" class="mt-2 px-3 py-2 rounded bg-gray-50 border border-gray-200">
              <p class="text-xs" :class="getDaysClass(daysUntil(editingVehicle.accidentEnd))">
                <span v-if="daysUntil(editingVehicle.accidentEnd) !== null && daysUntil(editingVehicle.accidentEnd) < 0">意外險已逾期 {{ Math.abs(daysUntil(editingVehicle.accidentEnd)) }} 天</span>
                <span v-else>意外險剩餘 {{ daysUntil(editingVehicle.accidentEnd) }} 天</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 shrink-0">
        <button @click="showVehicleModal=false" class="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">取消</button>
        <button @click="saveVehicle" class="px-5 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700">儲存</button>
      </div>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════════════
       Modal：維修 / 保養紀錄新增 / 編輯
  ═══════════════════════════════════════════════════════════════════════ -->
  <div v-if="showRecordModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
        <h3 class="text-base font-semibold text-gray-800">{{ isNewRecord ? `新增${recordModalType}紀錄` : `編輯${recordModalType}紀錄` }}</h3>
        <button @click="showRecordModal=false" class="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
      </div>

      <!-- Body -->
      <div class="overflow-y-auto flex-1 p-6 space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs text-gray-500 mb-1">車輛 *</label>
            <select v-model="editingRecord.vehicleId" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400">
              <option value="">請選擇車輛</option>
              <option v-for="v in vehicles" :key="v.id" :value="v.id">{{ v.plate }} {{ v.brand }} {{ v.model }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">日期 *</label>
            <input v-model="editingRecord.date" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400" placeholder="YYYY/MM/DD" />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">廠商</label>
            <input v-model="editingRecord.shop" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400" />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">施工里程（km）</label>
            <input v-model.number="editingRecord.odometer" type="number" min="0" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400" />
          </div>
          <div v-if="recordModalType === '保養'" class="col-span-2">
            <label class="block text-xs text-gray-500 mb-1">下次保養建議里程（km）</label>
            <input v-model.number="editingRecord.nextOdometer" type="number" min="0" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400" />
          </div>
        </div>

        <!-- 明細表 -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs font-semibold text-gray-600">費用明細</p>
          </div>
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-200">
                  <th class="px-3 py-2 text-left text-xs font-medium text-gray-500">項目名稱</th>
                  <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 w-20">數量</th>
                  <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 w-28">單價</th>
                  <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 w-28">小計</th>
                  <th class="px-3 py-2 w-8"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in editingRecord.items" :key="idx" class="border-b border-gray-100">
                  <td class="px-3 py-1.5">
                    <input v-model="item.name" class="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-primary-400" placeholder="項目名稱" />
                  </td>
                  <td class="px-3 py-1.5">
                    <input v-model.number="item.qty" type="number" min="1" class="w-full px-2 py-1 border border-gray-200 rounded text-sm text-right focus:outline-none focus:border-primary-400" />
                  </td>
                  <td class="px-3 py-1.5">
                    <input v-model.number="item.unitPrice" type="number" min="0" class="w-full px-2 py-1 border border-gray-200 rounded text-sm text-right focus:outline-none focus:border-primary-400" />
                  </td>
                  <td class="px-3 py-1.5 text-right font-medium text-gray-700">$ {{ fmt(item.qty * item.unitPrice) }}</td>
                  <td class="px-3 py-1.5 text-center">
                    <button @click="removeItem(idx)" class="text-danger hover:text-danger/80 text-base leading-none">×</button>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="border-t border-gray-200 bg-gray-50">
                  <td colspan="5" class="px-3 py-2">
                    <button @click="addItem" class="text-xs text-primary-600 hover:text-primary-800 font-medium">+ 新增明細</button>
                  </td>
                </tr>
                <tr class="border-t border-gray-200">
                  <td colspan="3" class="px-3 py-2 text-right text-sm font-semibold text-gray-700">合計</td>
                  <td class="px-3 py-2 text-right text-sm font-bold text-primary-700">$ {{ fmt(editingTotal()) }}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div>
          <label class="block text-xs text-gray-500 mb-1">備註</label>
          <textarea v-model="editingRecord.notes" rows="2" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400 resize-none"></textarea>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 shrink-0">
        <button @click="showRecordModal=false" class="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">取消</button>
        <button @click="saveRecord" class="px-5 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700">儲存</button>
      </div>
    </div>
  </div>
</template>
