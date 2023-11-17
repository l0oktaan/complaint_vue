<template>
    <div class="user-view">
        <div class="style-page">
          <v-data-table 
            :headers="headers"
            :items="datas"
            :search="search"
            :loading="loadTable"
            loading-text="Loading..."
            class="table-none"
          >
            <template v-slot:top>
              <v-toolbar flat class="table-head">
                <v-toolbar-title class="mr-2">รายการผู้ร้องเรียน</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="ค้นหา (E-mail, ชื่อ-สกุล)"
                  single-line
                  hide-details
                ></v-text-field>
              </v-toolbar>
            </template>

            <template v-slot:[`item.create_date`]="{ item }">{{getThaiDate(item.create_date)}}</template>
            <template v-slot:[`item.name`]="{ item }">{{item.name + ' ' + item.lastname}}</template>
            <template v-slot:[`item.E-mail`]="{ item }">{{ item.email }}</template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn
                color="#003366"
                icon
                small 
                @click="editItem(item.id)"
              >
                <i class="f-16 fa-solid fa-magnifying-glass"></i>
              </v-btn>
            </template>
          </v-data-table>
        </div>
      </div>
    </template>
    <script>
    import  axios  from "axios";
   
      export default {
  
        data: () => ({
          dialog: false,
          // dialogDelete: false,
          search: '',
          loadTable: true,
          headers: [
            { text: 'วันที่จัดทำ', value: 'create_date', align: 'center'},
            { text: 'E-mail', value: 'email' },
            { text: 'ชื่อ-สกุล', value: 'name' },
            { text: 'เบอร์โทรศัพท์มือถือ', value: 'phone' },
            { text: 'Action', value: 'actions', align: 'center', sortable: false },
          ],
          datas: [],
        }),
    
        mounted () {
          this.getRegister()
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
          async getRegister () {
            try {
              let path        = await `/api/backoffice/get/listRegister`
              let response    = await axios.get(`${path}`)
              this.datas = await response.data.data
              this.loadTable = await false;
            } catch (error) {
              if (error.response.status === 401) {
                // Redirect to the login page
                this.$router.push('/backoffice/login'); // Replace with your login route
              } else {
                console.log('getRegister');
                // Handle other errors
              }
            }
          },

          editItem (id) {
            this.$router.push({ name: 'register_form', params: { id: id },})
          },
  
          
        },
      }
    </script>
    <style scoped>
        .v-data-table-header{
            background-color: #0170c2;
        }
        th span{
               color: white!important;
        }
        .title-festival{
            border-bottom: 2px solid #0170c2;
        }
        .btn-create{
            background-color: #213862!important;
            border: 1px solid #213862;
            color: white!important;
        }
        .btn-submit{
            background-color: #0170c2;
            border: 1px solid #0170c2;
            color: white!important;
        }
        .btn-cancel{
            color: #0170c2!important;
            border: 1px solid #0170c2;
            margin-right: 0.5rem;
        }
        /* .table-none{
          box-shadow: none!important;
        } */
    </style>