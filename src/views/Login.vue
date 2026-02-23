<script setup>
import { ref } from 'vue'

const emit = defineEmits(['login', 'toast'])

const username = ref('admin')
const password = ref('1234')

function handleSubmit() {
  if ((username.value === 'admin' || username.value === 'hr_lin') && password.value === '1234') {
    emit('login', username.value)
  } else {
    emit('toast', '帳號或密碼錯誤')
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-700">
    <div class="bg-white p-12 rounded-2xl shadow-2xl w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-semibold text-primary-700 mb-2">💼 T-ERP 人事薪資</h1>
        <p class="text-gray-500">輕量化管理系統</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-2">帳號</label>
          <input
            v-model="username"
            type="text"
            placeholder="請輸入帳號"
            class="w-full px-4 py-3 border-2 border-primary-100 rounded-lg focus:outline-none focus:border-primary-400 transition-colors"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-2">密碼</label>
          <input
            v-model="password"
            type="password"
            placeholder="請輸入密碼"
            class="w-full px-4 py-3 border-2 border-primary-100 rounded-lg focus:outline-none focus:border-primary-400 transition-colors"
          />
        </div>
        <button
          type="submit"
          class="w-full py-4 bg-gradient-to-r from-primary-400 to-primary-500 text-white font-semibold rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          登入系統
        </button>
      </form>

      <div class="mt-6 p-4 bg-amber-50 rounded-lg text-sm text-primary-400">
        <strong class="block mb-1">展示帳號</strong>
        Admin：admin / 1234<br />
        Maintainer：hr_lin / 1234
      </div>

      <p class="text-center mt-6 text-gray-400 text-sm">© 2025 T-ERP 人事薪資管理系統</p>
    </div>
  </div>
</template>
