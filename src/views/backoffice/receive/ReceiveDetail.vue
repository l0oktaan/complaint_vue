<template>
  <div class="receive-detail">
      <loaderView ref="loader"/>
      <BreadcrumbsView :items="item"/>
      <v-card>
        <DetailComplain ref="data" @updateValue="getValue" />
      </v-card>
      <v-btn class="btn-submit mt-3 mr-2" color="deep-orange" @click="dialogShowCancel">ไม่รับเรื่อง</v-btn>

      <v-btn class="btn-submit mt-3" @click="dialog = true">รับเรื่อง</v-btn>

      <!-- รับเรื่อง -->
      <v-dialog
        v-model="dialog"
        persistent
        max-width="500"
      >
        <v-card class="dialog-receive">
          <v-form ref="form" validate-on="submit lazy" @submit.prevent="saveComplainStep">
            <v-toolbar color="#167dc2" dark>
              <v-toolbar-title>รับเรื่อง</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-subheader class="px-0">รายละเอียดปัญหา/สาเหตุ</v-subheader>
              <v-textarea
                outlined
                name="input-7-4"
                hide-details="auto"
                v-model="complain_detail"
                :maxlength="maxLengthFiveHundredTwelve"
                @input="checkRulesLength(complain_detail.length, maxLengthFiveHundredTwelve)"
              ></v-textarea>
            </v-card-text>
            <v-card-actions class="px-4 pb-5">
                <v-spacer></v-spacer>
                <v-btn class="btn-submit" type="submit">บันทึก</v-btn>
                <v-btn
                  class="btn-cancel"
                  text
                  @click="close"
                >
                  ยกเลิก
                </v-btn>
              </v-card-actions>
          </v-form>
       
        </v-card>
      </v-dialog>

      <!-- ไม่รับเรื่อง -->
      <v-dialog
        v-model="dialogCancel"
        persistent
        max-width="500"
      >
        <v-card class="dialog-receive">
        
          <v-form ref="form" validate-on="submit lazy" @submit.prevent="saveComplainStep">
            <v-toolbar color="#167dc2" dark>
              <v-toolbar-title>ไม่รับเรื่อง</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <p class="style-label"><span>*</span>ข้อความตอบกลับผู้ใช้งาน</p>
              <v-select
                v-model="selectCancel"
                :items="itemsCancel"
                :rules="[v => !!v || 'กรุณากรอกข้อมูล']"
                label="กรุณากรอกข้อมูล"
                item-text="value"
                item-value="id"
                required
                dense
                outlined
                single-line
                return-object
                @change="clickSelectCancel(selectCancel)"
              ></v-select>
              
              <p class="style-label"><span>*</span>กรุณาติดต่อช่องทาง</p>
              <v-select
                v-model="selectContact"
                :items="itemsContact"
                :rules="[v => !!v || 'กรุณากรอกข้อมูล']"
                label="กรุณากรอกข้อมูล"
                item-text="value"
                item-value="id"
                required
                dense
                outlined
                single-line
                return-object
              ></v-select>

              <div v-if="showSelectCancel">
                <p class="style-label"><span>*</span>ข้อความอื่นๆ</p>
                <v-textarea
                  v-model="otherCancel"
                  :rules="otherCancelRules"
                  outlined
                  name="input-7-4"
                  hide-details="auto"
                  :maxlength="maxLengthFiveHundredTwelve"
                  @input="checkRulesLength(otherCancel.length, maxLengthFiveHundredTwelve)"
                ></v-textarea>
              </div>
            </v-card-text>
            <v-card-actions class="px-4 pb-5">
                <v-spacer></v-spacer>
                <v-btn
                  class="btn-submit"
                  type="submit"

                >
                  บันทึก
                </v-btn>
                <v-btn
                  class="btn-cancel"
                  text
                  @click="closeCancel"
                >
                  ยกเลิก
                </v-btn>
                <v-btn
                  class="btn-submit"
                  text
                  @click="sendFile"

                >
                  send
                </v-btn>
              </v-card-actions>
              
          </v-form>
        
        </v-card>
      </v-dialog>
  </div>
</template>
<script>
import axios from "axios";
import Swal from 'sweetalert2';
import store from '../../../store/index.js';
import loaderView from '@/components/loaderView.vue';
import BreadcrumbsView from '@/components/breadcrumbsView.vue';
import DetailComplain from '@/components/detailComplain.vue';

  export default {
  components: {  BreadcrumbsView, DetailComplain, loaderView},
    data () {
      return {
        tab: null,
        dataComplain: {},
        dataRegister: {},
        files: {},
        complain_detail: '',
        cancel_complain_detail: '',
        dialog: false,
        dialogCancel: false,
        check_roles: store.getters.user,
        url: '',
        overlayImg: false,
        opacity: 1,
        absolute: false,
        loading: false,
        show: false,
        showSelectCancel: false,
        maxLengthFiveHundredTwelve: 512,
        item: [
          {
            text: 'รับปัญหา',
            disabled: false,
            href: '/backoffice/receive',
          },
          {
            text: 'รายละเอียดปัญหา',
            disabled: true,
            href: 'breadcrumbs_link_1',
          },
        ],
        otherCancel: '',
        selectCancel: null,
        itemsCancel: [],
        selectContact: null,
        itemsContact: [],
        CancelcomplainDetailRules: [
          v => !!v || 'กรุณากรอกข้อมูล',
          v => (v.length <= 512) || 'กรอกรายละเอียดห้ามเกิน 512 ตัวอักษร',
        ],
        otherCancelRules: [
          v => !!v || 'กรุณากรอกข้อมูล',
        ],
      }
    },

    methods: {
      dialogShowCancel(){
        this.dialogCancel = true;
        this.getSelectReplyMessage();
        this.getSelectContactChannels();
      },
      close(){
        this.dialog = false
        this.complain_detail = ''
      },
      closeCancel(){
        this.dialogCancel = false
        this.otherCancel = ''
        this.selectCancel = null
        this.selectContact = null
        // this.$refs.form.reset()
        this.$refs.form.resetValidation()
      },
      clickSelectCancel(v){
        if(!v.check){
          this.showSelectCancel = false
        }else{
          this.showSelectCancel = true
        }   
      },
      checkRulesLength(valueLength, maxLength){
          if(valueLength === maxLength){
              Swal.fire(`กรอกได้ไม่เกิน ${maxLength} ตัวอักษร`)
          }
      },
      async saveComplainStep(){
        if(this.$refs.form.validate()){
          try {

            let fd = await {
              "complain_id"           : this.dataComplain.id,
              "admin_id"              : this.check_roles.id,
              "register_id"           : this.dataComplain.register_id,
              "register_email"        : this.dataRegister.email,
              "register_name"         : this.dataRegister.name,
              "detail"                : this.complain_detail,
              "status_call"           : this.dialogCancel ? 2 : 1,
              "status_name"           : this.dialogCancel ? 'ไม่รับเรื่อง' : 'รับเรื่อง',
              "cancel_message_id"     : this.dialogCancel ? this.selectCancel.id : null,
              "cancel_message_name"   : this.dialogCancel ? this.selectCancel.value : '',
              "cancel_contact_id"     : this.dialogCancel ? this.selectContact.id : null,
              "cancel_contact_name"   : this.dialogCancel ? this.selectContact.value : '',
              "cancel_contact_url"    : this.dialogCancel ? this.selectContact.url : '',
              "cancel_message_other"  : this.dialogCancel ? this.otherCancel : '',
              "create_by"             : this.check_roles.id,
              "modified_by"           : this.check_roles.id,
            } 

          let path        = await `/api/backoffice/create/complainStep`
          await axios.post(`${path}`, fd)

          await Swal.fire({
              icon: 'success',
              title: 'บันทึกสำเร็จ',
              text: 'ระบบได้ทำการบันทึกข้อมูลของคุณแล้ว'
          }).then( function(){
          });

          await this.$router.push({name:"backoffice-follow"});

            this.dialog = await false
            this.dialogCancel = await false


          } catch (error) {
          Swal.fire({
              icon: 'error',
              title: 'บันทึกไม่สำเร็จ',
              text: 'มีข้อผิดพลาดที่ไม่คาดคิดเกิดขึ้น โปรดลองใหม่อีกครั้ง'
          })
            console.log(error);
          } 
        }
    
      },
      async getValue(v) {
        this.dataComplain = await v.data
        this.dataRegister = await v.user
        await setTimeout(() => (this.$refs.loader.overlay = false), 300);
      },

      async sendFile(){
        console.log('=========');
        let fd = await {
            "mail"           : "saraban@dbd.go.th",
            } 
        let path  = await `/api/backoffice/sendFile`
        await axios.post(`${path}`, fd)

        
      },

      async getSelectReplyMessage(){

        let path = await `/api/get/selectReplyMessage`
       
        let response = await axios.get(`${path}`)

        await response.data.data.forEach(async item => {
            await this.itemsCancel.push({'id':item.id, 'value':item.message_detail, 'check': item.message_detail_other})
        })
      },

      async getSelectContactChannels(){

        let path = await `/api/get/selectContactChannels`

        let response = await axios.get(`${path}`)

        await response.data.data.forEach(async item => {
            await this.itemsContact.push({'id':item.id, 'value':item.contact_name, 'url' : item.contact_link})
        })
      },
    }
  }
</script>

<style>
  .input-gray ::v-deep .v-input__slot{
      background: #ebe9e9!important;
  }
  .input-gray ::v-deep input{
      color: gray!important;
  }
  .style-tabs .v-tabs-slider-wrapper{
    color: rgb(255, 204, 102);
    height: 4px!important;
  }
  
  .v-overlay.style-bg{
    z-index: 300!important;
  }
  .v-overlay.style-bg img{
    width: 500px;
    height: 500px;
    object-fit: contain;
  }

</style>