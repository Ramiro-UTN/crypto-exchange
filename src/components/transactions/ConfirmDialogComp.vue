<script setup>
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from "primevue/useconfirm";
const emit = defineEmits(['confirm'])


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
      
    }
  });
};



</script>

<template>
  <ConfirmDialog></ConfirmDialog>
  <div class="card flex flex-wrap gap-2 justify-content-center">
    <Button @click="confirm1()" icon="pi pi-check" label="Confirm"></Button>
  </div>
</template>