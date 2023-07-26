import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref([]);
  const availableCoins = ref({});


  const getTransactions = async (user) => {
    const baseURL = `http://localhost:3001/transactions?q={"user_id":"${user}"}`;
    const req = axios.get(baseURL);
    await req.then(response => transactions.value = response.data);
  }

  const getAvailableCoins = () => {
    availableCoins.value = transactions.value
    .map(({ action, crypto_code, crypto_amount, money }) => ({ action, crypto_code, crypto_amount, money }))
    .reduce((out, inp) => {
      if (out[inp.crypto_code]) {

        if (inp.action === 'purchase') {
          out[inp.crypto_code].crypto_amount += inp.crypto_amount;
          out[inp.crypto_code].money += inp.money;
        }
        if (inp.action === 'sale') {
          out[inp.crypto_code].crypto_amount -= inp.crypto_amount;
          out[inp.crypto_code].money -= inp.money;
        }

      } else {
        out[inp.crypto_code] = inp;

      }
      
      return out;
    }, {})
  }



  const resetTransactions = () => {
    transactions.value = [];
    availableCoins.value = {};
  }


  return {
    transactions,
    availableCoins,
    getTransactions,
    getAvailableCoins,
    resetTransactions
  }
}, { persist: true })