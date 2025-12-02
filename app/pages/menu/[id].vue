<script setup>
const route = useRoute()
const router = useRouter()
const { data, error } = await useFetch('/api/menu/' + route.params.id)
const { data: images } = await useFetch('/api/image/' + route.params.id)
import { useLocalStorage } from '@vueuse/core'

const isStar = ref(false)
const starData = useLocalStorage('menu-star', [])

if (starData.value.includes(route.params.id)) {
  isStar.value = true
}

function start() {
  starData.value.push(route.params.id)
  isStar.value = true
}

function unStart() {
  const index = starData.value.indexOf(route.params.id)
  if (index !== -1) {
    starData.value.splice(index, 1)
    isStar.value = false
  }
}

const historyData = useLocalStorage('menu-history', [])
const index = historyData.value.indexOf(route.params.id)
if (index !== -1) {
  historyData.value.splice(index, 1)
}
historyData.value.push(route.params.id)
</script>

<template>
  <div v-if="data == undefined">
    No data
  </div>
  <div class="container">
    <div class="row justify-content-md-center">
      <div class="col-md-8">
        <div class="fs-5">
          <NuxtLink @click="router.go(-1)" class="text-decoration-none cursor-pointer">
            <i class="bi bi-arrow-left"></i>
            返回
          </NuxtLink>
        </div>
        <div class="fs-3 d-flex justify-content-between">
          {{ data.store }}
          <i v-if="!isStar" class="bi bi-star cursor-pointer" @click="start()"></i>
          <i v-else class="bi bi-star-fill cursor-pointer" @click="unStart()"></i>
        </div>
        <div class="d-flex overflow-x-auto mb-2">
          <template v-for="(item, key) in images">
            <img :src="'/static/image/' + route.params.id + '/' + item.filename" width="300" class="p-2"/>
          </template>
        </div>
        <table class="table">
          <tbody>
            <tr>
              <td>電話</td>
              <td>{{ data.tel }}</td>
            </tr>
            <tr>
              <td>地址</td>
              <td>{{ data.address }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
