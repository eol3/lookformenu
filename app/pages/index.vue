<script setup>
const { data, error } = await useFetch('/api/menu')
const route = useRoute()
// await new Promise(r => setTimeout(r, 2000));

</script>

<template>
  <div class="row">
    <div class="col-6 col-md-4 col-lg-3" v-for="(item, key) in data" :key="key">
      <NuxtLink :to="'/menu/' + item.id" class="text-decoration-none">
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">{{ item.store }}</h5>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
