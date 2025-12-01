<script setup>
definePageMeta({
  layout: 'admin',
  middleware: ['authenticated'],
})
import { ref, reactive } from 'vue';

const route = useRoute()
const router = useRouter()

const word = ref('')
const currentPage = ref(1)
const perPage = ref(10)

const queryObj = reactive({
  word: null,
  limit: perPage.value,
	offset: perPage.value * (currentPage.value - 1),
  sortBy: 'id',
  orderBy: 'desc',
})

setQueryObj(route)
const { data: list, refresh } = await useFetch('/api/admin/menu', { query: queryObj, watch: false })
const wordQuery = computed(() => route.query.word)
const { data: totalData } = await useFetch('/api/admin/menu/count', { 
  query: { word: wordQuery },
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

function search() {
  if (word.value !== '') {
    router.push('/admin?word=' + word.value)
  } else {
    router.push('/admin')
  }
}
function clear() {
  word.value = ''
  router.push('/admin')
}
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-auto">
        <NuxtLink to="/admin/menu/new" class="btn btn-primary">新增菜單</NuxtLink>
      </div>
      <div class="col-auto">
        <div class="input-group">
          <input class="form-control" placeholder="Search" v-model="word" @keyup.enter="search()"/>
          <span v-if="route.query.word !== undefined" class="input-group-text cursor-pointer" @click="clear()">
            X
          </span>
          <button class="btn btn-outline-secondary" @click="search()">Search</button>
        </div>
      </div>
    </div>
    <table class="table table-hover">
      <thead>
        <tr>
          <td width="10%">id</td>
          <td width="10%"></td>
          <td>store</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, key) in list" :key="key">
          <td>{{ item.id }}</td>
          <td>
            <NuxtLink :to="'/admin/menu/edit/' + item.id" class="text-decoration-none">edit</NuxtLink>
          </td>
          <td>{{ item.store }}</td>
        </tr>
      </tbody>
    </table>
    <div>
      <Pagination
        v-model="currentPage"
        :per-page="perPage"
        :total-data="totalData"
      ></Pagination>
    </div>
  </div>
</template>