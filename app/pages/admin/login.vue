<script setup lang="ts">
definePageMeta({
  layout: false
})

const { loggedIn, user, fetch: refreshSession } = useUserSession()
const credentials = reactive({
  email: '',
  password: '',
})
async function login () {
  try {
    await $fetch('/api/admin/login', {
      method: 'POST',
      body: credentials,
    })

    // Refresh the session on client-side and redirect to the home page
    await refreshSession()
    await navigateTo('/admin')
  } catch {
    alert('Bad credentials')
  }
}
</script>

<template>
  <div class="container">
    <div class="mt-3 mb-2">
      <div class="h3 text-decoration-none">
        管理後臺
      </div>
    </div>
    <br /><br />
    <div class="row justify-content-md-center">
      <div class="col-4">
        <h4>登入</h4>
        <div>
          <div class="mb-3">
            <label class="form-label">E-mail</label>
            <input type="email" class="form-control" v-model="credentials.email">
          </div>
          <div class="mb-3">
            <label class="form-label">Password</label>
            <input type="password" class="form-control" v-model="credentials.password">
          </div>          
          <button class="btn btn-primary" @click="login()">Login</button>
        </div>
      </div>
    </div>
  </div>
</template>