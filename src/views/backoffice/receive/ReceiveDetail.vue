<template>
  <div class="receive-detail">
      <loaderView ref="loader"/>
      <BreadcrumbsView :items="item"/>
      <v-card>

          <v-tabs
              v-model="tab"
              background-color="#003366"
              class="style-tabs"
              centered
              dark
              icons-and-text
              >
              <v-tabs-slider></v-tabs-slider>

              <v-tab href="#tab-1">
                  รายละเอียดปัญหา
                  <i class="fa-solid fa-comment"></i>
              </v-tab>

              <v-tab href="#tab-2">
                  รายละเอียดผู้เเจ้งปัญหา
                  <i class="fa-solid fa-user"></i>
              </v-tab>

          </v-tabs>
    
        <v-tabs-items v-model="tab">
          <v-tab-item :value="'tab-1'">   
            <v-card flat>
              <v-card-text>
                  <v-container fluid>
                
                      <v-row>
                        <v-col cols="3">
                          <v-subheader>Call No.</v-subheader>
                        </v-col>
                        <v-col cols="9">
                          
                          <v-text-field
                            v-model="data.call_no"
                            solo
                            readonly
                            hide-details="auto"
                            class="input-gray"
                          ></v-text-field>
                        </v-col>
                      <v-col cols="3">
                          <v-subheader>วันที่บันทึกปัญหา</v-subheader>
                      </v-col>
                      <v-col cols="3">
                          <v-text-field
                          v-model="data.create_date"
                          solo
                          readonly
                          hide-details="auto"
                          class="input-gray"
                          ></v-text-field>
                      </v-col>
                      <v-col cols="3">
                          <v-subheader>วันที่พบปัญหา</v-subheader>
                      </v-col>
                      <v-col cols="3">
                          <v-text-field
                          v-model="data.start_date"
                          solo
                          readonly
                          hide-details="auto"
                          class="input-gray"
                          ></v-text-field>
                      </v-col>
                      </v-row>

                      <v-row>
                      <v-col cols="3">
                          <v-subheader>หัวเรื่อง</v-subheader>
                      </v-col>
                      <v-col cols="9">
                          <v-text-field
                          v-model="data.topic"
                          solo
                          readonly
                          hide-details="auto"
                          class="input-gray"
                          ></v-text-field>
                      </v-col>
                      </v-row>

                      <v-row>
                      <v-col cols="3">
                          <v-subheader>สถานที่เกิดเหตุ</v-subheader>
                      </v-col>
                      <v-col cols="9">
                          <v-text-field
                          v-model="data.location"
                          solo
                          readonly
                          hide-details="auto"
                          class="input-gray"
                          ></v-text-field>
                      </v-col>
                      </v-row>

                      <v-row>
                      <v-col cols="3">
                          <v-subheader>รายละเอียดเรื่องร้องเรียน</v-subheader>
                      </v-col>
                      <v-col cols="9">
                        <v-textarea
                          solo
                          name="input-7-4"
                          label=""
                          v-model="data.description_face"
                          readonly
                          hide-details="auto"
                          class="input-gray"
                        ></v-textarea>
                      </v-col>
                      </v-row>
                      <v-row>
                      <v-col cols="3">
                          <v-subheader>เอกสารประกอบการร้องเรียน</v-subheader>
                      </v-col>
                      <v-col cols="9">
                          <v-list subheader>
                          <div class="d-flex justify-space-between">
                              <v-subheader>ชื่อไฟล์</v-subheader>
                              <v-subheader>ไฟล์เเนบ</v-subheader>
                          </div>
                          

                          <v-list-item
                              v-for="file in files"
                              :key="file.id"
                          >

                              <v-list-item-content class="text-left">
                              <v-list-item-title>{{ file.file_name }}</v-list-item-title>
                              </v-list-item-content>
                              <div class="btn-files" @click="urlFiles('UrlFilesComplain',file.file_name, file.file_type)"><i class="fa-solid fa-file"></i></div>
                          </v-list-item>
                          
                          </v-list>
                      </v-col>
                      </v-row>

                      <v-btn class="btn-submit" @click="dialog = true">รับเรื่อง</v-btn>
                      <!-- <v-btn class="btn-cancel">ยกเลิก</v-btn> -->


                      
                  </v-container>
              </v-card-text>
            </v-card>
          </v-tab-item>
          
          <v-tab-item :value="'tab-2'">
            <v-card flat>
              <v-card-text>
                <v-container fluid>
                      <v-row>
                      <v-col class="d-flex">
                          <v-subheader>*Email :</v-subheader>
                          <v-text-field
                            v-model="user.email"
                            solo
                            readonly
                            hide-details="auto"
                            class="input-gray"
                          ></v-text-field>
                      </v-col>
                      <!-- <v-col cols="3">
                          <v-text-field
                            v-model="user.email"
                            solo
                            readonly
                            hide-details="auto"
                            class="input-gray"
                          ></v-text-field>
                      </v-col> -->
                      </v-row>

                      <v-row>
                        <v-col cols class="d-flex">
                            <v-subheader>ชื่อผู้แจ้งปัญหา</v-subheader>
                            <v-text-field
                              v-model="user.name"
                              solo
                              readonly
                              hide-details="auto"
                              class="input-gray"
                            ></v-text-field>
                        </v-col>
                        <!-- <v-col cols="3" class="d-flex">
                          <v-subheader>เพศ</v-subheader>
                          <v-text-field
                            v-model="user.gender"
                            solo
                            readonly
                            hide-details="auto"
                            class="input-gray"
                            ></v-text-field>
                        </v-col> -->
                        <v-col cols="3" class="d-flex">
                              <v-subheader>อายุ</v-subheader>
                              <v-text-field
                                v-model="user.age"
                                solo
                                readonly
                                hide-details="auto"
                                class="input-gray"
                              ></v-text-field>
                          </v-col>
                      
                      <!-- <v-col cols="9">
                          <v-text-field
                          v-model="user.username"
                          solo
                          readonly
                          hide-details="auto"
                          class="input-gray"
                          ></v-text-field>
                      </v-col> -->
                      </v-row>

                      <!-- <v-row>
                        <v-col cols="3">
                            <v-subheader>เพศ</v-subheader>
                        </v-col>
                        <v-col cols="9">
                            <v-text-field
                            v-model="user.gender"
                            solo
                            readonly
                            hide-details="auto"
                            class="input-gray"
                            ></v-text-field>
                        </v-col>
                      </v-row> -->

                      <!-- <v-row>
                        <v-col cols="3">
                            <v-subheader>อายุ</v-subheader>
                        </v-col>
                        <v-col cols="9">
                            <v-text-field
                            v-model="user.age"
                            solo
                            readonly
                            hide-details="auto"
                            class="input-gray"
                            ></v-text-field>
                        </v-col>
                      </v-row> -->

                      <v-row>
                        <v-col cols="6" class="d-flex">
                            <v-subheader>*เบอร์โทรศัพท์มือถือ</v-subheader>
                            <v-text-field
                              v-model="user.phone"
                              solo
                              readonly
                              hide-details="auto"
                              class="input-gray"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="6" class="d-flex">
                          <v-subheader>เบอร์ติดต่ออื่น ๆ </v-subheader>
                          <v-text-field
                            v-model="user.phone_other"
                            solo
                            readonly
                            hide-details="auto"
                            class="input-gray"
                            ></v-text-field>
                        </v-col>
                      </v-row>
                      
                  </v-container>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>

          <v-dialog
            v-model="dialog"
            persistent
            max-width="500"
          >
          <v-card>
            <v-card-title class="text-h5">
              <!-- Use Google's location service? -->
            </v-card-title>
            <v-card-text>
              <v-subheader>รายละเอียดปัญหา/สาเหตุ</v-subheader>
              <v-textarea
                outlined
                name="input-7-4"
                hide-details="auto"
                v-model="complain_detail"
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
      </v-card>

        <!-- โชว์รูป -->
      <v-overlay class="style-bg" :opacity="opacity" :absolute="absolute"  :value="overlayImg">
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
      </v-overlay>
      

  </div>
</template>
<script>
import axios from "axios";
import moment from 'moment';
import Swal from 'sweetalert2';
import store from '../../../store/index.js';
import loaderView from '@/components/loaderView.vue';
import BreadcrumbsView from '@/components/breadcrumbsView.vue';

  export default {
  components: { loaderView, BreadcrumbsView},
    data () {
      return {
        tab: null,
        data: {},
        // data_register: {},
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
      }
    },
    mounted() {
        this.getComplainDetail()
      
        
    },
    methods: {
      close(){
        this.dialog = false
        this.complain_detail = ''
      },
      async getComplainDetail(){
          let path              = await `/api/user/get/complainDetail`
          let response          =  await axios.get(`${path}/`+ this.$route.params.id)
          this.data             = await response.data.data[0]
          this.data.create_date = await moment(response.data.data[0].create_date).add(543, 'year').format("DD/MM/YYYY HH:mm:ss")
          this.data.start_date  = await moment(response.data.data[0].start_date).add(543, 'year').format("DD/MM/YYYY")
          this.files            = await response.data.data_files

          await this.getRegisterDetail()
          await setTimeout(() => (this.$refs.loader.overlay = false), 300);
        },

        async urlFiles(url,file_name, file_type){

          let path = null

          if(file_type != 'application/pdf'){
            path = await `/api/get/${url}?filename=${file_name}`
          }else{
            console.log('=======');
            path = await `/api/get/pdf/${url}?filename=${file_name}`
          }

          let res = await axios.get(`${path}`)

          this.url = await res.data
          console.log(this.url);

          if(file_type == 'application/pdf'){

            var fileURL = await window.URL.createObjectURL(new Blob([this.url], { type: 'application/pdf' }));
            var fileLink = await document.createElement('a');
            
            fileLink.href = await fileURL;

            let filename = await file_name;

            await fileLink.setAttribute('download', filename);

            await document.body.appendChild(fileLink);
            
            await window.open(fileLink, "_blank");

          }else{
            this.overlayImg = await !this.overlayImg 
          }
        },
       
      //   async urlFiles(url,file_name, file_type){

      //   let path = await `/api/get/${url}?filename=${file_name}`
      //   let res = await axios.get(`${path}`)
      //   this.url = await res.data
      //   if(file_type == 'pdf'){
      //     console.log(file_type);
      //     // await this.displayPdf(this.url)
      //   }else{
      //     this.overlayImg = await !this.overlayImg 
      //   }
      // },
        async getRegisterDetail(){
          let path              = await `/api/get/registerDetail`
          let response          = await axios.get(`${path}/` + this.data.register_id)
          this.user             = await response.data.data[0]
          this.user.name       =   await response.data.data[0].name + ' ' + response.data.data[0].lastname 
        },
        async saveComplainStep(){
          try {

            let fd = await {
              "complain_id"       : this.data.id,
              "admin_id"          : this.check_roles.id,
              "register_id"       : this.data.register_id,
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