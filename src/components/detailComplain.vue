<template>
    <div>
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
                            </v-row>
                            <v-row>
                            <v-col cols="3">
                                <v-subheader>วันที่บันทึกปัญหา</v-subheader>
                            </v-col>
                            <v-col cols="9">
                            <v-text-field
                                v-model="data.create_date"
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
                                <v-subheader>ช่วงวัน - เวลาเกิดเหตุ : ตั้งแต่ </v-subheader>
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
                                
                                <v-text-field
                                v-model="data.start_time"
                                append-icon="mdi-clock-time-four-outline"
                                class="input-gray"
                                readonly
                                solo
                                hide-details="auto"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="1">
                                <v-subheader>ถึง : </v-subheader>
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
                                    <div class="btn-files" v-if="file.file_type == 'application/pdf'" @click="urlPdfFiles('UrlFilesComplain',file.file_name)"><i class="fa-solid fa-file"></i></div>
                                    <div class="btn-files" v-else @click="urlFiles('UrlFilesComplain',file.file_name)"><i class="fa-solid fa-image"></i></div>

                                </v-list-item>
                                
                                </v-list>
                            </v-col>
                            </v-row>
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
                                    <v-subheader>Email :</v-subheader>
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
                            <v-row>
                                <v-col class="d-flex">
                                    <v-subheader>ที่อยู่ :</v-subheader>
                                    <v-text-field
                                    v-model="user.address"
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
import moment  from 'moment-timezone';
// import moment from 'moment';
export default {
    data: () => ({
        tab: null,
        data: {},
        user: {},
        files: {},
        url: '',
        overlayImg: false,
        opacity: 1,
        absolute: false,
    }),
    mounted(){
        this.getComplainDetail()
    },
    methods: {
        async getComplainDetail(){

            let path              = await `/api/user/get/complainDetail`
            let response          =  await axios.get(`${path}/`+ this.$route.params.id)
            this.data             = await response.data.data[0]

            this.data.create_date = await moment(response.data.data[0].create_date).add(543, 'year').format("DD/MM/YYYY HH:mm:ss")

            // this.data.start_time  = await moment(response.data.data[0].start_date).tz("Asia/Bangkok").format('HH:mm') !== '00:00' ? moment(response.data.data[0].start_date).tz("Asia/Bangkok").format('HH:mm') : '-'; 
            // this.data.end_time    = await moment(response.data.data[0].end_date).tz("Asia/Bangkok").format('HH:mm') !== '00:00'? moment(response.data.data[0].end_date).tz("Asia/Bangkok").format('HH:mm') : '-'; 
            // this.data.start_date  = await moment(response.data.data[0].start_date).add(543, 'year').format("DD/MM/YYYY")
            // this.data.end_date    = await moment(response.data.data[0].end_date).add(543, 'year').format("DD/MM/YYYY")
            // this.data.start_time  = await moment(response.data.data[0].start_date).tz("Asia/Bangkok").format('HH:mm') !== '00:00' ? moment(response.data.data[0].start_date).tz("Asia/Bangkok").format('HH:mm') : '-'; 
            // this.data.end_time    = await moment(response.data.data[0].end_date).tz("Asia/Bangkok").format('HH:mm') !== '00:00'? moment(response.data.data[0].end_date).tz("Asia/Bangkok").format('HH:mm') : '-'; 
            
            // this.data.start_date  = await moment(response.data.data[0].start_date).add(543, 'year').tz("Asia/Bangkok").locale('th').format('DD MMMM YYYY')
            // this.data.end_date    = await moment(response.data.data[0].end_date).add(543, 'year').tz("Asia/Bangkok").locale('th').format('DD MMMM YYYY')

                 this.data.start_date  = await response.data.data[0].start_date
                this.data.end_date    = await response.data.data[0].end_date
      
          this.files            = await response.data.data_files
          


          await this.getRegisterDetail()
        //   await setTimeout(() => (this.$refs.loader.overlay = false), 300);
        },
        async getRegisterDetail(){
          let path              = await `/api/get/registerDetail`
          let response          = await axios.get(`${path}/` + this.data.register_id)
          this.user             = await response.data.data[0]
          this.user.name       =   await response.data.data[0].name + ' ' + response.data.data[0].lastname 
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
        }
}
</script>

<style>
    .theme--light.v-text-field--solo > .v-input__control > .v-input__slot{
        background: #ebe9e9!important;
    }
    /* .theme--light.v-input input, .theme--light.v-input textarea{
        color: gray!important;
    } */
    /* .input-gray ::v-deep .v-input__slot{
        background: #ebe9e9!important;
    }
    ::v-deep.input-gray ::v-deep input{
        color: gray!important;
    } */
</style>