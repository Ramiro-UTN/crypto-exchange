<script setup>
import axios from 'axios';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Password from 'primevue/password';
import { ref } from 'vue';
import { useUsersStore } from '../stores/user'
import { useRouter } from 'vue-router';

const store = useUsersStore();
const userId = ref(null);
const password = ref(null);
const { setUser } = store;
const router = useRouter();
const loading = ref(false)

const handleSubmit = async () => {
  const userObject = {
    userName: userId.value,
    password: password.value
  }

  await login(userObject);
}

const login = async (values) => {
  loading.value = true;
  console.log('values:', values, "type:", typeof values);
  const request = axios.post('http://localhost:3001/auth/login', values);
  const loggedIn = await request.then(response => response.data);

  if (loggedIn) {
    setUser(loggedIn);
    loading.value = false;
    router.push("/");
  }
  console.log('response:', loggedIn);


}


</script>
<template>
  <div class="cont">
    <form @submit.prevent="handleSubmit()">
      <div class="label-input-group">
        <label for="username">Username</label>
        <span class="p-input-icon-left inputBox">
          <i class="pi pi-user" />
          <InputText id="username" v-model="userId" placeholder="Username" />
        </span>
      </div>
      <div class="label-input-group">
        <label for="password">Password</label>
        <Password v-model="password" placeholder="Password" toggleMask id="password" />
      </div>

      <Button :loading="loading" class="btn" type="submit" label="Sign In" icon="pi pi-check" aria-label="Sign In" />
    </form>
  </div>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  place-items: center;
  row-gap: 1rem;
  padding: 2rem;
  margin-top: 1rem;
}

.label-input-group {
  display: flex;
  flex-direction: column;

}

.btn {
  width: 150px;
}
</style>