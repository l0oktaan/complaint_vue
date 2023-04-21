<template>
  <div class="complain-detail"> 
    <loaderView ref="loader"/>
    <BreadcrumbsView :items="item"/>
    <v-expansion-panels
      v-model="panel"
      multiple
    >
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
                    <div class="btn-files" @click="urlFiles(file.file_name, file.file_type)"><i class="fa-solid fa-file"></i></div>

                  </v-list-item>
                  
                </v-list>
              </v-col>
            </v-row>
          </v-container>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel v-if="check_roles.roles == 'admin'">
        <v-expansion-panel-header>
          สถานะการดำเนินงานของเจ้าหน้าที่
        </v-expansion-panel-header>
        <v-expansion-panel-content>

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
                  
                  <InputFiles  ref="status"/>
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
                  ></v-select>
                </v-col>
              </v-row>
              <v-btn
                depressed
                class="btn-submit mt-5"
                @click="saveComplainStep"
              >
                บันทึก
              </v-btn>
            </v-form>
          
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

            <template v-slot:[`item.files`]="{ item }">
              <v-btn
                color="primary"
                dark
                icon
                @click="dailogfiles(item)"
              >
              <i class="fa-solid fa-file"></i>
              </v-btn>
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
                @click="dailogDetail(item)"
              >
                <i class="fa-solid fa-magnifying-glass"></i>
              </v-btn>
             </div>
             
            </template>
          </v-data-table>

        </v-expansion-panel-content>
      </v-expansion-panel>

    </v-expansion-panels>
    <v-dialog
      v-model="dialog_files"
      max-width="290"
    >
      <v-card>
        <v-card-title class="text-h5">
          Use Google's location service?
        </v-card-title>

        <v-card-text>
          Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            Disagree
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog_detail"
      max-width="500"
    >
      <v-card>
        <v-card-title class="text-h5">
         รายการดำเนินงานของเจ้าหน้าที่
        </v-card-title>
        <v-card-text>

        </v-card-text>

      
      </v-card>
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

    <!-- <a v-if="overlayImg" :href="url" target="_blank">
      <img width="220" height="250" border="0" align="center"  :src="url" alt=""/>
    </a> -->
  </div>
</template>
<script>
import axios from "axios";
import moment from 'moment';
// import Swal from 'sweetalert2';
import store from '../../../store/index.js';
import loaderView from '@/components/loaderView.vue';
import BreadcrumbsView from '@/components/breadcrumbsView.vue';
import InputFiles from '@/components/inputFiles.vue';


export default {
  components: { loaderView, BreadcrumbsView, InputFiles},
  data: () => ({
    check_roles: store.getters.user,
    // zIndex: 4,
    panel: [0],
    valid: true,
    data: {},
    files: {},
    files_url: '',
    url: '',
    status_detail: '',
    status_call: { value: '', id: null },
    // edit_status_detail: '',
    // edit_status_call: { value: '', id: null },
    selectStatus: [
          // { value: 'อยู่ระหว่างดำเนินการ', id: 2 },
          { value: 'เรื่องเสร็จ', id: 2 },
          { value: 'สอบถามข้อมูลเพิ่มเติม', id: 3 },
          { value: 'ส่งต่อผู้เกี่ยวข้อง', id: 4 },
          { value: 'ตั้งคณะกรรมการสอบสวน', id: 5 },
      ],
    dialog_files: false,
    dialog_detail: false,
    overlayImg: false,
    absolute: false,
    opacity: 1,
    desserts: [],
    item: [
        {
          text: 'ติดตามเรื่องร้องเรียน',
          disabled: false,
          href: '/user/complain',
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
        // { text: 'ชื่อ - สกุล', value: 'name' },
        { text: 'หน่วยงาน', value: 'division' },
        { text: 'รายละเอียด', value: 'detail' },
        { text: 'สถานะ', value: 'status_call' },
        { text: 'ไฟล์เเนบ', value: 'files' },
        { text: 'Action', value: 'edit' },
      ],
    }),
  mounted() {
    this.getComplainDetail()
    this.getComplainStep()
  },
  methods: {
    dailogfiles(v){
      this.dialog_files = true
      console.log(v);
    },
    async dailogDetail(v){
      this.dialog_detail        = await true
      console.log(v);
     
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
    formattedDate(create_date) {
      return moment(create_date).add(543, 'year').format("DD/MM/YYYY HH:mm:ss");
    },
    isBase64(str) {
      try {
        return btoa(atob(str)) == str;
      } catch (error) {
        return false;
      }
    },
    base64ToBlob(base64String, contentType) {
      // const byteCharacters = atob(base64String);
      console.log(contentType);
      const byteCharacters = this.isBase64(base64String);
      const byteArrays = [];
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays.push(byteCharacters.charCodeAt(i));
      }
      const blob = new Blob([new Uint8Array(byteArrays)], { type: contentType });
      return blob;
    },
    displayPdf(base64String) {
      const contentType = 'application/pdf';
      try {
        const blob = this.base64ToBlob(base64String, contentType);

        const fileUrl =  window.URL.createObjectURL(blob);

        console.log(fileUrl);

        // window.open(fileUrl, '_blank');
      } catch (error) {
        console.error(error);
      }
    },
    async urlFiles(file_name, file_type){

      console.log(file_name);
      console.log(file_type);

      // let path = await `/api/user/getUrlFiles?filename=${file_name}`
      let path = await `/api/get/UrlFilesComplain?filename=${file_name}`
      let res = await axios.get(`${path}`)

      this.url = await res.data
      

      if(file_type == 'pdf'){
        await this.displayPdf(this.url)
      }else{
        // window.open(this.url, '_blank');
        this.overlayImg = await !this.overlayImg 
      }

      // const binaryString  = await this.isBase64(this.url)

      // // Convert the binary string to a Uint8Array
      // const uint8Array = new Uint8Array(binaryString.length);


      // for (let i = 0; i < binaryString.length; i++) {
      //   uint8Array[i] = binaryString.charCodeAt(i);
      // }

      // // Create a Blob object from the Uint8Array and set the MIME type
      // const blob = new Blob([uint8Array], { type: 'application/pdf' }); // replace 'application/pdf' with your desired MIME type

      
      // // Create a URL for the Blob object
      // const url = URL.createObjectURL(blob);

 

      // // Create an anchor tag with the URL and the download attribute
      //   const link = document.createElement('a');
      //   link.href = url;
      //   link.setAttribute('download', 'file.pdf'); // replace 'file.pdf' with your desired file name

      //   // Append the anchor tag to the document body and click it to download the file
      //   document.body.appendChild(link);
      //   link.click();

      //   // Clean up by revoking the URL object
      //   URL.revokeObjectURL(url);
            
      // console.log('=======', url);

   



      // console.log(this.files_url);

    
      // const blobPDF = await this.base64ToBlobPDF(res.data)
      // const blobUrl = await URL.createObjectURL(blobPDF);

      // const blobImage = await this.base64ToBlob(res.data);
      // const blobUrl = await URL.createObjectURL(blobImage);

      // return  window.open(blobUrl, '_blank');
   
    },
    async getComplainDetail(){
      let path              = await `/api/user/get/complainDetail`
      let response          =  await axios.get(`${path}/`+ this.$route.params.id)
      this.data             = await response.data.data[0]
      this.data.create_date = await moment(response.data.data[0].create_date).add(543, 'year').format("DD/MM/YYYY HH:mm:ss")
      this.data.start_date  = await moment(response.data.data[0].start_date).add(543, 'year').format("DD/MM/YYYY")
      this.files            = await response.data.data_files


      console.log(this.files);
      
      await setTimeout(() => (this.$refs.loader.overlay = false), 300);
    },
    async getComplainStep(){
      let path              = await `/api/user/get/complainStep`
      let response          =  await axios.get(`${path}/`+ this.$route.params.id)
      this.desserts         = await response.data.data
      console.log(response );
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
  .v-overlay.style-bg{
    z-index: 6!important;
  }
  .v-overlay.style-bg img{
    width: 500px;
    height: 500px;
    object-fit: contain;
  }
  /* .v-subheader{
    justify-content: right;
  } */
</style>