<template>
    <div class="page-main">
      
        <div class="head-topic">
            <v-container>
                <v-row>
                    <span class="head-left">แบบฟอร์มลงทะเบียนเรื่องร้องเรียน</span>
                </v-row>
            </v-container>
        </div>
        <div class="section-main">
            <v-container class="mt-3">
                <span class="h1">ขั้นตอนการร้องเรียนเรื่องทุจริต</span>
                    <v-stepper v-model="e1" class="step">
                        <v-stepper-header class="stepper-header mt-3">
                                <v-stepper-step :complete="e1 > 1" step="1" >ข้อตกลงเเละเงื่อนไขการร้องเรียน</v-stepper-step>
                            <v-divider></v-divider>

                            <v-stepper-step :complete="e1 > 2" step="2">ข้อมูลผู้ร้องเรียน</v-stepper-step>

                            <v-divider></v-divider>

                            <v-stepper-step :complete="e1 > 3" step="3">ข้อมูลการร้องเรียน</v-stepper-step>

                            <!-- <v-divider></v-divider> -->

                            <!-- <v-stepper-step step="4" :complete="isOkay" >บันทึกรายการ</v-stepper-step> -->
                        </v-stepper-header>
                        <v-stepper-items>
                        
                            <v-stepper-content step="1">
                                <stepOne/>
                                <div class="text-center">
                                    <v-btn color="#003366" class="text-white" @click="checkStepOne">  ข้าพเจ้ายอมรับข้อตกลงและเงื่อนไข</v-btn>
                                </div>
                            </v-stepper-content>

                            <v-stepper-content step="2">
                                <v-form
                                    ref="formRegister"
                                    v-model="validOne"
                                    lazy-validation
                                >
                                    <StepTwo ref="user"/>

                                    <div class="text-right">
                                        <!-- <v-btn  class="btn-back" @click="e1 = 1">ย้อนกลับ</v-btn> -->
                                        <v-btn color="#003366" class="btn-next text-white"  @click="checkStepTwo">บันทึก</v-btn>
                                    </div>
                                </v-form>
                            </v-stepper-content>

                            <v-stepper-content step="3">

                                <v-alert type="success">
                                คุณ : {{ name }} ลงทะเบียนสำเร็จ 
                                </v-alert>

                             
                                <v-form
                                    ref="formOfficer"
                                    v-model="validOne"
                                    lazy-validation
                                >
                                    <StepTree ref="employee"/>
                                    <div class="text-right">
                                        <!-- <v-btn class="btn-back"  @click="e1 = 2">ย้อนกลับ</v-btn> -->
                                        <v-btn color="#003366" class="btn-next text-white" @click="checkStepTree">บันทึก</v-btn>
                                    </div>
                                </v-form>
                            </v-stepper-content>
                        </v-stepper-items>
                    </v-stepper>
            </v-container>
        </div>
    </div>
  

</template>
  
<script>
import axios  from 'axios'
import moment from 'moment'
import Swal from 'sweetalert2'
import stepOne from '@/components/step/stepOne.vue'
import StepTwo from '@/components/step/stepTwo.vue'
import StepTree from '@/components/step/stepTree.vue'
  export default {
  components: { stepOne, StepTwo, StepTree },
    data: () => ({
        e1: 1,
        email: '',
        name: '',
        user: {},
        employee: {},
        isOkay: false,
        step_one : false,
        validOne: true,
        validTwo: true,
        blobUrl: null,
        register_id : null,
        dataString: "Hello, world!"
    }),
    methods: {
        checkStepOne(){
            this.e1 = 2
            this.step_one = true

        },

        async checkStepTwo(){
            
            if(this.$refs.formRegister.validate()){
                try {
                    this.user = await this.$refs.user

                    this.email = await this.user.item.email
                    this.name = await this.user.item.name + ' ' + this.user.item.lastname

                    
                    let path = await `/api/user/checkMail`
                    let response_mail = await axios.post(`${path}`, { "email": this.user.item.email})

                    console.log(response_mail);

                    if(response_mail.data.status == await 200){

                        let address = await this.user.item.address !== undefined ? this.user.item.address : ''

                        let province_th = await this.user.province !== null ? ' จังหวัด' + this.user.province.value || this.user.province : ''

                        let district_th = await this.user.district !== null ?  ' เเขวง' + this.user.district.value || this.user.district : ''

                        let subdistrict_th = await this.user.subdistrict !== null ? ' เขต' + this.user.subdistrict.value  || this.user.subdistrict : ''

                        let postcode = await this.user.item.postcode !== undefined ? this.user.item.postcode : ''

                        let all_address = await address + province_th + district_th  + subdistrict_th + ' ' +postcode

                        let fd = await {
                            "email"                 : this.user.item.email,
                            "name"                  : this.user.item.name,
                            "lastname"              : this.user.item.lastname,
                            "gender"                : this.user.item.gender,
                            "age"                   : this.user.item.age,
                            "phone"                 : this.user.item.phone,
                            "phone_other"           : this.user.item.phone_other,
                            "address"               : all_address,     
                            "province"              : this.user.province !== null ? this.user.province.id || this.user.province : null,
                            "province_name"         : this.user.province !== null ? this.user.province.value || this.user.province : null,
                            "district"              : this.user.district !== null ? this.user.district.id || this.user.district : null,
                            "district_name"         : this.user.district !== null ? this.user.district.value || this.user.district : null,
                            "subdistrict"           : this.user.subdistrict !== null ? this.user.subdistrict.id  || this.user.subdistrict : null,
                            "subdistrict_name"      : this.user.district !== null ? this.user.subdistrict.value || this.user.subdistrict : null,
                            "postcode"              : this.user.item.postcode,
                            "check_policy"          : this.step_one,
                        }
                                    
                        await Swal.fire({
                            icon: 'info',
                            title: 'คุณต้องการยืนยันข้อมูลใช่หรือไม่ ?',
                            html:
                                '<span>Email : </span> <b>' + this.user.item.email + '</b><br>' +
                                '<span>ชื่อ : </span> <b>' + this.user.item.name  + '</b><br>' +
                                '<span>นามสกุล : </span> <b>' + this.user.item.lastname +'</b>',
                            showDenyButton: false,
                            showCancelButton: true,
                            confirmButtonText: 'ยืนยัน',
                            cancelButtonText: `ยกเลิก`,
                        }).then(async (result)  => {
                            if (result.isConfirmed) {
                                let path_regis = await `/api/user/register`
                                let response = await axios.post(`${path_regis}`, fd)
                                this.register_id = await response.data.register_id
                                await Swal.fire('บันทึกข้อมูลเรีบร้อยเเล้ว', '', 'success')
                                
                                this.e1 = await 3
                            } else if (result.isDenied) {
                                Swal.fire('Changes are not saved', '', 'info')
                            }
                        })
                  
                    }

            

                } catch (error) {
                    await Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'มีอีเมลนี่ในระบบเเล้ว',
                    })
                }

            }
        },

        async checkStepTree(){
            if(this.$refs.formOfficer.validate()){
                // this.e1 = 4
                this.employee = await this.$refs.employee
                try {

                    let end_date =  `${moment(this.employee.end_date).format('YYYY-MM-DD')}`
                    let end_time = this.employee.complain_end_time !== null ? `${this.employee.complain_end_time}` : '' 
                    let start_time = this.employee.complain_start_time !== null ? `${this.employee.complain_start_time}` : '' 
                
                    console.log(this.employee.end_date);
                    let fd = await {
                        "name"              : this.employee.name,
                        "lastname"          : this.employee.lastname,
                        "register_id"       : this.register_id,
                        "division"          : this.employee.division,
                        "description_face"  : this.employee.description_face,
                        "topic"             : this.employee.complain_topic,
                        "location"          : this.employee.complain_location,
                        "start_date"        : `${moment(this.employee.start_date).format('YYYY-MM-DD') + ' ' + start_time}`,
                        "end_date"          : `${end_date + ' ' + end_time}`,
                        "detail"            : this.employee.complain_detail,
                        "create_by"         : this.register_id,
                        "modified_by"       : this.register_id,
                    }
                    await Swal.fire({
                        icon: 'info',
                        title: 'คุณต้องการยืนยันข้อมูลใช่หรือไม่ ?',
                        showDenyButton: false,
                        showCancelButton: true,
                        confirmButtonText: 'ยืนยัน',
                        cancelButtonText: `ยกเลิก`,
                    }).then(async (result)  => {
                    /* Read more about isConfirmed, isDenied below */
                        if (result.isConfirmed) {

                            let path = await `/api/user/complain`

                            let response = await axios.post(`${path}`, fd)
                            
                            if(response){

                                const formData = await new FormData();    

                                await formData.append('id', response.data.complain_id);

                                await formData.append('types', 'Complain');    

                                for (let i = 0; i < this.employee.files.length; i++) {

                                    await formData.append('files', this.employee.files[i]);
                                    
                                    const complain_id = await response.data.complain_id

                                    let number = await i + 1

                                    const file = await this.employee.files[i]
              
                                    const arr_file = await file.type.split("/")

                                    let file_name = await ''

                                    if(file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'){

                                        file_name = await 'imgComplain' + complain_id + '_' + number + '.' + arr_file[1] 

                                    }else if(file.type === 'application/pdf'){

                                        file_name = await 'pdfComplain' + complain_id + '_' + number + '.' + arr_file[1] 
                                    
                                    }

                                    let fd_upload = await {
                                        "register_id"   : this.register_id,
                                        "complain_id"   : complain_id,
                                        "file_original" : file.name,
                                        "file_name"     : file_name,
                                        "file_type"     : file.type
                                    }

                                    let path = await `/api/user/files`

                                    await axios.post(`${path}`, fd_upload )




                                    // let number = await i + 1

                                    // await this.insertFile(this.register_id, response.data.complain_id, this.employee.files[i], number)
                                    
                                
                                }
                                await this.myUpload(formData)
                            }
                            await Swal.fire('รับเรื่องร้องเรียนการทุจริตเรีบร้อยเเล้ว', '', 'success')

                            await  this.$router.push("/user/login");
                        }
                    })
                    
                } catch (error) {
                    console.log("insertcomplain", error );
                }
            }
        },
        dataUrl(v){
            const blobUrl = window.URL.createObjectURL(v);
            window.open(blobUrl, '_blank');
        },
        // async submit(){
        //     try {
        //         let fd = await {
        //             "email"                 : this.user.item.email,
        //             "name"                  : this.user.item.name,
        //             "lastname"              : this.user.item.lastname,
        //             "gender"                : this.user.item.gender,
        //             "age"                   : this.user.item.age,
        //             "phone"                 : this.user.item.phone,
        //             "phone_other"           : this.user.item.phone_other,
        //             "address"               : this.user.item.address,     
        //             "province"              : this.user.province !== null ? this.user.province.id || this.user.province : null,
        //             "district"              : this.user.district !== null ? this.user.district.id || this.user.district : null,
        //             "subdistrict"           : this.user.subdistrict !== null ? this.user.subdistrict.id  || this.user.subdistrict : null,
        //             "postcode"              : this.user.item.postcode,
        //             "check_policy"          : this.step_one,
        //         }
        
        //             await Swal.fire({
        //                 title: 'คุณต้องการบันทึกข้อมูลใช่หรือไม่ ?',
        //                 showDenyButton: false,
        //                 showCancelButton: true,
        //                 confirmButtonText: 'บันทึก',
        //                 cancelButtonText: `ยกเลิก`,
        //             }).then(async (result)  => {
        //             /* Read more about isConfirmed, isDenied below */
        //                 if (result.isConfirmed) {

        //                     console.log(result.isConfirmed);

        //                     let path = await `/api/user/register`
        //                     await axios.post(`${path}`, fd)


                          
        //                     await Swal.fire('บันทึกข้อมูลเรีบร้อยเเล้ว', '', 'success')
                     
        //                 }
        //             })

        //    } catch (error) {
        //     console.log(error);
        //    }
        // },
        // async insertComplain(register_id){
        //     let fd = await {
        //         "name"              : this.employee.name,
        //         "lastname"          : this.employee.lastname,
        //         "register_id"       : register_id,
        //         "division"          : this.employee.division,
        //         "description_face"  : this.employee.description_face,
        //         "topic"             : this.employee.complain_topic,
        //         "location"          : this.employee.complain_location,
        //         "start_date"        : `${moment(this.employee.start_date).format('YYYY-MM-DD')}`,
        //         "end_date"          : `${moment(this.employee.end_date).format('YYYY-MM-DD')}`,
        //         "detail"            : this.employee.complain_detail,
        //         "create_by"         : register_id,
        //         // "create_date"       : this.employee.files,
        //         "modified_by"       : register_id,
        //         // "modified_date"     : this.employee.files,
        //     }

        //     let path = await `/api/user/complain`
        //     let response = await axios.post(`${path}`, fd)

        //     if(response){

        //         const formData = await new FormData();    

        //         await formData.append('id', response.data.complain_id);

        //         await formData.append('types', 'Complain');
            

        //         for (let i = 0; i < this.employee.files.length; i++) {

        //             await formData.append('files', this.employee.files[i]);

        //             let number = await i + 1

        //             const complain_id = await response.data.complain_id

        //             const file = await this.employee.files[i]

        //             const arr_file = await file.name.split("/")

        //             let file_name = await ''

        //             if(file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'){

        //             file_name = await 'imgComplain' + complain_id + '_' + number + '.' +arr_file[1] 

        //             }else if(file.type === 'application/pdf'){

        //             file_name = await 'pdfComplain' + complain_id + '_' + number + '.' +arr_file[1] 
                    
        //             }

        //             let fd_upload = await {
        //                 "register_id"   : register_id,
        //                 "complain_id"   : complain_id,
        //                 "file_original" : file.name,
        //                 "file_name"     : file_name
        //             }

        //             let path = await `/api/user/files`

        //             await axios.post(`${path}`, fd_upload )


        //         }
                
        //         if(this.employee.files.length){
        //             await axios.post('/api/uploadsFile', formData)
        //             // await this.myUpload(formData)
        //         }
        //         // await this.myUpload(formData)

                   
        //     }
        // },
    
        async myUpload(files){

            try {

                await axios.post('/api/uploadsFile', files)
                    .then(response => {
                        // Handle the response
                        console.log(response.data);
                    })
                    .catch(error => {
                        // Handle the error
                        console.error(error);
                });

            } catch (error) {

                console.log(error);
            }
        },

        login() {
            this.$router.push({name:'userLogin'})
        },
    },
  }
</script>
<style>
    /* .page-main{
        border: 1px solid #ff0000;
        display: block;
        height: 100%;
    } */
    .head-topic{
        background: #003366;
    }
    .head-left{
        color: white;
        font-size: 24px;
        padding: 1rem 0;
    }
    .h1{
        font-size: 30px;
    }
    .step{
        box-shadow: none!important;
    }
    .stepper-header{
        box-shadow: none;
    }
    .form-register{
        box-shadow: none!important;
    }
    .text-white span{
        color: white;
    }
    .btn-next{
        width: 100px;
        /* border-top-left-radius: 0px;
        border-bottom-left-radius: 0px; */
    }
    .btn-back{
        width: 100px;
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
        border: 1px solid #003366;
        background: white;
        color: #003366;
    }

    ::v-deep .v-icon{
        font-size: 14px!important;
    }
    .swal2-container {
        font-family: 'Prompt', sans-serif!important;
    }
    .swal2-title{
        font-size: 24px;
    }

    .swal2-confirm{
        border: 1px solid #003366!important;
        background-color: #003366!important;
        color: white!important;
    }
    .swal2-cancel{
        color: #003366!important;
        border: 1px solid #003366!important;
        background-color: white!important;
    }
    .v-messages__message {
        line-height: 20px!important;
    }
    .v-card__title{
        font-family: 'Prompt', sans-serif!important;
        /* background: #003366;
        color: white; */
    }
   
</style>