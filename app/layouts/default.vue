<script setup>
import { ref } from 'vue';
const word = ref('')
const router = useRouter()
const route = useRoute()
if (route.query.word) word.value = route.query.word
function search() {
  if (word.value !== '') {
    router.push('/?word=' + word.value)
  } else {
    router.push('/')
  }
}
function clear() {
  word.value = ''
  router.push('/')
}
</script>

<template>
  <div class="container">
    <div class="headbar mb-4">
      <nav class="navbar navbar-expand-md bg-transparent">
        <div class="container-fluid">
          <NuxtLink class="navbar-brand d-flex align-items-center" to="/">
            <img src="~/assets/Logo.png" class="me-2">
            路可菜單網
          </NuxtLink>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-lg-0">
              <li class="nav-item">
                <NuxtLink class="nav-link" to="/star">星號標記</NuxtLink>
              </li>
              <li class="nav-item">
                <NuxtLink class="nav-link" to="/history">瀏覽紀錄</NuxtLink>
              </li>
            </ul>
            <div class="d-flex">
              <div class="input-group">
                <input class="form-control" placeholder="Search" v-model="word" @keyup.enter="search()"/>
                <span v-if="route.query.word !== undefined" class="input-group-text cursor-pointer" @click="clear()">
                  X
                </span>
                <button class="btn btn-outline-secondary" @click="search()">Search</button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
    <slot />
    <br />
  </div>
</template>