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
                label="Search"
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
            <template v-slot:[`item.no`]="{ index }">{{ index + 1 }}</template>
            <template v-slot:[`item.call_no`]="{ item }">
              <router-link :to="{ name: 'complain-detail', params: { id: item.id }}">
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
                {{ item.status_call }}
                </v-chip>
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
          text: 'No',
          align: 'start',
          value: 'no',
        },
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
      ],
      desserts: [],
    }
  },
  mounted(){
    this.getListComplain()
  },
  methods: {
    getColor (status_call) {
      if (status_call > 400) return 'red'
      else if (status_call > 200) return 'orange'
      else return 'green'
    },
    formattedDate(create_date) {
      // moment.locale('th'); // Set the locale to Thai
      // return moment(this.datas.create_date).format('DD MMMM YYYY, HH:mm', { lang: 'th' });
      return moment(create_date).add(543, 'year').format("DD/MM/YYYY HH:mm:ss");
    },
    async getListComplain(){
      let path = await `/api/user/get/listComplain`
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