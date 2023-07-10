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

            <template v-slot:[`item.status_call`]="{ item }">
              <v-chip
              :color="getColor(item.status_call)"
              dark
              >
              {{ getstatus(item.status_call) }}
              </v-chip>
            </template>

            <template   v-slot:[`item.detailComplainStep`]="{ item }"  >
             <div v-if="item.status_call != 0 && item.status_call != 1">
             
              <v-btn color="#003366" small icon @click="dailogDetailStep(item)">
                <i class="f-16 fa-solid fa-magnifying-glass"></i>
              </v-btn>
             </div>
            </template>

            <template v-slot:[`item.editCorrupt`]="{ item }">
              <div v-if="item.check_corrupt == 1">
                <v-btn  color="#003366" icon small @click="editCorrupt(item)">
                  <i class="f-16 fa-solid fa-pen-to-square"></i>
                </v-btn>
              </div> 
            </template>

          </v-data-table>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-btn depressed color="primary" class="mt-3" @click="dialogComplainStep = true">สถานะการดำเนินงานของเจ้าหน้าที่ </v-btn>
    
    </v-expansion-panels>

    <!-- สถานะการดำเนินงานของเจ้าหน้าที่ -->

    <v-dialog
      v-model="dialogComplainStep"
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
            @click="closeComplainStep"
          >
            ยกเลิก
          </v-btn>
        </v-card-actions>
    </v-card>
    </v-dialog> 

    <!-- รายละเอียดสถานะการดำเนินงานของเจ้าหน้าที่ -->
    <v-dialog
      v-model="dialogDetailStep"
      persistent
      max-width="900px"
    >
      <v-card>
        <v-toolbar color="#167dc2" dark>
          <v-toolbar-title>{{formTitle}}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
            <v-container fluid >
                  <v-row>
                      <v-col cols="3">
                        <v-skeleton-loader
                          :loading="loading"
                          type="list-item"
                        >
                          <v-subheader>รายละเอียดข้อมูล</v-subheader>
                        </v-skeleton-loader>
                      </v-col>
                      <v-col cols="9">
                        <v-skeleton-loader
                          :loading="loading"
                          height="150"
                          type="image"
                        >
                          <v-textarea
                            filled
                            readonly
                            hide-details="auto"
                            single-line
                            name="input-7-4"
                            v-model="detailStep.detail"
                            :rules="detailRules"
                          ></v-textarea>
                        </v-skeleton-loader>
                      </v-col>
                  </v-row>
  
                  <v-row>
                    <v-col cols="3">
                      <v-skeleton-loader
                        :loading="loading"
                        type="list-item"
                      >
                        <v-subheader>ไฟล์เเนบ</v-subheader>
                      </v-skeleton-loader>
                    </v-col>
                    <v-col cols="9">
                      <v-skeleton-loader
                        :loading="loading"
                       
                        type="chip"
                      >
                      <div class="text-left mt-3">
                        <v-chip class="mr-1 mb-1" 
                          v-for="(step_file,index) in step_files" :key="index"
                          @click="showFile(step_file, 'UrlFilesComplainStep')"
                        >
                        <i v-if="step_file.file_type == 'application/pdf'" class="fa-solid fa-file pr-2"></i>
                        <i v-else class="fa-solid fa-image pr-2"></i>
                        {{step_file.file_original}}
                      </v-chip>
                    
                      </div>
                    </v-skeleton-loader>
                  
                    </v-col>
                  </v-row>
  
                  <v-row>
                    <v-col cols="3">
                      <v-skeleton-loader
                        :loading="loading"
                        type="list-item"
                      >
                        <v-subheader>สถานะการดำเนินงาน</v-subheader>
                      </v-skeleton-loader>
                    </v-col>
                  
                    <v-col cols="9">
                      <v-skeleton-loader
                        :loading="loading"
                        height="40"
                        type="image"
                      >
                        <v-select
                          filled
                          readonly
                          v-model="detailStep.status_call"
                          :items="selectStatus"
                          item-text="value"
                          item-value="id"
                          dense
                          single-line
                          hide-details="auto" 
                        ></v-select>
                      </v-skeleton-loader>
                    </v-col>
                  </v-row>
              
                  <v-row v-if="detailStep.status_call == 2">
                    <v-col cols="3">
                      <v-skeleton-loader
                        :loading="loading"
                        type="list-item"
                      >
                        <v-subheader>ประเภทการร้องเรียน</v-subheader>
                      </v-skeleton-loader>
                    </v-col>
                    <v-col cols="9">
                      <v-skeleton-loader
                        :loading="loading"
                        type="list-item"
                      >
                        <v-radio-group
                          v-model="detailStep.check_corrupt"
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
                      </v-skeleton-loader>
                    </v-col>
                  </v-row>

              
            </v-container>
        </v-card-text>
        <v-card-actions class="btn-action">
          <v-spacer></v-spacer>
          <v-skeleton-loader
            :loading="loading"
            type="button"
          >
            <v-btn
              class="btn btn-submit"
              text
              @click="dialogDetailStep = false"
            >
              ย้อนกลับ
            </v-btn>
          </v-skeleton-loader>
        </v-card-actions>
    </v-card>
    </v-dialog>

    <!--- ทุจริต --->
    <v-dialog
      v-model="dialogCorrupt"
      persistent
      max-width="900px"
    >
      <v-card>
        <v-toolbar color="#167dc2" dark>
          <v-toolbar-title>{{formTitleCorrupt}}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container fluid>
              <v-form
                  ref="formCorrupt"
                  v-model="valid"
                  lazy-validation
              >
                <v-row>
                  <v-col>
                    <v-skeleton-loader
                      :loading="loading"
                      height="45"
                      type="image"
                    >
                      <v-text-field
                        v-model="corrupt.reference"
                        :rules="corruptRefRules"
                        hide-details="auto"
                        label="เลขที่หนังสือ"
                        outlined
                        dense
                      ></v-text-field>
                    </v-skeleton-loader>
                  </v-col>
               
                  <v-col>
                    <v-skeleton-loader
                      :loading="loading"
                      height="45"
                      type="image"
                    >
                      <!-- <DatePickers ref="corrupt_date" :showDate.sync="corrupt.date" @change_date="change_corrupt_date"  label="วันที่ดำเนินการ"/> -->
                      <v-menu
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        :return-value.sync="corrupt_date"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="newDate"
                            label="วันที่"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            outlined
                            dense
                          ></v-text-field>
                        </template>
                      
                        <v-date-picker
                          v-model="corrupt_date"
                          :rules="dateValidationRule"
                          no-title
                          scrollable
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                            text
                            color="primary"
                            @click="menu = false"
                          >
                            Cancel
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.menu.save(corrupt_date)"
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </v-skeleton-loader>
                  </v-col>
                </v-row> 
                <v-row>
                  <v-col>
                    <v-skeleton-loader
                      :loading="loading"
                      height="85"
                      type="image"
                    >
                      <InputFiles  ref="corrupt_file" />
                      <div class="text-left pl-6 mt-3">
                        <v-chip class="mr-1"      
                        v-for="(corrupt_file,index) in corrupt_files" 
                        :key="index"
                        close @click:close="removeCorruptFiles(corrupt_file)"
                        @click="showFile(corrupt_file, 'UrlFilesCorrupt')"
                        >
                        <i v-if="corrupt_file.file_type == 'application/pdf'" class="fa-solid fa-file pr-2"></i>
                        <i v-else class="fa-solid fa-image pr-2"></i>
                        {{corrupt_file.file_original}}
                      </v-chip>
                      </div>
                    </v-skeleton-loader>
                  
                  </v-col>
                </v-row>
                  
                <v-row>
                  <v-col>
                    <v-skeleton-loader
                      :loading="loading"
                      height="155"
                      type="image"
                    >
                      <v-textarea
                        v-model="corrupt.detail"
                        :rules="corruptDetailfRules"
                        label="รายละเอียดการทุจริต"
                        hide-details="auto"
                        outlined
                      ></v-textarea>
                    </v-skeleton-loader>
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
        </v-card-text>
        <v-card-actions class="btn-action">
        
          <v-spacer></v-spacer>
          <v-skeleton-loader
            :loading="loading"
            type="actions"
          >
            <v-btn
              class="btn btn-submit mr-2"
              text
              @click="saveComplainCorrupt"
            >
              บันทึก
            </v-btn>
            <v-btn
              class="btn btn-cancel"
              text
              @click="closeComplainCorrupt"
            >
              ยกเลิก
            </v-btn>
          </v-skeleton-loader>
        </v-card-actions>
    </v-card>
    </v-dialog>

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
import moment  from 'moment-timezone'
import Swal from 'sweetalert2';
import store from '../../../store/index.js';
import loaderView from '@/components/loaderView.vue';
import BreadcrumbsView from '@/components/breadcrumbsView.vue';
import InputFiles from '@/components/inputFiles.vue';
// import DatePickers from '@/components/datePickers.vue';
import DetailComplain from '@/components/detailComplain.vue';

export default {
  components: { loaderView, BreadcrumbsView, InputFiles,  DetailComplain},
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
      { text: 'รายละเอียดสถานะการดำเนินงานของเจ้าหน้าที่', value: 'detailComplainStep', align: 'center' },
      { text: 'แก้ไขรายการทุจริต', value: 'editCorrupt', align: 'center' },
    ],
    desserts: [],
    loading : false,
    dialogComplainStep : false,
    dialogDetailStep: false,
    dialogCorrupt : false,
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
    detailStep: {},
    check_corrupt: false,
    // corrupt: {},
    corrupt: {},
    // corrupt_date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    corrupt_date: new Date().toISOString().substr(0, 10),
    newDate : null,
    menu: false,
    modal: false,
    // menu2: false,
    corruptRefRules : [
      v => !!v || 'กรุณากรอกข้อมูล',
      v => (v && v.length <= 512) || 'กรอกรายละเอียดห้ามเกิน 512 ตัวอักษร'
    ],
    corruptDetailfRules : [
      v => !!v || 'กรุณากรอกข้อมูล',
      v => (v && v.length <= 512) || 'กรอกรายละเอียดห้ามเกิน 512 ตัวอักษร'
    ],
    dateValidationRule: [
      v => !!v || 'Date is required',
      // (value) => this.isDateValid || 'Invalid date',
    ],
    show_detail_status : false,
    editedIndex: -1,
    editTitleCorrupt : -1,
    dialog_files_step: false,
    dialog_files_corrupt: false,
    step_files: {},
    complain_step_id: null,
    corrupt_id: null,
    corrupt_files: {},
    // get_corrupt_date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    get_corrupt_date: null,
  }),

  mounted() {
    this.getComplainStep()
    this.getEndThaiDate()
  },
  watch: {
    corrupt_date(){
        this.getEndThaiDate()
    },
  },

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'สถานะการดำเนินงานของเจ้าหน้าที่' : 'รายละเอียดสถานะการดำเนินงานของเจ้าหน้าที่'
    },
    formTitleCorrupt(){
      return this.editTitleCorrupt === -1 ? 'รายละเอียดการทุจริต' : 'แก้ไขรายละเอียดการทุจริต'
    },
    isDateValid() {
      return !this.corrupt_date || this.corrupt_date >= new Date();
    },
  },
 
  methods: {
    fetchData() {
      this.loading = true; 

      setTimeout(() => {
        this.loading = false; // Hide the loader
      }, 1000);

    },
    // change_corrupt_date(date){
    //   this.get_corrupt_date = date
    // },
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
    showDetailStatus( v){
      if(v != 2){
        this.show_detail_status = false
      }else{
        this.show_detail_status = true
      }   
    },
    showFile(v, urlFiles){
      if(v.file_type == 'application/pdf'){
        this.urlPdfFiles(urlFiles, v.file_name)
      }else{
        this.urlFiles(urlFiles, v.file_name)
      }
    },
    async closeComplainStep(){

      this.dialogComplainStep = await false
      this.editedIndex        = await -1
      this.show_detail_status = await false
      this.status_detail      = await ''
      this.status_call        = await { value: '', id: null }
      this.check_corrupt      = await false
      this.step_files         = await {}

      await this.$refs.status_files.clearFiles()      
      await this.$refs.form.reset()
      await this.$refs.form.resetValidation()
      // this.$refs.status_files.files = await []
      // this.check_corrupt = false
      // this.overlay_edit_status = false
      // this.corrupt = {}
    },
    async closeComplainCorrupt(){
      this.dialogCorrupt    = await false
      this.editTitleCorrupt = await -1
      // this.corrupt          = await {}
      this.corrupt_files    = await {}
      this.corrupt_date     = await new Date().toISOString().substr(0, 10),

      await this.$refs.corrupt_file.clearFiles()
      await this.$refs.formCorrupt.reset()
      await this.$refs.formCorrupt.resetValidation()
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
    async getCorruptFiles(corrupt_id){

      let path              = await `/api/backoffice/get/CorruptFiles`
      let response          = await axios.get(`${path}/`+ corrupt_id)
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
    async dailogDetailStep(v){
      this.editedIndex              = await 1
      this.dialogDetailStep         = await true
      await this.fetchData();
      this.detailStep               = await v
      this.detailStep.check_corrupt = await v.check_corrupt == 1 ? true : false
      this.complain_step_id         = await v.id
      await this.getComplainStepFiles(v)

      // await setTimeout(() => (this.loadDetailStep = false), 300);

    },
    async editCorrupt(v){
      this.dialogCorrupt      =   await true
      await this.fetchData();
      this.editTitleCorrupt   =   await 0
      this.complain_step_id   =   await v.id
      this.corrupt_id         =   await v.corrupt_id
      this.corrupt.reference  =   await v.reference_code
      this.corrupt.detail     =   await v.corrupt_detail
      // this.corrupt_date       =   await v.corrupt_date;
      this.corrupt_date       =   await moment(v.corrupt_date).format("YYYY-MM-DD");
      this.corrupt.detail     =   await v.corrupt_detail
      await this.getCorruptFiles(v.corrupt_id)
      
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

            const formData = await new FormData();  

            this.complain_step_id = await response.data.complain_step_id
            await formData.append('id', response.data.complain_step_id);
            await formData.append('types', 'ComplainStep');

            for (let i = 0; i < this.$refs.status_files.files.length; i++) {
             
              await formData.append('files', this.$refs.status_files.files[i]);
              
              let number = await i + 1

              let complain_id = await response.data.complain_step_id

              let file = await this.$refs.status_files.files[i]

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

                await axios.post(`${path_api}`, fd_upload )
            }

            if(this.$refs.status_files.files.length){
              await axios.post('/api/uploadsFile', formData)
              // await this.myUpload(formData)
            }

          }

          await Swal.fire({
              icon: 'success',
              title: 'บันทึกสำเร็จ',
              text: 'ระบบได้ทำการบันทึกข้อมูลของคุณแล้ว'
          }).then( function(){});
          // this.dialogComplainStep = await false
          // this.dialogComplainStep = await false
          

        
          // await this.getComplainStep()
          if(this.check_corrupt){
            this.dialogCorrupt = await true
            this.getEndThaiDate()
          }else{
            await this.closeComplainStep()
            await this.getComplainStep()
          }

        } catch (error) {
          Swal.fire({
              icon: 'error',
              title: 'บันทึกไม่สำเร็จ',
              text: 'มีข้อผิดพลาดที่ไม่คาดคิดเกิดขึ้น โปรดลองใหม่อีกครั้ง'
          })
            console.log('saveComplainStep',error);
        }
      } 
    },
    async saveComplainCorrupt(){
      if(this.$refs.formCorrupt.validate()){
        try {
          let fd_corrupt = await {
            "corrupt_id"        : this.corrupt_id,
            "admin_id"          : this.check_roles.id,
            "complain_step_id"  : this.complain_step_id,
            "reference_code"    : this.corrupt.reference,
            "date"              : this.corrupt_date,
            "detail"            : this.corrupt.detail,
          }

          console.log(fd_corrupt);

          let path = null

          if(this.editTitleCorrupt > -1){
            path        = await `/api/backoffice/edit/complainCorrupt`
          }else{
            path        = await `/api/backoffice/create/complainCorrupt`
          }

          console.log(path);

          let response    = await axios.post(`${path}`, fd_corrupt)

          if(response){

            const formData = await new FormData();  

            await formData.append('id', response.data.corrupt_id);

            await formData.append('types', 'Corrupt');

            for (let i = 0; i < this.$refs.corrupt_file.files.length; i++) {

              await formData.append('files', this.$refs.corrupt_file.files[i]);

              let number = await i + 1

              let file = await this.$refs.corrupt_file.files[i]

              let corrupt_id = await response.data.corrupt_id

              const arr_file = await file.type.split("/")

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

              await axios.post(`${path_api}`, fd_upload )
            
            }

            if(this.$refs.corrupt_file.files.length){
              await axios.post('/api/uploadsFile', formData)
            }

            await Swal.fire({
                icon: 'success',
                title: 'บันทึกสำเร็จ',
                text: 'ระบบได้ทำการบันทึกข้อมูลของคุณแล้ว'
            }).then( function(){});
            // this.dialogCorrupt = await false
            // this.dialogCorrupt = await false
           
            if(this.editTitleCorrupt > -1){
              await this.getComplainStep()
            }else{
              await this.closeComplainStep()
              await this.getComplainStep()
            }
            await this.closeComplainCorrupt()
          } 

        } catch (error) {
          console.log('saveComplainCorrupt', error);
        }
      }
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

                  let path =  await `/api/update/deleteCorruptFiles`
                  let response = await axios.post(`${path}`, payload)
                  
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

    },

    getEndThaiDate(){
      if (this.corrupt_date){
        var d = new Date(this.corrupt_date);
        this.newDate = d.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
      }
    },

    // async myUpload(files){
    //   await axios.post('/api/uploadsFile', files)
    //   .then(response => {
    //       // Handle the response
    //       console.log(response.data);
    //   })
    //   .catch(error => {
    //       // Handle the error
    //       console.error(error);
    //   });
    // },
   
  }
}
</script>

<style scoped>
  .v-expansion-panel-header{
    background-color: #003366;
    border-bottom: 1px solid #ada3a3;
    color: white;
  }

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
.btn-action{
 padding: 8px 36px!important;
}

</style>