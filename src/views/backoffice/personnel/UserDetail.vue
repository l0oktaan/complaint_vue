<template>
   <div class="user-detail">
    <loaderView ref="loader"/>
        <div class="style-page">
            <v-card class="style-card">
                <v-toolbar flat>
                    <v-toolbar-title class="h2">โปรไฟล์</v-toolbar-title>
                </v-toolbar>
        
                <v-card-text >
                    <v-row align="center">
                        <v-col cols="12">
                            <v-subheader>รหัสผู้ใช้งาน</v-subheader>
                            <v-text-field
                                v-model="username"
                                solo
                                readonly
                                hide-details="auto"
                                class="input-gray"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row align="center">
                        <v-col cols="12" md="6">
                            <v-subheader>ชื่อ</v-subheader>
                            <v-text-field
                                v-model="name"
                                solo
                                readonly
                                hide-details="auto"
                                class="input-gray"
                              
                            ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-subheader>นามสกุล</v-subheader>
                            <v-text-field
                                v-model="lastname"
                                solo
                                readonly
                                hide-details="auto"
                                class="input-gray"
                            ></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row align="center">
                        <v-col cols="12" md="6">
                            <v-subheader>ตำเเหน่ง</v-subheader>
                            <v-text-field
                                v-model="position"
                                solo
                                readonly
                                hide-details="auto"
                                class="input-gray"
                            ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-subheader>หน่วยงาน</v-subheader>
                            <v-text-field
                                v-model="divisions"
                                solo
                                readonly
                                hide-details="auto"
                                class="input-gray"
                            ></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" md="6">
                            <v-subheader>ประเภทสิทธิ์การใช้งาน</v-subheader>
                            <v-text-field
                                v-model="roles"
                                solo
                                readonly
                                hide-details="auto"
                                class="input-gray"
                            ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-subheader>สถานะการใช้งาน</v-subheader>
                            <v-text-field
                                v-model="status"
                                solo
                                readonly
                                hide-details="auto"
                                class="input-gray"
                            ></v-text-field>
                        </v-col>
                    </v-row>

                </v-card-text>
            
            </v-card>
        </div>
    </div> 
</template>

<script>
import axios from "axios";
import loaderView from '@/components/loaderView.vue';
export default {
    components: { loaderView},
    data:() => ({
        username: '',
        name: '',
        lastname: '',
        position: '',
        roles: '',
        divisions: '',
        status: '',
    }),
    mounted(){
        this.getuserDetail()    
    },
    methods: {
        async getuserDetail(){
            let path                    = await `/api/backoffice/get/userDetail`
            let response                = await axios.get(`${path}/`+ this.$route.params.id)
            this.username               = await response.data.data[0].username
            this.name                   = await response.data.data[0].name
            this.lastname               = await response.data.data[0].lastname
            this.position               = await response.data.data[0].position
            this.divisions              = await response.data.data[0].divisions === 1 ? 'ศทส' : 'กบค'
            this.roles                  = await response.data.data[0].roles === 'general' ? 'ผู้ใช้งานทั่วไป' : 'ผู้ดูเเลระบบ'
            this.status                 = await response.data.data[0].status === 1 ?  'ใช้งาน' : 'ไม่ใช้งาน'

            await setTimeout(() => (this.$refs.loader.overlay = false), 300);

            
        },
    }
}
</script>

<style>

</style>