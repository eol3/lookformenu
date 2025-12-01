<script setup>
definePageMeta({
  layout: 'admin',
  middleware: ['authenticated'],
})

import { ref, reactive } from 'vue';

const route = useRoute()
const router = useRouter()

const { data: formData, error } = await useFetch('/api/menu/' + route.params.id)
const { data: images } = await useFetch('/api/admin/image/' + route.params.id)

async function save() {
  await $fetch('/api/admin/menu/' + route.params.id, {
    method: 'put',
    body: {
      store: formData.value.store,
      address: formData.value.address,
      tel: formData.value.tel,
      used: formData.value.used,
    },
  })
  return navigateTo('/admin')
}

const { handleFileInput, files } = useFileStorage()
const isLoading = ref(false)
const handleAutoUpload = async (event) => {
  await handleFileInput(event)
  if (files.value && files.value.length > 0) {
    await upload()
  }
}
const upload = async () => {
  isLoading.value = true
  const response = await $fetch('/api/admin/image/' + route.params.id, {
    method: 'POST',
    body: {
        files: files.value
    }
  })
  await getImages()
  isLoading.value = false
}
const deleteAll = async () => {
  isLoading.value = true
  const response = await $fetch('/api/admin/image/' + route.params.id, {
    method: 'DELETE'
  })
  await getImages()
  isLoading.value = false
}

const getImages = async() => {
  images.value = await $fetch('/api/admin/image/' + route.params.id)
}
</script>
<template>
  <div class="col-12 col-md-4">
    <h4>編輯菜單</h4>
    <div class="mb-3">
      <label class="form-label">store name</label>
      <input type="text" class="form-control" v-model='formData.store'>
    </div>
    <div class="mb-3">
      <label class="form-label">Images</label>
      <div class="input-group">
        <input class="form-control" type="file" @input="handleAutoUpload" multiple>
        <button class="btn btn-outline-secondary" type="button" @click="deleteAll">Delete</button>
      </div>
      <div v-if="isLoading" class="fs-6">Loading...</div>
      <div class="d-flex overflow-x-auto">
        <template v-for="(item, key) in images">
          <img :src="'/static/image/' + route.params.id + '/' + item.filename" width="300" class="p-2"/>
        </template>
      </div>
    </div>
    <div class="mb-3">
      <label class="form-label">address</label>
      <input type="text" class="form-control" v-model='formData.address'>
    </div>
    <div class="mb-3">
      <label class="form-label">tel</label>
      <input type="text" class="form-control" v-model='formData.tel'>
    </div>
    <div class="mb-3">
      <label class="form-label">公開</label>
      <select class="form-select" v-model="formData.used">
        <option value="0">未使用</option>
        <option value="1">已使用</option>
      </select>
    </div>
    <button class="btn btn-primary me-2" @click="save()">save</button>
    <button class="btn btn-secondary" @click="router.back()">back</button>
  </div>
</template>