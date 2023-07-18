<script setup>
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from "primevue/useconfirm";
const emit = defineEmits(['confirm', 'cancel'])


const confirm = useConfirm();

const confirm1 = () => {
  confirm.require({
    message: 'Are you sure you want to proceed?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      emit('confirm')
    },
    reject: () => {
      emit('cancel')
    }
  });
};



</script>

<template>
  <ConfirmDialog></ConfirmDialog>
  <div class="card flex flex-wrap gap-2 justify-content-center align-items-end">
    <Button class="btn" @click="confirm1()" icon="pi pi-check" severity="success" label="Confirm"></Button>
  </div>
</template>

<style scoped>
.btn{
  height: 2.5rem;
}

</style>