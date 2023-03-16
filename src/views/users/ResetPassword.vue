<template>  
<div class="page">
  <v-dialog
      v-model="dialog"
      class="dialog-reset"  
     
      persistent
      width="500"
  >
  <v-card>
      <v-card-title class="text-h5 text lighten-2">
          เปลี่ยนรหัสผ่าน
      </v-card-title>
      <v-form
          ref="formReset"
          class="form-reset"
          v-model="valid"
          lazy-validation
          @submit.prevent="resetPassword"    
      >

          <v-card-text>
              <!-- <p class="style-label">รหัสผ่านปัจจุบัน <span>*</span></p>
              <v-text-field
                  v-model="password"
                  :rules="passwordRules"
                  label="รหัสผ่านปัจจุบัน"
                  required
                  dense
                  outlined
                  :type="showPassword ? 'text' : 'password'"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPassword = !showPassword"
                  autocomplete="on"
              
              ></v-text-field> -->
              <p class="style-label">รหัสผ่านใหม่ <span>*</span></p>
              <v-text-field
                  v-model="newPassword"
                  :rules="newPasswordRules"
                  label="รหัสผ่านใหม่"
                  required
                  dense
                  outlined
                  single-line
                  :type="showPassword2 ? 'text' : 'password'"
                  :append-icon="showPassword2 ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPassword2 = !showPassword2"
                  autocomplete="on"
              ></v-text-field>
              <p class="style-label">ยืนยันรหัสผ่านใหม่ <span>*</span></p>
              <v-text-field
                  v-model="confirmPassword"
                  :rules="confirmPasswordRules"
                  label="ยืนยันรหัสผ่านใหม่"
                  required
                  dense
                  outlined
                  single-line
                  :type="showPassword3 ? 'text' : 'password'"
                  :append-icon="showPassword3 ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPassword3 = !showPassword3"
                  autocomplete="on"
              ></v-text-field>
              <p v-if="errorMessage" class="error_message">{{ errorMessage }}</p>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="blue darken-1"
              text
              @click="closeDialog"
          >
          ยกเลิก
        </v-btn>
          <v-btn
              color="primary"
              text
              type="submit"
          >
              บันทึก
          </v-btn>
          </v-card-actions>
      </v-form>
    
    </v-card>
  </v-dialog>

</div>
</template>
<script>
  // import store from '../store/index.js';
  import axios from "axios";
  import Swal from 'sweetalert2';

  export default {

      data: () => ({
          valid:false,
          dialog: true,
          newPassword: '',
          confirmPassword: '',
          showPassword2: false,
          showPassword3: false,
          errorMessage:'',
          newPasswordRules: [
            v => !!v || 'กรุณากรอกข้อมูล',
            // v => (v && v.length >= 8) || 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร',
            v => (v && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v)) || 'Minimum 8 characters, One capital latter, Special charater, Number',
          ],
          confirmPasswordRules: [
            v => !!v || 'กรุณากรอกข้อมูล',
            v => (v && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v)) || 'Minimum 8 characters, One capital latter, Special charater, Number',
            // v => (v && v.length >= 8) || 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร',
          ],
      }),
      created(){
        console.log(this.$route.query.token)
      },
        computed: { 
            isPasswordMatch() {
                return this.newPassword === this.confirmPassword;
            }
        },
      methods:{
          closeDialog(){
            this.$router.push("/user/login")
          },
          async resetPassword(){
                try {
                    if(this.$refs.formReset.validate()){

                        if (!this.isPasswordMatch) {
                            this.errorMessage = await 'Password does not match'
                        } else {
                            let fd = await {
                                "forgot_token"  : this.$route.query.token,
                                "password"      : this.newPassword,
                            }

                            let path = await `/api/user/forgot/reset-password`
                            let response = await axios.post(`${path}`, fd)

                            await Swal.fire({
                                icon: 'success',
                                title: 'บันทึกสำเร็จ',
                                text: 'ระบบได้ทำการบันทึกข้อมูลของคุณแล้ว'
                            }).then( function(){
                            });

                            await this.$router.push('/user/login')
                            console.log(response);
                        }
                  }
              } catch (error) {
                  Swal.fire({
                  icon: 'error',
                  title: 'บันทึกไม่สำเร็จ',
                  text: 'มีข้อผิดพลาดที่ไม่คาดคิดเกิดขึ้น โปรดลองใหม่อีกครั้ง'
                  })
                  console.log('error_resetPassword', error );
              }
          },
      }
  
  }
</script>
<style scoped>
.dialog-reset{
  background-color: #1e1e1ecc!important;
}

</style>