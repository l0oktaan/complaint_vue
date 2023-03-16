<template>
    <div class="page-login">
        <div class="center">
            <div class="box-login">
                <div class="box-logo mb-3">
                    <img src="@/assets/images/logo-yellow.png"/>
                </div>
                <h2>ระบบรับเรื่องร้องเรียนทุจริต</h2>
                <h2 class="mb-7">เจ้าหน้าที่กรมบัญชีกลาง</h2>
                <v-form
                    ref="form"
                    class="form-login"
                    v-model="valid"
                    lazy-validation
                    @submit.prevent="login"    
                >
                    <v-row>
                        <v-col>
                            <v-text-field
                                v-model="username"
                                :rules="usernameRules"
                                label="Username"
                                required
                                solo
                                prepend-inner-icon="fa-solid fa-user"
                                class="style-input-login"
                            ></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row no-gutters>
                        <v-col>
                            <v-text-field
                                v-model="password"
                                :rules="passwordRules"
                                label="Password"
                                required
                                solo
                                prepend-inner-icon="fa-solid fa-lock"
                                class="style-input-login"
                                :type="showPassword ? 'text' : 'password'"
                                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append="showPassword = !showPassword"
                                autocomplete="on"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row no-gutters>
                        <v-col>
                            <v-btn 
                                class="btn-login mb-1"
                                type="submit"
                                :disabled="disabled == true"
                            >Login</v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </div>
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2'
import store from '../../store/index.js';
export default {
    data: () => ({
      valid: true,
      showPassword: false,
      disabled: false,
      username: '',
      usernameRules: [
        v => !!v || 'Username is required',
        // v => (v && v.length <= 10) || 'Name must be less than 10 characters',
      ],
      password: '',
      passwordRules: [
        v => !!v || 'Password is required',
      ],
    }),

    methods: {
        async login () {
            if( this.$refs.form.validate()){
                try { 
                    this.disabled =  await true
                    await store.dispatch('login',{
                        username: this.username,
                        password: this.password
                    })

                    await this.$router.push({name:"personnel"});

                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'เข้าสู่ระบบสำเร็จ',
                        showConfirmButton: false,
                        timer: 1000
                    })
                } catch (error) {
                    console.log('error', error);
                    Swal.fire({
                        title: 'Error!',
                        text: 'รหัสผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    })
                    this.disabled =  await false
                } 
            }
        },
    },
}
</script>

<style scoped>
    .page-login{
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
    .box-login{
        margin: 0 1rem;
        width: 100%;
        max-width: 350px;
        padding: 1.5rem;
        background-color: white;
        border-radius: 15px;
        box-shadow: 0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12)!important;
    }
    .box-logo img{
        width: 100%;
        max-width: 90px;
    }
    .style-input-login .v-input__slot{
        background: #e6e6e6!important;
        box-shadow: none!important;
    }
    .form-login .v-icon{
        font-size: 16px;
    }
    .btn-login{
        width: 100%;
        background: #003366!important;
        color: white!important;
    }
    /* .w-100{
        width: 100%;
    }
    .box-forgot{
        text-decoration: none;
    }
    .box-forgot .forgot-password{
        color: #333;
        font-size: 14px;
    }
   */
    
</style>