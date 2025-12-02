<script setup>
const route = useRoute()
const router = useRouter()
const { data, error } = await useFetch('/api/menu/' + route.params.id)
const { data: images } = await useFetch('/api/admin/image/' + route.params.id)
import { getData, setData } from 'nuxt-storage/local-storage';

let starData = null
const isStar = ref(false)
starData = getData('menu-star')
if (starData) {
  starData = starData.split(',')
  if (starData.includes(route.params.id)) {
    isStar.value = true
  }
} else {
  starData = []
}

let historyData = []
if (getData('menu-history')) {
  historyData = getData('menu-history').split(',')
  let index = historyData.indexOf(route.params.id)
  if (index !== -1) {
    historyData.splice(index, 1)
  }
}
historyData.push(route.params.id)
setData('menu-history', historyData.join(','), 30, 'd')

function start() {
  if (!starData.includes(route.params.id)) {
    starData.push(route.params.id)
    setData('menu-star', starData.join(','), 30, 'd')
    isStar.value = true
  }
}

function unStart() {
  if (starData.includes(route.params.id)) {
    starData = starData.filter(item => item != route.params.id)
    setData('menu-star', starData.join(','))
    isStar.value = false
  }
}
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
