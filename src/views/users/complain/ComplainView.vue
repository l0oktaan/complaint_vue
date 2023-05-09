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

          let end_date =  `${moment(this.employee.end_date).format('YYYY-MM-DD')}`
          let end_time = this.employee.complain_end_time !== null ? `${this.employee.complain_end_time}` : '00:00:00' 
          let start_time = this.employee.complain_start_time !== null ? `${this.employee.complain_start_time}` : '00:00:00'  
          let fd = await {
            "name"              : this.employee.name,
            "lastname"          : this.employee.lastname,
            "register_id"       : this.check_roles.id,
            "division"          : this.employee.division,
            "description_face"  : this.employee.description_face,
            "topic"             : this.employee.complain_topic,
            "location"          : this.employee.complain_location,
            // "start_date"        : `${moment(this.employee.start_date).format('YYYY-MM-DD')}`,
            // "end_date"          : `${moment(this.employee.end_date).format('YYYY-MM-DD')}`,
            "start_date"        : `${moment(this.employee.start_date).format('YYYY-MM-DD') + ' ' + start_time}`,
            "end_date"          : `${end_date + ' ' + end_time}`,
            "detail"            : this.employee.complain_detail,
            "create_by"         : this.check_roles.id,
            "modified_by"       : this.check_roles.id,
          }

          let path = await `/api/user/complain`
          let response = await axios.post(`${path}`, fd)

       
          if(response){

            let timerInterval
              await Swal.fire({
                title: 'กำลังอัพโหลดไฟล์',
                html: 'I will success in <b></b> milliseconds.',
                timer: 5000,
                timerProgressBar: true,
                didOpen: () => {
                  Swal.showLoading()
                  const b = Swal.getHtmlContainer().querySelector('b')
                  timerInterval = setInterval(() => {
                    b.textContent = Swal.getTimerLeft()
                  }, 100)
                    for (let i = 0; i < this.employee.files.length; i++) {

                      let number = i + 1 


                      this.insertFile(this.check_roles.id, response.data.complain_id, this.employee.files[i], number)

                    }

                },
                willClose: () => {
                  clearInterval(timerInterval)
                
  
                }
              })

           
          }
        
          await Swal.fire({
              icon: 'success',
              title: 'บันทึกสำเร็จ',
              text: 'ระบบได้ทำการบันทึกข้อมูลของคุณแล้ว'
          }).then( function(){
          });
          this.isActive =  await true
          await this.$router.push({name:'complain-follow'})
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
              "file_name"     : file_name,
              "file_type"     : file.type
          }

              let path = await `/api/user/files`

              let response = await axios.post(`${path}`, fd_upload )

              if(response){
                // let timerInterval
                // await Swal.fire({
                //   title: 'กำลังอัพโหลดไฟล์',
                //   html: 'I will success in <b></b> milliseconds.',
                //   timer: 2000,
                //   timerProgressBar: true,
                //   didOpen: () => {
                //     Swal.showLoading()
                //     const b = Swal.getHtmlContainer().querySelector('b')
                //     timerInterval = setInterval(() => {
                //       b.textContent = Swal.getTimerLeft()
                //     }, 100)
                //   },
                //   willClose: () => {
                //     clearInterval(timerInterval)
                //     this.myUpload(file_name,  file)
                //   }
                // })

                await this.myUpload(file_name,  file)

                  // setTimeout(() => {this.myUpload(file_name,  file)}, 2000);
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