<script setup>
import axios from 'axios'
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dialog from 'primevue/dialog';
import { ref } from 'vue';
//STORE
import { useUsersStore } from '../stores/user';
import { storeToRefs } from 'pinia'
import { useTransactionsStore } from '../stores/transactions'

const usersStore = useUsersStore();
const { user } = storeToRefs(usersStore);
const transactionsStore = useTransactionsStore();
const { transactions } = storeToRefs(transactionsStore);
const { getTransactions } = transactionsStore;
getTransactions(user.value.userName);



const transactionDialog = ref(false);
const deleteProductDialog = ref(false);
const product = ref({});
const submitted = ref(false);



const actions = ref([
  { label: 'Purchase', value: 'purchase' },
  { label: 'Sale', value: 'sale' },
]);

const availableCoins = [
  { abbr: "ADA", name: "Cardano" },
  { abbr: "AVAX", name: "Avalanche" },
  { abbr: "BCH", name: "Bitcoin Cash" },
  { abbr: "BTC", name: "Bitcoin" },
  { abbr: "DAI", name: "Dai" },
  { abbr: "DOGE", name: "Dogecoin" },
  { abbr: "DOT", name: "Polkadot" },
  { abbr: "ETH", name: "Ethereum" },
  { abbr: "LINK", name: "Chainlink" },
  { abbr: "LTC", name: "Litecoin" },
  { abbr: "MANA", name: "Decentraland" },
  { abbr: "SOL", name: "Solana" },
  { abbr: "UNI", name: "Uniswap" },
  { abbr: "USDC", name: "USD Coin" },
  { abbr: "USDT", name: "Tether" },
  { abbr: "XLM", name: "Stellar" },
  { abbr: "XRP", name: "Ripple" },
];

const editProduct = (prod) => {
  console.log(prod)
  product.value = { ...prod };
  transactionDialog.value = true;
}
const hideDialog = () => {
  transactionDialog.value = false;
  submitted.value = false;
};

const confirmDeleteProduct = (prod) => {
  console.log(prod)
  product.value = prod;
  deleteProductDialog.value = true;
}

const confirmEdit = async () => {
  //Find index to update the exact element, 
  const index = transactions.value.findIndex(obj => obj._id === product.value._id);
  await axios.patch(`http://localhost:3001/transactions/${product.value._id}`, product.value)
    .then(res => transactions.value[index] = res.data)

  transactionDialog.value = false;
  product.value = {};

}

const deleteSelectedProduct = async () => {
  transactions.value = transactions.value.filter(transaction => transaction._id !== product.value._id);
  deleteProductDialog.value = false;
  await axios.delete(`http://localhost:3001/transactions/${product.value._id}`);
}



</script>

<template>
  <div class="card p-fluid w-full flex justify-content-center cont">
    <DataTable :value="transactions" class="pt-4" v-show="transactions.length > 0" paginator :rows="4" tableStyle="min-width: 50rem">
      <!-- <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
          <span class="text-xl text-900 font-bold">Transactions History</span>
          <Button icon="pi pi-refresh" rounded raised />
        </div>
      </template> -->
      <Column field="action" style="width: 15%" header="Transaction">
        <template #body="slotProps">
          {{ slotProps.data.action.charAt(0).toUpperCase() + slotProps.data.action.substring(1)  }}
        </template>
      </Column>
      <Column field="crypto_code" style="width: 12%" header="Crypto"></Column>
      <Column field="crypto_amount" style="width: 15%" header="Crypto Amount"></Column>
      <Column field="money" style="width: 17%" header="Total (ARS)">
        <template #body="slotProps">
          {{ '$ ' + slotProps.data.money }}
        </template>
      </Column>
      <Column field="datetime" style="width: 20%" header="Date"></Column>
      <Column class="col-fixed" style="width: 17%">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editProduct(slotProps.data)" />
          <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" />
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="transactionDialog" :style="{ width: '450px' }" header="Transaction Details" :modal="true"
      class="p-fluid">

      <div class="field">
        <label for="action" class="mb-3">Crypto</label>
        <Dropdown autofocus id="action" v-model="product.action" :options="actions" optionLabel="label"
          optionValue="value" placeholder="Transaction type" :class="{ 'p-invalid': submitted && !product.action }">
        </Dropdown>

        <small class="p-error" v-if="submitted && !product.action">Action is required.</small>
      </div>
      <div class="field">
        <label for="crypto" class="mb-3">Crypto</label>
        <Dropdown id="crypto" v-model="product.crypto_code" :options="availableCoins" optionLabel="abbr"
          optionValue="abbr" :placeholder="product.crypto_code"></Dropdown>
      </div>
      <div class="formgrid grid">
        <div class="field col">
          <label for="amount">Amount</label>
          <InputNumber id="amount" v-model="product.crypto_amount" showButtons :min="0.00001" :step="0.00001"
            :maxFractionDigits="5" />
        </div>
        <div class="field col">
          <label for="total">Total</label>
          <InputNumber id="total" :maxFractionDigits="2" v-model="product.money" />
        </div>
      </div>
      <div class="field">
        <label for="date">Date</label>
        <InputText id="date" v-model.trim="product.datetime" required="true"
          :class="{ 'p-invalid': submitted && !product.datetime }" />
        <small class="p-error" v-if="submitted && !product.datetime">Date is required.</small>
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Save" icon="pi pi-check" text @click="confirmEdit" />
      </template>
    </Dialog>

    <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="product">Are you sure you want to delete the selected transaction?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteProductDialog = false" />
        <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedProduct" />
      </template>
    </Dialog>

    <h1 v-if="transactions.length === 0">There are no recent transactions</h1>
  </div>
</template>

