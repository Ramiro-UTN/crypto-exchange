<script setup>
defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div>
    <h1>
      {{ msg }}
    </h1>
  </div>
</template>

<style scoped>
div{
  margin-top: 2rem;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  height: fit-content;
  padding: 1rem 2.5rem;
  color: white;
  background-color: rgba(0, 0, 0, 0.712);
}

</style>