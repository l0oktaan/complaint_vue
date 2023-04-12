<template>
    <div class="follow-view">
      <div class="style-page">
        <v-card class="style-card">
          <v-card-title>เเสดงรายการปัญหา</v-card-title>
          <v-row>
            <v-col cols>
              <selectStatus  ref="filter_status"/>
            </v-col>
            <v-col cols>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
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
            <!-- <template v-slot:[`item.no`]="{ index }">{{ index + 1 }}</template> -->
            <template v-slot:[`item.call_no`]="{ item }">
              <router-link v-if="check_roles.roles == 'user'" :to="{ name: 'complain-detail', params: { id: item.id }}">
                {{ item.call_no }}
              </router-link>
              <router-link v-else :to="{ name: 'backoffice-complaindetail', params: { id: item.id }}">
                {{ item.call_no }}
              </router-link>
            </template>
            <template v-slot:[`item.create_date`]="{ item }">
              {{ formattedDate(item.create_date) == 'Invalid date' ? '' : formattedDate(item.create_date) }}
            </template>
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
              <!-- <router-link v-else :to="{ name: 'backoffice-complaindetail', params: { id: item.id }}">
                {{ item.call_no }}
              </router-link> -->
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
          // {
          //   text: 'No',
          //   align: 'start',
          //   value: 'no',
          // },
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
          { text: 'วัน - เวลาเเจ้งปัญหา', value: 'create_date' },
          { text: 'สถานะ Call', value: 'status_call' },
          {
            text: 'รายละเอียดเรื่องร้องเรียน',
            align: 'center',
            value: 'detail',
          },
        ],
        desserts: [],
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
                // &&
                // (this.search === '' || item.name?.toLowerCase().includes(this.search.toLowerCase()))
              );
            // }
          
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
      formattedDate(create_date) {
        // moment.locale('th'); // Set the locale to Thai
        // return moment(this.datas.create_date).format('DD MMMM YYYY, HH:mm', { lang: 'th' });
        return moment(create_date).add(543, 'year').format("DD/MM/YYYY, HH:mm:ss");
      },
      async getListComplain(){
        let path = await `/api/user/get/listFollow`
        let response =  await axios.get(`${path}/`+ this.check_roles.id)
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