<template>

  <div class="announce-view">

    <breadcrumbsView :items="item"/>

    <!-- รายการช่องทางการประกาศ-->
    <v-data-table
      :headers="headers"
      :items="dataAnnounces"
      :loading="loading"
      loading-text="Loading... Please wait"
      :sort-by="[{ key: 'calories', order: 'asc' }]"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>ช่องทางการประกาศ</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <v-btn
              color="#213862"
              dark
              class="mb-2"
              @click="dialogCreate = true"
              >
              <i class="fa-solid fa-plus icon-style"></i>
              เพิ่มรายการใหม่
          </v-btn>
        </v-toolbar>
      </template>

      <template v-slot:[`item.create_date`]="{ item }">
        <div class="overflow-160" > 
          {{getThaiDate(item.create_date)}}
        </div>
      </template>

      <template v-slot:[`item.announce_name`]="{ item }">
        <div class="overflow-630" >{{ item.announce_name }}</div>
      </template>

      <template v-slot:[`item.start_date`]="{ item }">
        <div class="overflow-160" > 
          {{getThaiDate(item.start_date)}}
        </div>
      </template>

      <template v-slot:[`item.end_date`]="{ item }">
        <div class="overflow-160" > 
          {{getThaiDate(item.end_date)}}
        </div>
      </template>

      <template v-slot:[`item.status`]="{ item }">  
        <div class="overflow-160" > 
          <v-switch
          @click="toggleStatus(item)"
          v-model="item.status"
          :label="`${item.status == true ? 'ใช้งาน' : 'ไม่ใช้งาน'}`"
          ></v-switch>
        </div>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
          <v-btn  color="#003366" icon small @click="editAnnounce(item)">
            <i class="f-16 fa-solid fa-pen-to-square"></i>
          </v-btn>
          <v-btn  color="#003366" icon small @click="removeAnnounce(item)">
            <i class="fa-solid fa-trash"></i>
          </v-btn>
      </template>

    </v-data-table>

    <!-- form การเพิ่ม-แก้ไข ข้อมูล -->
    <v-dialog v-model="dialogCreate" max-width="700px" persistent>
      <v-card>

        <v-toolbar color="#167dc2" class="mb-4" dark>
          <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
        </v-toolbar>

        <v-card-text>

          <v-overlay v-if="loaderData"
              :loading="loaderData"
              class="align-center justify-center"
            >
            <v-progress-circular
              color="primary"
              indeterminate
              size="64"
            ></v-progress-circular>
          </v-overlay>

          
            <v-form ref="formAnnounce" v-model="valid" lazy-validation>
              <p class="style-label mt-2"><span>*</span>ชื่อเรื่องประกาศ</p>
              <v-text-field
                  v-model="dataDailogAnnounce.announce_name"
                  :rules="announceRules"
                  label="ชื่อเรื่องประกาศ"
                  dense
                  outlined
                  single-line
                  hide-details="auto"
                  thai_engLanguage
                  :maxlength="maxLengthTwoHundredFiftyFive"
                  @input="checkRulesLength(dataDailogAnnounce.announce_name.length, maxLengthTwoHundredFiftyFive)"
                
              ></v-text-field>
            
              <p class="style-label mt-2"><span>*</span>หัวข้อประกาศ</p>
              <v-text-field
                  v-model="dataDailogAnnounce.announce_title"
                  :rules="announceRules"
                  label="หัวข้อประกาศ"
                  dense
                  outlined
                  single-line
                  hide-details="auto"
                  thai_engLanguage
                  :maxlength="maxLengthTwoHundredFiftyFive"
                  @input="checkRulesLength(dataDailogAnnounce.announce_title.length, maxLengthTwoHundredFiftyFive)"
                
              ></v-text-field>
              <p class="style-label mt-2"><span>*</span>ประเภทประกาศ</p>
          
              <v-select
                v-model="dataDailogAnnounce.announce_type"
                :items="selectAnnounceTpye"
                :rules="[v => !!v || 'กรุณากรอกข้อมูล']"
                label="เลือกประเภทประกาศ"
                item-text="value"
                item-value="id"
                required
                dense
                outlined
                single-line
                hide-details="auto" 
              ></v-select>

              <p class="style-label mt-2"><span>*</span>ไฟล์เเนบ : (เเนบไฟล์ png, jpeg, gif, pdf) </p>
              <v-file-input 
                v-if="dataDailogAnnounce.file_original == null" 
                show-size 
                label="เลือกไฟล์" 
                outlined
                dense
                clearable 
                single-line
                v-model="dataDailogAnnounce.file"
                :accept="acceptTypes"
                :rules="fileRules"
              ></v-file-input>
              <div v-else class="text-left">
                <v-chip 
                  class="ma-2"
                  closable
                >
                  <v-icon v-if="dataDailogAnnounce.file_type == 'application/pdf'" @click="showFile(dataDailogAnnounce.file_type, dataDailogAnnounce.file_name, dataDailogAnnounce.file_original, 'UrlFilesAnnounce')">mdi-file</v-icon>
                  <v-icon v-else @click="showFile(dataDailogAnnounce.file_type, dataDailogAnnounce.file_name, 'UrlFilesAnnounce')">mdi-image</v-icon>
                  &nbsp;{{dataDailogAnnounce.file_original}}
              
                </v-chip>
                <v-btn  color="#003366" icon small @click="removeFile(dataDailogAnnounce)">
                  <i class="fa-solid fa-trash"></i>
                </v-btn>
              </div>

              <v-row>
                <v-col>
                  <p class="style-label mb-3"><span>*</span>วันที่เริ่มต้น</p> 
                  <v-menu
                      ref="start_date"
                      v-model="menu_start_date"
                      :close-on-content-click="false"
                      :return-value.sync="start_date"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"    
                  >
                      <template v-slot:activator="{ on, attrs }">
                          <v-text-field                                                        
                              v-model="dataDailogAnnounce.start_date"
                              label="ตั้งเเต่วันที่"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                              dense
                              outlined
                              clearable
                              prepend-icon="mdi-calendar"
                              @click:clear="start_date=null"
                          ></v-text-field>
                      </template>

                      <v-date-picker
                          v-model="start_date"
                          no-title
                          scrollable
                          locale="th-TH"
                          >
                          <v-spacer></v-spacer>
                          <v-btn
                              text
                              color="primary"
                              @click="menu_start_date = false"
                          >
                              ยกเลิก
                          </v-btn>
                          <v-btn
                              text
                              color="primary"
                              @click="$refs.start_date.save(start_date)"
                          >
                              ตกลง
                          </v-btn>
                      </v-date-picker>

                  </v-menu>
                </v-col>

                <v-col>
                  <p class="style-label mb-3"><span>*</span>วันที่สิ้นสุด </p>
                  <v-menu
                      ref="end_date"
                      v-model="menu_end_date"
                      :close-on-content-click="false"
                      :return-value.sync="end_date"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"    
                  >
                      <template v-slot:activator="{ on, attrs }">
                          <v-text-field                                                        
                              v-model="dataDailogAnnounce.end_date"
                              label="ตั้งเเต่วันที่"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                              dense
                              outlined
                              clearable
                              prepend-icon="mdi-calendar"
                              @click:clear="end_date=null"
                          ></v-text-field>
                      </template>

                      <v-date-picker
                          v-model="end_date"
                          :min="start_date"
                          no-title
                          scrollable
                          locale="th-TH"
                          >
                          <v-spacer></v-spacer>
                          <v-btn
                              text
                              color="primary"
                              @click="menu_end_date = false"
                          >
                              ยกเลิก
                          </v-btn>
                          <v-btn
                              text
                              color="primary"
                              @click="$refs.end_date.save(end_date)"
                          >
                              ตกลง
                          </v-btn>
                      </v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>

              <v-tiptap v-model="dataDailogAnnounce.announce_content" :extensions="extensions"/>
          
            </v-form>
            <v-card-actions  class="px-0 py-0 mt-4">
              <v-spacer></v-spacer>
              <v-btn
                class="btn btn-submit"
                variant="text"
                @click="saveAnnounce"
              >
                บันทึก
              </v-btn>
              <v-btn
                class="btn btn-cancel"
                variant="text"
                @click="closeDailogCreate"
              >
                ยกเลิก
              </v-btn>
            </v-card-actions>

        </v-card-text> 
      </v-card>
    </v-dialog>

     <!-- โชว์รูป  -->
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
  import breadcrumbsView from '@/components/breadcrumbsView.vue';
  import store from '../../../store/index.js';
  import Swal from 'sweetalert2';
  import moment from 'moment';
  import axios from "axios";

  export default {
    components: { breadcrumbsView},

    data: () => ({
      check_roles: store.getters.user,
      loading : true,
      loaderData : false,
      date : moment().format('YYYY-MM-DD HH:mm:ss'),
      value: '',
      extensions: [],
      item: [
        {
          text: 'ตั้งค่า',
          disabled: false,
          href: '/backoffice/manage',
        },
        {
          text: 'ช่องทางการประกาศ',
          disabled: true,
          href: 'breadcrumbs_link_1',
        },  
      ],
      headers: [
        { text: 'วันที่จัดทำ', value: 'create_date', align: 'center'},
        { text: 'ช่องทางการประกาศ', value: 'announce_name' },
        { text: 'วันที่เริ่มต้น', value: 'start_date' },
        { text: 'วันที่สิ้นสุด', value: 'end_date' },
        { text: 'สถานะการใช้งาน', value: 'status' },
        { text: '', value: 'actions', align: 'center', sortable: false },
      ],
      valid: true,
      url: '',
      opacity: 1,
      absolute: false,
      overlayImg: false,
      dataAnnounces:[],
      dataDate: {},
      dataDailogAnnounce: {},
      dataFiles: [],
    
      checkRemoveFile : false,
      titleAnnounce: -1,
      dialogCreate: false,
      announceId: null,
      announceFileName: '',
      announceFileType: '',
      announceFileOrifinal: '',

      menu_start_date: false,
      menu_end_date: false,
      start_date: new Date().toISOString().substr(0, 10),
      end_date: new Date().toISOString().substr(0, 10),
      maxLengthTwoHundredFiftyFive: 255,

      status: true,
      checkRemove: false,
      acceptTypes: "image/*, application/pdf",
      announceRules: [
        v => !!v || 'กรุณากรอกข้อมูล',
        // v => (v && v.length <= 200) || 'กรอกรายละเอียดห้ามเกิน 200 ตัวอักษร',
      ],
      fileRules: [
        value => {
          if (!value || value.length === 0) {
              return "กรุณาอัพโหลดไฟล์";
          }

          const maxFileSize = 10 * 1024 * 1024; // 2MB in bytes
          for (let i = 0; i < value.length; i++) {
              if (value[i].size > maxFileSize) {
                  return 'อัพโหลดไฟล์ขนาดไม่เกิน 10 mb';
              }else{
                  return true;
              }
          }
            
          const allowedTypes = ["image/png", "image/jpeg", "image/gif", "application/pdf"];
          if (!allowedTypes.includes(value.type)) {
              return "ประเภทไฟล์ที่อัพโหลดไม่ถูกต้อง";
              }
          return true;
        }
      ],
      selectAnnounceTpye: [
        { value: 'ประชาสัมพันธ์', id: "ประชาสัมพันธ์" },
        { value: 'ประกาศและระเบียบที่เกี่ยวข้อง', id: "ประกาศและระเบียบที่เกี่ยวข้อง" }
      ],


    }),

    mounted(){
      this.getAnnounce()
      this.getEndThaiDate()
    },
    
    watch: {
      start_date(v){
        console.log(v);
        this.end_date = v
        this.getEndThaiDate()
      },
      end_date(){
        this.getEndThaiDate()  
      },
    },

    computed: {
      formTitle () {
        return this.titleAnnounce === -1 ? 'สร้างรายการ' : 'แก้ไขรายการ'
      }
    },

    methods:{
      checkRulesLength(valueLength, maxLength){
        if(valueLength === maxLength){
            Swal.fire(`กรอกได้ไม่เกิน ${maxLength} ตัวอักษร`)
        }
      },

      getThaiDate(value){
        if (value){
          var d = new Date(value);
          return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
        }else{
          return "";
        }            
      },

      getEndThaiDate(){
        if (this.start_date || this.end_date){
            var d_start = new Date(this.start_date);
            var d_end = new Date(this.end_date);
            this.dataDailogAnnounce.start_date = d_start.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
            this.dataDailogAnnounce.end_date = d_end.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
        }
      },

      showFile(file_type, file_name, file_original, urlFiles){
        if(file_type == 'application/pdf'){
          this.urlPdfFiles(urlFiles, file_name, file_original)
        }else{
          this.urlFiles(urlFiles, file_name)
        }
      },

      fetchData() {
        this.loaderData = true; 
        setTimeout(() => {
          this.loaderData = false; // Hide the loader
        }, 1000);
      },

      closeDailogCreate () {
        this.titleAnnounce        = -1
        this.dataDailogAnnounce   = {}
        this.dialogCreate         = false
        this.checkRemoveFile      = false
        this.$refs.formAnnounce.resetValidation()
        this.dataDate = {
          "start_date" : null,
          "end_date" : null
        }

        this.dataFiles = []
        
      },
  
      async getAnnounce(){
        try {
          let path            = await `/api/backoffice/get/announce`
          let response        = await axios.get(`${path}`) 
          this.dataAnnounces  = await response.data.data
          this.loading        = await false
        } catch (error) {
          if (error.response.status === 401) {
            // Redirect to the login page
            this.$router.push('/backoffice/login'); // Replace with your login route
          } else {
            console.log('getAnnounce');
            // Handle other errors
          }
        }
  
        // await setTimeout(() => (this.$refs.loader.overlay = false), 300);
      },

      async saveAnnounce(){
        if(this.$refs.formAnnounce.validate()){
          try {

            let fd = await {};

            let path = await null;

            // สร้าง //

            if(this.titleAnnounce === -1){
  
              fd = await {
                "announce_name"           : this.dataDailogAnnounce.announce_name,
                "announce_title"          : this.dataDailogAnnounce.announce_title,
                "announce_content"        : this.dataDailogAnnounce.announce_content,
                "announce_type"           : this.dataDailogAnnounce.announce_type,
                "number_preview"          : 0,
                "file_original"           : this.dataDailogAnnounce.file.name,
                "file_type"               : this.dataDailogAnnounce.file.type,
                "start_date"              :  this.start_date,
                "end_date"                : this.end_date,
                "check_remove"            : false,
                "status"                  : this.status,
                "create_by"               : this.check_roles.id,
              }
            
              path = await `/api/backoffice/create/announce`

            }else{

              // แก้ไข //

              fd = await {
                "announce_id"             : this.announceId,
                "announce_name"           : this.dataDailogAnnounce.announce_name,
                "announce_title"          : this.dataDailogAnnounce.announce_title,
                "announce_content"        : this.dataDailogAnnounce.announce_content,
                "announce_type"           : this.dataDailogAnnounce.announce_type,
                "file_original"           : this.dataDailogAnnounce.file !== undefined ? this.dataDailogAnnounce.file.name : this.dataDailogAnnounce.file_original,
                "file_name"               : this.dataDailogAnnounce.file !== undefined ? null : this.dataDailogAnnounce.file_name,
                "file_type"               : this.dataDailogAnnounce.file !== undefined ? this.dataDailogAnnounce.file.type : this.dataDailogAnnounce.file_type,
                "start_date"              : `${moment(this.start_date).format('YYYY-MM-DD')}`,
                "end_date"                : `${moment(this.end_date).format('YYYY-MM-DD')}`,
                "status"                  : this.status,
                "roles_id"                : this.check_roles.id,
                "check_remove"            : this.checkRemove,
              }

                path = await `/api/backoffice/edit/announce`
            }

              let response = await axios.post(`${path}`, fd)

            if(response){

              // อัพโหลดไฟล์ to server

                const formData = await new FormData(); 

                await formData.append('id', response.data.announce_id);

                await formData.append('types', 'Announce');

                await formData.append('files', this.dataDailogAnnounce.file);

                await formData.append('file_name', response.data.file_name);

                await axios.post('/api/uploadsFile', formData)

            }

            await Swal.fire({
              icon: 'success',
              title: 'บันทึกสำเร็จ',
              text: 'ระบบได้ทำการบันทึกข้อมูลของคุณแล้ว'
            }).then( function(){});


            await this.closeDailogCreate()
            await this.getAnnounce()


          } catch (error) {
            console.log('saveAnnounce' + error);
          }

        }
      },

      async editAnnounce(value){
        await this.fetchData();
        this.dialogCreate           = await true;
        this.titleAnnounce          = await 0;
        this.dataDailogAnnounce     = await JSON.parse(JSON.stringify(value));
        this.announceId             = await value.id;
        this.start_date             = await value.start_date;
        this.end_date               = await value.end_date;

      },
      
      async toggleStatus(v){
        Swal.fire({
        title: 'คำเตือน',
        text: "คุณต้องการเปลี่ยนสถานะรายการใช่หรือไม่ ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก',
        }).then(async (result) => {
          if (result.isConfirmed) {
              const payload = { 
                  id                 : v.id,
                  admin_id           : this.check_roles.id,
                  status             : v.status ? true : false
              }
              console.log(payload);
              let path      = `/api/backoffice/update/announcesStatus`
              let response = await axios.post(`${path}`, payload)
              console.log(response);

              if(payload){
                  Swal.fire({
                      icon: 'success',
                      text: 'บันทึกข้อมูลเรีบร้อยเเล้ว',
                  })


                  await this.getAnnounce()

              }else{
                  Swal.fire({
                      icon: 'error',
                      title: 'บันทึกไม่สำเร็จ',
                      text: 'มีข้อผิดพลาดที่ไม่คาดคิดเกิดขึ้น โปรดลองใหม่อีกครั้ง'
                  })
              }    
          } else if (result.dismiss === Swal.DismissReason.cancel) {
          v.status == true ? v.status = false : v.status = true
          }
        }) 
      },

      async removeAnnounce(v){
        try {
          await Swal.fire({
              title: 'คำเตือน',
              text: "คุณต้องการลบรายการช่องทางการประกาศใช่หรือไม่ ?",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'ใช่',
              cancelButtonText: 'ยกเลิก',
              }).then(async (result) => {
                  if (result.isConfirmed) {              
                      const payload = {
                          id : v.id,
                          admin_id : this.check_roles.id,
                          check_remove : true,
                      }
    
                      let path =  await `/api/backoffice/update/deleteAnnounce`
                      let response = await axios.post(`${path}`, payload)
                      
                      if(response){
                          await Swal.fire({
                              icon: 'success',
                              text: 'ลบข้อมูลสำเร็จ',
                          })
                        
                      } 
                      await this.getAnnounce()
                  }
              })
    
        } catch (error) {
          await Swal.fire({
            icon: 'error',
            title: 'บันทึกไม่สำเร็จ',
            text: 'มีข้อผิดพลาดที่ไม่คาดคิดเกิดขึ้น โปรดลองใหม่อีกครั้ง'
          })
          console.log('removeAnnounce',error);
        }
      },
    
      async removeFile(v){
        try {
          await Swal.fire({
            title: 'คำเตือน',
            text: "คุณต้องการลบเอกสารแนบใช่หรือไม่ ?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ใช่',
            cancelButtonText: 'ยกเลิก',
            }).then(async (result) => {
              if (result.isConfirmed) {              
                const payload = {
                  id : v.id,
                  file_original : null,
                  file_name : null,
                  file_type : null,
                  admin_id : this.check_roles.id,
                }

                let path =  await `/api/backoffice/update/deleteAnnounceFile`
                let response = await axios.post(`${path}`, payload)
                  
                if(response){
                    await Swal.fire({
                        icon: 'success',
                        text: 'ลบข้อมูลสำเร็จ',
                    })
                } 
                this.dataDailogAnnounce.file_original = await null,
                this.dataDailogAnnounce.file_name = await null,
                this.dataDailogAnnounce.file_type = await null
              }
          })
    
        } catch (error) {
          await Swal.fire({
            icon: 'error',
            title: 'บันทึกไม่สำเร็จ',
            text: 'มีข้อผิดพลาดที่ไม่คาดคิดเกิดขึ้น โปรดลองใหม่อีกครั้ง'
          })
          console.log('removeContactChannels',error);
        }

      },

      async urlPdfFiles(url,file_name,file_original){
        axios({
            url: `/api/get/pdf/${url}`,
            params: {"filename":file_name},
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
              var fileURL = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
              var fileLink = document.createElement('a');
              fileLink.href = fileURL;
              fileLink.setAttribute('download', file_original);
              document.body.appendChild(fileLink);
              window.open(fileLink, "_blank");

        });
      },

      async urlFiles(url,file_name){
        let path = await `/api/get/${url}?filename=${file_name}`
        
        let res = await axios.get(`${path}`)

        this.url = await res.data

        this.overlayImg = await !this.overlayImg 

      },
    }
  }
</script>

<style></style>