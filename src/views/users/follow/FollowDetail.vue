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
            <div class="h2 mb-6">เจ้าหน้าที่ / หน่วยงาน</div>
            <v-row class="align-center">
              <v-col cols="2">
                  <v-subheader>ชื่อ</v-subheader>
              </v-col>

              <v-col cols="4">
                <v-text-field
                    v-model="data.name"
                    solo
                    readonly
                    hide-details="auto"
                    class="input-gray"
                ></v-text-field>
              </v-col>

              <v-col cols="2">
                <v-subheader>นามสกุล</v-subheader>
              </v-col>

              <v-col cols="4">
                <v-text-field
                    v-model="data.lastname"
                    solo
                    readonly
                    hide-details="auto"
                    class="input-gray"
                ></v-text-field>
              </v-col>
            </v-row>
            
            <v-row class="align-center">
              <v-col cols="2">
                  <v-subheader>หน่วยงาน</v-subheader>
              </v-col>

              <v-col cols="4">
                  <v-text-field
                      v-model="data.division"
                      solo
                      readonly
                      hide-details="auto"
                      class="input-gray"
                  ></v-text-field>
              </v-col>

              <v-col cols="2">
                  <v-subheader>รูปพรรณสันฐาน</v-subheader>
              </v-col>

              <v-col cols="4">
                  <v-text-field
                      v-model="data.description_face"
                      solo
                      readonly
                      hide-details="auto"
                      class="input-gray"
                  ></v-text-field>
              </v-col>
            </v-row>

            <div class="h2 mt-10 mb-6">เรื่องร้องเรียน</div>
            <v-row class="align-center">
              <v-col cols="2">
                <v-subheader>Call No.</v-subheader>
              </v-col>

              <v-col cols="4">
                <v-text-field
                  v-model="data.call_no"
                  solo
                  readonly
                  hide-details="auto"
                  class="input-gray"
                ></v-text-field>
              </v-col>

              <v-col cols="2">
                <v-subheader>วันที่บันทึกปัญหา</v-subheader>
              </v-col>

              <v-col cols="4">
                <v-text-field
                  v-model="data.create_date"
                  solo
                  readonly
                  hide-details="auto"
                  class="input-gray"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="align-center">
              <v-col cols="2">
                <v-subheader>หัวเรื่อง</v-subheader>
              </v-col>

              <v-col cols="10">
                <v-text-field
                    v-model="data.topic"
                    solo
                    readonly
                    hide-details="auto"
                    class="input-gray"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="align-center">
              <v-col cols="2">
                <v-subheader>สถานที่เกิดเหตุ</v-subheader>
              </v-col>

              <v-col cols="10">
                <v-text-field
                    v-model="data.location"
                    solo
                    readonly
                    hide-details="auto"
                    class="input-gray"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="align-center">
              <v-col cols="2">
                <v-subheader>ช่วงวันเกิดเหตุ : ตั้งแต่ </v-subheader>
              </v-col>

              <v-col cols="4">
                <v-text-field
                  v-model="data.start_date"
                  label="วันที่เริ่มต้น"
                  append-icon="mdi-calendar"
                  class="input-gray"
                  readonly
                  solo
                ></v-text-field>
              </v-col>

              <v-col cols="2">
                <v-subheader>ถึง </v-subheader>
              </v-col>

              <v-col cols="4">
                <v-text-field
                  v-model="data.end_date"
                  label="วันที่สิ้นสุด"
                  append-icon="mdi-calendar"
                  readonly
                  class="input-gray"
                  solo
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="align-center">
              <v-col cols="2">
                <v-subheader>ช่วงเวลาเกิดเหตุ : ตั้งแต่ </v-subheader>
              </v-col>

              <v-col cols="4">
                <v-text-field
                  v-model="data.start_time"
                  append-icon="mdi-clock-time-four-outline"
                  class="input-gray"
                  readonly
                  solo
                  hide-details="auto"
                ></v-text-field>
              </v-col>

              <v-col cols="2">
                <v-subheader>ถึง </v-subheader>
              </v-col>

              <v-col cols="4">
                <v-text-field
                  v-model="data.end_time"
                  append-icon="mdi-clock-time-four-outline"
                  class="input-gray"
                  readonly
                  solo
                  hide-details="auto"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="align-center">
              <v-col cols="2">
                <v-subheader>รายละเอียดเรื่องร้องเรียน</v-subheader>
              </v-col>

              <v-col cols="10">
                <v-textarea
                  v-model="data.detail"
                  solo
                  readonly
                  hide-details="auto"
                  class="input-gray"
                ></v-textarea>
              </v-col>
            </v-row>

            <div class="h2 mt-10 mb-4">เอกสารประกอบการร้องเรียน</div>
            <v-row class="align-center">
              <v-col cols="12">
                <v-list subheader>
                  <div class="d-flex justify-space-between">
                    <v-subheader>ชื่อไฟล์</v-subheader>
                    <v-subheader>ไฟล์เเนบ</v-subheader>
                  </div>

                  <v-list-item v-for="file in files" :key="file.id">
                    <v-list-item-content class="text-left">
                    <v-list-item-title>{{ file.file_original }}</v-list-item-title>
                    </v-list-item-content>
                    <div class="btn-files" v-if="file.file_type == 'application/pdf'" @click="urlPdfFiles('UrlFilesComplain',file.file_name)"><i class="fa-solid fa-file"></i></div>
                    <div class="btn-files" v-else @click="urlFiles('UrlFilesComplain',file.file_name)"><i class="fa-solid fa-image"></i></div>
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
              {{ formattedDate(item.date) == 'Invalid date' ? '' : formattedDate(item.date) }}
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
             <div v-if="item.status_call == 2">
             
              <v-btn color="#003366" small icon @click="DetailComplainStep(item)">
                <i class="f-16 fa-solid fa-magnifying-glass"></i>
              </v-btn>
             </div>
            </template>
          
          </v-data-table>

        </v-expansion-panel-content>
      </v-expansion-panel>

    </v-expansion-panels>
      <v-dialog persistent max-width="700px" v-model="dialogComplainStep">
        <v-card>
          <v-toolbar color="#167dc2" dark>
            <v-toolbar-title>รายละเอียดสถานะการดำเนินงานของเจ้าหน้าที่</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="dialogComplainStep = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          </v-toolbar>
        </v-card>
        <v-card-text class="bg-w">
          <v-container fluid>
            <p>{{ cancelMessageName }}</p>
            <p>กรุณาร้องเรียนผ่านช่องทางนี้ : 
              <a v-bind:href="`${cancelContactUrl}`">{{cancelContactName}}</a>
            </p>
          </v-container>
        </v-card-text>
      </v-dialog>

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
// import Swal from 'sweetalert2';
import store from '../../../store/index.js';
import loaderView from '@/components/loaderView.vue';
import BreadcrumbsView from '@/components/breadcrumbsView.vue';
// import InputFiles from '@/components/inputFiles.vue';


export default {
  components: { loaderView, BreadcrumbsView},
  data: () => ({
    check_roles: store.getters.user,
    panel: [0, 1],
    valid: true,
    data: {},
    files: {},
    files_url: '',
    step_files: {},
    url: '',
    status_detail: '',
    status_call: { value: '', id: null },
    cancelMessageName: '',
    cancelContactName:'',
    cancelContactUrl:'',
    dialogComplainStep: false,
    dialog_files_step: false,
    dialog_detail: false,
    overlayImg: false,
    absolute: false,
    opacity: 1,
    desserts: [],
    item: [
        {
          text: 'ติดตามเรื่องร้องเรียน',
          disabled: false,
          href: '/user/follow',
        },
        {
          text: 'รายละเอียดปัญหา',
          disabled: true,
          href: 'breadcrumbs_link_1',
        },
        
    ],
    headers: [
        {
          text: 'วันที่ / เวลา',
          align: 'center',
          sortable: false,
          value: 'date',
        },
        { text: 'รายละเอียด', value: 'detail' },
        { text: 'สถานะ', value: 'status_call' },
        { text: 'รายละเอียดสถานะการดำเนินงานของเจ้าหน้าที่', value: 'detailComplainStep', align: 'center' },
      ],
    }),
  mounted() {
    this.getComplainDetail()
    this.getComplainStep()
  },
  methods: {
    async dailogfiles(v){
      this.dialog_files_step = await true

      await this.getComplainStepFiles(v)
    },
    async dailogDetail(){
      this.dialog_detail        = await true

     
    },
    getColor (status_call) {
      if (status_call == 0) return '#a19d9d'
      else if (status_call == 1) return '#FFA000'
      else if (status_call == 2) return '#EF6C00'
      else if (status_call == 3) return '#01579B'
      else if (status_call == 4) return '#512DA8'
      else if (status_call == 5) return 'green'
      else return 'green'
    },
    getstatus (status_call) {

      if (status_call == 0) return 'รอรับเรื่อง'
      else if (status_call == 1) return 'รับเรื่อง'
      else if (status_call == 2) return 'ไม่รับเรื่อง'
      else if (status_call == 3) return 'อยู่ระหว่างดำเนินการ'
      else if (status_call == 4) return 'สอบถามข้อมูลเพิ่มเติม'
      else if (status_call == 5) return 'เรื่องเสร็จ'
      else return ''
    },
    formattedDate(create_date) {
      return moment(create_date).add(543, 'year').utcOffset("+00:00").format("DD/MM/YYYY HH:mm:ss");
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

    async DetailComplainStep(v){

      this.dialogComplainStep = await true,
      this.cancelMessageName  = await v.cancel_message_id === 3 ? v.cancel_message_other : v.cancel_message_name,
      this.cancelContactName  = await v.cancel_contact_name,
      this.cancelContactUrl   = await v.cancel_contact_url

    },

    async getComplainDetail(){
      let path              = await `/api/user/get/complainDetail`
      // let response          =  await axios.get(`${path}/`+ this.$route.params.id)
      let response          =  await axios.get(`${path}`,{
          params: {
              id: this.$route.params.id,
              userType: this.$route.path.includes('cgd') ? 'cgd' : this.$route.path.includes('backoffice') ?'admin' : 'user'
          }
      })
      this.data             = await response.data.data[0]
      this.data.create_date = await  moment(response.data.data[0].create_date).add(543, 'year').tz("Asia/Bangkok").locale('th').format('DD MMMM YYYY')
      // this.data.create_date = await moment(response.data.data[0].create_date).add(543, 'year').tz("Asia/Bangkok").locale('th').format('DD MMMM YYYY') + ' ' + moment(response.data.data[0].create_date).utcOffset("+00:00").format('HH:mm')
      this.data.start_time  = await moment(response.data.data[0].start_date).utcOffset("+00:00").format('HH:mm') == '00:00' ? '' : moment(response.data.data[0].start_date).utcOffset("+00:00").format('HH:mm')
      this.data.end_time  = await moment(response.data.data[0].end_date).utcOffset("+00:00").format('HH:mm') == '00:00' ? '' : moment(response.data.data[0].end_date).utcOffset("+00:00").format('HH:mm')
      this.data.start_date  = await moment(response.data.data[0].start_date).add(543, 'year').tz("Asia/Bangkok").locale('th').format('DD MMMM YYYY')
      this.data.end_date    = await moment(response.data.data[0].end_date).add(543, 'year').tz("Asia/Bangkok").locale('th').format('DD MMMM YYYY')
 
      this.files            = await response.data.data_files

      await setTimeout(() => (this.$refs.loader.overlay = false), 300);
    },
    async getComplainStep(){
      let path              = await `/api/user/get/complainStep`
      let response          =  await axios.get(`${path}/`+ this.$route.params.id)
      this.desserts         = await response.data.data
    }, 
    async getComplainStepFiles(v){
      let path              = await `/api/backoffice/get/ComplainStepFiles`
      let response          = await axios.get(`${path}/`+ v.id)
      this.step_files    = await response.data.data

    },
  }
}
</script>

<style scoped>
  .w-180{
    width: 220px;
  }
  .v-expansion-panel-header{
    background-color: #003366;
    border-bottom: 1px solid #ada3a3;
    color: white;
  }

  .input-gray ::v-deep .v-input__slot{
    background: #ebe9e9!important;
  }
  .input-gray ::v-deep input{
    color: gray!important;
  }
  .v-overlay.style-bg{
    z-index: 6!important;
  }
  .v-overlay.style-bg img{
    width: 500px;
    height: 500px;
    object-fit: contain;
  }
  .v-overlay.style-bg{
    z-index: 300!important;
  }
  .v-overlay.style-bg img{
    width: 500px;
    height: 500px;
    object-fit: contain;
  }
  .btn-files{
    cursor: pointer;
  }

  v-subheader {
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.375rem;
    letter-spacing: 0.0071428571em;
}
.bg-w{
  background: #fff;
}

@media only screen and (max-width: 767px) {
  .w-180{
    width: 100%;
  }
}
</style>