<script setup>
import { watch } from 'vue';
const route = useRoute()
const router = useRouter()
const { data, error } = await useFetch('/api/menu/' + route.params.id)
const { data: images } = await useFetch('/api/admin/image/' + route.params.id)

</script>

<template>
  <div v-if="data == undefined">
    No data
  </div>
  <div class="container">
    <div class="fs-5">
      <NuxtLink to="/" class="text-decoration-none">
        <i class="bi bi-arrow-left"></i>
        返回
      </NuxtLink>
    </div>
    <div class="fs-3">
      {{ data.store }}
    </div>
    <div class="d-flex overflow-x-auto mb-2">
      <template v-for="(item, key) in images">
        <img :src="'/static/image/' + route.params.id + '/' + item.filename" width="300" class="p-2"/>
      </template>
    </div>
    <div class="row col-md-6">
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
</template>
