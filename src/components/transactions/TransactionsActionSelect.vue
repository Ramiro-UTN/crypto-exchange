<script setup>
import Button from 'primevue/button'
defineProps({
  action: {
    type: String,
    required: true
  }
})

</script>

<template >
  <main class="flex flex-row justify-content-center gap-2 surface-overlay  p-2 ">
    
    <a><Button class="btn" :outlined="action === 'purchase'" label="Purchase" @click="$emit('set-action', 'purchase')"/></a>
    <a><Button class="btn" :outlined="action === 'sale'" label="Sale" @click="$emit('set-action', 'sale')"/></a>
  </main>
</template>

<style scoped>

.btn{
  width: 7rem;
  
}
</style>