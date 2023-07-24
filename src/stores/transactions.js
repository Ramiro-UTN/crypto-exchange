import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios';

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref([]);


  const getTransactions = async (user) => {
    const baseURL = `http://localhost:3001/transactions?q={"user_id":"${user}"}`
    const req = axios.get(baseURL)
    await req.then(response => transactions.value = response.data)
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