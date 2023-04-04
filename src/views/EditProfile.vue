<template>
  <div class="edit-profile">
    <div class="style-page">
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
      >
        <stepTwo ref="user" :datas="check_roles" check_page="edit-profile"/>
        <v-btn class="btn-submit" @click="editProfile">บันทึก</v-btn>
      </v-form>
    </div>
  </div>
</template>

<script>
import axios  from "axios"
import Swal from 'sweetalert2'
import store from '../store/index.js'
import stepTwo from '@/components/step/stepTwo.vue'

export default {
  components: { stepTwo },
  data: () => ({
    valid: true,
    check_roles: store.getters.user,
  }),
  methods:{
    async editProfile(){
      if(this.$refs.form.validate()){
          const user = await this.$refs.user

          try {
            let fd = await {
                "id"                    : user.item.id,
                "email"                 : user.item.email,
                "name"                  : user.item.name,
                "lastname"              : user.item.lastname,
                "gender"                : user.item.gender,
                "age"                   : user.item.age,
                "phone"                 : user.item.phone,
                "phone_other"           : user.item.phone_other,
                "address"               : user.item.address,      
                "province_id"           : user.province !== null ? user.province.id || user.province : null,
                "district_id"           : user.district !== null ? user.district.id || user.district : null,
                "subdistrict_id"        : user.subdistrict !== null ? user.subdistrict.id || user.subdistrict : null,
                "postcode"              : user.item.postcode,
                "roles"                 : "roles"
            }
                let path = await `/api/user/edit/profile`
                let response = await axios.post(`${path}`, fd)
                console.log(response);

                await Swal.fire({
                  icon: 'success',
                  title: 'บันทึกสำเร็จ',
                  text: 'ระบบได้ทำการบันทึกข้อมูลของคุณแล้ว'
                }).then(async function(){
                     await store.dispatch("setName", fd)
                });
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'บันทึกไม่สำเร็จ',
              text: 'มีข้อผิดพลาดที่ไม่คาดคิดเกิดขึ้น โปรดลองใหม่อีกครั้ง'
            })
            console.log('edit_profile', error );
          }

      } 
    } 

  }
 
}

</script>

<style scoped>
.form-register{
    box-shadow: none!important;
}

.btn-submit{
    border: 1px solid #003366;
    background-color: #003366!important;
    color: white;
}

</style>