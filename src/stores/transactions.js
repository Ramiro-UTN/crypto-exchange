import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios';

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref([]);


  const getTransactions = (user) => {
    const baseURL = `http://localhost:3001/transactions?q={"user_id":"${user}"}`
    axios.get(baseURL)
      .then(res => {
        transactions.value = res.data;
        console.log('trans:', transactions.value)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  
  const resetTransactions = () => {
    transactions.value = [];
  }


  return {
    transactions,
    getTransactions,
    resetTransactions
  }
}, { persist: true })