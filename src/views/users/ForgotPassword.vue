<template>
  <div class="page">
    <div class="center">
      <div class="box-forgot-password">
        <h2 class="mb-7">Forgot your password</h2>
        <p class="style-label">Enter email address</p>
        <v-form
          ref="formForgot"
          v-model="valid"
          lazy-validation
          @submit.prevent="sendPasswordResetEmail"    
        >
          <v-text-field
            v-model="email"
            :rules="emailRules"
            required
            label="อีเมล"
            single-line
            outlined
            dense
          ></v-text-field>
          <v-btn
            depressed
            class="w-100 btn-secondary"
            color="#003366"
            type="submit"
          >
            บันทึก
          </v-btn>
      </v-form>
          <router-link class="back-login text-decoration-none" to="/user/login" >
              <p class="mt-2 mb-0">Back To Login</p>
          </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2'
import  axios  from "axios"
export default {
  data: () => ({
    valid: false,
    email: '',
    emailRules: [ 
      v => !!v || 'กรุณากรอกข้อมูล',
      v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'อีเมลไม่ถูกต้อง'
    ],
  }),
  methods: {
    async sendPasswordResetEmail() {   
      try {
        // Send a request to the server to initiate the password reset process
        if(this.$refs.formForgot.validate()){
          let path = await `/api/user/forgot-password`
          let response = await axios.post(`${path}`, {email: this.email})

          // If the server returned a successful response
          if (response.status === 200) {
            await Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Password reset email sent! Please check your inbox.',
              showConfirmButton: false,
              timer: 1500
            })

            this.email = await ''
            await this.$refs.formForgot.reset()
            await this.$refs.formForgot.resetValidation()
            // alert("Password reset email sent! Please check your inbox.");
          }
        }
      } catch (error) {
        // If the server returned an error, display it to the user
        console.log('error', error);
        Swal.fire({
            title: 'Error!',
            text: 'อีเมลไม่ถูกต้อง',
            icon: 'error',
            confirmButtonText: 'Ok'
        })
      }
    }
  }
}
</script>

<style>
    .page{
        height: 100%;
        background-color: #167dc2;
    }
    .center{
        display: flex;
        height: 100%;
        align-items: center;
        justify-content: center;
        width: 100%;
    }
    .box-forgot-password{
      margin: 0 1rem;
      width: 100%;
      max-width: 350px;
      padding: 1.5rem;
      background-color: white;
      border-radius: 15px;
      box-shadow: 0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12)!important;
    }
    .btn-secondary{
      color: white!important;
    }
</style>