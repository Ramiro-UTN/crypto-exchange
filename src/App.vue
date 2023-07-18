<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HeaderTitle from './components/HeaderTitle.vue'
import { useUsersStore } from './stores/user';
import {useTransactionsStore} from './stores/transactions'
import { storeToRefs } from 'pinia'
const store = useUsersStore();
const transactionsStore = useTransactionsStore();
const { user } = storeToRefs(store);
import Button from 'primevue/button';
import { useRouter } from 'vue-router';
const router = useRouter()

const logOut = () => {
  store.setLogOut();
  transactionsStore.resetTransactions();
  router.push('/login');
  
}

</script>

<template>
  <header>

    <div class="wrapper">
      <HeaderTitle msg="Crypto Exchange" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/transactions">Transactions</RouterLink>
        <RouterLink to="/history">History</RouterLink>
        <span>{{ user ? user.userName : '' }}</span>
        <Button v-show="user" class="btn" @click="logOut" label="Log Out" />
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  display: flex;
  

}
.btn{
  width: 6rem;
  height: 2rem;
  
}

.wrapper {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
  
}

span {
  align-self: flex-end;
  padding: 0 1rem;

}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;

}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    /* padding-right: calc(var(--section-gap) / 2); */
  }




  header .wrapper {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;

  }

  nav {
    text-align: right;
    margin-left: -1rem;
    font-size: 1rem;
    margin-top: 1rem;
  }



}
</style>
