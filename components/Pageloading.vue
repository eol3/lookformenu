<template>
    <div>
        <b-row class="mt-2 mb-2 justify-content-center align-items-center">
            <p style="font-size:24px;color:#9b9b9b;">
                頁面載入中...
            </p>
        </b-row>
        <b-row class="mobile-row">
            <b-col class="mobile-col" cols="6" sm="6"  md="4" lg="3"
                    v-for="index in 4" :key="index">
                <div class="card mb-4">
                  <div class="square">
                  </div>
                  <div class="card-body">
                      <br>
                      <br>
                  </div>
                </div>
            </b-col>
        </b-row>
    </div>
</template>
