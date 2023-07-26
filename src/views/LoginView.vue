<script setup>
import axios from 'axios';
import { RouterLink } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Password from 'primevue/password';
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";
const toast = useToast();
import { ref } from 'vue';
import { useUsersStore } from '../stores/user'
import { useRouter } from 'vue-router';



const store = useUsersStore();
const userId = ref(null);
const password = ref(null);
const email = ref(null);
const { setUser } = store;
const router = useRouter();
const loading = ref(false)
const isLogin = ref(true);



const handleSubmit = async () => {
  const userObject = (isLogin.value) ? { userName: userId.value, password: password.value }
  :{ userName: userId.value, email: email.value, password: password.value }

  if (isLogin.value) await login(userObject);
  if (!isLogin.value) await register(userObject);
}

const login = async (values) => {
  //loading.value = true;
  console.log('values:', values, "type:", typeof values);
  const request = axios.post('http://localhost:3001/auth/login', values);
  const loggedIn = await request.then(response => response.data);

  if (loggedIn) {
    setUser(loggedIn);
    router.push("/");
  }
  console.log('response:', loggedIn);
}
const register = async (values) => {

  const request = axios.post('http://localhost:3001/auth/register', values);
  const savedUser = await request.then(response => response.data);
  if(savedUser){
    toast.add({ severity: "success", summary: 'Confirmed', detail: 'you have successfully registered', life: 3000 });
    isLogin.value = true;
  }

}


</script>
<template>
  <Toast/>
  <div class="cont">
    <form @submit.prevent="handleSubmit()">
      <div class="label-input-group">
        <label for="username">Username</label>
        <span class="p-input-icon-left inputBox">
          <i class="pi pi-user" />
          <InputText id="username" v-model="userId" placeholder="Username" />
        </span>
      </div>
      <template v-if="!isLogin">
        <div class="label-input-group">
          <label for="email">Email</label>
          <span class="p-input-icon-left inputBox">
            <i class="pi pi-envelope" />
            <InputText id="email" v-model="email" placeholder="Email" />
          </span>
        </div>
      </template>
      <div class="label-input-group">
        <label for="password">Password</label>
        <Password v-model="password" placeholder="Password" toggleMask id="password" />
      </div>

      <Button class="btn" type="submit" :label="isLogin ? 'Sign In' : 'Sign Up'" icon="pi pi-check" />
      <small>
        <RouterLink @click="isLogin = !isLogin" :to="isLogin ? '/register' : '/login'">
          {{ isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In" }}
        </RouterLink>
      </small>
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