<script setup>
import Button from 'primevue/button'

</script>

<template>
  <main>
    <a><Button label="Purchase" @click="$emit('set-action', 'purchase')"/></a>
    <a><Button label="Sale" @click="$emit('set-action', 'sale')"/></a>
  </main>
</template>
