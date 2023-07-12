import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUsersStore = defineStore('users', () => {
  const user = ref(null)
  const token = ref(null)
  function setUser(payload) {
    user.value = payload.user;
    token.value = payload.token;
  }
  function setLogOut() {
    user.value = null;
    token.value = null;
  }

  return { user, token, setUser, setLogOut }
},{persist: true})
