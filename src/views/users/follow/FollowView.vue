<template>
    <div class="follow-view">
      <div class="style-page">
        <v-card class="style-card">
          <v-card-title>เเสดงรายการปัญหา</v-card-title>
          <v-row>
            <v-col cols="12" sm="6">
              <selectStatus  ref="filter_status" :itemsStatus="itemsStatus"/>
            </v-col>
            <v-col  cols="12" sm="6">
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="ค้นหา"
                single-line
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>           
          <v-data-table
            :headers="headers"
            :search="search"
            :loading="loading"
            loading-text="Loading... Please wait"
            :items="filteredItems"
          >
            <template v-slot:[`item.call_no`]="{ item }">
                {{ item.call_no }}
            </template>
            <template v-slot:[`item.start_date`]="{ item }">{{getThaiDate(item.start_date)}}</template>
            <template v-slot:[`item.end_date`]="{ item }">{{getThaiDate(item.end_date)}}</template>
            <!-- <template v-slot:[`item.start_time`]="{ item }">{{timeFormat(item.start_date)}}</template>
            <template v-slot:[`item.end_time`]="{ item }">{{timeFormat(item.end_date)}}</template> -->
            <!-- <template v-slot:[`item.create_date`]="{ item }">
              
              {{ formattedDate(item.create_date) == 'Invalid date' ? '' : formattedDate(item.create_date) }}
            </template> -->
            <template v-slot:[`item.status_call`]="{ item }">
                <v-chip
                :color="getColor(item.status_call)"
                dark
                >
                {{ getstatus(item.status_call) }}
                </v-chip>
            </template>
            <template v-slot:[`item.detail`]="{ item }">
              <router-link :to="{ name: 'complain-detail', params: { id: item.id }}">
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
  import selectStatus from '@/components/selectStatus.vue';
  export default {
    components: {selectStatus},
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
            // { text: 'ตั้งเเต่เวลา', value: 'start_time' },
            // { text: 'ถึงเวลา', value: 'end_time' },
            { text: 'สถานะ Call', value: 'status_call' },
            {
              text: 'รายละเอียดเรื่องร้องเรียน',
              align: 'center',
              value: 'detail',
            },
          ],
          desserts: [],
          itemsStatus: [
            { value: 'ทั้งหมด', id: null },
            { value: 'รอรับเรื่อง', id: 0 },
            { value: 'อยู่ระหว่างดำเนินการ', id: 1 },
            { value: 'เรื่องเสร็จ', id: 2 },
            { value: 'สอบถามข้อมูลเพิ่มเติม', id: 3 },
            { value: 'ส่งต่อผู้เกี่ยวข้อง', id: 4 },
            { value: 'ตั้งคณะกรรมการสอบสวน', id: 5 },
          ],
        }
    },
    mounted(){
      this.getListComplain()
    },
    computed: {
        filteredItems() {
          return this.datas.filter(item => {
            const status_call = this.getstatus(item.status_call)
              return (
                (this.$refs.filter_status.selectedStatus === 'ทั้งหมด' || status_call === this.$refs.filter_status.selectedStatus) 
              );
          });
        },
    },
    methods: {
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
      timeFormat:function(d){
        let time =  moment(d).utcOffset("+00:00").format('HH:mm') == '00:00' ? '' : moment(d).utcOffset("+00:00").format('HH:mm') 
          return time;      
      },
      getThaiDate(item){

        if (item){
          var d = new Date(item);
          return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
        }else{
          return "";
        }            
      },
      formattedDate(create_date) {

        return moment(create_date).add(543, 'year').format("DD/MM/YYYY");
      },
      async getListComplain(){
        let path = await `/api/user/get/listFollow`
        let response =  await axios.get(`${path}/`+ this.check_roles.id)
        this.datas = await response.data.data
        this.loading = await false
      },
    },
  }
</script>
<style>
.style-card{
  box-shadow: none!important;
}
</style>