<template>
    
<div class="reply-message">
  <BreadcrumbsView :items="item"/>
  <v-data-table
    :headers="headers"
    :items="dataReplyMessage"
    :loading="loading"
    loading-text="Loading... Please wait"
    :sort-by="[{ key: 'calories', order: 'asc' }]"
    class="elevation-1"
  >
  <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>ข้อความตอบกลับผู้ใช้งาน</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-btn
            color="primary"
            dark
            class="mb-2"
            @click="dialogCreate = true"
            >
            <i class="fa-solid fa-plus icon-style"></i>
            เพิ่มรายการใหม่
        </v-btn>
    </v-toolbar>
  </template>

  <template v-slot:[`item.create_date`]="{ item }">
    <div class="overflow-160" >{{getThaiDate(item.create_date)}}</div>
  </template>
  <template v-slot:[`item.message_detail`]="{ item }">
    <div class="overflow-630" >{{ item.message_detail }}</div>
  </template>
  <template v-slot:[`item.status`]="{ item }">  
    <div class="overflow-160" >
      <v-switch
        @click="toggleStatus(item)"
        v-model="item.status"
        :label="`${item.status == true ? 'ใช้งาน' : 'ไม่ใช้งาน'}`"
      ></v-switch>
    </div>
  </template>

  <template v-slot:[`item.actions`]="{ item }">
      <v-btn  color="#003366" icon small @click="editReplyMessage(item)">
        <i class="f-16 fa-solid fa-pen-to-square"></i>
      </v-btn>
      <v-btn  color="#003366" icon small @click="removeReplyMessage(item)">
        <i class="fa-solid fa-trash"></i>
      </v-btn>
  </template>

  </v-data-table>
  <v-dialog v-model="dialogCreate" max-width="500px" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ formTitle }}</span>
      </v-card-title>

      <v-card-text>
        <v-form ref="formReplyMessage" v-model="valid" lazy-validation>
          <p class="style-label"><span>*</span>รายละเอียดข้อความตอบกลับผู้ใช้งาน</p>
          <v-textarea
              v-model="messageDetail"
              :rules="messageDetailRules"
              hide-details="auto"
              outlined
              :maxlength="maxLengthTwoHundred"
              @input="checkRulesLength(messageDetail.length, maxLengthTwoHundred)"
          ></v-textarea>
          <v-checkbox
            v-model="CheckmessageOther"
            label="เพิ่มช่องกรอกรายละเอียดข้อความอื่นๆ"
          ></v-checkbox>
        </v-form>

        <v-card-actions class="px-0 py-0 mt-4">
          <v-spacer></v-spacer>
          <v-btn
            class="btn btn-submit"
            variant="text"
            @click="saveReplyMessage"
          >
            บันทึก
          </v-btn>
          <v-btn
            class="btn btn-cancel"
            variant="text"
            @click="closeDailogCreate"
          >
            ยกเลิก
          </v-btn>
        </v-card-actions>
      </v-card-text> 

    </v-card>
  </v-dialog>
</div>

    
</template>
<script>
  import axios from "axios";
  import Swal from 'sweetalert2';
  import store from '../../../store/index.js';
  import moment from 'moment';
  import 'moment/locale/th'; // Import the Thai locale
  import BreadcrumbsView from '@/components/breadcrumbsView.vue';
  export default {
    components: { BreadcrumbsView},
    data: () => ({
      check_roles: store.getters.user,
      valid: true,
      loading: true,
      dialogCreate: false,
      dataReplyMessage: [],
      CheckmessageOther: false,
      date : moment().format('YYYY-MM-DD HH:mm:ss'),
      maxLengthTwoHundred: 200,
      id: null,
      status: false,
      messageDetail: '',
      checkRemove: false,
      messageDetailRules: [
          v => !!v || 'กรุณากรอกข้อมูล',
          v => (v && v.length <= 200) || 'กรอกรายละเอียดห้ามเกิน 200 ตัวอักษร',
      ],
      dialogDelete: false,
      item: [
        {
          text: 'ตั้งค่า',
          disabled: false,
          href: '/backoffice/manage',
        },
        {
          text: 'ข้อความตอบกลับผู้ใช้งาน',
          disabled: true,
          href: 'breadcrumbs_link_1',
        },  
      ],
      headers: [
        { text: 'วันที่จัดทำ', value: 'create_date', align: 'center'},
        { text: 'รายการ', value: 'message_detail' },
        { text: 'สถานะการใช้งาน', value: 'status' },
        { text: '', value: 'actions', align: 'center', sortable: false },
      ],

      desserts: [],
      titleReplyMessage: -1,
      editedItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
      defaultItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
    }),
    async mounted(){
      this.getReplyMessage();
    },
    computed: {
      formTitle () {
        return this.titleReplyMessage === -1 ? 'สร้างรายการ' : 'แก้ไขรายการ'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    created () {
      this.initialize()
    },

    methods: {
      checkRulesLength(valueLength, maxLength){
        if(valueLength === maxLength){
            Swal.fire(`กรอกได้ไม่เกิน ${maxLength} ตัวอักษร`)
        }
      },
      getThaiDate(value){
      if (value){
        var d = new Date(value);
        return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
      }else{
        return "";
      }            
      },
      async getReplyMessage(){
      let path                = await `/api/backoffice/get/replyMessage`
      let response            = await axios.get(`${path}`) 
      this.dataReplyMessage   = await response.data.data

      this.loading = await false

      },
      async editReplyMessage(value){
        this.dialogCreate       = await true;
        this.titleReplyMessage  = await 0;
        this.id                 = await value.id;
        this.messageDetail      = await value.message_detail;
        this.CheckmessageOther  = await value.message_detail_other;
        // this.messageStatus      = await value.status;
        // this.checkRemove        = await value.check_remove;
        // console.log(this.messageStatus);
      },
      async saveReplyMessage(){
        if(this.$refs.formReplyMessage.validate()){
          try {
              let fd = await {}

              let path = await null

              if(this.titleReplyMessage === -1){
                fd = await {
                  "message_detail"          : this.messageDetail,
                  "message_detail_other"    : this.CheckmessageOther,
                  "status"                  : true,
                  "check_remove"            : this.checkRemove,
                  "create_by"               : this.check_roles.id,
                  "create_date"             : this.date,
                  "modified_by"             : this.check_roles.id,
                  "modified_date"           : this.date,
                }
                console.log(fd);
                path        = await `/api/backoffice/create/replyMessage`
              }else{
                fd = await {
                  "id"                      : this.id,
                  "message_detail"          : this.messageDetail,
                  "message_detail_other"    : this.CheckmessageOther,
                  "modified_by"             : this.check_roles.id,

                }
                path        = await `/api/backoffice/edit/replyMessage`
              }
           
              let response    = await axios.post(`${path}`, fd)
              console.log(response);
              await Swal.fire({
              icon: 'success',
              title: 'บันทึกสำเร็จ',
              text: 'ระบบได้ทำการบันทึกข้อมูลของคุณแล้ว'

              }).then( function(){});

              await this.closeDailogCreate()
              await this.getReplyMessage()


            } catch (error) {
              console.log('saveReplyMessage', error);
          }
        }
      },

      async toggleStatus(v){

      console.log(v);
      Swal.fire({
      title: 'คำเตือน',
      text: "คุณต้องการเปลี่ยนสถานะรายการใช่หรือไม่ ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก',
      }).then(async (result) => {
          if (result.isConfirmed) {
              const payload = { 
                  id                 : v.id,
                  admin_id           : this.check_roles.id,
                  status             : v.status ? true : false
              }
              console.log(payload);
              let path      = `/api/backoffice/update/replyMessageStatus`
              let response = await axios.post(`${path}`, payload)
              console.log(response);

              if(payload){
                  Swal.fire({
                      icon: 'success',
                      text: 'บันทึกข้อมูลเรีบร้อยเเล้ว',
                  })


                  await this.getReplyMessage()

              }else{
                  Swal.fire({
                      icon: 'error',
                      title: 'บันทึกไม่สำเร็จ',
                      text: 'มีข้อผิดพลาดที่ไม่คาดคิดเกิดขึ้น โปรดลองใหม่อีกครั้ง'
                  })
              }    
          } else if (result.dismiss === Swal.DismissReason.cancel) {
          v.status == true ? v.status = false : v.status = true
          }
      }) 
      },


      async removeReplyMessage(v){
        try {
          await Swal.fire({
              title: 'คำเตือน',
              text: "คุณต้องการลบรายการข้อความตอบกลับผู้ใช้งานใช่หรือไม่ ?",
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
    
                      let path =  await `/api/backoffice/update/deleteReplyMessage`
                      let response = await axios.post(`${path}`, payload)
                      
                      if(response){
                          await Swal.fire({
                              icon: 'success',
                              text: 'ลบข้อมูลสำเร็จ',
                          })
                        
                      } 
                      await this.getReplyMessage()
                  }
              })
    
        } catch (error) {
          await Swal.fire({
            icon: 'error',
            title: 'บันทึกไม่สำเร็จ',
            text: 'มีข้อผิดพลาดที่ไม่คาดคิดเกิดขึ้น โปรดลองใหม่อีกครั้ง'
          })
          console.log('removeReplyMessage',error);
        }
      },

      closeDailogCreate () {
        this.dialogCreate = false
        this.titleReplyMessage = -1
        this.messageDetail = ''
        this.CheckmessageOther = false
        this.$refs.formReplyMessage.resetValidation()
      },

      initialize () {
        this.desserts = [
          {
            name: 'Frozen Yogurt',
            calories: 159,
            fat: 6.0,
            carbs: 24,
            protein: 4.0,
          },
          {
            name: 'Ice cream sandwich',
            calories: 237,
            fat: 9.0,
            carbs: 37,
            protein: 4.3,
          },
          {
            name: 'Eclair',
            calories: 262,
            fat: 16.0,
            carbs: 23,
            protein: 6.0,
          },
          {
            name: 'Cupcake',
            calories: 305,
            fat: 3.7,
            carbs: 67,
            protein: 4.3,
          },
          {
            name: 'Gingerbread',
            calories: 356,
            fat: 16.0,
            carbs: 49,
            protein: 3.9,
          },
          {
            name: 'Jelly bean',
            calories: 375,
            fat: 0.0,
            carbs: 94,
            protein: 0.0,
          },
          {
            name: 'Lollipop',
            calories: 392,
            fat: 0.2,
            carbs: 98,
            protein: 0,
          },
          {
            name: 'Honeycomb',
            calories: 408,
            fat: 3.2,
            carbs: 87,
            protein: 6.5,
          },
          {
            name: 'Donut',
            calories: 452,
            fat: 25.0,
            carbs: 51,
            protein: 4.9,
          },
          {
            name: 'KitKat',
            calories: 518,
            fat: 26.0,
            carbs: 65,
            protein: 7,
          },
        ]
      },

      editItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        this.desserts.splice(this.editedIndex, 1)
        this.closeDelete()
      },

     

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.desserts[this.editedIndex], this.editedItem)
        } else {
          this.desserts.push(this.editedItem)
        }
        this.close()
      },
    },
  }
</script>
<style>
    .box-card {
      background-color: #fff;
      padding: 20px;

      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
   
</style>
