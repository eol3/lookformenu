<script setup>
import { ref, reactive } from 'vue';

const route = useRoute()

const currentPage = ref(1)
const perPage = ref(12)

const queryObj = reactive({
  word: null,
  limit: perPage.value,
	offset: perPage.value * (currentPage.value - 1),
  sortBy: 'id',
  orderBy: 'desc',
})

setQueryObj(route)
const { data: list, refresh } = await useFetch('/api/menu', { query: queryObj, watch: false })
const word = computed(() => route.query.word)
const { data: totalData } = await useFetch('/api/menu/count', { 
  query: { word: word },
})

onBeforeRouteUpdate(async (to) => {
	setQueryObj(to)
  refresh()
})

function setQueryObj(route) {
	if (route.query.word) queryObj.word = route.query.word
	else delete queryObj.word
	if (route.query.page) currentPage.value = Number(route.query.page)
	else currentPage.value = 1
	queryObj.offset = perPage.value * (currentPage.value - 1)
}
</script>

<template>
  <div class="row">
    <div class="col-6 col-md-4 col-lg-3" v-for="(item, key) in list" :key="key">
      <NuxtLink :to="'/menu/' + item.id" class="text-decoration-none">
        <div class="card mb-3">
          <img v-if="item.first_img_filename" :src="'/static/image/' + item.id + '/' + item.first_img_filename" class="card-img-top" style="height:200px;object-fit: contain;">
          <div v-else class="card-img-top bg-body-secondary d-flex align-items-center justify-content-center text-primary-emphasis" style="height:200px;">
            No image
          </div>
          <div class="card-body" style="height:80px;">
            <h5 class="card-title">{{ item.store }}</h5>
          </div>
        </div>
      </NuxtLink>
    </div>
    <div class="d-flex justify-content-center">
      <Pagination
        v-model="currentPage"
        :per-page="perPage"
        :total-data="totalData"
      ></Pagination>
    </div>
  </div>
</template>
