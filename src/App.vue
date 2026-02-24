<script setup>
import { ref } from 'vue'
import Login from './views/Login.vue'
import Dashboard from './views/Dashboard.vue'
import Personnel from './views/Personnel.vue'
import Payroll from './views/Payroll.vue'
import Reports from './views/Reports.vue'
import Settings from './views/Settings.vue'
import Vehicles from './views/Vehicles.vue'
import Sidebar from './components/Sidebar.vue'
import Topbar from './components/Topbar.vue'
import Toast from './components/Toast.vue'

const isLoggedIn = ref(false)
const currentPage = ref('dashboard')
const toastMessage = ref('')
const toastVisible = ref(false)

const user = { name: '王總經理', role: '系統管理員', avatar: '王' }

const pageTitles = {
  dashboard: '儀表板總覽',
  personnel: '人事異動管理',
  payroll: '薪資作業',
  reports: '名冊與報表',
  settings: '系統設定',
  vehicles: '車輛管理'
}

function handleLogin() {
  isLoggedIn.value = true
  showToast('登入成功')
}

function handleLogout() {
  isLoggedIn.value = false
  currentPage.value = 'dashboard'
  showToast('已登出系統')
}

function showToast(msg) {
  toastMessage.value = msg
  toastVisible.value = true
  setTimeout(() => toastVisible.value = false, 2000)
}

function navigateTo(page) {
  if (page === 'logout') {
    if (confirm('確定要登出嗎？')) handleLogout()
    return
  }
  currentPage.value = page
}
</script>

<template>
  <!-- 登入頁 -->
  <Login v-if="!isLoggedIn" @login="handleLogin" @toast="showToast" />

  <!-- 主系統 -->
  <div v-else class="flex min-h-screen bg-primary-50">
    <Sidebar
      :user="user"
      :currentPage="currentPage"
      @navigate="navigateTo"
    />

    <main class="flex-1 ml-64">
      <Topbar :title="pageTitles[currentPage]" />

      <div class="p-8">
        <Dashboard v-if="currentPage === 'dashboard'" @navigate="navigateTo" @toast="showToast" />
        <Personnel v-if="currentPage === 'personnel'" @toast="showToast" />
        <Payroll v-if="currentPage === 'payroll'" @toast="showToast" />
        <Reports v-if="currentPage === 'reports'" @toast="showToast" />
        <Settings v-if="currentPage === 'settings'" @toast="showToast" />
        <Vehicles v-if="currentPage === 'vehicles'" @toast="showToast" />
      </div>
    </main>
  </div>

  <Toast :message="toastMessage" :visible="toastVisible" />
</template>
