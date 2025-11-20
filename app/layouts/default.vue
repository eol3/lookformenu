<template>
  <div class="container">
    <div class="headbar mb-4">
      <nav class="navbar navbar-expand-md bg-transparent">
        <div class="container-fluid">
          <NuxtLink class="navbar-brand d-flex align-items-center" to="/">
            <img src="~/assets/Logo.png" class="me-2">
            路可菜單網
          </NuxtLink>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-lg-0">
              <li class="nav-item">
                <a class="nav-link active" href="#">星號標記</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">瀏覽紀錄</a>
              </li>
            </ul>
            <div class="d-flex">
              <div class="input-group">
                <input class="form-control" placeholder="Search" aria-label="Search"/>
                <button class="btn btn-outline-secondary">Search</button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
    <slot />
  </div>
</template>