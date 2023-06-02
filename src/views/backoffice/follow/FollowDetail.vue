<template>
  <div class="complain-detail"> 
    <loaderView ref="loader"/>
    <BreadcrumbsView :items="item"/>

    <v-card class="mb-3">
      <DetailComplain ref="data"/>
    </v-card>

    <v-expansion-panels v-model="panel" multiple>
      <v-expansion-panel>
        <v-expansion-panel-header>
          ขั้นตอนการเเก้ปัญหา
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-data-table
            :headers="headers"
            :items="desserts"
            class="elevation-1"
          >
            <template v-slot:[`item.name`]="{ item }">
              {{ item.name + ' ' +item.lastname }}
            </template>
            <template v-slot:[`item.date`]="{ item }">
              {{ formattedDate(item.cdate) == 'Invalid date' ? '' : formattedDate(item.date) }}
            </template>

            <template v-slot:[`item.files_step`]="{ item }">
              <div  v-if="item.status_call != 0 && item.status_call != 1">
                <v-btn
                  color="primary"
                  dark
                  icon
                  @click="dailogfiles('complain_step', item)"
                >
                <i class="fa-solid fa-file"></i>
              </v-btn>
                <!-- <v-btn
                  color="primary"
                  dark
                  icon
                  @click="dailogfiles('complain_step', item)"
                >
                <i class="fa-solid fa-file"></i>
              </v-btn> -->
              </div>
             
            </template>

            <template v-slot:[`item.files_corrupt`]="{ item }">
              <div  v-if="item.status_call == 2">
                <v-btn
                  color="primary"
                  dark
                  icon
                  @click="dailogfiles('corrupt',item)"
                >
                <i class="fa-solid fa-file"></i>
              </v-btn>
              </div>
             
            </template>

            <template v-slot:[`item.status_call`]="{ item }">
              <v-chip
              :color="getColor(item.status_call)"
              dark
              >
              {{ getstatus(item.status_call) }}
              </v-chip>
            </template>
            <template   v-slot:[`item.edit`]="{ item }"  >
             <div v-if="item.status_call != 0 && item.status_call != 1">
              <v-btn
                color="primary"
                dark
                icon
                @click="dailogStatusEdit(item)"
              >
                <i class="fa-solid fa-pen-to-square"></i>
              </v-btn>
             </div>
             
            </template>
          </v-data-table>

        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-btn depressed color="primary" class="mt-3" @click="dialog_status = true">สถานะการดำเนินงานของเจ้าหน้าที่ </v-btn>
    
    </v-expansion-panels>

    <!-- สถานะการดำเนินงานของเจ้าหน้าที่ -->
    <v-dialog
      v-model="dialog_status"
      persistent
      max-width="900px"
    >
      <v-card>
        <v-toolbar color="#167dc2" dark>
          <v-toolbar-title>{{formTitle}}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container fluid>
              <v-form
                  ref="form"
                  v-model="valid"
                  lazy-validation
              >
                <v-row>
                  <v-col cols="3">
                    <v-subheader>รายละเอียดข้อมูล</v-subheader>
                  </v-col>
                  <v-col cols="9">
                    <v-textarea
                      outlined
                      hide-details="auto"
                      single-line
                      name="input-7-4"
                      v-model="status_detail"
                      :rules="detailRules"
                    ></v-textarea>
                  </v-col>
                </v-row>
  
                <v-row>
                  <v-col cols="3">
                    <v-subheader>ไฟล์เเนบ</v-subheader>
                  </v-col>
                  <v-col cols="9">
                    
                    <InputFiles  ref="status_files" :file="step_files"/>
                    
                  
                  </v-col>
                </v-row>
  
                <v-row>
                  <v-col cols="3">
                    <v-subheader>สถานะการดำเนินงาน</v-subheader>
                  </v-col>
                  <v-col cols="9">
                    <v-select
                      v-model="status_call"

                      :items="selectStatus"
                      item-text="value"
                      item-value="id"
                      label="สถานะการดำเนินงาน"
                      dense
                      outlined
                      single-line
                      hide-details="auto" 
                      @change="showDetailStatus(status_call)"
                    ></v-select>
                  </v-col>
                </v-row>
              
                <v-row v-if="show_detail_status">
                  <v-col cols="3">
                    <v-subheader>ประเภทการร้องเรียน</v-subheader>
                  </v-col>
                  <v-col cols="9">
                    <v-radio-group
                      v-model="check_corrupt"
                      row
                    >
                      <v-radio
                        label="ไม่ทุจริต"
                        :value=false
                        @click="check_corrupt = false"
                      ></v-radio>
                      <v-radio
                        label="ทุจริต"
                        :value=true
                        @click="check_corrupt = true"
                      ></v-radio>
                    </v-radio-group>
                  </v-col>
    
                </v-row>
                <v-card v-if="check_corrupt && show_detail_status" class="mx-auto">
                  {{ corrupt.date }}
                  <v-card-title class="head-corrupt">รายละเอียดการทุจริต</v-card-title>
                  <v-card-text class="pt-5">
                    <v-row>
                      <v-col>
                        <v-text-field
                          v-model="corrupt.reference"
                          :rules="corruptRefRules"
                          hide-details="auto"
                          label="เลขที่หนังสือ"
                          outlined
                          dense
                        ></v-text-field>
                      </v-col>
      
                      <v-col>

                        <DatePickers ref="corrupt_date" :show_date="corrupt.date"  label="วันที่ดำเนินการ"/>
                      </v-col>
                    </v-row> 
                    <v-row>
                      <v-col>
                        <InputFiles  ref="corrupt_file"/>
                        <!-- <div class="text-left">
                          <v-chip         
                          v-for="(corrupt_file,index) in corrupt_files" 
                          :key="index"
                          close @click:close="removeCorrupt(index)"
                          >
                            {{corrupt_file.file_original}}
                        </v-chip>
                        </div> -->
                      
                      </v-col>
                    </v-row>
                  
                    <v-row>
                      <v-col>
                        <v-textarea
                          v-model="corrupt.detail"
                          :rules="corruptDetailfRules"
                          label="รายละเอียดการทุจริต"
                          hide-details="auto"
                          outlined
                        ></v-textarea>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-form>
            </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="btn btn-submit"
            text
            @click="saveComplainStep"
          >
            บันทึก
          </v-btn>
          <v-btn
            class="btn btn-cancel"
            text
            @click="dialog_status = false"
          >
            ยกเลิก
          </v-btn>
        </v-card-actions>
    </v-card>
    </v-dialog> 

    <!-- <v-overlay v-model="overlay_edit_status">
        <v-progress-circular
          :width="3"
          color="blue"
          indeterminate
      ></v-progress-circular>
      </v-overlay> -->

    <v-dialog
      v-model="dialog_edit_status"
      persistent
      max-width="900px"
    >
      <v-card>
        <v-toolbar color="#167dc2" dark>
          <v-toolbar-title>{{formTitle}}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container fluid>
              <v-form
                  ref="formEdit"
                  v-model="valid"
                  lazy-validation
              >
                <v-row>
                  <v-col cols="3">
                    <v-subheader>รายละเอียดข้อมูล</v-subheader>
                  </v-col>
                  <v-col cols="9">
                    <v-textarea
                      filled
                      readonly
                      hide-details="auto"
                      single-line
                      name="input-7-4"
                      v-model="status_detail"
                      :rules="detailRules"
                    ></v-textarea>
                  </v-col>
                </v-row>
  
                <v-row>
                  <v-col cols="3">
                    <v-subheader>ไฟล์เเนบ</v-subheader>
                  </v-col>
                  <v-col cols="9">
                  
                    <div class="text-left">
                      <v-chip v-for="(step_file,index) in step_files" :key="index">
                        {{step_file.file_original}}
                    </v-chip>
                    </div>
                  
                  </v-col>
                </v-row>
  
                <v-row>
                  <v-col cols="3">
                    <v-subheader>สถานะการดำเนินงาน</v-subheader>
                  </v-col>
                  <v-col cols="9">
                    <v-select
                      filled
                      readonly
                      v-model="status_call"
                      :items="selectStatus"
                      item-text="value"
                      item-value="id"
                      dense
                      
                      single-line
                      hide-details="auto" 
                    ></v-select>
                  </v-col>
                </v-row>
              
                <v-row v-if="status_call == 2">
                  <v-col cols="3">
                    <v-subheader>ประเภทการร้องเรียน</v-subheader>
                  </v-col>
                  <v-col cols="9">
                    <v-radio-group
                      v-model="check_corrupt"
                      row
                      disabled
                    >
                      <v-radio
                        label="ไม่ทุจริต"
                        :value=false
                      ></v-radio>
                      <v-radio
                        label="ทุจริต"
                        :value=true
                      ></v-radio>
                    </v-radio-group>
                  </v-col>
    
                </v-row>
            
                <v-card v-if="check_corrupt" class="mx-auto">

                  <v-card-title class="head-corrupt">รายละเอียดการทุจริต</v-card-title>
                  <v-card-text class="pt-5">
                    <v-row>
                      <v-col>
                        <v-text-field
                          v-model="corrupt.reference"
                          :rules="corruptRefRules"
                          hide-details="auto"
                          label="เลขที่หนังสือ"
                          outlined
                          dense
                        ></v-text-field>
                      </v-col>
      
                      <v-col>
                        <DatePickers ref="corrupt_date" :show_date="corrupt.date" @change_date="change_corrupt_date"  label="วันที่ดำเนินการ"/>
                      </v-col>
                    </v-row> 
                    <v-row>
                      <v-col>
                        <InputFiles  ref="corrupt_file" />
                      
                        <div class="text-left pl-6 mt-3">
                          <v-chip         
                          v-for="(corrupt_file,index) in corrupt_files" 
                          :key="index"
                          close @click:close="removeCorruptFiles(corrupt_file)"
                          @click="showFile(corrupt_file)"
                          >
                            {{corrupt_file.file_original}}
                        </v-chip>
                        </div>
                      
                      </v-col>
                    </v-row>
                  
                    <v-row>
                      <v-col>
                        <v-textarea
                          v-model="corrupt.detail"
                          :rules="corruptDetailfRules"
                          label="รายละเอียดการทุจริต"
                          hide-details="auto"
                          outlined
                        ></v-textarea>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-form>
            </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="btn btn-submit"
            text
            @click="editComplainStep"
          >
            บันทึก
          </v-btn>
          <v-btn
            class="btn btn-cancel"
            text
            @click="close"
          >
            ยกเลิก
          </v-btn>
        </v-card-actions>
    </v-card>
    </v-dialog>

    <!-- เเนบไฟล์ -->
    <DialogsFiles  
      ref="dialog_files_step"
      title="ไฟล์เเนบ" 
      :files="step_files"
      path_name="UrlFilesComplainStep"
    />

    <!-- เเนบไฟล์การทุจริต -->
    <DialogsFiles
      ref="dialog_files_corrupt"
      title="ไฟล์เเนบการทุจริต" 
      :files="corrupt_files"
      path_name="UrlFilesCorrupt"
    />

    <!-- โชว์รูป Complain -->
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
// import moment from 'moment';
import moment  from 'moment-timezone'
import Swal from 'sweetalert2';
import store from '../../../store/index.js';
import loaderView from '@/components/loaderView.vue';
import BreadcrumbsView from '@/components/breadcrumbsView.vue';
import InputFiles from '@/components/inputFiles.vue';
import DatePickers from '@/components/datePickers.vue';
import DialogsFiles from '@/components/step/dialogsFiles.vue';
import DetailComplain from '@/components/detailComplain.vue';




export default {
  components: { loaderView, BreadcrumbsView, InputFiles, DatePickers, DialogsFiles, DetailComplain},
  data: () => ({
    chips: ['Programming', 'Playing video games', 'Watching movies', 'Sleeping'],
    items: ['Streaming', 'Eating'],
    item: [
      {
        text: 'รายการที่ต้องดำเนินการ',
        disabled: false,
        href: '/backoffice/follow',
      },
      {
        text: 'รายละเอียดปัญหา',
        disabled: true,
        href: 'breadcrumbs_link_1',
      },  
    ],
    overlay_edit_status: false,
    panel: [0, 1],
    overlayImg: false,
    opacity: 1,
    absolute: false,
    url: '',
    headers: [
      {
        text: 'วันที่ / เวลา',
        align: 'center',
        sortable: false,
        value: 'date',
      },
      { text: 'หน่วยงาน', value: 'division' },
      { text: 'รายละเอียด', value: 'detail' },
      { text: 'สถานะ', value: 'status_call' },
      { text: 'ไฟล์เเนบ', value: 'files_step', align: 'center' },
      { text: 'รายละเอียดการทุจริต', value: 'files_corrupt', align: 'center' },
      { text: 'แก้ไข', value: 'edit', align: 'center' },
    ],
    desserts: [],
    dialog_status : false,
    dialog_edit_status : false,
    valid: true,
    detailRules: [
      v => !!v || 'กรุณากรอกข้อมูล',
      v => (v && v.length <= 512) || 'กรอกรายละเอียดห้ามเกิน 512 ตัวอักษร',
  ],
    statusCallRules: [(v) =>  v.length> 0 || "เลือกสถานะการดำเนินงาน"],
    check_roles: store.getters.user,
    status_detail: '',
    status_call: { value: '', id: null },
    selectStatus: [
      { value: 'เรื่องเสร็จ', id: 2 },
      { value: 'สอบถามข้อมูลเพิ่มเติม', id: 3 },
      { value: 'ส่งต่อผู้เกี่ยวข้อง', id: 4 },
      { value: 'ตั้งคณะกรรมการสอบสวน', id: 5 },
    ],
    check_corrupt: false,
    corrupt: {},
    corruptRefRules : [
      v => !!v || 'กรุณากรอกข้อมูล',
      v => (v && v.length <= 512) || 'กรอกรายละเอียดห้ามเกิน 512 ตัวอักษร'
    ],
    corruptDetailfRules : [v => !!v || 'กรุณากรอกข้อมูล'],
    show_detail_status : false,
    editedIndex: -1,
    dialog_files_step: false,
    dialog_files_corrupt: false,
    step_files: {},
    complain_step_id: null,
    corrupt_id: null,
    corrupt_files: {},
    get_corrupt_date: null,
  }),
  mounted() {
    this.getComplainStep()
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'สถานะการดำเนินงานของเจ้าหน้าที่' : 'แก้ไขสถานะการดำเนินงานของเจ้าหน้าที่'
    },
  },
  methods: {
    dailogfiles(typeFile, v){
      if(typeFile == 'complain_step'){
        this.$refs.dialog_files_step.open()
        this.getComplainStepFiles(v)
      }else if(typeFile == 'corrupt'){
        this.$refs.dialog_files_corrupt.open()
        // this.dialog_files_corrupt = true
        this.getCorruptFiles(v)
      }
    },

    change_corrupt_date(date){
      this.get_corrupt_date = date
    },

    formattedDate(create_date) {
      return moment(create_date).add(543, 'year').utcOffset("+00:00").format("DD/MM/YYYY HH:mm:ss");
    },
    getColor (status_call) {
      if (status_call == 0) return '#FFA000'
      else if (status_call == 1) return '#EF6C00'
      else if (status_call == 2) return 'green'
      else if (status_call == 3) return '#01579B'
      else if (status_call == 4) return '#512DA8'
      else if (status_call == 5) return '#D81B60'
      else return 'green'
    },
    getstatus (status_call) {

      if (status_call == 0) return 'รอรับเรื่อง'
      else if (status_call == 1) return 'อยู่ระหว่างดำเนินการ'
      else if (status_call == 2) return 'เรื่องเสร็จ'
      else if (status_call == 3) return 'สอบถามข้อมูลเพิ่มเติม'
      else if (status_call == 4) return 'ส่งต่อผู้เกี่ยวข้อง'
      else if (status_call == 5) return 'ตั้งคณะกรรมการสอบสวน'
      else return ''
    },
    async removeCorruptFiles (v) {

      try {
        await Swal.fire({
          title: 'คำเตือน',
          text: "คุณต้องการลบไฟล์เเนบใช่หรือไม่ ?",
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

                  console.log(payload);

                  let path =  await `/api/update/deleteCorruptFiles`
                  let response = await axios.post(`${path}`, payload)

                  console.log(response);
                  
                  if(response){
                      await Swal.fire({
                          icon: 'success',
                          text: 'ลบข้อมูลสำเร็จ',
                      })
                  } 

                 await this.getCorruptFiles(v.corrupt_id)
              }
          })
      } catch (error) {
        await Swal.fire({
            icon: 'error',
            title: 'บันทึกไม่สำเร็จ',
            text: 'มีข้อผิดพลาดที่ไม่คาดคิดเกิดขึ้น โปรดลองใหม่อีกครั้ง'
        })
      }
      
        // console.log(index);
        // this.corrupt_files.splice(index, 1)
    },
    close(){
      this.dialog_edit_status = false
      this.editedIndex = -1
      this.show_detail_status = false
      this.check_corrupt = false
      this.overlay_edit_status = false
      this.corrupt = {}
      this.$refs.formEdit.reset()
      this.$refs.formEdit.resetValidation()
      this.$refs.form.reset()
      this.$refs.form.resetValidation()

    },
    async dailogStatusEdit(v){
      console.log(v);
      this.editedIndex = await 1
      this.dialog_edit_status = await true
      this.status_detail = await v.detail
      await this.getComplainStepFiles(v)
      this.status_call = await v.status_call
      this.complain_step_id = await v.id

      this.check_corrupt = await v.check_corrupt == 1 ? true : false

      if(this.check_corrupt){
        this.corrupt_id       = await v.corrupt_id
        this.corrupt.reference =  await v.reference_code
        this.corrupt.detail =  await v.corrupt_detail
        this.corrupt.date =  await v.corrupt_date
        await this.getCorruptFiles(v)
        this.corrupt.detail =  await v.corrupt_detail

      }

    },
    showDetailStatus( v){
      
        if(v != 2){
          this.show_detail_status = false

        }else{
          this.show_detail_status = true
        }   
    },
    async getComplainStep(){
      let path              = await `/api/backoffice/get/complainStep`
      let response          =  await axios.get(`${path}/`+ this.$route.params.id) 
      this.desserts         = await response.data.data

      await setTimeout(() => (this.$refs.loader.overlay = false), 300);

    },
    async getComplainStepFiles(v){
      let path              = await `/api/backoffice/get/ComplainStepFiles`
      let response          = await axios.get(`${path}/`+ v.id)
      this.step_files    = await response.data.data


    },
    async getCorruptFiles(v){
      console.log(v);
      let path              = await `/api/backoffice/get/CorruptFiles`
      let response          = await axios.get(`${path}/`+ v.corrupt_id)
      this.corrupt_files    = await response.data.data
    },

    async urlPdfFiles(url,file_name){
      axios({
          url: `/api/get/pdf/${url}`,
          params: {"filename":file_name},
          method: 'GET',
          responseType: 'blob',
      }).then((response) => {
            var fileURL = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            var fileLink = document.createElement('a');

            fileLink.href = fileURL;
            fileLink.setAttribute('download', file_name);
            document.body.appendChild(fileLink);

            window.open(fileLink, "_blank");

          //  fileLink.click();
      });
    },

    async urlFiles(url,file_name){

     
      let path = await `/api/get/${url}?filename=${file_name}`
      
      let res = await axios.get(`${path}`)

      this.url = await res.data

      this.overlayImg = await !this.overlayImg 
    },

    showFile(v){
      if(v.file_type == 'application/pdf'){
        this.urlPdfFiles('UrlFilesCorrupt', v.file_name)
      }else{
        this.urlFiles('UrlFilesCorrupt', v.file_name)
      }
    },

    async saveComplainStep(){
      if(this.$refs.form.validate()){
        try {
          let fd = await {
            "complain_id"       : this.$refs.data.data.id,
            "admin_id"          : this.check_roles.id,
            "register_id"       : this.$refs.data.data.register_id,
            "detail"            : this.status_detail,
            "status_call"       : this.status_call,
            "check_corrupt"     : this.check_corrupt,
            "create_by"         : this.check_roles.id,
            "modified_by"       : this.check_roles.id,
          }


          let path        = await `/api/backoffice/create/complainStep`
          let response    = await axios.post(`${path}`, fd)
            
          if(response){
            for (let i = 0; i < this.$refs.status_files.files.length; i++) {

              let number = await i + 1

              let complain_id = await response.data.complain_step_id

              let file = await this.$refs.status_files.files[i]

              // const arr_file = await file.name.split(".")
              const arr_file = await file.type.split("/")

              let file_name = await ''
              
              if(file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'){

                file_name = await 'imgComplainStep' + complain_id + '_' + number + '.' +arr_file[1] 

              }else if(file.type === 'application/pdf'){

                file_name = await 'pdfComplainStep' + complain_id + '_' + number + '.' +arr_file[1] 
              }

                let fd_upload = await {
                    "register_id"         : this.$refs.data.data.register_id,
                    "complain_step_id"    : complain_id,
                    "file_original"       : file.name,
                    "file_name"           : file_name,
                    "file_type"           : file.type
                }
 
                let path_api = await `/api/backoffice/complainStepFiles`

                let res_complainStepfiles =  await axios.post(`${path_api}`, fd_upload )
                
                if(res_complainStepfiles){

                  let path_upload = await  `/api/backoffice/uploadStepFiles`

                  await this.myUpload(file_name,  file, path_upload)

                  await setTimeout(() => {
                    console.log('....');
                  }, 2000);
                }

                // setTimeout(async ()  => { await this.insertFile(fd_upload, path_api, file_name, file, path_upload)}, 2000);
            }

            if(this.check_corrupt){
              await this.saveComplainCorrupt(response.data.complain_step_id)
            }
       
          }
       
          await Swal.fire({
              icon: 'success',
              title: 'บันทึกสำเร็จ',
              text: 'ระบบได้ทำการบันทึกข้อมูลของคุณแล้ว'
          }).then( function(){});
          this.dialog_status = await false
          await this.getComplainStep()
        } catch (error) {
          Swal.fire({
              icon: 'error',
              title: 'บันทึกไม่สำเร็จ',
              text: 'มีข้อผิดพลาดที่ไม่คาดคิดเกิดขึ้น โปรดลองใหม่อีกครั้ง'
          })
            console.log(error);
        }
      } 
    },
    async editComplainStep(){
      if(this.$refs.formEdit.validate()){
        try {

          if(this.check_corrupt){
            await this.saveComplainCorrupt(this.complain_step_id, this.corrupt_id)
          }

          await Swal.fire({
              icon: 'success',
              title: 'บันทึกสำเร็จ',
              text: 'ระบบได้ทำการบันทึกข้อมูลของคุณแล้ว'
          }).then( function(){});
          this.dialog_edit_status = await false

          this.overlay_edit_status = await false

        
          await this.getComplainStep()
          // await this.getComplainDetail()
        } catch (error) {
          Swal.fire({
              icon: 'error',
              title: 'บันทึกไม่สำเร็จ',
              text: 'มีข้อผิดพลาดที่ไม่คาดคิดเกิดขึ้น โปรดลองใหม่อีกครั้ง'
          })
            console.log(error);
        }
      } 
    },
    // async insertFile(fd, path_api, file_name, file, path_upload){
    //   try {
    //     let response = await axios.post(`${path_api}`, fd )
    //     console.log(response);
    //     if(response){
    //         setTimeout(async ()  => { await this.myUpload(file_name,  file, path_upload)}, 10000);
    //     }
    //   } catch (error) {
    //       console.log(error);
    //   }

    // },
    async myUpload(file_name, files, path_upload){
      try {

          let fd_upload =  await new FormData();
          await fd_upload.append('image_name', file_name);
          await fd_upload.append('images', files);

          let res2  = await axios.post(`${path_upload}`, fd_upload)
          
          console.log(res2);

      } catch (error) {

          console.log(error);
      }
    },
    async saveComplainCorrupt(complain_step_id, corrupt_id){

      let fd_corrupt = await {
        "corrupt_id"        : corrupt_id,
        "admin_id"          : this.check_roles.id,
        "complain_step_id"  : complain_step_id,
        "reference_code"    : this.corrupt.reference,
        "date"              : this.get_corrupt_date,
        "detail"            : this.corrupt.detail,
      }
    

      let path = null

      if(corrupt_id != null){
        path        = await `/api/backoffice/edit/complainCorrupt`
      }else{
        path        = await `/api/backoffice/create/complainCorrupt`
      }
   
      let response    = await axios.post(`${path}`, fd_corrupt)

      if(response){

        for (let i = 0; i < this.$refs.corrupt_file.files.length; i++) {

          let number = await i + 1

          let file = await this.$refs.corrupt_file.files[i]

          let corrupt_id = await response.data.corrupt_id

          const arr_file = await file.name.split(".")

          let file_name = await ''
            
          if(file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'){

            file_name = await 'imgCorrupt' + corrupt_id + '_' + number + '.' +arr_file[1] 

          }else if(file.type === 'application/pdf'){

            file_name = await 'pdfCorrupt' + corrupt_id + '_' + number + '.' +arr_file[1] 
          }

          let fd_upload = await {
            "corrupt_id"          : corrupt_id,
            "file_original"       : file.name,
            "file_name"           : file_name,
            "file_type"           : file.type,
            "check_remove"        : false,
            "admin_id"            : this.check_roles.id,
          }

          let path_api = await `/api/backoffice/complainCorruptFiles`

          let res_complainCorruptFiles =  await axios.post(`${path_api}`, fd_upload )

          if(res_complainCorruptFiles){

            let path_upload = await  `/api/backoffice/uploadCorruptFiles`

            await this.myUpload(file_name,  file, path_upload)

            await setTimeout(() => {
              console.log('....');
            }, 2000);
          }


       
          // await this.insertFile(fd_upload, path_api, file_name, file, path_upload)
        }
      } 

    },
  }
}
</script>

<style scoped>
  .v-expansion-panel-header{
    background-color: #003366;
    border-bottom: 1px solid #ada3a3;
    color: white;
  }

  /* ::v-deep .v-icon {
    color: white!important;
  } */
 
  /* .input-gray ::v-deep .v-input__slot{
    background: #ebe9e9!important;
  }
  .input-gray ::v-deep input{
    color: gray!important;
  } */

  /* .v-subheader{
    justify-content: right;
  } */
  .head-corrupt{
    background-color: #003366;
    border-bottom: 1px solid #ada3a3;
    color: white;
    font-size: 0.9375rem;
    padding: 8px 16px;
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