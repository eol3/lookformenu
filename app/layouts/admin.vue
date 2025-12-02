<script setup lang="ts">
useHead({
  title: '管理後臺｜路可菜單網',
  meta: [
    { name: 'description', content: '蒐集整理各家商店菜單' },
  ],
})
const { user, clear: clearSession } = useUserSession()

async function logout () {
  await clearSession()
  await navigateTo('/admin/login')
}
</script>

<template>
  <div class="container">
    <div class="my-3 d-flex align-items-center flex-wrap">
      <NuxtLink to="/admin" class="fs-3 text-black text-decoration-none me-4">
          管理後臺
      </NuxtLink>
      <NuxtLink to="/" class="text-decoration-none me-4">前台首頁</NuxtLink>
      <button class="btn btn btn-outline-dark" @click="logout">
        Logout
      </button>
    </div>
    <slot />
  </div>
</template>