<template>
  <div class="complain-detail"> 
    <loaderView ref="loader"/>

    <BreadcrumbsView :items="item"/>
    <v-card class="mb-3">
      <DetailComplain ref="data" @updateValue="getValue"  />
    
    </v-card>

    <v-expansion-panels v-model="panel" multiple>

      <v-expansion-panel>

        <v-expansion-panel-header>ขั้นตอนการเเก้ปัญหา</v-expansion-panel-header>
        
        <v-expansion-panel-content>
          <v-data-table
            :headers="headers"
            :items="dataComaplinStep"
            class="elevation-1"
          >
          
            <template v-slot:[`item.name`]="{ item }">
              {{ item.name + ' ' +item.lastname }}
            </template>
            <template v-slot:[`item.date`]="{ item }">
              {{ formattedDate(item.date) == 'Invalid date' ? '' : formattedDate(item.date) }}
            </template>

            <template v-slot:[`item.division`]="{ item }">
                  <div class="overflow" >{{ item.division }}</div>
            </template>
           

            <template v-slot:[`item.detail`]="{ item }">
                  <div class="overflow" >{{ item.detail }}</div>
            </template>
           
            <template v-slot:[`item.status_call`]="{ item }">
              <v-chip
              :color="getColor(item.status_call)"
              dark
              >
              {{ getstatus(item.status_call) }}
              </v-chip>
            </template>

            <template   v-slot:[`item.detailComplainStep`]="{ item }"  >
             <div v-if="item.status_call != 0">
             
              <v-btn color="#003366" small icon @click="DetailComplainStep(item)">
                <i class="f-16 fa-solid fa-magnifying-glass"></i>
              </v-btn>
             </div>
            </template>

            <template v-slot:[`item.editCorrupt`]="{ item }">
              <div v-if="item.check_corrupt == 1">
                <v-btn  color="#003366" icon small @click="editCorrupt(item)">
                  <i class="f-16 fa-solid fa-pen-to-square"></i>
                </v-btn>
              </div> 
            </template>

          </v-data-table>
        </v-expansion-panel-content>

      </v-expansion-panel>

      <v-btn v-if="dataComplain.status_call !== 2 " depressed color="primary" class="mt-3" @click="dialogStatusComplainStep = true">สถานะการดำเนินงานของเจ้าหน้าที่ </v-btn>

    </v-expansion-panels>

    <!-- สถานะการดำเนินงานของเจ้าหน้าที่ -->
    <v-dialog v-if="dialogStatusComplainStep"
      v-model="dialogStatusComplainStep"
      persistent
      max-width="900px"
    >
      <v-card>
        <v-toolbar color="#167dc2" dark>
          <v-toolbar-title>{{formTitleComplain}}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container fluid>

            <v-form v-if="editComplainStep === -1"
              ref="form"
              v-model="valid"
              lazy-validation
            >
              <v-row>
                <v-col cols md="3">
                  <v-subheader><p class="style-label"><span>*</span>รายละเอียดข้อมูล</p></v-subheader>
                </v-col>
                <v-col cols md="9">
                  <v-textarea
                    outlined
                    hide-details="auto"
                    single-line
                    name="input-7-4"
                    v-model="vComplainStep.status_detail"
                    :rules="detailRules"
                    :maxlength="maxLengthFiveHundredTwelve"
                    @input="checkRulesLength(vComplainStep.status_detail.length, maxLengthFiveHundredTwelve)"
                  ></v-textarea>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols md="3">
                  <v-subheader><p class="style-label">ไฟล์เเนบ</p></v-subheader>
                </v-col>
                <v-col cols md="9">
                  <InputFiles  ref="status_files" :file="vComplainStepFiles"/>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols md="3">
                  <!-- <v-subheader>สถานะการดำเนินงาน</v-subheader> -->
                  <v-subheader><p class="style-label"><span>*</span>สถานะการดำเนินงาน</p></v-subheader>
                </v-col>
                <v-col cols md="9">
                  <v-select
                    v-model="vComplainStep.status_call"
                    :items="selectStatus"
                    :rules="[v => !!v || 'กรุณากรอกข้อมูล']"
                    label="สถานะการดำเนินงาน"
                    item-text="value"
                    item-value="id"
                    required
                    dense
                    outlined
                    single-line
                    hide-details="auto" 
                    return-object
                    @change="showDetailStatus(vComplainStep.status_call)"
                  ></v-select>
                </v-col>
              </v-row>            
              <v-row v-if="showStatusComplainStep" class="align-center">
                <v-col cols md="3">
                  <v-subheader>ประเภทการร้องเรียน</v-subheader>
                </v-col>
                <v-col cols md="9">
                  <v-radio-group
                    v-model="vComplainStep.check_corrupt"
                    row
                  >
                    <v-radio
                      label="กรณีอื่นๆ"
                      :value=false
                      @click="vComplainStep.check_corrupt = false"
                    ></v-radio>
                    <v-radio
                      label="กรณีทุจริต"
                      :value=true
                      @click="vComplainStep.check_corrupt = true"
                    ></v-radio>
                  </v-radio-group>
                </v-col>
  
              </v-row>
            </v-form>

            <div v-else>
                <!--ไม่รับเรื่อง -->
              <div v-if="vComplainStep.status_call === 2">
                <v-row>
                  <v-col cols="4">
                    <v-skeleton-loader
                      :loading="loading"
                      type="list-item"
                    >
                      <v-subheader>ข้อความตอบกลับผู้ใช้งาน</v-subheader>
                    </v-skeleton-loader>
                  </v-col>

                  <v-col cols="8">
                    <v-skeleton-loader
                      :loading="loading"
                      height="80"
                      type="image"
                    >
                    <v-textarea
                        v-model="vComplainStep.cancel_message_name"
                        solo
                        readonly
                        hide-details="auto"
                        class="input-gray"
                        height="80"
                      ></v-textarea>
                    </v-skeleton-loader>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="4">
                    <v-skeleton-loader
                      :loading="loading"
                      type="list-item"
                    >
                      <v-subheader>กรุณาติดต่อช่องทาง</v-subheader>
                    </v-skeleton-loader>
                  </v-col>

                  <v-col cols="8">
                    <v-skeleton-loader
                      :loading="loading"
                      height="80"
                      type="image"
                    >
                      <v-textarea
                        v-model="vComplainStep.cancel_contact_name"
                        solo
                        readonly
                        hide-details="auto"
                        class="input-gray"
                        height="80"
                      ></v-textarea>
                    </v-skeleton-loader>
                  </v-col>
                </v-row>

                <v-row class="align-center">
                  <v-col cols="4">
                    <v-skeleton-loader
                      :loading="loading"
                      type="list-item"
                    >
                      <v-subheader>ข้อความอื่นๆ</v-subheader>
                    </v-skeleton-loader> 
                  </v-col>

                  <v-col cols="8">
                    <v-skeleton-loader
                      :loading="loading"
                      height="150"
                      type="image"
                    >
                      <v-textarea
                        v-model="vComplainStep.cancel_message_other"
                        solo
                        readonly
                        hide-details="auto"
                        class="input-gray"
                      ></v-textarea>
                    </v-skeleton-loader>
                  </v-col>
                </v-row>
              </div>

               <!-- รับเรื่อง -->
              <div v-if="vComplainStep.status_call === 1">
                
                <v-row>
                  <v-col cols="4">
                    <v-skeleton-loader
                      :loading="loading"
                      type="list-item"
                    >
                      <v-subheader>รายละเอียดปัญหา/สาเหตุ</v-subheader>
                    </v-skeleton-loader> 
                  </v-col>
                  <v-col cols="8">
                    <v-skeleton-loader
                      :loading="loading"
                      height="150"
                      type="image"
                    >
                      <v-textarea
                        v-model="vComplainStep.detail"
                        solo
                        readonly
                        hide-details="auto"
                        class="input-gray"
                      ></v-textarea>
                    </v-skeleton-loader>
                  </v-col>
                </v-row>

              </div>

              <!-- รายละเอียดสถานะการดำเนินงานของเจ้าหน้าที่ -->
              <div v-if="vComplainStep.status_call === 3 || vComplainStep.status_call === 4 || vComplainStep.status_call === 5">
                
                <v-row>
                  <v-col cols md="4">
                    <v-skeleton-loader
                      :loading="loading"
                      type="list-item"
                    >
                      <v-subheader>รายละเอียดข้อมูล</v-subheader>
                    </v-skeleton-loader>
                  </v-col>
                  <v-col cols md="8">
                    <v-skeleton-loader
                      :loading="loading"
                      height="150"
                      type="image"
                    >
                      <v-textarea
                        filled
                        readonly
                        hide-details="auto"
                        single-line
                        name="input-7-4"
                        v-model="vComplainStep.detail"
                      ></v-textarea>
                    </v-skeleton-loader>
                  </v-col>
                </v-row>
    
                <v-row>
                  <v-col cols md="4">
                    <v-skeleton-loader
                      :loading="loading"
                      type="list-item"
                    >
                      <v-subheader>ไฟล์เเนบ</v-subheader>
                    </v-skeleton-loader>
                  </v-col>
                  <v-col cols md="8">
                    <v-skeleton-loader
                      :loading="loading"
                      type="chip"
                    >
                    <div class="text-left mt-3">
                      <v-chip class="mr-1 mb-1" 
                        v-for="(vComplainStepFile,index) in vComplainStepFiles" :key="index"
                        @click="showFile(vComplainStepFile, 'UrlFilesComplainStep')"
                      >
                      <i v-if="vComplainStepFile.file_type == 'application/pdf'" class="fa-solid fa-file pr-2"></i>
                      <i v-else class="fa-solid fa-image pr-2"></i>
                      {{vComplainStepFile.file_original}}
                    </v-chip>
                    </div>
                  </v-skeleton-loader>
                  </v-col>
                </v-row>
    
                <v-row>
                  <v-col cols md="4">
                    <v-skeleton-loader
                      :loading="loading"
                      type="list-item"
                    >
                      <v-subheader>สถานะการดำเนินงาน</v-subheader>
                    </v-skeleton-loader>
                  </v-col>
                
                  <v-col cols md="8">
                    <v-skeleton-loader
                      :loading="loading"
                      height="40"
                      type="image"
                    >
                      <v-select
                        filled
                        readonly
                        v-model="vComplainStep.status_call"
                        dense
                        single-line
                        hide-details="auto" 
                      ></v-select>
                    </v-skeleton-loader>
                  </v-col>
                </v-row>
                
                <!-- สถานะเรื่องเสร็จ -->
                <v-row class="align-center" v-if="vComplainStep.status_call == 5">
                  <v-col cols md="4">
                    <v-skeleton-loader
                      :loading="loading"
                      type="list-item"
                    >
                      <v-subheader>ประเภทการร้องเรียน</v-subheader>
                    </v-skeleton-loader>
                  </v-col>
                  <v-col cols md="8">
                    <v-skeleton-loader
                      :loading="loading"
                      type="list-item"
                    >
                      <v-radio-group
                        v-model="vComplainStep.check_corrupt"
                        row
                        disabled
                        :rules="[v => !!v || 'Item is required']" required
                      >
                        <v-radio
                          label="กรณีอื่นๆ"
                          :value=false
                        ></v-radio>
                        <v-radio
                          label="กรณีทุจริต"
                          :value=true
                        ></v-radio>
                      </v-radio-group>
                    </v-skeleton-loader>
                  </v-col>
                </v-row>

              </div>

            </div>

            <v-card-actions class="px-0 py-0">
              <v-spacer></v-spacer>
              <div class="mt-4" v-if="editComplainStep === -1">
                <v-btn
                  class="btn btn-submit mr-2"
                  text
                  @click="saveStatusComplainStep"
                >
                  บันทึก
                </v-btn>
                <v-btn
                  class="btn btn-cancel"
                  text
                  @click="closeStatusComplainStep"
                >
                  ยกเลิก
                </v-btn>
              </div>

              <div class="mt-4" v-else>
                <v-skeleton-loader
                  :loading="loading"
                  type="button"
                >
                  <v-btn
                    class="btn btn-submit"
                    text
                    @click="backComplainStep"
                  >
                    ย้อนกลับ
                  </v-btn>
                </v-skeleton-loader>
              </div>
            </v-card-actions>

          </v-container>
        </v-card-text>
      </v-card>
    
    </v-dialog>

    <!-- กรณีทุจริต -->
    <v-dialog v-if="dialogComplainCorrupt"
      v-model="dialogComplainCorrupt"
      persistent
      max-width="700px"
    >
      
      <v-card>
        <v-toolbar color="#167dc2" dark>
          <v-toolbar-title>{{formTitleCorrupt}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn v-if="checkSubmit" icon dark @click="closeComplainCorrupt">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>

            <v-overlay v-if="loading"
              :loading="loading"
              class="align-center justify-center"
            >
              <v-progress-circular
                color="primary"
                indeterminate
                size="64"
              ></v-progress-circular>
            </v-overlay>

            <v-form v-else
              ref="formCorrupt"
              v-model="valid"
              lazy-validation
            >
              <div class="box-corrupt-file">

                <div class="mt-4">
                  <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    :return-value.sync="vCorruptDate"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <p class="style-label"><span>*</span>วันที่</p>
                      <v-text-field
                        v-model="CorruptNewDate"
                        hide-details="auto"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        outlined
                        dense
                      ></v-text-field>
                    </template>
                  
                    <v-date-picker
                      v-model="vCorruptDate"
                      :rules="dateValidationRule"
                      no-title
                      scrollable
                    >
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        color="primary"
                        @click="menu = false"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.menu.save(vCorruptDate)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </div>

                <div class="mt-4">
                  <v-skeleton-loader
                    :loading="loading"
                    height="155"
                    type="image"
                  >
                    <p class="style-label"><span>*</span>รายละเอียดการทุจริต</p>
                    <v-textarea
                      v-model="vCorruptDetail"
                      :rules="detailRules"
                      hide-details="auto"
                      outlined
                      :maxlength="maxLengthFiveHundredTwelve"
                      @input="checkRulesLength(vCorruptDetail.length, maxLengthFiveHundredTwelve)"

                    ></v-textarea>
                  </v-skeleton-loader>
                </div>

                <v-list class="mt-4" v-if="corruptFiles.length > 0" subheader>
                  <v-subheader class="h-25 px-0">รายการเอกสาร</v-subheader>
                  <v-list-item class="px-0"
                    v-for="(corruptFile,index) in corruptFiles" 
                    :key="index"
                  >
                  <!-- <pre>    {{ corruptFiles}}</pre> -->
              
                      <v-list-item-content class="text-left" v-if="!corruptFile.check_remove">
                        <div class="icon-corrupt d-flex align-center">
                          <span>  {{ corruptFile.reference_code }}</span>
                          <div v-if="!corruptFile.check_remove_file" @click="showFile(corruptFile, 'UrlFilesCorrupt')">
                            <i v-if="corruptFile.file_type == 'application/pdf'" class="fa-solid fa-file pl-2"></i>
                            <i v-else class="fa-solid fa-image pl-2"></i>
                          </div>
                         

                        </div>
                      </v-list-item-content>
                    
                      <div v-if="!corruptFile.check_remove" class="d-flex justify-center align-center">
                          <div class="btn-corrupt-edit mr-2" @click="dialogEditCorruptFile(corruptFile)">แก้ไข  <i class="fa-solid fa-pen-to-square"></i></div>
                        
                        <div class="btn-corrupt-remove" @click="removeCorrupt(corruptFile)">ลบ <i class="fa-solid fa-trash"></i></div>
                      </div>
                  </v-list-item>
                </v-list>
              </div>

            </v-form>

            <v-card-actions v-if="!loading" class="px-0 py-0 mt-4">
              <div class="text-right">
                <v-btn class="btn btn-add" @click="createDialogCorruptFile">เพิ่มรายการเอกสาร</v-btn>
              </div>
              <v-spacer></v-spacer>
              <div v-if="!checkSubmit">
                <v-btn
                  class="btn btn-submit mr-2"
                  text
                  @click="updateComplainCorrupt"
                >
                  บันทึก
                </v-btn>
                <v-btn
                  class="btn btn-cancel"
                  text
                  @click="closeComplainCorrupt"
                >
                  ยกเลิก
                </v-btn>
              </div>
            </v-card-actions>

          <!-- </v-container> -->
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- ไฟล์การทุจริต -->
    <v-dialog v-if="dialogCorruptFile"
      v-model="dialogCorruptFile"
      persistent
      max-width="500px"
    >
      <v-card>
        <v-toolbar color="#167dc2" dark>
          <v-toolbar-title>{{formTitleCorruptFile}}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form
            ref="formCorruptFile"
            v-model="valid"
            lazy-validation
          >
            <div class="mt-4"> 
              <v-skeleton-loader
                :loading="loading"
                height="45"
                type="image"
              >
                <p class="style-label"><span>*</span>เลขที่หนังสือ</p>
                <v-text-field
                  v-model="vCorruptReferenceCode"
                  :rules="corruptRefRules"
                  hide-details="auto"
                  outlined
                  dense
                  :maxlength="maxLengthFifty"
                  @input="checkRulesLength(vCorruptReferenceCode.length, maxLengthFifty)"
                ></v-text-field>
              </v-skeleton-loader> 
            </div>  
            <div class="mt-4">  
              <p class="style-label"><span>*</span>ไฟล์เเนบ</p>

              <div 
               v-if="!dataCorruptFile.check_remove_file && dataCorruptFile.id && !checkRemoveFile"
                class="text-left  display-flex align-center"
              > 
                <v-chip class="mr-1"      
                
                  @click="showFile(dataCorruptFile, 'UrlFilesCorrupt')"
                  >
                  <i v-if="dataCorruptFile.file_type == 'application/pdf'" class="fa-solid fa-file pr-2"></i>
                  <i v-else class="fa-solid fa-image pr-2"></i>
                  {{dataCorruptFile.file_original}}
                </v-chip>
                <v-btn density="compact" icon @click="removeCorruptFile(dataCorruptFile)">
                  <i class="fa-solid fa-trash icon-trash"></i>
                </v-btn>
                

              </div>
             
              <div v-else>
                <v-file-input 
                  v-model="vCorruptFile"
                  :accept="acceptTypes"
                  :rules="fileRules"
                  show-size
                  outlined
                  dense
                  label="ไฟล์เเนบ"
                  hide-details="auto"
                ></v-file-input>
              </div>
        
            </div>

          </v-form>
          <v-card-actions class="px-0 py-0 mt-4">
      
            <v-spacer></v-spacer>
            <v-skeleton-loader
              :loading="loading"
              type="actions"
            >
              <v-btn
                class="btn btn-submit mr-2"
                text
                @click="saveCorruptFile"
              >
                บันทึก
              </v-btn>
              <v-btn
                class="btn btn-cancel"
                text
                @click="closeCorruptFile"
              >
                ปิด
              </v-btn>
            </v-skeleton-loader>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>

     <!-- โชว์รูป  -->
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
import moment  from 'moment-timezone'
import Swal from 'sweetalert2';
import store from '../../../store/index.js';
import loaderView from '@/components/loaderView.vue';
import BreadcrumbsView from '@/components/breadcrumbsView.vue';
import DetailComplain from '@/components/detailComplain.vue';
import InputFiles from '@/components/inputFiles.vue';


export default {
  components: { loaderView, BreadcrumbsView, DetailComplain, InputFiles},
  data: () => ({
    check_roles: store.getters.user,
    item: [
      {
        text: 'รายการที่ต้องดำเนินการ',
        disabled: false,
        href: '/backoffice/follow',
      },
      {
        text: 'รายละเอียดปัญหา',
        disabled: true,
        href: 'breadcrumbs_link_1',
      },  
    ],
    panel: [0, 1],
    headers: [
      {
        text: 'วันที่',
        align: 'center',
        sortable: false,
        value: 'date',
      },
      { text: 'หน่วยงาน', value: 'division' },
      { text: 'รายละเอียด', value: 'detail' },
      { text: 'สถานะ', value: 'status_call' },
      { text: 'รายละเอียดสถานะการดำเนินงานของเจ้าหน้าที่', value: 'detailComplainStep', align: 'center' },
      { text: 'แก้ไขรายการทุจริต', value: 'editCorrupt', align: 'center' },
    ],
    loading : false,
    valid: true,
    url: '',
    opacity: 1,
    absolute: false,
    overlayImg: false,
    dataComplain: {},
    dataRegister: {},

    complainStepId : null,
    editComplainStep: -1,
    editComplainCorrupt: -1,
    editCorruptFile: -1,
    dataComaplinStep: [],
    showStatusComplainStep : false,
    dialogStatusComplainStep : false,
    dialogComplainCorrupt: false,
    dialogCorruptFile: false,

    vComplainStep: {},
    vComplainStepFiles: {},
    menu: false,
    corruptNewDate : null,
    corruptId : null,
    vCorruptDate: new Date().toISOString().substr(0, 10),
    vCorruptDetail: '',
    checkSubmit: false,

    corruptFileId : null,
    vCorruptReferenceCode: '',
    vCorruptFile: null,
    dataCorruptFile: {},
    corruptFiles: {},
    checkRemoveFile : false,
    acceptTypes: "image/*, application/pdf",

    maxLengthFifty: 50,
    maxLengthFiveHundredTwelve: 512,

    detailRules: [v => !!v || 'กรุณากรอกข้อมูล'],
    corruptRefRules : [v => !!v || 'กรุณากรอกข้อมูล / หากไม่ทราบให้กรอกคำว่า -'],
    // checkCorruptRules: [v =>  v.length > 0 || '"At least one item should be selected"'],
    fileRules: [
      value => {
        if (!value || value.length === 0) {
            return "กรุณาอัพโหลดไฟล์";
        }

        const maxFileSize = 10 * 1024 * 1024; // 2MB in bytes
        for (let i = 0; i < value.length; i++) {
            if (value[i].size > maxFileSize) {
                return 'อัพโหลดไฟล์ขนาดไม่เกิน 10 mb';
            }else{
                return true;
            }
        }
          
        const allowedTypes = ["image/png", "image/jpeg", "image/gif", "application/pdf"];
        if (!allowedTypes.includes(value.type)) {
            return "ประเภทไฟล์ที่อัพโหลดไม่ถูกต้อง";
            }
        // for (let i = 0; i < value.length; i++) {
        //     const file = value[i];
        //     console.log(file);
        //     if (!allowedTypes.includes(file.type)) {
        //     return "ประเภทไฟล์ที่อัพโหลดไม่ถูกต้อง";
        //     }
        // }
        return true;
      }
    ],
    dateValidationRule: [
      v => !!v || 'Date is required',
    ],
    selectStatus: [
      { value: 'อยู่ระหว่างดำเนินการ', id: 3 },
      { value: 'สอบถามข้อมูลเพิ่มเติม', id: 4 },
      { value: 'เรื่องเสร็จ', id: 5 },
    ],
    
    
  }),
  mounted() {
    this.getComplainStep()
    this.getEndThaiDate()

   
  
  },
  watch: {
    vCorruptDate(){
        this.getEndThaiDate()
    },
  },
  computed: {
    formTitleComplain () {
      return this.editComplainStep === -1 ? 'สถานะการดำเนินงานของเจ้าหน้าที่' : 'รายละเอียดสถานะการดำเนินงานของเจ้าหน้าที่'
    },
    formTitleCorrupt(){
      return this.editComplainCorrupt === -1 ? 'เพิ่มรายละเอียดการทุจริต' : 'รายการเอกสารเพิ่มเติม'
    },
    formTitleCorruptFile(){
      return this.editCorruptFile === -1 ? 'เพิ่มรายการเอกสาร' : 'แก้ไขรายการเอกสาร'
    },
  },
 
  methods: {
    fetchData() {
      this.loading = true; 
      setTimeout(() => {
        this.loading = false; // Hide the loader
      }, 1000);

    },
    formattedDate(create_date) {
      return moment(create_date).add(543, 'year').utcOffset("+00:00").format("DD/MM/YYYY");
    },
    getColor (status_call) {
      if (status_call == 0) return '#a19d9d'
      else if (status_call == 1) return '#FFA000'
      else if (status_call == 2) return '#EF6C00'
      else if (status_call == 3) return '#01579B'
      else if (status_call == 4) return '#512DA8'
      else if (status_call == 5) return 'green'
      else return 'green'
    },
    getstatus (status_call) {
      if (status_call == 0) return 'รอรับเรื่อง'
      else if (status_call == 1) return 'รับเรื่อง'
      else if (status_call == 2) return 'ไม่รับเรื่อง'
      else if (status_call == 3) return 'อยู่ระหว่างดำเนินการ'
      else if (status_call == 4) return 'สอบถามข้อมูลเพิ่มเติม'
      else if (status_call == 5) return 'เรื่องเสร็จ'
      else return ''
    },
    getEndThaiDate(){
      if (this.vCorruptDate){
        var d = new Date(this.vCorruptDate);
        this.CorruptNewDate = d.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
      }
    },
    showDetailStatus(v){
      console.log(v);
      if(v.id != 5){
        this.showStatusComplainStep = false
      }else{
        this.showStatusComplainStep = true
      }   
    },
    showFile(v, urlFiles){

      if(v.file_type == 'application/pdf'){
        this.urlPdfFiles(urlFiles, v.file_name)
      }else{
        this.urlFiles(urlFiles, v.file_name)
      }
    },
    checkRulesLength(valueLength, maxLength){
      if(valueLength === maxLength){
          Swal.fire(`กรอกได้ไม่เกิน ${maxLength} ตัวอักษร`)
      }
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
    

    // Complain Step
    async DetailComplainStep(v){
      await this.fetchData();
      this.editComplainStep             = await 0
      this.dialogStatusComplainStep     = await true
      this.vComplainStep                = await v
      this.vComplainStep.check_corrupt  = await v.check_corrupt == 1 ? true : false
      await this.getComplainStepFiles(v)
    

    },
    async backComplainStep(){
      this.dialogStatusComplainStep = await false,
      this.vComplainStep            = await {},
      this.vComplainStepFiles       = await {}
      this.editComplainStep         = await -1
    },
    async getComplainStep(){
      let path                = await `/api/backoffice/get/complainStep`
      let response            = await axios.get(`${path}/`+ this.$route.params.id) 
      this.dataComaplinStep   = await response.data.data
      await setTimeout(() => (this.$refs.loader.overlay = false), 300);
    },
    async getComplainStepFiles(v){
      let path                = await `/api/backoffice/get/ComplainStepFiles`
      let response            = await axios.get(`${path}/`+ v.id)
      this.vComplainStepFiles = await response.data.data
    },
    async saveStatusComplainStep(){
      if(this.$refs.form.validate()){
     
        try {
          let fd = await {
            "complain_id"       : this.dataComplain.id,
            "admin_id"          : this.check_roles.id,
            "register_id"       : this.dataComplain.register_id,
            "register_email"    : this.dataRegister.email,
            "register_name"     : this.dataRegister.name,
            "detail"            : this.vComplainStep.status_detail,
            "status_call"       : this.vComplainStep.status_call.id,
            "status_name"       : this.vComplainStep.status_call.value,
            "check_corrupt"     : this.vComplainStep.check_corrupt === true ? true : false,
            "create_by"         : this.check_roles.id,
            "modified_by"       : this.check_roles.id,
          }

          
          let path        = await `/api/backoffice/create/complainStep`

          let response    = await axios.post(`${path}`, fd)

          this.complainStepId = await response.data.complain_step_id
            
          if(response){

            if(this.vComplainStep.check_corrupt === true){

              let responseCorrupt  =  await this.saveComplainCorrupt()

              this.corruptId      = await responseCorrupt.data.corrupt_id

              console.log(this.corruptId);

            }

            const formData = await new FormData();  

            await formData.append('id', this.complainStepId);
            
            await formData.append('types', 'ComplainStep');

            for (let i = 0; i < this.$refs.status_files.files.length; i++) {
             
              await formData.append('files', this.$refs.status_files.files[i]);
              
              let number = await i + 1

              let file = await this.$refs.status_files.files[i]

              const arr_file = await file.type.split("/")

              let file_name = await ''
              
              if(file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'){

                file_name = await 'imgComplainStep' +  this.complainStepId + '_' + number + '.' +arr_file[1] 

              }else if(file.type === 'application/pdf'){

                file_name = await 'pdfComplainStep' +  this.complainStepId + '_' + number + '.' +arr_file[1] 
              }

                let fd_upload = await {
                    "register_id"         : this.dataComplain.register_id,
                    "complain_step_id"    : this.complainStepId,
                    "file_original"       : file.name,
                    "file_name"           : file_name,
                    "file_type"           : file.type
                }
 
                let path_api = await `/api/backoffice/complainStepFiles`

                await axios.post(`${path_api}`, fd_upload )

                await this.getComplainStep()
            }

            if(this.$refs.status_files.files.length){
              await axios.post('/api/uploadsFile', formData)
            }

          }

          await Swal.fire({
              icon: 'success',
              title: 'บันทึกสำเร็จ',
              text: 'ระบบได้ทำการบันทึกข้อมูลของคุณแล้ว'
          }).then( function(){});

          if(this.vComplainStep.check_corrupt === true){
            this.dialogComplainCorrupt  = await true
            this.closeStatusComplainStep()

          }else{
            this.dialogStatusComplainStep = await false
            this.vComplainStep = await {}
            this.vComplainStepFiles = await {}
          }

          this.showStatusComplainStep = await false


          
        } catch (error) {
          Swal.fire({
              icon: 'error',
              title: 'บันทึกไม่สำเร็จ',
              text: 'มีข้อผิดพลาดที่ไม่คาดคิดเกิดขึ้น โปรดลองใหม่อีกครั้ง'
          })
            console.log('saveComplainStep',error);
        }
      } 
    },
    closeStatusComplainStep(){
      this.dialogStatusComplainStep =  false
      this.editComplainStep         = -1
      this.vComplainStep            = {}
      // this.$refs.form.reset()
      this.$refs.form.resetValidation()
    },


    // Complain Corrupt
    async saveComplainCorrupt(){

      let fd_corrupt = await {
        "admin_id"          : this.check_roles.id,
        "complain_step_id"  : this.complainStepId,
      }


      let path = await `/api/backoffice/create/complainCorrupt`

      let response    = await axios.post(`${path}`, fd_corrupt)

      return response;
    },
    async editCorrupt(v){

      await this.fetchData();
      this.dialogComplainCorrupt      =   await true
      this.editComplainCorrupt        =   await 0
      this.complainStepId             =   await v.id
      this.corruptId                  =   await v.corrupt_id;
      this.vCorruptDetail             =   await v.corrupt_detail
      this.vCorruptDate               =   await v.corrupt_date === null ? this.vCorruptDate : moment(v.corrupt_date).format("YYYY-MM-DD");
      await this.getCorruptFiles();
    },
    async updateComplainCorrupt(){
      if(this.$refs.formCorrupt.validate()){
        try {
          let fd_corrupt = await {
            "corrupt_id"        : this.corruptId,
            "admin_id"          : this.check_roles.id,
            "complain_step_id"  : this.complainStepId,
            "reference_code"    : this.vCorruptReferenceCode,
            "date"              : this.vCorruptDate,
            "detail"            : this.vCorruptDetail,
            "check_remove_file" : false
          }

          let path = await `/api/backoffice/edit/complainCorrupt`

          await axios.post(`${path}`, fd_corrupt)

          await Swal.fire({
              icon: 'success',
              title: 'บันทึกสำเร็จ',
              text: 'ระบบได้ทำการบันทึกข้อมูลของคุณแล้ว'
          }).then( function(){});

          await this.getComplainStep()

          if(this.editComplainCorrupt === -1){
            // this.dialogComplainCorrupt = await false
            this.checkSubmit = await true
          }

        } catch (error) {
          Swal.fire({
              icon: 'error',
              title: 'บันทึกไม่สำเร็จ',
              text: 'มีข้อผิดพลาดที่ไม่คาดคิดเกิดขึ้น โปรดลองใหม่อีกครั้ง'
          })
            console.log('updateComplainCorrupt',error);
        }
      }
    },
    async createDialogCorruptFile(){
      if(!this.checkSubmit && this.editComplainCorrupt === -1){
        Swal.fire(
          'กรุณากรอกข้อมูลรายละเอียดการทุจริต',
          'ก่อนการเพิ่มรายการเอกสาร',
          'question'
          
        )
      }else{
        this.dialogCorruptFile  = await true
      }
    },
    async removeCorrupt(v){
      try {
        await Swal.fire({
            title: 'คำเตือน',
            text: "คุณต้องการลบเอกสารเเละไฟล์เเนบใช่หรือไม่ ?",
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
  
                    let path =  await `/api/update/deleteCorrupt`
                    let response = await axios.post(`${path}`, payload)
                    
                    if(response){
                        await Swal.fire({
                            icon: 'success',
                            text: 'ลบข้อมูลสำเร็จ',
                        })
                       
                    } 
                    await this.getCorruptFiles(v.corrupt_id)
                }
            })
  
      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: 'บันทึกไม่สำเร็จ',
          text: 'มีข้อผิดพลาดที่ไม่คาดคิดเกิดขึ้น โปรดลองใหม่อีกครั้ง'
        })
        console.log('removeCorruptFile',error);
      }
    },
    closeComplainCorrupt(){
      this.dialogComplainCorrupt  = false
      this.editComplainCorrupt    = -1
      this.checkSubmit = false
      // this.disabled = false
      this.vCorruptDate = new Date().toISOString().substr(0, 10),
      this.vCorruptDetail = ''
      this.corruptFiles = {}
      // this.$refs.formCorrupt.reset()
      this.$refs.formCorrupt.resetValidation()
    },

    // Corrupt File
    async getCorruptFiles(){
      let path              = await `/api/backoffice/get/CorruptFiles`
      let response          = await axios.get(`${path}/`+ this.corruptId)
      this.corruptFiles     = await response.data.data
      console.log('===============',this.corruptFiles);
    },
    async saveCorruptFile(){
      if(this.$refs.formCorruptFile.validate()){
        try {


          const formData = await new FormData(); 

          let fileName = await ''

          if(this.vCorruptFile !== null){

            await formData.append('id', this.corruptFileId);

            await formData.append('types', 'Corrupt');

            await formData.append('files', this.vCorruptFile);
            
            const arrFile = await this.vCorruptFile.type.split("/")

            if(this.vCorruptFile.type === 'image/jpeg' || this.vCorruptFile.type === 'image/jpg' || this.vCorruptFile.type === 'image/png'){

              fileName = await 'imgCorrupt' + this.corruptFileId + '_1' + '.' + arrFile[1] 

            }else if(this.vCorruptFile.type === 'application/pdf'){

              fileName = await 'pdfCorrupt' + this.corruptFileId + '_1' + '.' + arrFile[1] 
            }

          }

          let fd_corrupt_file = await {
            "id"                  : this.corruptFileId,
            "corrupt_id"          : this.corruptId,
            "admin_id"            : this.check_roles.id,
            "reference_code"      : this.vCorruptReferenceCode,
            "file_original"       : this.vCorruptFile !== null ? this.vCorruptFile.name : this.dataCorruptFile.file_original ,
            "file_name"           : this.vCorruptFile !== null ? fileName : this.dataCorruptFile.file_name,
            "file_type"           : this.vCorruptFile !== null ? this.vCorruptFile.type : this.dataCorruptFile.file_type,
            "check_remove"        : false,
            "check_remove_file"   : false,
  
          }
        
          
          let path_api = null
          if(this.editCorruptFile > -1){
            path_api = await `/api/backoffice/edit/complainCorruptFiles`
          }else{
            path_api = await `/api/backoffice/create/complainCorruptFiles`
          }
          
  
          await axios.post(`${path_api}`, fd_corrupt_file )

          await this.getCorruptFiles();

          if(this.vCorruptFile){
            await axios.post('/api/uploadsFile', formData)

          }

          await Swal.fire({
              icon: 'success',
              title: 'บันทึกสำเร็จ',
              text: 'ระบบได้ทำการบันทึกข้อมูลของคุณแล้ว'
          }).then( function(){});
          await this.closeCorruptFile();
        

          
        } catch (error) {
          Swal.fire({
              icon: 'error',
              title: 'บันทึกไม่สำเร็จ',
              text: 'มีข้อผิดพลาดที่ไม่คาดคิดเกิดขึ้น โปรดลองใหม่อีกครั้ง'
          })
            console.log('saveCorruptFile',error);
        }
      }
    },
    async dialogEditCorruptFile(v){

      this.dialogCorruptFile        = await true
      this.editCorruptFile          = await 0
      this.corruptId                = await v.corrupt_id
      this.corruptFileId            = await v.id
      this.vCorruptReferenceCode    = await v.reference_code
      this.dataCorruptFile          = await v
      console.log(this.dataCorruptFile );
    },
    async removeCorruptFile (v) {
      try {
        await Swal.fire({
          title: 'คำเตือน',
          text: "คุณต้องการลบไฟล์เเนบใช่หรือไม่ ?",
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
                      check_remove_file : true,
                  }

                  let path =  await `/api/update/deleteCorruptFile`
                  let response = await axios.post(`${path}`, payload)
                  
                  if(response){
                      await Swal.fire({
                          icon: 'success',
                          text: 'ลบข้อมูลสำเร็จ',
                      })
                    
                  } 
                  await this.getCorruptFiles()
                  this.checkRemoveFile = await  true
              }
          })

      } catch (error) {
        await Swal.fire({
            icon: 'error',
            title: 'บันทึกไม่สำเร็จ',
            text: 'มีข้อผิดพลาดที่ไม่คาดคิดเกิดขึ้น โปรดลองใหม่อีกครั้ง'
        })
      }

    },
    async getValue(v) {
      this.dataComplain = await v.data
      this.dataRegister = await v.user
    },
    closeCorruptFile(){
      this.dialogCorruptFile        = false
      this.editCorruptFile          = -1
      this.dataCorruptFile          = {}
      this.vCorruptReferenceCode    = ''
      this.vCorruptFile             = null
      this.checkRemoveFile          = false
      this.$refs.formCorruptFile.resetValidation()
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

  .head-corrupt{
    background-color: #003366;
    border-bottom: 1px solid #ada3a3;
    color: white;
    font-size: 0.9375rem;
    padding: 8px 16px;
  }

  .v-overlay.style-bg{
  z-index: 300!important;
}
.v-overlay.style-bg img{
  width: 500px;
  height: 500px;
  object-fit: contain;
}

.btn-add{
  background: #003366!important;
  color: white!important;
}
.btn-corrupt-edit{
  border: 1px solid #167dc2;
  padding: 4px 12px;
  border-radius: 30px;
  background: #167dc2!important;
  color: white!important;
  cursor: pointer;
}
.btn-corrupt-remove{
  border: 1px solid #167dc2;
  padding: 4px 12px;
  border-radius: 30px;
  background: #167dc2!important;
  color: white!important;
  cursor: pointer;
}
.h-25{
  height: 25px;
}

.icon-trash{
  color: #167dc2;
  font-size: 16px;
}

 .icon-corrupt svg{
  font-size: 18px!important;
  cursor: pointer!important;
}

</style>