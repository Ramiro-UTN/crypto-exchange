<script async setup>
import { ref } from 'vue';
import { useTransactionsStore } from '../stores/transactions'
import { storeToRefs } from 'pinia'
import axios from 'axios';

const transactionsStore = useTransactionsStore();
const { transactions } = storeToRefs(transactionsStore);
const wallet = ref([]);

const availableCoins = transactions.value
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


const getCryptoPrice = async (cryptoCode) => {
  return await axios
    .get(`https://criptoya.com/api/satoshitango/${cryptoCode}/ars/1`)
    .then(response => response.data.totalBid)
}

const fillWalletArray = async () => {

  for (const crypto in availableCoins) {
    
    const price = await getCryptoPrice(crypto);
    const amount = availableCoins[crypto].crypto_amount;
    const total = Number(price * amount).toFixed(2);
    wallet.value.push({ crypto_code: crypto, amount, total})
  }
}
fillWalletArray();
//cryptoCodes.value.push(Object.keys(availableCoins))


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

<template #default>

  <div class="pt-5">
    <div v-if="wallet.length > 0" class="flex flex-column gap-2 p-2" v-for="crypto in wallet">
      <p>Coin: {{ crypto.crypto_code }}</p>
      <p>Amount: {{  (countDecimals(crypto.amount)  > 5) ? crypto.amount.toFixed(5) : crypto.amount  }}</p>
      <p>Total (ARS): ${{crypto.total  }}</p>
    </div>
  </div>
 
</template>
