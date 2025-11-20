<script setup>
import { onBeforeRouteLeave } from 'vue-router'
const { $bootstrap } = useNuxtApp()

let modal = null

onMounted(() => {
  var modalEl = document.getElementById('exampleModal')
  modal = new $bootstrap.Modal(modalEl)
})

onBeforeRouteLeave(() => {
  modal.hide()
})

function closeModal() {
  modal.hide()
}
</script>
<template>
  <div class="modal fade" id="exampleModal" ref="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-focus="false">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          ...
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>
</template>