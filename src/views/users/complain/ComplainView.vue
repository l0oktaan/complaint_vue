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
          this.isActive =  await true
          this.employee   = await this.$refs.employee
          let end_date    = await `${moment(this.employee.end_date).format('YYYY-MM-DD')}`
          let end_time    = await this.employee.complain_end_time !== null ? `${this.employee.complain_end_time}` : '00:00:00' 
          let start_time  = await this.employee.complain_start_time !== null ? `${this.employee.complain_start_time}` : '00:00:00'  
          let fd          = await {
            "complain_type"    : this.check_roles.roles.includes('cgd') ? 'cgd' : 'user',
            "name"              : this.employee.name,
            "lastname"          : this.employee.lastname,
            "register_id"       : this.check_roles.id,
            "division"          : this.employee.division,
            "description_face"  : this.employee.description_face,
            "topic"             : this.employee.complain_topic,
            "location"          : this.employee.complain_location,
            "start_date"        : `${moment(this.employee.start_date).format('YYYY-MM-DD') + ' ' + start_time}`,
            "end_date"          : `${end_date + ' ' + end_time}`,
            "detail"            : this.employee.complain_detail,
            "create_by"         : this.check_roles.id,
            "modified_by"       : this.check_roles.id,
          }
          let path        = await `/api/user/complain`
          let response    = await axios.post(`${path}`, fd)

          if(response){
        
            const formData = await new FormData();        
            await formData.append('id', response.data.complain_id);

            await formData.append('types', 'Complain');
         
            for (let i = 0; i < this.employee.files.length; i++) {

            
              await formData.append('files', this.employee.files[i]);

              const complain_id = await response.data.complain_id

              const number = await i + 1 
   
              const file = await this.employee.files[i]
              
              const arr_file = await file.type.split("/")

              let file_name = await ''


              if(file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'){

                file_name = await 'imgComplain' + complain_id + '_' + number + '.' + arr_file[1] 

              }else if(file.type === 'application/pdf'){

                file_name = await 'pdfComplain' + complain_id + '_' + number + '.' + arr_file[1] 
              }

              let fd_upload = await {
                "complain_type" : this.check_roles.roles.includes('cgd') ? 'cgd' : 'user',
                "register_id"   : this.check_roles.id,
                "complain_id"   : complain_id,
                "file_original" : file.name,
                "file_name"     : file_name,
                "file_type"     : file.type
              }

              let path = await `/api/user/files`

              await axios.post(`${path}`, fd_upload )
            }

            await this.myUpload(formData)

          } 
          await Swal.fire({
              icon: 'success',
              title: 'บันทึกสำเร็จ',
              text: 'ระบบได้ทำการบันทึกข้อมูลของคุณแล้ว'
          }).then( function(){
          });
          this.isActive =  await false
          if (this.$route.path.includes("cgd")){
              await this.$router.push({name:"cgd_follow"});

              // await this.$router.push({name:"receive"});
          }else{
              await this.$router.push({name:'complain-follow'})
          }
          
        } catch (error) {
          this.isActive =  await false
          console.log(error);
        }
      }
    },

    async myUpload(files){
      try {

        await axios.post('/api/uploadsFile', files)
        .then(response => {
            // Handle the response
            console.log(response.data);
        })
        .catch(error => {
            // Handle the error
            console.error(error);
        });

      } catch (error) {

          console.log(error);
      }
    }
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