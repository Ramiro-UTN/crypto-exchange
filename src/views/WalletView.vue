<script async setup>
import { ref, watch } from 'vue';
//import axios from 'axios';
import { getCryptoPrice } from '../services/transactions'
import { onBeforeMount } from 'vue';
import DataTable from 'primevue/datatable';
import SelectButton from 'primevue/selectbutton';
import Column from 'primevue/column';
import DisplayMessage from '../components/DisplayMessage.vue';

//STORE
import { useUsersStore } from '../stores/user';
import { useTransactionsStore } from '../stores/transactions';
import { storeToRefs } from 'pinia';

const usersStore = useUsersStore();
const transactionsStore = useTransactionsStore();
const { availableCoins } = storeToRefs(transactionsStore);
const { user } = storeToRefs(usersStore);
const { getTransactions, getAvailableCoins } = transactionsStore;

const isDataFetched = ref(false);
const wallet = ref([]);
const balanceData = ref([]);
const totalSum = ref(0);
const totalSpend = ref(0);

const choosenOption = ref('Assets');
const walletOptions = ref(['Assets', 'Balance']);


onBeforeMount(async () => {
  await getTransactions(user.value.userName);
  getAvailableCoins();
  isDataFetched.value = true;
})

watch(isDataFetched, () => fillWalletArray())

// const getCryptoPrice = async (cryptoCode) => {
//   return await axios
//     .get(`https://criptoya.com/api/satoshitango/${cryptoCode}/ars/1`)
//     .then(response => response.data.totalBid)
// }

const fillWalletArray = async () => {

  for (const crypto in availableCoins.value) {

    const price = await getCryptoPrice(crypto);
    const amount = availableCoins.value[crypto].crypto_amount;
    const total = Number(price * amount).toFixed(2);
    const moneySpendOnCrypto = +availableCoins.value[crypto].money.toFixed(2);
    const returns = +(+total - moneySpendOnCrypto).toFixed(2);

    balanceData.value.push({ crypto_code: crypto, returns });
    wallet.value.push({ crypto_code: crypto, amount, total: +total });
  }

  wallet.value = wallet.value.filter((crypto) => crypto.amount !== 0);
  totalSum.value = wallet.value.reduce((acc, curr) => acc + curr.total, 0);
}


const countDecimals = (value) => {
  let text = value.toString()
  // verify if number 0.000005 is represented as "5e-6"
  if (text.indexOf('e-') > -1) {
    let [base, trail] = text.split('e-');
    let deg = parseInt(trail, 10);
    return deg;
  }
  // count decimals for number in representation like "0.123456"
  if (Math.floor(value) !== value) {
    return value.toString().split(".")[1].length || 0;
  }
  return 0;
}

const stockClass = (data) => {
  return [
    
    {
      'text-red-400': data.returns < 0,
      'text-green-400': data.returns > 0
    }
  ];
};



</script>

<template>
  <div class="flex justify-content-center h-7 cont">
    <DisplayMessage v-if="wallet.length=== 0" msg="Your wallet is empty"/>
    <DataTable v-if="wallet.length > 0" class="pt-4" :value="choosenOption === 'Assets' ? wallet : balanceData" paginator
      :rows="4" tableStyle="min-width: 50rem">
      <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
          <span class="text-xl text-900 font-bold">My Wallet</span>
          <SelectButton unselectable class="ml-8" v-model="choosenOption" :options="walletOptions" />
          <span class="text-xl text-900 font-bold">{{ '$ ' + totalSum.toFixed(2) + ' ARS' }}</span>
        </div>
      </template>
      <template v-if="choosenOption === 'Assets'">
        <Column field="crypto_code" header="" style="width: 25%"></Column>
        <Column field="amount" header="Amount" style="width: 25%">
          <template #body="slotProps">
            {{ (countDecimals(slotProps.data.amount) > 5) ? slotProps.data.amount.toFixed(5) : slotProps.data.amount }}
          </template>
        </Column>
        <Column field="total" header="Total (ARS)" style="width: 25%">
          <template #body="slotProps">
            {{ '$ ' + slotProps.data.total }}
          </template>
        </Column>
      </template>
      <template v-if="choosenOption === 'Balance'">
        <Column field="crypto_code" header="" style="width: 25%"></Column>
        <Column field="returns" header="Returns (ARS)" style="width: 25%">
          <template #body="slotProps">
            <div :class="stockClass(slotProps.data)">
              {{ '$ ' + slotProps.data.returns }}
            </div>

          </template>
        </Column>
      </template>
    </DataTable>
  </div>
</template>

