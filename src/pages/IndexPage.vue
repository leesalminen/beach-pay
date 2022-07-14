<template>
  <q-page style="margin: 10px;">
    <div class="row">
      <div class="col">
        <h1>Welcome to Beach Pay!</h1>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <q-btn
          color="primary"
          href="/#new"
        >
          Set up a wristband
        </q-btn>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IndexPage'
})
</script>
