<template>
    <div class="page-login">
        <div class="box-login">
            <div class="box-logo mb-3">
                <img src="@/assets/images/logo-cgd.png"/>
            </div>
            <h2 class="mb-7">ระบบรับเรื่องร้องเรียนทุจริต</h2>
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
                                v-model="email"
                                :rules="emailRules"
                                label="email"
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
                        <!-- <v-col md="6" class="box-left">
                                <router-link  to="/user/register" >
                                    <div class="text-left">Register</div>
                                </router-link>
                        </v-col> -->
                        <v-col md="12">
                            <v-btn 
                                class="btn-right"
                                type="submit"
                                :disabled="disabled == true"
                            >Login</v-btn>
                        </v-col>
                    </v-row>
                    <router-link class="box-forgot" to="/user/forgot-password" >
                        <div class="forgot-password mt-2">Forgot your password?</div>
                    </router-link>
                    
                 
                </v-form>
        </div>
    </div>
    <!-- <div class="page"> -->
        <!-- <div class="center"> -->
            <!-- <div class="box-login">
                <div class="box-logo mb-3">
                    <img src="@/assets/logo-cgd.png"/>
                </div>
                <h2 class="mb-7">ระบบรับเรื่องร้องเรียนทุจริต</h2>
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
                                v-model="email"
                                :rules="emailRules"
                                label="email"
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
                        <v-col md="6" class="box-left">
                                < to="/user/register" >
                                    <div class="text-left">Register</div>
                                </router-link>
                        </v-col>
                        <v-col md="6">
                            <v-btn 
                                class="btn-right"
                                type="submit"
                                :disabled="disabled == true"
                            >Login</v-btn>
                        </v-col>
                    </v-row>
                    <router-link class="box-forgot" to="/user/forgot-password" >
                        <div class="forgot-password mt-2">Forgot your password?</div>
                    </router-link>
                    
                 
                </v-form>
            </div> -->
        <!-- </div> -->
    <!-- </div> -->
</template>

<script>
import Swal from 'sweetalert2'
import store from '../../store/index.js';
export default {
    data: () => ({
    
      valid: true,
      showPassword: false,
      disabled: false,
      check: false,
      email: '',
      emailRules: [
        v => !!v || 'กรุณากรอกข้อมูล',
        v => v.length >= 8 || 'ชื่อผู้ใช้ต้องมีอักษรอย่างน้อย 8 ตัว'
        // v => (v && v.length <= 10) || 'Name must be less than 10 characters',
      ],
      password: '',
      passwordRules: [
        v => !!v || 'กรุณากรอกข้อมูล',
        // v => (v && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v)) || 'Minimum 8 characters, One capital latter, Special charater, Number',
        // v => v.length >= 8 || 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'
      ],
    }),

    methods: {
        // register(){
        //     console.log(this.check);
        //     this.check = true 
        // },
        async login () {
            if( this.$refs.form.validate()){
                try { 
                    this.disabled =  await true
                    await store.dispatch('userLogin',{
                        email: this.email,
                        password: this.password
                    })

                    await this.$router.push({name:"complain-report"});

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
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .box-login{
        margin: 0 1rem;
        width: 100%;
        max-width: 350px;
        max-height: 456px;
        padding: 1.5rem;
        background-color: #003366;
        border-radius: 15px;
        box-shadow: 0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12)!important;
    }
    .box-logo img{
        width: 100%;
        max-width: 90px;
    }
 
    .btn-right{
        width: 100%;
        background: #167dc2!important;
        color: white!important;
        /* border-radius: inherit;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px; */
    }

    .box-left{
        text-transform: uppercase;
        font-weight: 500;
        border: 1px solid #003366;
        border-bottom-left-radius: 4px;
        border-top-left-radius: 4px;
    }
    .box-left a{
        text-decoration: none;
    }
    .box-left .text-left{
        color: #003366;
        height: 34px;
        padding: 6px 0;
        text-align: center!important;
    }
  
    .box-forgot{
        text-decoration: none;
    }
    .box-forgot .forgot-password{
        color: white;
        font-size: 14px;
    }
    .mb-7{
        color: white;
        font-weight: 300;
    }
  
    .style-input-login ::v-deep  .v-input__slot{
        background: white!important;
        box-shadow: none!important;
    }
    ::v-deep .v-icon{
        font-size: 14px!important;
    }
    .w-100{
        width: 100%;
    }

    
</style>