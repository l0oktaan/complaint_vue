<template>
  <div class="complain-view">  
    <div class="style-page">
      <h2 class="mb-3">ข้อมูลการร้องเรียน</h2>
      <v-form
        ref="formComplain"
        v-model="valid"
        lazy-validation
      >
        <stepTree ref="employee"/>
        <v-btn class="btn-submit mt-3" :disabled="isActive" @click="insertComplain">บันทึก</v-btn>
      </v-form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import Swal from 'sweetalert2';
import store from '../../../store/index.js';
import stepTree from '@/components/step/stepTree.vue';
export default {
  components: { stepTree },
  data: () => ({
    valid: true,
    employee: {},
    check_roles: store.getters.user,
    isActive: false,
  }),
  methods: {
    async insertComplain(){
      if(this.$refs.formComplain.validate()){
        try {
          this.employee = await this.$refs.employee
          console.log(this.employee);
          let fd = await {
            "name"              : this.employee.name,
            "lastname"          : this.employee.lastname,
            "register_id"       : this.check_roles.id,
            "division"          : this.employee.division,
            "description_face"  : this.employee.description_face,
            "topic"             : this.employee.complain_topic,
            "location"          : this.employee.complain_location,
            "start_date"        : `${moment(this.employee.start_date).format('YYYY-MM-DD')}`,
            "end_date"          : `${moment(this.employee.end_date).format('YYYY-MM-DD')}`,
            "detail"            : this.employee.complain_detail,
            "create_by"         : this.check_roles.id,
            "modified_by"       : this.check_roles.id,
          }

          let path = await `/api/user/complain`
          let response = await axios.post(`${path}`, fd)

       
          if(response){

            for (let i = 0; i < this.employee.files.length; i++) {

            let number = await i + 1

            await this.insertFile(this.check_roles.id, response.data.complain_id, this.employee.files[i], number)
            }
          }
          await Swal.fire({
              icon: 'success',
              title: 'บันทึกสำเร็จ',
              text: 'ระบบได้ทำการบันทึกข้อมูลของคุณแล้ว'
          }).then( function(){
          });
          this.isActive =  await true
        } catch (error) {
          console.log(error);
        }
      }
    },

    async insertFile(register_id, complain_id, file, id){
      try {

        console.log(file);

          const arr_file = await file.name.split(".")

          let file_name = await ''
          
          if(file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'){

            file_name = await 'imgcid' + complain_id + '_' + id + '.' +arr_file[1] 

          }else if(file.type === 'application/pdf'){

            file_name = await 'pdfcid' + complain_id + '_' + id + '.' +arr_file[1] 
          }

          let fd_upload = await {
              "register_id"   : register_id,
              "complain_id"   : complain_id,
              "file_original" : file.name,
              "file_name"     : file_name
          }

              let path = await `/api/user/files`

              let response = await axios.post(`${path}`, fd_upload )

              if(response){
                  setTimeout(() => {this.myUpload(file_name,  file)}, 2000);
              }

      } catch (error) {
          console.log(error);
      }
    },
    async myUpload(file_name, files){

      try {

          let fd_upload =  await new FormData();
          await fd_upload.append('image_name', file_name);
          await fd_upload.append('images', files);


          let res2  = await axios.post(`/api/user/uploadFiles`, fd_upload)
          
          console.log(res2);

      } catch (error) {

          console.log(error);
      }
    },
  }

}
</script>

<style scoped>
  .btn-submit{
    border: 1px solid #003366;
    background-color: #003366!important;
    color: white;
}
</style>