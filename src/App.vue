<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HeaderTitle from './components/HeaderTitle.vue'
</script>

<template>
  <header>

    <div class="wrapper">
      <HeaderTitle msg="Crypto Exchange" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;

}

.wrapper {
  display: flex;
  align-items: flex-end
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
    padding-right: calc(var(--section-gap) / 2);
  }




  header .wrapper {
    display: flex;
    align-items: flex-end;

  }

  nav {
    text-align: right;
    margin-left: -1rem;
    font-size: 1rem;
    margin-top: 1rem;
  }
}
</style>
