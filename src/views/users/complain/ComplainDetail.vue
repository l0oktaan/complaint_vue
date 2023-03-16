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
                <v-text-field
                  v-model="data.detail"
                  solo
                  readonly
                  hide-details="auto"
                  class="input-gray"
                ></v-text-field>
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
                    <div class="btn-files" @click="urlFiles(file.file_name)"><i class="fa-solid fa-file"></i></div>
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
          Some content
        </v-expansion-panel-content>
      </v-expansion-panel>

    </v-expansion-panels>
  </div>
</template>
<script>
import axios from "axios";
import moment from 'moment';
import loaderView from '@/components/loaderView.vue';
import BreadcrumbsView from '@/components/breadcrumbsView.vue';


export default {
  components: { loaderView, BreadcrumbsView },
  data: () => ({
      panel: [0],
      data: {},
      files: {},
      files_url: '',
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
    }),
  mounted() {
    this.getComplainDEtail()
  },
  methods: {
    formattedDate(create_date) {
      return moment(create_date).add(543, 'year').format("DD/MM/YYYY, HH:mm:ss");
    },
    async urlFiles(file_name){
      let path = await `/api/user/getUrlFiles?filename=${file_name}`
      let res = await axios.get(`${path}`)

      this.files_url = await res.data
      console.log(this.files_url);

    },
    async getComplainDEtail(){
      let path              = await `/api/user/get/complainDetail`
      let response          =  await axios.get(`${path}/`+ this.$route.params.id)
      this.data             = await response.data.data[0]
      this.data.create_date = await moment(response.data.data[0].create_date).add(543, 'year').format("DD/MM/YYYY HH:mm:ss")
      this.data.start_date  = await moment(response.data.data[0].start_date).add(543, 'year').format("DD/MM/YYYY")
      this.files            = await response.data.data_files
      
      await setTimeout(() => (this.$refs.loader.overlay = false), 300);
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

  ::v-deep .v-icon {
    color: white!important;
  }
 
  .input-gray ::v-deep .v-input__slot{
    background: #ebe9e9!important;
  }
  .input-gray ::v-deep input{
    color: gray!important;
  }

  /* .v-subheader{
    justify-content: right;
  } */
</style>