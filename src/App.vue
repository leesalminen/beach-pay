<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue'

// window.apiBaseUrl = 'https://beach-pay.netlify.app'
window.apiBaseUrl = 'http://localhost:18080'

export default defineComponent({
  name: 'App'
})
</script>
