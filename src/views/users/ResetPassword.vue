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
            <resetPassword ref="pass"/>
           
              <!-- <p class="style-label">รหัสผ่านใหม่ <span>*</span></p>

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
              ></v-text-field> -->
              <p v-if="errorMessage" class="error_message not-match">{{ errorMessage }}</p>
              <p class="valid-text">*หมายเหตุ กำหนดรหัสผ่าน 8 ตัวอักษรขึ้นไป ประกอบด้วย อักษรภาษาอังกฤษ พิมพ์ใหญ่ พิมพ์เล็ก อักขระพิเศษ เเละตัวเลข</p>
              <v-card-actions class="px-0">
                <v-spacer></v-spacer>
                <v-btn class="btn btn-submit" text type="submit">บันทึก</v-btn>
                <v-btn class="btn btn-cancel" text @click="closeDialog">ยกเลิก</v-btn>
            
                </v-card-actions>
          </v-card-text>
        

      </v-form>
    
    </v-card>
  </v-dialog>

</div>
</template>
<script>
  // import store from '../store/index.js';
  import axios from "axios";
  import Swal from 'sweetalert2';
import resetPassword from '@/components/resetPassword.vue';

  export default {
  components: { resetPassword },

      data: () => ({
          valid:false,
          dialog: true,
        //   newPassword: '',
        //   confirmPassword: '',
        //   showPassword2: false,
        //   showPassword3: false,
          errorMessage:'',
        //   newPasswordRules: [
        //     v => !!v || 'กรุณากรอกข้อมูล',
        //     // v => (v && v.length >= 8) || 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร',
        //     v => (v && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v)) || 'Minimum 8 characters, One capital latter, Special charater, Number',
        //   ],
        //   confirmPasswordRules: [
        //     v => !!v || 'กรุณากรอกข้อมูล',
        //     v => (v && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v)) || 'Minimum 8 characters, One capital latter, Special charater, Number',
        //     // v => (v && v.length >= 8) || 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร',
        //   ],
      }),
      created(){

        this.fetchResetPassword();
      },
        computed: { 
            isPasswordMatch() {
                return this.$refs.pass.newPassword === this.$refs.pass.confirmPassword;
            }
        },
      methods:{
        closeDialog(){
          this.$router.push("/user/login")
        },
        async fetchResetPassword(){



          console.log(this.$route.params.token);

          const response = await axios.get(`/api/user/checkTokenReset/${this.$route.params.token}`);

          // console.log(response.data.status);
          if(response.data.status === 401){
            this.$router.push({name : 'NotFound'})
          }else{
            return { success: true, message: 'Password reset successful' };
          } 

        },
        async resetPassword(){
            try {
                if(this.$refs.formReset.validate()){

                    if (this.isPasswordMatch) {
                        let fd = await {
                            "forgot_token"  : this.$route.params.token,
                            "password"      : this.$refs.pass.newPassword,
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
                    
                    } else {
                      this.errorMessage = await 'รหัสผ่านไม่ตรงกัน'
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
        // async resetPassword(){
          //       try {
          //           if(this.$refs.formReset.validate()){

          //               if (this.isPasswordMatch) {
          //                   let fd = await {
          //                       "forgot_token"  : this.$route.query.token,
          //                       "password"      : this.$refs.pass.newPassword,
          //                   }

          //                   let path = await `/api/user/forgot/reset-password`
          //                   let response = await axios.post(`${path}`, fd)

          //                   await Swal.fire({
          //                       icon: 'success',
          //                       title: 'บันทึกสำเร็จ',
          //                       text: 'ระบบได้ทำการบันทึกข้อมูลของคุณแล้ว'
          //                   }).then( function(){
          //                   });

          //                   await this.$router.push('/user/login')
          //                   console.log(response);
                       
          //               } else {
          //                 this.errorMessage = await 'รหัสผ่านไม่ตรงกัน'
          //               }
          //         }
          //     } catch (error) {
          //         Swal.fire({
          //         icon: 'error',
          //         title: 'บันทึกไม่สำเร็จ',
          //         text: 'มีข้อผิดพลาดที่ไม่คาดคิดเกิดขึ้น โปรดลองใหม่อีกครั้ง'
          //         })
          //         console.log('error_resetPassword', error );
          //     }
          // },
      }
  
  }
</script>
<style scoped>
.dialog-reset{
  background-color: #1e1e1ecc!important;
}
.not-match{
  background: #e7e7e7;
  text-align: center;
}

v-deep.v-icon.v-icon{
  font-size: 24px;
}
.btn-cancel{
  border: 1px solid #003366;
  color: #003366;
}
.btn-submit{
  border: 1px solid #003366;
  background: #003366;
}
.valid-text{
  color: red;
}
</style>