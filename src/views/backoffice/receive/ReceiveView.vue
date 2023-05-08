<template>
    <div class="receive-complain">
      <div class="style-page">
        <v-card class="style-card">
          <v-card-title>
              เเสดงรายการปัญหา
              <v-spacer></v-spacer>
              <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="ค้นหา"
                  single-line
                  hide-details
              ></v-text-field>
          </v-card-title>
          <v-data-table
              :headers="headers"
              :items="datas"
              :search="search"
              :loading="loading"
              loading-text="Loading... Please wait"
          >

            <template v-slot:[`item.call_no`]="{ item }">{{ item.call_no }}</template>
            <template v-slot:[`item.start_date`]="{ item }">{{getThaiDate(item.start_date)}}</template>
            <template v-slot:[`item.end_date`]="{ item }">{{getThaiDate(item.end_date)}}</template>
            <template v-slot:[`item.start_time`]="{ item }">{{timeFormat(item.start_date)}}</template>
            <template v-slot:[`item.end_time`]="{ item }">{{timeFormat(item.end_date)}}</template>
            <!-- <template v-slot:[`item.create_date`]="{ item }">
              {{ formattedDate(item.create_date) == 'Invalid date' ? '' : formattedDate(item.create_date) }}
            </template> -->
            <template v-slot:[`item.status_call`]="{ item }">
                <v-chip
                :color="getColor(item.status_call)"
                dark
                >
                {{ item.status_call  == 0 ? 'รอรับเรื่อง' : '' }}
                </v-chip>
            </template>
            <template v-slot:[`item.action`]="{ item }">
              <router-link :to="{ name: 'receive-detail', params: { id: item.id }}">
                <i class="fa-solid fa-magnifying-glass"></i>
              </router-link>
            </template>
          </v-data-table>
        </v-card>
      </div>
    </div>
  </template>
  <script>
  import axios from "axios";
  import moment from 'moment';
  import 'moment/locale/th'; // Import the Thai locale
  import store from '../../../store/index.js';
  export default {
    data () {
      return {
        check_roles: store.getters.user,
        search: '',
        loading: true,
        datas: [],
        headers: [
          {
            text: 'Call No',
            align: 'center',
            value: 'call_no',
          },
          {
            text: 'หัวข้อปัญหา',
            align: 'start',
            sortable: false,
            value: 'topic',
          },
          { text: 'วันที่เริ่มต้น', value: 'start_date' },
          { text: 'วันที่สิ้นสุด', value: 'end_date' },
          { text: 'ตั้งเเต่เวลา', value: 'start_time' },
          { text: 'ถึงเวลา', value: 'end_time' },
          // { text: 'วัน - เวลาเเจ้งปัญหา', value: 'create_date' },
          { text: 'สถานะ Call', value: 'status_call' },
          {
            text: 'Action',
            align: 'center',
            value: 'action',
          },
        ],
        desserts: [],
      }
    },
    mounted(){
      this.getListComplain()
    },
    methods: {
      getThaiDate(item){
        if (item){
          var d = new Date(item);
          return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
        }else{
          return "";
        }            
      },
      timeFormat:function(d){

        let time =  moment(d).format('HH:mm') == '00:00' ? '' : moment(d).format('HH:mm') 

          return time;


      },
      getColor (status_call) {
        if (status_call > 400) return 'red'
        else if (status_call > 200) return 'orange'
        else return '#FFA000'
      },
      formattedDate(create_date) {
        return moment(create_date).add(543, 'year').format("DD/MM/YYYY HH:mm:ss");
      },
      async getListComplain(){
        let path = await `/api/backoffice/get/listComplain`
        let response =  await axios.get(`${path}/`)
        // let response =  await axios.get(`${path}/`+ this.check_roles.id)
        this.datas = await response.data.data
        this.loading = await false
        console.log(response);
      },
    },
  }
  </script>
  <style>
  .style-card{
  box-shadow: none!important;
  }
  </style>