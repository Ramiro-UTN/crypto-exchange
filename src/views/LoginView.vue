<script setup>
import axios from 'axios';
import { RouterLink } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Password from 'primevue/password';
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";
const toast = useToast();
import { ref, reactive } from 'vue';
import { useUsersStore } from '../stores/user'
import { useRouter } from 'vue-router';



const store = useUsersStore();

const { setUser } = store;
const router = useRouter();
const isLogin = ref(true);

//validate form
import * as yup from 'yup';
import { useForm } from 'vee-validate';

const loginSchema = yup.object().shape({
  userId: yup.string().required('Please enter your ursername').label('Username'),
  password: yup.string().required('Please enter your password').label('Password'),
})

// const registerSchema = yup.object().shape({
//   userId: yup.string().required('Please enter your ursername').label('Username'),
//   email: yup.string().email().required('Please enter your email').label('Email'),
//   password: yup.string().required('Please enter your password').label('Password'),
// })

const { handleSubmit,
  resetForm,
  errors,
  defineComponentBinds,
  values } = useForm({ validationSchema: loginSchema });

//

const userId = defineComponentBinds('userId');
const password = defineComponentBinds('password');
const email = defineComponentBinds('email');

const onSubmit = handleSubmit(async (values) => {

  const userObject = (isLogin.value) ? { userName: userId.value.modelValue, password: password.value.modelValue }
    : { userName: userId.value.modelValue, email: email.value.modelValue, password: password.value.modelValue }

  if (isLogin.value) await login(userObject);
  if (!isLogin.value) await register(userObject);


});



const handleSubmits = async () => {

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
  if (savedUser) {
    toast.add({ severity: "success", summary: 'Confirmed', detail: 'You have successfully registered', life: 3000 });
    isLogin.value = true;
  }

}




</script>
<template>
  <Toast />
  <div class="cont flex justify-content-center pt-2">
    <form @submit.prevent="onSubmit">
      <div class="label-input-group">
        <label for="username">Username</label>
        <span class="p-input-icon-left inputBox">
          <i class="pi pi-user" />
          <InputText :class="{ 'p-invalid': errors.userId }" id="username" v-bind="userId" placeholder="Username" />
        </span>
        <small id="userId-help" class="p-error">
          {{ errors.userId }}
        </small>
      </div>
      <template v-if="!isLogin">
        <div class="label-input-group">
          <label for="email">Email</label>
          <span class="p-input-icon-left inputBox">
            <i class="pi pi-envelope" />
            <InputText :class="{ 'p-invalid': errors.email }" id="email" v-bind="email" placeholder="Email" />
          </span>
          <small id="email-help" class="p-error">
            {{ errors.email }}
          </small>
        </div>
      </template>
      <div class="label-input-group">
        <label for="password">Password</label>
        <Password :class="{ 'p-invalid': errors.password }" v-bind="password" placeholder="Password" toggleMask
          id="password" />
        <small id="password-help" class="p-error">
          {{ errors.password }}
        </small>
      </div>

      <Button class="btn" type="submit" :label="isLogin ? 'Sign In' : 'Sign Up'" icon="pi pi-check" />
      <small>
        <RouterLink @click="isLogin = !isLogin" :to="isLogin ? '/register' : '/login'">
          <span class="router-link">{{ isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In" }}</span>
        </RouterLink>
      </small>
    </form>

  </div>
</template>

<style scoped>
form {
  display: flex;
  color: rgb(54, 54, 54);
  flex-direction: column;
  height: fit-content;
  place-items: center;
  row-gap: 1rem;
  padding: 2.5rem 1.2rem 1rem;
  margin-top: 1rem;
  width: fit-content;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  background-color: rgba(255, 255, 255, 0.555);
  
}

.router-link{
  color: rgb(54, 54, 54);
}

.label-input-group {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0.2rem 1rem;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;

}

.btn {
  width: 150px;
}
</style>