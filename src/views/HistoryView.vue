<script setup>
import { useUsersStore } from '../stores/user';
import { storeToRefs } from 'pinia'
import { useTransactionsStore } from '../stores/transactions'
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Button from 'primevue/button';


const usersStore = useUsersStore();
const { user } = storeToRefs(usersStore);
const transactionsStore = useTransactionsStore();
const { transactions } = storeToRefs(transactionsStore);
const { getTransactions } = transactionsStore;
getTransactions(user.value.userName);
console.log('history: ', transactions.value);
</script>

<template>
  <div class="card">
    <DataTable v-show="transactions.length > 0" :value="transactions" tableStyle="min-width: 50rem">
      <Column field="action" header="Transaction"></Column>
      <Column field="crypto_code" header="Crypto"></Column>
      <Column field="crypto_amount" header="Crypto Amount"></Column>
      <Column field="money" header="Total"></Column>
      <Column field="datetime" header="Date"></Column>
      <Column>
        <template #body>
          <Button icon="pi pi-file-edit" label="Edit"/>
          <Button icon="pi pi-times" label="Delete" severity="danger"/>
        </template>
      </Column>
    </DataTable>
    <h1 v-if="transactions.length === 0">There are no recent transactions</h1>
  </div>
</template>