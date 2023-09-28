<template>
    <div class="user-form">
        <loaderView ref="loader" v-if="this.$route.name == 'personnel_formedit'"/>
        <BreadcrumbsView :items="item"/>
        <div class="style-page">
            <v-card class="style-card">
                <v-toolbar flat>
                    <v-toolbar-title class="h2">{{ formTitle }}</v-toolbar-title>
                </v-toolbar>
                <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                >
                    <v-card-text >
                        <v-row align="center">
                            <v-col cols="12">
                                <p class="style-label"><span>*</span>รหัสผู้ใช้งาน : </p>
                                <v-text-field
                                    v-model="username"
                                    :rules="usernameRules"
                                    label="รหัสผู้ใช้งาน"
                                    dense
                                    outlined
                                    single-line
                                    hide-details="auto"
                                    clearable
                                    :maxlength="50"
                                ></v-text-field>
                            </v-col>
                            <!-- <v-col cols="6">
                                <p class="style-label">รหัสผ่านผู้ใช้งาน : </p>
                                <v-text-field
                                    v-model="password"
                                    label="รหัสผ่านผู้ใช้งาน"
                                    dense
                                    outlined
                                    single-line
                                    hide-details="auto"
                                    clearable
                                ></v-text-field>
                            </v-col> -->
                        </v-row>
                        <v-row align="center">
                            <v-col cols="12" md="6">
                                <p class="style-label"><span>*</span>ชื่อ : </p>
                                <v-text-field
                                    v-model="name"
                                    :rules="nameRules"
                                    label="ชื่อ"
                                    dense
                                    outlined
                                    single-line
                                    hide-details="auto"
                                    clearable
                                    thai_engLanguage
                                    :maxlength="50"
                                ></v-text-field>
                            </v-col>

                            <v-col cols="12" md="6">
                                <p class="style-label"><span>*</span>นามสกุล : </p>
                                <v-text-field
                                    v-model="lastname"
                                    :rules="lastnameRules"
                                    label="นามสกุล"
                                    dense
                                    outlined
                                    single-line
                                    hide-details="auto"
                                    clearable
                                    thai_engLanguage
                                    :maxlength="50"
                                ></v-text-field>
                            </v-col>
                        </v-row>

                        <v-row align="center">
                            <v-col cols="12" md="6">
                                <p class="style-label"><span>*</span>ตำเเหน่ง : </p>
                                <v-text-field
                                    v-model="position"
                                    :rules="positionRules"
                                    label="ตำเเหน่ง"
                                    dense
                                    outlined
                                    single-line
                                    hide-details="auto"
                                    clearable
                                    thai_engLanguage
                                    :maxlength="200"
                                ></v-text-field>
                            </v-col>

                            <v-col cols="12" md="6">
                                <p class="style-label"><span>*</span>หน่วยงาน : </p>
                                <v-select
                                    v-model="divisions"
                                    :items="selectDivisions"
                                    
                                    item-text="value"
                                    item-value="id"
                                    label="หน่วยงาน"
                                    dense
                                    outlined
                                    single-line
                                    hide-details="auto"
                                    clearable
                                ></v-select>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" md="6">
                                <p class="style-label"><span>*</span>ประเภทสิทธิ์การใช้งาน : </p>
                                <v-select
                                v-model="roles"
                                :items="selectRoles"
                                :rules="rules.rolesRules"
                                item-text="value"
                                item-value="id"
                                label="ประเภทสิทธิ์การใช้งาน"
                                dense
                                outlined
                                single-line
                                hide-details="auto"
                                clearable
                                ></v-select>
                            </v-col>

                            <v-col cols="12" md="6">
                                <p class="style-label">สถานะการใช้งาน : </p>
                                <v-select
                                v-model="status"
                                :items="selectStatus"
                                item-text="value"
                                item-value="id"
                                label="สถานะการใช้งาน"
                                dense
                                outlined
                                single-line
                                hide-details="auto"
                                clearable
                                ></v-select>
                            </v-col>
                        </v-row>

                    </v-card-text>
                    <v-toolbar flat class="box-button">
                        <v-btn
                            class="btn btn-submit mr-2"
                            text
                            @click="saveUser"
                        >
                            บันทึก
                        </v-btn>
                            <v-btn
                            class="btn btn-cancel"
                            text
                            @click="cancel"
                        >
                            ยกเลิก
                        </v-btn>
                    </v-toolbar>

                </v-form>
            </v-card>
        </div>
    </div> 
</template>
<script>
    import axios from "axios";
    import Swal from 'sweetalert2';
    import store from '../../../store/index.js';
    import loaderView from '@/components/loaderView.vue';
    import BreadcrumbsView from '@/components/breadcrumbsView.vue';
    export default {
  components: { loaderView, BreadcrumbsView },
        // props: ['item'],
        data: () => ({
            // data: {},
            show1: false,
            valid: true,
            check_title :  true,
            user_id: null,
            username: '',
            password: '',
            name: '',
            lastname: '',
            position: '',
            admin_id: store.getters.user.id,
            roles: { value: '', id: null },
            selectRoles: [
                { value: 'ผู้ใช้งานทั่วไป', id: 'general' },
                { value: 'ผู้ดูเเลระบบ', id: 'admin' },
                // { value: 'ผู้ใช้งานระดับสูง', id: 'vip' },
            ],
            divisions: { value: '', id: null },
            selectDivisions: [
                { value: 'ศทส.', id: 1 },
                { value: 'กบค.', id: 2 },
                // { value: 'สล', id: 2 },
            ],
            status: { value: 'ใช้งาน', id: 1 },
            state: '',
            selectStatus: [
                { value: 'ใช้งาน', id: 1 },
                { value: 'ไม่ใช้งาน', id: 0 },
            ],

            usernameRules: [
                v => !!v || 'กรุณากรอกข้อมูล',
                v => (v && v.length <= 50) || 'กรอกรายละเอียดห้ามเกิน 50 ตัวอักษร'
            ],
            passwordRules: [
                v => !!v || 'กรุณากรอกข้อมูล',
                v => v.length >= 8 || 'Min 8 characters',
            ],
            nameRules: [
                v => !!v || 'กรุณากรอกข้อมูล',
                v =>/^[a-zA-Zก-ฮะ-์\s]+$/.test(v) ||` ห้ามกรอกอักขระพิเศษ เเละตัวเลข`,
                v => (v && v.length <= 50) || 'กรอกรายละเอียดห้ามเกิน 50 ตัวอักษร'
            ],
            lastnameRules: [
                v => !!v || 'กรุณากรอกข้อมูล',
                v =>/^[a-zA-Zก-ฮะ-์\s]+$/.test(v) ||` ห้ามกรอกอักขระพิเศษ เเละตัวเลข`,
                v => (v && v.length <= 50) || 'กรอกรายละเอียดห้ามเกิน 50 ตัวอักษร'
            ],
            positionRules: [
                v => !!v || 'กรุณากรอกข้อมูล',
                v =>/^[a-zA-Zก-ฮะ-์\s]+$/.test(v) ||` ห้ามกรอกอักขระพิเศษ เเละตัวเลข`,
                v => (v && v.length <= 200) || 'กรอกรายละเอียดห้ามเกิน 200 ตัวอักษร'
            ],
            rules:{
                divisionsRules: [(v) =>  v.length> 0  || "เลือกประเภทหน่วยงาน"],
                rolesRules: [(v) =>  v.length> 0 || "เลือกประเภทสิทธิ์การใช้งาน"]
                // statusRules: [(v) =>  v.length> 0 || "เลือกสถานะการใช้งาน"],
            },
            item: [
                {
                    text: 'รายการบุคลากร',
                    disabled: false,
                    href: '/backoffice/personnel',
                },
                {
                    text: 'ข้อมูลผู้ใช้งาน',
                    disabled: true,
                    href: 'breadcrumbs_link_1',
                },
                
            ],
 
        }),
        mounted(){
            if(this.$route.name == 'personnel_formedit'){
                this.getuserDetail()    
            }
        },
        computed:{
            formTitle () {
                return this.$route.name == 'personnel_form' ? 'สร้างผู้ใช้งาน' : 'แก้ไขผู้ใช้งาน'
            },
        },
        methods: {
            async getuserDetail(){
                let path                    = await `/api/backoffice/get/userDetail`
                let response                = await axios.get(`${path}/`+ this.$route.params.id)
                this.user_id                = await response.data.data[0].id
                this.username               = await response.data.data[0].username
                this.name                   = await response.data.data[0].name
                this.lastname               = await response.data.data[0].lastname
                this.position               = await response.data.data[0].position
                this.divisions              = await response.data.data[0].divisions
                this.roles                  = await response.data.data[0].roles
                this.status                 = await response.data.data[0].status
                this.state                  = await response.data.data[0].state

                await setTimeout(() => (this.$refs.loader.overlay = false), 300);

              
            },
            async saveUser(){ 
                if(this.$refs.form.validate()){
                    let fd = {
                        "admin_id"      : this.admin_id,
                        "user_id"       : this.user_id,
                        "username"      : this.username,
                        "password"      : this.password,
                        "name"          : this.name,
                        "lastname"      : this.lastname,
                        "position"      : this.position,
                        "divisions"     : this.divisions,
                        "roles"         : this.roles,
                        "status"        : this.$route.name == 'personnel_form'? this.status.id : this.status,
                        "state"         : this.state,
                    }
                    try {
                        let path = ''
                        if(this.$route.name == 'personnel_form'){
                            path = await `/api/backoffice/create/user`
                        }else{
                            path = await `/api/backoffice/edit/user`
                        }
                        let res = await axios.post(`${path}`, fd)
                        console.log(res);
                        Swal.fire({
                            icon: 'success',
                            title: 'บันทึกสำเร็จ',
                            text: 'ระบบได้ทำการบันทึกข้อมูลของคุณแล้ว'
                        }).then( function(){
                            window.location.href = '/backoffice/personnel';
                        });
                    } catch (error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'บันทึกไม่สำเร็จ',
                            text: 'มีข้อผิดพลาดที่ไม่คาดคิดเกิดขึ้น โปรดลองใหม่อีกครั้ง'
                        })
                        console.log('error :' + error)
                    }
                } 
            },
            cancel(){
                 this.$router.push('/backoffice/personnel')
            }
        }
    }

</script>
<style>
    .box-button .v-toolbar__content{
        justify-content: center;
    }
    .style-card{
        box-shadow: none;
    }
</style>
