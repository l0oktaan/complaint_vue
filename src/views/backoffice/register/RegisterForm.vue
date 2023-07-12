<template>
  <div class="register-form">
      <LoaderView ref="loader"/>
      <breadcrumbsView :items="item"/>
      <div class="style-page">
          <v-row>
            <v-col>
              <p class="style-label">Email :</p>
              <v-text-field
                  v-model="data.email"
                  dense
                  outlined
                  readonly
                  hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols md="4">
              <p class="style-label">ชื่อ :</p>
              <v-text-field
                  v-model="data.name"
                  dense
                  outlined
                  readonly
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols md="4">
                <p class="style-label">นามสกุล :</p>
              <v-text-field
                  v-model="data.lastname"
                  dense
                  outlined
                  readonly
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols md="4">
              <p class="style-label">อายุ (ปี) : </p>
              <v-text-field
                  v-model="data.age"
                  dense
                  outlined
                  readonly
                  hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols md="6">
              <p class="style-label">เบอร์โทรศัพท์มือถือ :</p>
              <v-text-field
                  v-model="data.phone"
                  dense
                  outlined
                  readonly
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols md="6">
                <p class="style-label">เบอร์ติดต่ออื่น ๆ :</p>
              <v-text-field
                  v-model="data.phone_other"
                  dense
                  outlined
                  readonly
                  hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <p class="style-label">ที่อยู่ :</p>
              <v-text-field
                  v-model="data.address"
                  dense
                  outlined
                  readonly
                  hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols md="3">
              <p class="style-label">จังหวัด</p>
              <v-text-field
                  v-model="data.province_name"
                  dense
                  outlined
                  readonly
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols md="3">
              <p class="style-label">เขต / อำเภอ</p>
              <v-text-field
                  v-model="data.district_name"
                  dense
                  outlined
                  readonly
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols md="3">
              <p class="style-label">แขวง / ตำบล</p>
              <v-text-field
                  v-model="data.subdistrict_name"
                  dense
                  outlined
                  readonly
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols md="3">
              <p class="style-label">รหัสไปรษณีย์</p>
              <v-text-field
                  v-model="data.postcode"
                  dense
                  outlined
                  readonly
                  hide-details
              ></v-text-field>
            </v-col>
          </v-row>
      </div>
  </div>

</template>

<script>
import  axios  from "axios"
import LoaderView from '@/components/loaderView.vue'
import breadcrumbsView from "@/components/breadcrumbsView.vue"
export default {
components: { LoaderView, breadcrumbsView },

data: () => ({
  valid: true,
  data : {},
  item: [
      {
          text: 'รายการผู้ร้องเรียน',
          disabled: false,
          href: '/backoffice/register',
      },
      {
          text: 'ข้อมูลผู้ร้อง',
          disabled: true,
          href: '/backoffice/register/form',
      },
      
  ],
}),
mounted(){
  this.getRegister()

},

  
methods: {
  async getRegister () {
      try {
          let path        = await `/api/backoffice/get/registerDetail`
          let response    = await axios.get(`${path}/`+ this.$route.params.id )
          this.data       = await response.data.data[0]
             
          this.loadTable = await false;
          await setTimeout(() => (this.$refs.loader.overlay = false), 300);
      } catch (error) {
          console.log('error :' + error)
      }
  },
  // async editProfile(){
  //   if(this.$refs.form.validate()){
  //       const user = await this.$refs.user
  //       try {
  //         let fd = await {
  //             "id"                    : user.item.id,
  //             "email"                 : user.item.email,
  //             "name"                  : user.item.name,
  //             "lastname"              : user.item.lastname,
  //             "gender"                : user.item.gender,
  //             "age"                   : user.item.age,
  //             "phone"                 : user.item.phone,
  //             "phone_other"           : user.item.phone_other,
  //             "address"               : user.item.address,      
  //             "province_id"           : user.province !== null ? user.province.id || user.province : null,
  //             "district_id"           : user.district !== null ? user.district.id || user.district : null,
  //             "subdistrict_id"        : user.subdistrict !== null ? user.subdistrict.id || user.subdistrict : null,
  //             "postcode"              : user.item.postcode,
  //         }
  //             let path = await `/api/user/edit/profile`
  //             let response = await axios.post(`${path}`, fd)
  //             console.log(response);

  //             await Swal.fire({
  //               icon: 'success',
  //               title: 'บันทึกสำเร็จ',
  //               text: 'ระบบได้ทำการบันทึกข้อมูลของคุณแล้ว'
  //             }).then(async function(){
  //                 //  await store.dispatch("setName", fd)
  //             });
  //       } catch (error) {
  //         Swal.fire({
  //           icon: 'error',
  //           title: 'บันทึกไม่สำเร็จ',
  //           text: 'มีข้อผิดพลาดที่ไม่คาดคิดเกิดขึ้น โปรดลองใหม่อีกครั้ง'
  //         })
  //         console.log('edit_profile', error );
  //       }

  //   } 
  // } 

}

}
</script>

<style>

</style>