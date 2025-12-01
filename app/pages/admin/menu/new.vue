<script setup>
definePageMeta({
  layout: 'admin',
  middleware: ['authenticated'],
})

const router = useRouter()

const fromData = reactive({
  store: '',
  address: '',
  tel: '',
})

async function save() {
  await $fetch('/api/admin/menu', {
    method: 'post',
    body: fromData,
  })
  return navigateTo('/admin')
}
</script>
<template>
  <div class="col-12 col-md-4">
    <h4>新增菜單</h4>
    <div class="mb-3">
      <label class="form-label">store name</label>
      <input type="text" class="form-control" v-model='fromData.store'>
    </div>
    <div class="mb-3">
      <label class="form-label">address</label>
      <input type="text" class="form-control" v-model='fromData.address'>
    </div>
    <div class="mb-3">
      <label class="form-label">tel</label>
      <input type="text" class="form-control" v-model='fromData.tel'>
    </div>
    <button class="btn btn-primary me-2" @click="save()">save</button>
    <button class="btn btn-secondary" @click="router.back()">back</button>
  </div>
</template>