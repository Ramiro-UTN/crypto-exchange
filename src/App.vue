<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HeaderTitle from './components/HeaderTitle.vue'
import { useUsersStore } from './stores/user';
import { useTransactionsStore } from './stores/transactions'
import { storeToRefs } from 'pinia'
const store = useUsersStore();
const transactionsStore = useTransactionsStore();
const { user } = storeToRefs(store);
import Button from 'primevue/button';
import { useRouter } from 'vue-router';
const router = useRouter();


const logOut = () => {
  store.setLogOut();
  transactionsStore.resetTransactions();
  router.push('/login');

}

</script>

<template>
  <div class="flex flex-column gap-2 h-full">
    <header>

      <div class="wrapper">
        <HeaderTitle msg="Crypto Exchange" />

        <nav>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/wallet">My Wallet</RouterLink>
          <RouterLink to="/transactions">Transactions</RouterLink>
          <RouterLink to="/history">History</RouterLink>
          <span>{{ user ? user.userName : '' }}</span>
          <Button v-show="user" class="btn" @click="logOut" label="Log Out" />
        </nav>
      </div>
    </header>

    <RouterView />
    <div class="footer">
      <span>Laboratorio III - Ramiro Lonatti</span>
    </div>
  </div>
</template>

<style scoped>
header {

  line-height: 1.5;
  max-height: 100vh;
  display: flex;
  background-color: rgba(0, 0, 0, 0.712);
  padding: 1rem 2rem;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;


}

.btn {
  width: 6rem;
  height: 2rem;

}

.footer span{
  color:white;
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;


}

span {
  align-self: flex-end;
  padding: 0 1rem;
  color: rgb(137, 148, 252);

}

nav {
  width: fit-content;

  padding: 1rem 2rem;
  font-size: 12px;
  text-align: center;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;


}

nav a.router-link-exact-active {
  color: #9fa8dabb;
  font-weight: 500;
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
    align-items: center;
    justify-content: space-between;

  }

  nav {
    text-align: right;

    font-size: 1rem;

  }



}
</style>
