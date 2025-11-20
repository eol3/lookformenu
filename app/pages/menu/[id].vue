<script setup>
import { watch } from 'vue';
const route = useRoute()
const { data, error } = await useFetch('/api/menu/' + route.params.id)
// console.log(data.value)
// console.log('hello')
watch(() => route.fullPath, (newPath, oldPath) => {
  console.log(`Full path changed from ${oldPath} to ${newPath}`)
})
</script>

<template>
  <div v-if="data == undefined">
    No data
  </div>
  <div v-else>
    {{ data.store }}
  </div>
</template>
