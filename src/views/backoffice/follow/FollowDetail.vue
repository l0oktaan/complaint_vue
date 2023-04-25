<template>
    <div class="complain-detail"> 
      <loaderView ref="loader"/>
      <BreadcrumbsView :items="item"/>
      <v-expansion-panels v-model="panel" multiple>
        <v-expansion-panel>
          <v-expansion-panel-header>
            รายละเอียดปัญหา
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-container fluid>
              <v-row>
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
                    v-model="data.detail"
                    solo
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
                        <v-list-item-title>{{ file.file_original }}</v-list-item-title>
                      </v-list-item-content>
                      <div class="btn-files" @click="urlFiles('UrlFilesComplain',file.file_name, file.file_type)"><i class="fa-solid fa-file"></i></div>
  
                    </v-list-item>
                    
                  </v-list>
                </v-col>
              </v-row>
            </v-container>
          </v-expansion-panel-content>
        </v-expansion-panel>

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
                        
                        <InputFiles  ref="status_files"/>
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
                          @change="showDetailStatus('select', status_call)"
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
                            @click="checkCorrupt"
                          ></v-radio>
                          <v-radio
                            label="ทุจริต"
                            :value=true
                            @click="checkCorrupt"
                          ></v-radio>
                        </v-radio-group>
                      </v-col>
        
                    </v-row>
                    <v-card v-if="check_corrupt && show_detail_status" class="mx-auto">
                  
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
                          <v-col>
                            <InputFiles  ref="corrupt_file"/>
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
                @click="close"
              >
                ยกเลิก
              </v-btn>
            </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- เเนบไฟล์ -->
      <v-dialog v-model="dialog_files_step" max-width="500">
        <v-toolbar color="#167dc2" dark>
          <v-toolbar-title>ไฟล์เเนบ</v-toolbar-title>
        </v-toolbar>

        <v-list  subheader two-line>
          <div v-if="step_files.length">
            <v-list-item
                v-for="step_file in step_files"
                :key="step_file.id"
              >
              <v-list-item-content class="text-left">
                <v-list-item-title >{{ step_file.file_original }}</v-list-item-title>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn icon @click="urlFiles('UrlFilesComplainStep',step_file.file_name, step_file.file_type)">
                  <i class="fa-solid fa-file"></i>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </div>
          <p v-else>ไม่มีข้อมูล</p>
        </v-list> 
      </v-dialog>

    <!-- เเนบไฟล์การทุจริต -->
    <v-dialog v-model="dialog_files_corrupt" max-width="500">
      <v-toolbar color="#167dc2" dark>
        <v-toolbar-title>ไฟล์เเนบการทุจริต</v-toolbar-title>
      </v-toolbar>

      <v-list subheader two-line
      >
        <v-list-item
          v-for="corrupt_file in corrupt_files"
          :key="corrupt_file.id"
        >
        
          <v-list-item-content class="text-left">
            <v-list-item-title >{{ corrupt_file.file_original }}</v-list-item-title>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn icon @click="urlFiles('UrlFilesCorrupt',corrupt_file.file_name, corrupt_file.file_type)">
              <i class="fa-solid fa-file"></i>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-dialog>



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
  import InputFiles from '@/components/inputFiles.vue';
  import DatePickers from '@/components/datePickers.vue';
  
  
  export default {
    components: { loaderView, BreadcrumbsView, InputFiles, DatePickers},
    data: () => ({
      item: [
        {
          text: 'ติดตามเรื่องร้องเรียน',
          disabled: false,
          href: '/backoffice/follow',
        },
        {
          text: 'รายละเอียดปัญหา',
          disabled: true,
          href: 'breadcrumbs_link_1',
        },  
      ],
      panel: [0],
      data: {},
      files: {},
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
        { text: 'ไฟล์เเนบการทุจริต', value: 'files_corrupt', align: 'center' },
        { text: 'Action', value: 'edit', align: 'center' },
      ],
      desserts: [],
      dialog_status : false,
      valid: true,
      detailRules: [v => !!v || 'กรุณากรอกข้อมูล'],
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
      corruptRefRules : [v => !!v || 'กรุณากรอกข้อมูล'],
      corruptDetailfRules : [v => !!v || 'กรุณากรอกข้อมูล'],
      show_detail_status : false,
      editedIndex: -1,
      dialog_files_step: false,
      dialog_files_corrupt: false,
      step_files: {},
      complain_step_id: null,
      corrupt_id: null,
      corrupt_files: {},
    }),
    mounted() {
      this.getComplainDetail()
      this.getComplainStep()
    },
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'สถานะการดำเนินงานของเจ้าหน้าที่' : 'แก้ไขสถานะการดำเนินงานของเจ้าหน้าที่'
      },
    },
    methods: {
      close(){
        this.dialog_status = false
        this.editedIndex = -1
        this.show_detail_status = false
        this.check_corrupt = false
        this.$refs.form.reset()
        this.$refs.form.resetValidation()

      },
      formattedDate(create_date) {
        return moment(create_date).add(543, 'year').format("DD/MM/YYYY HH:mm:ss");
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
      showDetailStatus(type, v){
        if(type == 'edit'){
          this.corrupt.reference =  v.reference_code
          this.corrupt.detail =  v.corrupt_detail
          this.corrupt.date =  v.corrupt_date
        } else{
          if(v != 2){
            this.show_detail_status = false

          }else{
            this.show_detail_status = true

          }

         
        }


      },
      dailogfiles(typeFile, v){
        if(typeFile == 'complain_step'){
          this.dialog_files_step = true
          this.getComplainStepFiles(v)
        }else if(typeFile == 'corrupt'){
          this.dialog_files_corrupt = true
          this.getCorruptFiles(v)
        }
      },
      checkCorrupt(){
        if(this.check_corrupt){
          this.check_corrupt = true
        }else{
          this.check_corrupt = false
          // this.corrupt.reference = ''
          // this.$refs.corrupt_date.date = ''
          // this.corrupt.detail = ''
        }
      
      },
      async getComplainDetail(){
        let path              = await `/api/user/get/complainDetail`
        let response          =  await axios.get(`${path}/`+ this.$route.params.id)
        this.data             = await response.data.data[0]
        this.data.create_date = await moment(response.data.data[0].create_date).add(543, 'year').format("DD/MM/YYYY HH:mm:ss")
        this.data.start_date  = await moment(response.data.data[0].start_date).add(543, 'year').format("DD/MM/YYYY")
        this.files            = await response.data.data_files
        console.log(response);
        await setTimeout(() => (this.$refs.loader.overlay = false), 300);
      },
      async getComplainStep(){
        let path              = await `/api/backoffice/get/complainStep`
        let response          =  await axios.get(`${path}/`+ this.$route.params.id) 
        this.desserts         = await response.data.data

      },
      async getComplainStepFiles(v){
        let path              = await `/api/backoffice/get/ComplainStepFiles`
        let response          = await axios.get(`${path}/`+ v.id)
        this.step_files    = await response.data.data

      },
      async getCorruptFiles(v){
        console.log(v);
        let path              = await `/api/backoffice/get/CorruptFiles`
        let response          = await axios.get(`${path}/`+ v.id)
        this.corrupt_files    = await response.data.data

        console.log(response);

      },
      async urlFiles(url,file_name, file_type){
        console.log('urlFiles');
        let path = await `/api/get/${url}?filename=${file_name}`
        let res = await axios.get(`${path}`)
        this.url = await res.data
        if(file_type == 'pdf'){
          console.log(file_type);
          // await this.displayPdf(this.url)
        }else{
          this.overlayImg = await !this.overlayImg 
        }
      },
      async saveComplainStep(){
        if(this.editedIndex == -1){
          this.createComplainStep()
        }else{
          this.editComplainStep()
        }
      },
      async createComplainStep(){
        if(this.$refs.form.validate()){
          try {
            let fd = await {
              "complain_id"       : this.data.id,
              "admin_id"          : this.check_roles.id,
              "register_id"       : this.data.register_id,
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

                let file = await this.$refs.status_files.files[i]

                let complain_id = await response.data.complain_step_id

                const arr_file = await file.name.split(".")

                let file_name = await ''
                
                if(file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'){

                  file_name = await 'imgcid' + complain_id + '_' + number + '.' +arr_file[1] 

                }else if(file.type === 'application/pdf'){

                  file_name = await 'pdfcid' + complain_id + '_' + number + '.' +arr_file[1] 
                }

                  let fd_upload = await {
                      "register_id"         : this.data.register_id,
                      "complain_step_id"    : complain_id,
                      "file_original"       : file.name,
                      "file_name"           : file_name,
                      "file_type"           : file.type
                  }

                  let path_api = await `/api/backoffice/complainStepFiles`

                  let path_upload = await  `/api/backoffice/uploadStepFiles`

                await this.insertFile(fd_upload, path_api, file_name, file, path_upload)
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
      async insertFile(fd, path_api, file_name, file, path_upload){
        try {
          let response = await axios.post(`${path_api}`, fd )
          if(response){
              setTimeout(() => {this.myUpload(file_name,  file, path_upload)}, 2000);
          }
        } catch (error) {
            console.log(error);
        }

      },
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
      async dailogStatusEdit(v){
        console.log(v);
        this.editedIndex = await 1
        this.dialog_status = await true
        this.status_detail = await v.detail
        this.status_call = await v.status_call
        this.complain_step_id = await v.id
        this.corrupt_id       = await v.corrupt_id
        this.check_corrupt = await v.check_corrupt == 1 ? true : false

        if (v.status_call == 2 ) {
          this.show_detail_status = true
          if(this.check_corrupt){
            await this.showDetailStatus('edit',v)
          }
       
        }

        // if(this.check_corrupt){
        //   await this.showDetailStatus(v.status_call)
        // }
         
        // if(v.status_call){
        //   console.log('==============');
        //   
        //   this.check_corrupt = await v.check_corrupt == 1 ? true : false
        //   this.corrupt.reference = await v.reference_code
        //   this.corrupt.detail = await v.corrupt_detail
        //   this.corrupt.date = await v.corrupt_date
        // }
      },
      async editComplainStep(){
        if(this.$refs.form.validate()){
          try {
            let fd = await {
              "complain_step_id"  : this.complain_step_id,
              "complain_id"       : this.data.id,
              "admin_id"          : this.check_roles.id,
              "register_id"       : this.data.register_id,
              "detail"            : this.status_detail,
              "status_call"       : this.status_call,
              "check_corrupt"     : this.check_corrupt,
            }
            let path        = await `/api/backoffice/edit/complainStep`
            let response    = await axios.post(`${path}`, fd)
              
            console.log(response);
            if(response){

              // for (let i = 0; i < this.$refs.status_files.files.length; i++) {

              //   let number = await i + 1

              //   let file = await this.$refs.status_files.files[i]

              //   let complain_step_id = await this.complain_step_id

              //   const arr_file = await file.name.split(".")

              //   let file_name = await ''
                
              //   if(file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'){

              //     file_name = await 'imgcid' + complain_step_id + '_' + number + '.' +arr_file[1] 

              //   }else if(file.type === 'application/pdf'){

              //     file_name = await 'pdfcid' + complain_step_id + '_' + number + '.' +arr_file[1] 
              //   }

              //     let fd_upload = await {
              //         "admin_id"            : this.check_roles.id,
              //         // "register_id"         : this.data.register_id,
              //         "complain_step_id"    : complain_step_id,
              //         "file_original"       : file.name,
              //         "file_name"           : file_name,
              //         "file_type"           : file.type
              //     }

              //     let path_api = await `/api/backoffice/complainStepFiles`

              //     let path_upload = await  `/api/backoffice/uploadStepFiles`

              //   await this.insertFile(fd_upload, path_api, file_name, file, path_upload)
              // }

              if(this.check_corrupt){
                await this.saveComplainCorrupt(this.complain_step_id, this.corrupt_id)
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
      async saveComplainCorrupt(complain_step_id, corrupt_id){
 
          let fd_corrupt = await {
            "corrupt_id"        : corrupt_id,
            "admin_id"          : this.check_roles.id,
            "complain_step_id"  : complain_step_id,
            "reference_code"    : this.corrupt.reference,
            "date"              : this.$refs.corrupt_date.date,
            "detail"            : this.corrupt.detail,
          }

          let path = null
          if(this.editedIndex == -1){
            path        = await `/api/backoffice/create/complainCorrupt`
          }else{
            if(this.corrupt_id != null){
              path        = await `/api/backoffice/edit/complainCorrupt`
            }else{
              path        = await `/api/backoffice/create/complainCorrupt`
            }
          
          }

          let response    = await axios.post(`${path}`, fd_corrupt)

          console.log(response);

          if(response){

            for (let i = 0; i < this.$refs.corrupt_file.files.length; i++) {

              let number = await i + 1

              let file = await this.$refs.corrupt_file.files[i]

              let complain_corrupt_id = await response.data.complain_corrupt_id

              const arr_file = await file.name.split(".")

              let file_name = await ''
                
              if(file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'){

                file_name = await 'imgcid' + complain_corrupt_id + '_' + number + '.' +arr_file[1] 

              }else if(file.type === 'application/pdf'){

                file_name = await 'pdfcid' + complain_corrupt_id + '_' + number + '.' +arr_file[1] 
              }

              let fd_upload = await {
                "complain_step_id"    : complain_step_id,
                "file_original"       : file.name,
                "file_name"           : file_name,
                "file_type"           : file.type,
                "admin_id"            : this.check_roles.id,
              }

              let path = await `/api/backoffice/complainCorruptFiles`

              let path_api = await  `/api/backoffice/uploadCorruptFiles`
              
              await this.insertFile(fd_upload, path, file_name, file, path_api)
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
   
    .input-gray ::v-deep .v-input__slot{
      background: #ebe9e9!important;
    }
    .input-gray ::v-deep input{
      color: gray!important;
    }
  
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