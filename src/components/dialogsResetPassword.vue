<template>  
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
                <p class="style-label">รหัสผ่านปัจจุบัน <span>*</span></p>
                <v-text-field
                    v-model="password"
                    :rules="passwordRules"
                    label="รหัสผ่านปัจจุบัน"
                    required
                    dense
                    outlined
                    single-line
                    :type="showPassword ? 'text' : 'password'"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword"
                    autocomplete="on"
                
                ></v-text-field>
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
                    hide-details
                    :type="showPassword3 ? 'text' : 'password'"
                    :append-icon="showPassword3 ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword3 = !showPassword3"
                    autocomplete="on"
                ></v-text-field>
                <p v-if="errorMessage" class="error_message">{{ errorMessage }}</p>
            </v-card-text>

            <!-- <v-divider></v-divider> -->

            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                class="btn-cancel"
                text
                @click="close"
            >
            ยกเลิก
          </v-btn>
            <v-btn
                class="btn-submit"
                color="white"
                text
                type="submit"
            >
                บันทึก
            </v-btn>
            </v-card-actions>
        </v-form>
      
      </v-card>
    </v-dialog>

  </template>
  <script>
    import axios from "axios";
    import Swal from 'sweetalert2';
    export default {
        props: ['userId'],
        data: () => ({
            valid:false,
            dialog: false,
            password: '',
            newPassword: '',
            confirmPassword: '',
            showPassword: false,
            showPassword2: false,
            showPassword3: false,
            errorMessage:'',
            passwordRules: [
                v => !!v || 'กรุณากรอกข้อมูล',
                v => (v && v.length >= 8) || 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร',
            ],
            newPasswordRules: [
                v => !!v || 'กรุณากรอกข้อมูล',
                v => (v && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v)) || 'Minimum 8 characters, One capital latter, Special charater, Number',
            ],
            confirmPasswordRules: [
                v => !!v || 'กรุณากรอกข้อมูล',
                v => (v && v.length >= 8) || 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร',
            ],
         
        }),
        watch: {
            // dialog(val) {
            //     if(val) {
            //         this.password = '',
            //         this.newPassword = '',
            //         this.confirmPassword = ''
            //     }
            // }
        },
        computed: { 
            isPasswordMatch() {
                return this.newPassword === this.confirmPassword;
            }
        },

        methods:{
            open() {
                this.dialog = true 
            },
            close(){
                this.dialog = false 
                this.$refs.formReset.reset()
                this.$refs.formReset.resetValidation()
            },
            async resetPassword(){
                try {
                 
                    if(this.$refs.formReset.validate()){

                        if (!this.isPasswordMatch) {
                            this.errorMessage = await 'Password does not match'
                        } else {

                            let fd = await {
                                "id"            : this.userId,
                                "password"      : this.newPassword,
                            }
                            let path = await `/api/user/reset-password`
                            let response = await axios.post(`${path}`, fd)

                            await Swal.fire({
                                icon: 'success',
                                title: 'บันทึกสำเร็จ',
                                text: 'ระบบได้ทำการบันทึกข้อมูลของคุณแล้ว'
                            }).then( function(){
                            });
                            this.dialog = await false
                            await this.$refs.formReset.reset()
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
</style>