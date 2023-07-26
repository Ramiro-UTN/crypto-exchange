<script setup>
import { ref } from 'vue';
import { useUsersStore } from '../stores/user';
import { useTransactionsStore } from '../stores/transactions'
import { storeToRefs } from 'pinia';
import axios from 'axios';

import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import TransactionsActionSelect from '../components/transactions/TransactionsActionSelect.vue'
import ConfirmDialogComp from '../components/transactions/ConfirmDialogComp.vue'
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";
const toast = useToast();

//validate form
import * as yup from 'yup';
import { useForm } from 'vee-validate';

const schema = yup.object().shape({
  selectedCoin: yup.object().shape({
    abbr: yup.string().required(),
    name: yup.string().required('Please select a coin').label('Crypto')
  }),
  amount: yup.number().required('Please choose an amount').label('Amount'),
})

const { handleSubmit,
  resetForm,
  errors,
  defineComponentBinds,
  values } = useForm({ validationSchema: schema });

const selectedCoin = defineComponentBinds('selectedCoin');
const amount = defineComponentBinds('amount');

const onSubmit = handleSubmit(async (values) => {
  console.log('val1', values.selectedCoin);
  console.log('val2', values.amount);
  console.log(values);
  console.log('coinSel', selectedCoin.value.modelValue)
  await calcFinalPrice();

});

const transactionsStore = useTransactionsStore();
const { transactions } = storeToRefs(transactionsStore);

const store = useUsersStore();
const { user } = storeToRefs(store);
const transactionAction = ref('purchase');
const cryptoPrice = ref(null);
const finalTransactionPrice = ref(null);
//const selectedCoin = ref('');
//const amount = ref(0.00001);
//const min = ref(0.00001);
const transactionData = ref(null);
const loading = ref(false)

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


const setAction = (action) => {
  transactionAction.value = action;

}
const getCryptoPrice = async () => {
  return await axios
    .get(`https://criptoya.com/api/satoshitango/${selectedCoin.value.modelValue.abbr}/ars/1`)
    .then(response => transactionAction.value === 'purchase' ? response.data.totalAsk : response.data.totalBid);
}

const calcFinalPrice = async () => {
  loading.value = true;
  cryptoPrice.value = await getCryptoPrice();
  finalTransactionPrice.value = Number(amount.value.modelValue * cryptoPrice.value).toFixed(2);
  generateTransactionDataObject();

};

const generateTransactionDataObject = () => {
  transactionData.value = {
    "user_id": user.value.userName,
    "action": transactionAction.value,
    "crypto_code": selectedCoin.value.modelValue.abbr,
    "crypto_amount": amount.value.modelValue,
    "money": finalTransactionPrice.value,
    "datetime": getCurrentDateTime(),
  }
  console.log(transactionData.value);
  //loading.value = false;
}

const getCurrentDateTime = () => {
  const currentDate = new Date();

  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const year = currentDate.getFullYear();
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');

  const formattedDateTime = `${day}-${month}-${year} ${hours}:${minutes}`;

  return formattedDateTime;
}

const handleTransaction = async () => {

  const request = axios.post('http://localhost:3001/transactions', transactionData.value);
  const res = await request.then(response => response.data);

  //testing
  transactions.value.push(transactionData.value);


  console.log(res);
  transactionData.value = null;
  resetForm();
  toast.add({ severity: "success", summary: 'Confirmed', detail: 'The transaction was successful', life: 3000 });
  loading.value = false;

}

const cancelTransaction = () => {

  transactionData.value = null;
  loading.value = false;
  resetForm();

}

</script>

<template>
  <Toast />
  <div class="card flex flex-column align-items-center pt-3 cont">
    <form @submit.prevent="onSubmit" class="card flex flex-column w-7">
      <div class="field ">
        <label for="transaction">Transaction</label>
        <TransactionsActionSelect id="transaction" @set-action="setAction" :action="transactionAction" />
      </div>
      <div class="field">
        <label for="crypto">Crypto</label>
        <Dropdown :class="{ 'p-invalid': errors.selectedCoin }" v-bind="selectedCoin" :options="availableCoins"
          optionLabel="name" :placeholder="'Select a coin to ' + transactionAction" id="crypto" />
        <small id="selectedCoin-help" class="p-error">
          {{ errors.selectedCoin }}
        </small>
      </div>
      <div class="field">
        <label for="amount">Amount</label>
        <InputNumber placeholder=">=0.00001" id="amount" v-bind="amount" inputId="minmaxfraction" :value="0.00001"
          showButtons :min="0.00001" :step="0.00001" :maxFractionDigits="5"
          :class="{ 'p-invalid': errors.selectedCoin }" />
        <small id="amount-help" class="p-error">
          {{ errors.amount }}
        </small>
      </div>
      <Button :v-if="!transactionData" :loading="loading" type="submit" label="Total" />
    </form>
    <template v-if="transactionData">
      <div class="flex flex-column gap-2 dataTable">
        <DataTable :value="[transactionData]" tableStyle="min-width: 50rem" class="w-full pt-4 pb-2">
          <Column field="user_id" header="User"></Column>
          <Column field="action" header="Transaction"></Column>
          <Column field="crypto_code" header="Crypto"></Column>
          <Column field="crypto_amount" header="Crypto Amount"></Column>
          <Column field="money" header="Total (ARS)"></Column>
        </DataTable>
        <div class="flex gap-3 justify-content-center">
          <ConfirmDialogComp @confirm="handleTransaction" @cancel="cancelTransaction" />
          <Button class="btn" @click="cancelTransaction" severity="danger" label="Cancel" />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.field {
  display: flex;
  padding: 0.2rem 1rem;
  border-radius: 5px;
  border-color: rgba(255, 255, 255, 0.342);
  background-color: rgba(255, 255, 255, 0.555);
  flex-direction: column;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
}

.btn {
  width: 6rem;
  height: 2.5rem;
}
label{
  
  margin-bottom: -2px;
}
.dataTable {
  margin-top: -4rem;
}
</style>