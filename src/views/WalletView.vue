<script async setup>
import { ref, watch } from 'vue';
import axios from 'axios';
import { onBeforeMount } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

//STORE
import { useUsersStore } from '../stores/user';
import { useTransactionsStore } from '../stores/transactions';
import { storeToRefs } from 'pinia';

const usersStore = useUsersStore();
const transactionsStore = useTransactionsStore();
const { transactions } = storeToRefs(transactionsStore);
const { user } = storeToRefs(usersStore);
const { getTransactions } = transactionsStore;
const isDataFetched = ref(false);


const wallet = ref([]);
const totalSum = ref(0);
const availableCoins = ref({});


onBeforeMount(async () => {
  await getTransactions(user.value.userName);
  isDataFetched.value = true;
})

watch(isDataFetched, () => fillWalletArray())

const getCryptoPrice = async (cryptoCode) => {
  return await axios
    .get(`https://criptoya.com/api/satoshitango/${cryptoCode}/ars/1`)
    .then(response => response.data.totalBid)
}

const fillWalletArray = async () => {

  availableCoins.value = transactions.value
    .map(({ action, crypto_code, crypto_amount }) => ({ action, crypto_code, crypto_amount }))
    .reduce((out, inp) => {
      if (out[inp.crypto_code]) {

        if (inp.action === 'purchase') out[inp.crypto_code].crypto_amount += inp.crypto_amount;
        if (inp.action === 'sale') out[inp.crypto_code].crypto_amount -= inp.crypto_amount;

      } else {
        out[inp.crypto_code] = inp;

      }
      
      return out
    }, {})

  for (const crypto in availableCoins.value) {

    const price = await getCryptoPrice(crypto);
    const amount = availableCoins.value[crypto].crypto_amount;
    const total = Number(price * amount).toFixed(2);

    wallet.value.push({ crypto_code: crypto, amount, total: +total });
  }

  wallet.value = wallet.value.filter((crypto)=> crypto.amount !== 0 );
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

</script>

<template>
  <div class="flex justify-content-center h-7">
    <DataTable v-if="wallet.length > 0" class="pt-4" :value="wallet" paginator :rows="5" tableStyle="min-width: 50rem">
      <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
          <span class="text-xl text-900 font-bold">My Wallet</span>
          <span class="text-xl text-900 font-bold">{{ '$ ' + totalSum.toFixed(2) + ' ARS' }}</span>
        </div>
      </template>
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
    </DataTable>
  </div>
</template>

