<script setup>
import { ref } from 'vue';
import { useUsersStore } from '../stores/user';
import { storeToRefs } from 'pinia';
import axios from 'axios';

import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import TransactionsActionSelect from '../components/transactions/TransactionsActionSelect.vue'
import ConfirmDialogComp from '../components/transactions/ConfirmDialogComp.vue'


const store = useUsersStore();
const { user } = storeToRefs(store);
const transactionAction = ref('purchase');
const cryptoPrice = ref(null);
const finalTransactionPrice = ref(null);
const selectedCoin = ref('');
const amount = ref(0.00001);
const min = ref(0.00001);
const transactionData = ref(null);

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
    .get(`https://criptoya.com/api/satoshitango/${selectedCoin.value.abbr}/ars/1`)
    .then(response => transactionAction.value === 'purchase' ? response.data.totalAsk : response.data.totalBid);
}

const calcFinalPrice = async () => {
  cryptoPrice.value = await getCryptoPrice();
  finalTransactionPrice.value = Number(amount.value * cryptoPrice.value).toFixed(2);
  generateTransactionDataObject();

};

const generateTransactionDataObject = () => {
  transactionData.value = {
    "user_id": user.value.userName,
    "action": transactionAction.value,
    "crypto_code": selectedCoin.value.abbr.toLowerCase(),
    "crypto_amount": amount.value,
    "money": finalTransactionPrice.value,
    "datetime": getCurrentDateTime(),
  }
  console.log(transactionData.value);
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
  console.log(res);
  transactionData.value = null;
  amount.value = 0.00001;
  selectedCoin.value = null;
  
}

</script>

<template>
  <div class="cont">
    <h1>Transactions</h1>
    <TransactionsActionSelect @set-action="setAction" />
    <form @submit.prevent="handleTransaction">
      <Dropdown v-model="selectedCoin" :options="availableCoins" optionLabel="name"
        :placeholder="'Select a Coin to ' + transactionAction" />
      <InputNumber v-model="amount" inputId="minmaxfraction" showButtons :min="min" :step="0.00001"
        :maxFractionDigits="5" />
      <Button label="Calc" @click="calcFinalPrice" />
      
      <template v-if="transactionData">
        <DataTable :value="[transactionData]" tableStyle="min-width: 50rem">
          <Column field="user_id" header="User"></Column>
          <Column field="action" header="Transaction"></Column>
          <Column field="crypto_code" header="Crypto"></Column>
          <Column field="crypto_amount" header="Crypto Amount"></Column>
          <Column field="money" header="Total"></Column>
        </DataTable>
        <ConfirmDialogComp @confirm="handleTransaction"/>
      </template>
      <!-- <Button v-show="transactionData" type="submit"  :label="`${transactionAction === 'purchase'? 'Buy': 'Sale'}`" /> -->
      
    </form>
  </div>
</template>