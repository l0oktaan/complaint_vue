<template>
  <div class="receive-detail">
      <!-- <loaderView ref="loader"/> -->
      <BreadcrumbsView :items="item"/>
      <v-card>
        <DetailComplain ref="data"/>
      </v-card>
      <v-btn class="btn-submit mt-3" @click="dialog = true">รับเรื่อง</v-btn>
      
      <v-dialog
          v-model="dialog"
          persistent
          max-width="500"
        >
          <v-card>
            <v-card-title class="text-h5">
            </v-card-title>
            <v-card-text>
              <v-subheader>รายละเอียดปัญหา/สาเหตุ</v-subheader>
              <v-textarea
                outlined
                name="input-7-4"
                hide-details="auto"
                v-model="complain_detail"
                :rules="complainDetailRules"
              ></v-textarea>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                class="btn-submit"
                text
                @click="saveComplainStep"
              >
                บันทึก
              </v-btn>
              <v-btn
                class="btn-cancel"
                text
                @click="close"
              >
                ยกเลิก
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- โชว์รูป -->
      <!-- <v-overlay class="style-bg" :opacity="opacity" :absolute="absolute"  :value="overlayImg">
        <img :src="url" />
        <v-btn
            class="btn-overlay"
            icon
            @click="overlayImg = false"
        >
        <v-icon  dark>
            fa-xmark
        </v-icon>
        </v-btn>
      </v-overlay> -->
      

  </div>
</template>
<script>
import axios from "axios";
// import moment from 'moment';
import Swal from 'sweetalert2';
import store from '../../../store/index.js';
// import loaderView from '@/components/loaderView.vue';
import BreadcrumbsView from '@/components/breadcrumbsView.vue';
import DetailComplain from '@/components/detailComplain.vue';

  export default {
  components: {  BreadcrumbsView, DetailComplain},
    data () {
      return {
        tab: null,
        data: {},
        user: {},
        files: {},
        complain_detail: '',
        dialog: false,
        check_roles: store.getters.user,
        url: '',
        overlayImg: false,
        opacity: 1,
        absolute: false,
        item: [
          {
            text: 'รับปัญหา',
            disabled: false,
            href: '/backoffice/receive',
          },
          {
            text: 'รายละเอียดปัญหา',
            disabled: true,
            href: 'breadcrumbs_link_1',
          },
        ],
        complainDetailRules: [
            v => (v.length <= 512) || 'กรอกรายละเอียดห้ามเกิน 512 ตัวอักษร',
        ],
      }
    },
    // mounted() {
    //     this.getComplainDetail()
      
        
    // },
    methods: {
      close(){
        this.dialog = false
        this.complain_detail = ''
      },
      // async getComplainDetail(){
      //     let path              = await `/api/user/get/complainDetail`
      //     let response          =  await axios.get(`${path}/`+ this.$route.params.id)
      //     this.data             = await response.data.data[0]
      //     this.data.create_date = await moment(response.data.data[0].create_date).add(543, 'year').format("DD/MM/YYYY HH:mm:ss")
      //     this.data.start_date  = await moment(response.data.data[0].start_date).add(543, 'year').format("DD/MM/YYYY")
      //     this.data.end_date  = await moment(response.data.data[0].end_date).add(543, 'year').format("DD/MM/YYYY")
      //     this.data.start_time  = await moment(response.data.data[0].start_date, "HH:mm").format("hh:mm") !== 'Invalid date' ? moment(response.data.data[0].start_date, "HH:mm").format("hh:mm") : ''; 
      //     this.data.end_time    = await moment(response.data.data[0].end_time, "HH:mm").format("hh:mm") !== 'Invalid date' ? moment(response.data.data[0].end_time, "HH:mm").format("hh:mm") : ''; 
      //     this.files            = await response.data.data_files

      //     await this.getRegisterDetail()
      //     await setTimeout(() => (this.$refs.loader.overlay = false), 300);
      //   },

      //   async urlPdfFiles(url,file_name){
      //     axios({
      //         url: `/api/get/pdf/${url}`,
      //         params: {"filename":file_name},
      //         method: 'GET',
      //         responseType: 'blob',
      //     }).then((response) => {
      //           var fileURL = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      //           var fileLink = document.createElement('a');

      //           fileLink.href = fileURL;
      //           fileLink.setAttribute('download', file_name);
      //           document.body.appendChild(fileLink);

      //           window.open(fileLink, "_blank");

      //         //  fileLink.click();
      //     });
      //   },
      //   async urlFiles(url,file_name){

        
      //     let path = await `/api/get/${url}?filename=${file_name}`
          
      //     let res = await axios.get(`${path}`)

      //     this.url = await res.data

      //     this.overlayImg = await !this.overlayImg 
      //   },

        // async urlFiles(url,file_name, file_type){

        //   let path = null

        //   if(file_type != 'application/pdf'){
        //     path = await `/api/get/${url}?filename=${file_name}`
        //   }else{
        //     console.log('=======');
        //     path = await `/api/get/pdf/${url}?filename=${file_name}`
        //   }

        //   let res = await axios.get(`${path}`)

        //   this.url = await res.data
        //   console.log(this.url);

        //   if(file_type == 'application/pdf'){

        //     var fileURL = await window.URL.createObjectURL(new Blob([this.url], { type: 'application/pdf' }));
        //     var fileLink = await document.createElement('a');
            
        //     fileLink.href = await fileURL;

        //     let filename = await file_name;

        //     await fileLink.setAttribute('download', filename);

        //     await document.body.appendChild(fileLink);
            
        //     await window.open(fileLink, "_blank");

        //   }else{
        //     this.overlayImg = await !this.overlayImg 
        //   }
        // },
        // async getRegisterDetail(){
        //   let path              = await `/api/get/registerDetail`
        //   let response          = await axios.get(`${path}/` + this.data.register_id)
        //   this.user             = await response.data.data[0]
        //   this.user.name       =   await response.data.data[0].name + ' ' + response.data.data[0].lastname 
        // },
        async saveComplainStep(){
          try {

            let fd = await {
              "complain_id"       : this.$refs.data.data.id,
              "admin_id"          : this.check_roles.id,
              "register_id"       : this.$refs.data.data.register_id,
              "detail"            : this.complain_detail,
              "status_call"       : 1,
              "create_by"         : this.check_roles.id,
              "modified_by"       : this.check_roles.id,
            }

              let path        = await `/api/backoffice/create/complainStep`
              let response    = await axios.post(`${path}`, fd)

              await Swal.fire({
                  icon: 'success',
                  title: 'บันทึกสำเร็จ',
                  text: 'ระบบได้ทำการบันทึกข้อมูลของคุณแล้ว'
              }).then( function(){
              });
  
              console.log(response);

              await this.$router.push({name:"backoffice-follow"});

              //  this.dialog = await false


          } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'บันทึกไม่สำเร็จ',
                text: 'มีข้อผิดพลาดที่ไม่คาดคิดเกิดขึ้น โปรดลองใหม่อีกครั้ง'
            })
              console.log(error);
          } 
        }
    }
  }
</script>

<style>
  .input-gray ::v-deep .v-input__slot{
      background: #ebe9e9!important;
  }
  .input-gray ::v-deep input{
      color: gray!important;
  }
  .style-tabs .v-tabs-slider-wrapper{
    color: rgb(255, 204, 102);
    height: 4px!important;
  }
  
  .v-overlay.style-bg{
    z-index: 300!important;
  }
  .v-overlay.style-bg img{
    width: 500px;
    height: 500px;
    object-fit: contain;
  }
</style>