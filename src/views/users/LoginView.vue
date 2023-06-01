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
                    
                    <!-- <v-row no-gutters>
                        <v-col>
                            <v-text-field
                                v-model="newPassword"
                                :rules="newPasswordRules"
                                label="New Password"
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
                    </v-row> -->

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
                            
                            >Login</v-btn>
                        </v-col>
                        <!-- :disabled="disabled == true" -->
                     
                    </v-row>
                    <router-link class="box-forgot" to="/user/forgot-password" >
                        <div class="forgot-password mt-2">Forgot your password?</div>
                    </router-link>
                    
                 
                </v-form>
        </div>
        <div class="box-reset-password">
            <v-dialog
                v-model="dialog"
                class="dialog-reset"   
                persistent
                width="500"
            >
                <v-card>
                    <v-card-title class="text-h5 text lighten-2">เปลี่ยนรหัสผ่าน</v-card-title>
                    <v-form
                        ref="formReset"
                        class="form-reset"
                        v-model="valid"
                        lazy-validation
                        @submit.prevent="resetPassword"    
                    >
                        <v-card-text>
                        <ResetPassword ref="pass"/>
                            <p v-if="errorMessage" class="error_message">{{ errorMessage }}</p>
                        </v-card-text>   
                            <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn class="btn btn-submit" text type="submit">บันทึก</v-btn>
                            <v-btn class="btn btn-cancel" text @click="dialog == false">ยกเลิก</v-btn>
                         
                        </v-card-actions>
                    </v-form>
                </v-card>
            </v-dialog>
        </div>
    </div>
    
</template>

<script>
import Swal from 'sweetalert2'
import axios from "axios";
import store from '../../store/index.js';
import ResetPassword from '@/components/resetPassword.vue';

export default {
  components: { ResetPassword },
    data: () => ({
    dialog: false,
      valid: true,
      showPassword: false,
      disabled: false,
      check: false,
      check_user : false,
      errorMessage:'',
      email: '',
      emailRules: [
        v => !!v || 'กรุณากรอกข้อมูล',
        v => v.length >= 8 || 'ชื่อผู้ใช้ต้องมีอักษรอย่างน้อย 8 ตัว'
      ],
      password: '',
      passwordRules: [
        v => !!v || 'กรุณากรอกข้อมูล',
      ],
    }),
    computed: {
        isPasswordMatch() {
            return this.$refs.pass.newPassword === this.$refs.pass.confirmPassword;
        }
    },
    methods: {
      
        async login () {
            if( this.$refs.form.validate()){
                try { 
                    this.disabled   =  await true
                    let path        = await `/api/user/checkLogin`
                    let response    =  await axios.post(path,{
                        email: this.email,
                        password: this.password,
                     
                    })
                    console.log(response);

                    if(!response.data.first_reset_password){
                        this.dialog = await true
                    
                    }else{

                        await store.dispatch('userLogin',{
                            email: this.email,
                            password: this.password
                        })


                        await this.$router.push({name:"complain-follow"});

                        await Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'เข้าสู่ระบบสำเร็จ',
                            showConfirmButton: false,
                            timer: 1000
                        })
                    }
                 
                

                } catch (error) {
                    console.log('error', error);
                    await Swal.fire({
                        title: 'Error!',
                        text: 'รหัสผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    })
                    this.disabled =  await false
                } 
            }
        },
        async resetPassword(){
            if(this.$refs.formReset.validate()){
                if(!this.isPasswordMatch){
                    this.errorMessage = await 'Password does not match'
                }else{
                    let path_update = await `/api/user/resetePasswordLogin`
                    await axios.post(path_update,{
                        email       : this.email,
                        password    : this.$refs.pass.newPassword,
                        // user_id     : response.data.id
                    })
                    await Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'เปลี่ยนรหัสเรียบร้อยเเล้ว กรุณาเข้าสู่ระบบอีกครั้ง',
                        showConfirmButton: false,
                        timer: 1000
                    })
                    // this.email = await ''
                    // this.password = await ''
                     
                } 

                this.email = await ''
                this.password = await ''
                await this.$refs.form.resetValidation()
                this.dialog = await false
              
            }
          
        }
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