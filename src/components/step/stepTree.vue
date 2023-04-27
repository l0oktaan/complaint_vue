<template>
    <v-card class="form-register">
        <div class="box-officer">
            <v-row>
                <v-col>
                    <div class="h2">เจ้าหน้าที่ / หน่วยงาน </div>
                </v-col>
            </v-row>
            
            <v-row>
                <v-col>
                <p class="style-label"><span>*</span>ชื่อ : </p>
                    <v-text-field
                        v-model="name"
                        :rules="nameRules"
                        label="กรอกชื่อ"
                        required
                        dense
                        outlined
                        single-line
                    ></v-text-field>
                </v-col>
                <v-col>
                <p class="style-label"><span>*</span>นามสกุล : </p>
                    <v-text-field
                        v-model="lastname"
                        :rules="lastnameRules"
                        label="นามสกุล"
                        required
                        dense
                        outlined
                        single-line
                    ></v-text-field>
                </v-col>
            </v-row>
            
            <v-row>
                <v-col>
                <p class="style-label"><span>*</span>หน่วยงาน : </p>
                    <v-text-field
                        v-model="division"
                        :rules="divisionRules"
                        label="หน่วยงาน"
                        required
                        dense
                        outlined
                        single-line
                    ></v-text-field>
                    <!-- <v-select
                        :items="selectDivision"
                        v-model="data.division"
                        :rules="divisionRules"
                        label="หน่วยงาน"
                        dense
                        outlined
                        single-line
                        
                    ></v-select> -->
                </v-col>
                <v-col>
                <p class="style-label">รูปพรรณสันฐาน :</p>
                    <v-text-field
                        v-model="description_face"
                        label="รูปพรรณสันฐาน"
                        required
                        dense
                        outlined
                        single-line
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-divider></v-divider>
             
        </div>

        <div class="box-complaint">
            <v-row>
                <v-col>
                    <div class="h2 mt-5">เรื่องร้องเรียน</div>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <p class="style-label"><span>*</span>หัวเรื่อง : </p>
                    <v-text-field
                        v-model="complain_topic"
                        :rules="topicRules"
                        label="เรื่องร้องเรียน"
                        required
                        dense
                        outlined
                        single-line
                        
                    ></v-text-field>
                </v-col>
                <v-col>
                    <p class="style-label"><span>*</span>สถานที่เกิดเหตุ : </p>
                    <v-text-field
                        v-model="complain_location"
                        :rules="locationRules"
                        label="สถานที่เกิดเหตุ"
                        required
                        dense
                        outlined
                        single-line
                        
                    ></v-text-field>
                </v-col>
            </v-row>

            <v-row>
                <v-col>
                    <p class="style-label mb-3"><span>*</span>ช่วงวัน - เวลาเกิดเหตุ : ตั้งแต่ </p>
                    <!-- <v-dialog
                        ref="dialog_start"
                        v-model="modal"
                        :return-value.sync="start_date"
                        persistent
                        width="290px"
                    >
                        <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                            v-model="complain_start_date"
                            label="วันที่เริ่มต้น"
                            append-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            dense
                            outlined
                            single-line
                            
                        ></v-text-field>
                        </template>
                        <v-date-picker
                        v-model="start_date"
                        scrollable
                        locale="th-TH"
                        >
                        <v-spacer></v-spacer>
                        <v-btn
                            text
                            color="primary"
                            @click="modal = false"
                        >
                            Cancel
                        </v-btn>
                        <v-btn
                            text
                            color="primary"
                            @click="$refs.dialog_start.save(start_date)"
                        >
                            OK
                        </v-btn>
                        </v-date-picker>
                    </v-dialog> -->
                    
                    <v-menu
                        ref="start_date"
                        v-model="menu_start_date"
                        :close-on-content-click="false"
                        :return-value.sync="start_date"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"    
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field                                                        
                                v-model="complain_start_date"
                                label="ตั้งเเต่วันที่"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                dense
                                outlined
                                clearable
                                prepend-icon="mdi-calendar"
                                @click:clear="start_date=null"
                            ></v-text-field>
                        </template>

                        <v-date-picker
                            v-model="start_date"
                            no-title
                            scrollable
                            locale="th-TH"
                            >
                            <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="primary"
                                @click="menu_start_date = false"
                            >
                                ยกเลิก
                            </v-btn>
                            <v-btn
                                text
                                color="primary"
                                @click="$refs.start_date.save(start_date)"
                            >
                                ตกลง
                            </v-btn>
                        </v-date-picker>
                    </v-menu>

                    <v-menu
                        ref="start_time"
                        v-model="menu_start_time"
                        :close-on-content-click="false"
                        :return-value.sync="complain_start_time"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                    >
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                        v-model="complain_start_time"
                        label="ตั้งเเต่เวลา"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        dense
                        outlined
                        clearable
                        prepend-icon="mdi-clock-time-four-outline"
                        @click:clear="complain_start_time=null"
                        ></v-text-field>
                    </template>
                    <v-time-picker
                        v-model="complain_start_time"
                        format="24hr"
                        full-width
                        @click:minute="$refs.start_time.save(complain_start_time)"
                    
                    >
                    <v-spacer></v-spacer>
                    <v-btn
                        text
                        color="primary"
                        @click="menu = false"
                    >
                        ยกเลิก
                    </v-btn>
                    <v-btn
                        text
                        color="primary"
                        @click="$refs.menu.save(time)"
                    >
                        ตกลง
                    </v-btn>
                    </v-time-picker>
                    </v-menu>
                </v-col>
                
                <v-col>
                    <p class="style-label mb-3"><span>*</span>ถึง : </p>
                    <!-- <v-dialog
                        ref="dialog_end"
                        v-model="modal2"
                        :return-value.sync="end_date"
                        persistent
                        width="290px"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="complain_end_date"
                                label="วันที่สิ้นสุด"
                                append-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                dense
                                outlined
                                single-line
                                
                        ></v-text-field>
                        </template>
                        <v-date-picker
                            v-model="end_date"
                            scrollable
                        >
                        <v-spacer></v-spacer>
                        <v-btn
                            text
                            color="primary"
                            @click="modal2 = false"
                        >
                            Cancel
                        </v-btn>
                        <v-btn
                            text
                            color="primary"
                            @click="$refs.dialog_end.save(end_date)"
                        >
                            OK
                        </v-btn>
                        </v-date-picker>
                    </v-dialog> -->

                    <v-menu
                        ref="end_date"
                        v-model="menu_end_date"
                        :close-on-content-click="false"
                        :return-value.sync="end_date"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"    
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field                                                        
                                v-model="complain_end_date"
                                label="ตั้งเเต่วันที่"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                dense
                                outlined
                                clearable
                                prepend-icon="mdi-calendar"
                                @click:clear="end_date=null"
                            ></v-text-field>
                        </template>

                        <v-date-picker
                            v-model="end_date"
                            no-title
                            scrollable
                            locale="th-TH"
                            >
                            <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="primary"
                                @click="menu_end_date = false"
                            >
                                ยกเลิก
                            </v-btn>
                            <v-btn
                                text
                                color="primary"
                                @click="$refs.end_date.save(end_date)"
                            >
                                ตกลง
                            </v-btn>
                        </v-date-picker>
                    </v-menu>

                    <v-menu
                        ref="end_time"
                        v-model="menu_end_time"
                        :close-on-content-click="false"
                        :return-value.sync="complain_end_time"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                    >
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                        v-model="complain_end_time"
                        label="ถึงเวลา"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        dense
                        outlined
                        clearable
                        prepend-icon="mdi-clock-time-four-outline"
                        @click:clear="complain_end_time=null"
                        ></v-text-field>
                    </template>
                    <v-time-picker
                        v-model="complain_end_time"
                        format="24hr"
                        full-width
                        @click:minute="$refs.end_time.save(complain_end_time)"
                    
                    >
                    <v-spacer></v-spacer>
                    <v-btn
                        text
                        color="primary"
                        @click="menu = false"
                    >
                        ยกเลิก
                    </v-btn>
                    <v-btn
                        text
                        color="primary"
                        @click="$refs.menu.save(time)"
                    >
                        ตกลง
                    </v-btn>
                    </v-time-picker>
                    </v-menu>
                </v-col>
            </v-row>

            <v-row>
                <v-col>
                    <p class="style-label"><span>*</span>รายละเอียดเรื่องร้องเรียน : </p>
                    <v-textarea
                        outlined
                        label="รายละเอียดเรื่องร้องเรียน"
                        v-model="complain_detail"
                        :rules="complainDetailRules"
                        clearable 
                        single-line
                    ></v-textarea>
                    <!-- <v-tiptap class="mb-5" v-model="complain_detail" /> -->
                    <!-- <v-text-field
                        v-model="data.detail"
                        label="*รายละเอียดเรื่องร้องเรียน"
                        required
                        dense
                        outlined
                    ></v-text-field> -->
                </v-col>
            </v-row>
            <!-- <v-divider></v-divider> -->
        </div>
             
        <div class="box-upload">
            <v-row>
                <v-col>
                    <div class="h2">เอกสารประกอบการร้องเรียน</div>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <p class="style-label"><span>*</span>upload file : (เเนบไฟล์ png, jpeg, gif, pdf) </p>
                    <v-file-input v-model="files" 
                        small-chips 
                        :max-size="1000000"
                        :accept="acceptTypes"
                        :rules="fileRules"
                        outlined
                        multiple 
                        dense
                        clearable 
                        label="เลือกไฟล์"
                        single-line
                        @change="fileAdded">
                        <template v-slot:selection="{ text, index }">
                            <v-chip small text-color="white" color="#295671" close @click:close="remove(index)">
                                {{ text }}
                            </v-chip>
                        </template>
                    </v-file-input>
                </v-col>
            </v-row>
        </div>
    </v-card>
</template>

<script>
export default {
    data: () => ({
        data:{},
        name: '',
        lastname: '',
        division: '',
        description_face: '',
        complain_topic: '',
        complain_location: '',
        // startDate : new Date().toISOString().substr(0, 10),
        complain_start_date: null,
        complain_end_date: null,
        complain_start_time: null,
        complain_end_time: null,
        menu_start_date: false,
        menu_end_date: false,
        menu_start_time: false,
        menu_end_time: false,
        complain_detail: '',
        selectDivision: [],
        currFiles: [],
        previousFiles: [],
        files: [],
        modal: false,
        modal2: false,
        acceptTypes: "image/*, application/pdf",
        nameRules: [
            v => !!v || 'กรุณากรอกข้อมูล',
            v =>/^[a-zA-Zก-ฮะ-์\s]+$/.test(v) ||` ห้ามกรอกอักขระพิเศษ เเละตัวเลข`
        ],
        lastnameRules: [
            v => !!v || 'กรุณากรอกข้อมูล',
            v =>/^[a-zA-Zก-ฮะ-์\s]+$/.test(v) ||` ห้ามกรอกอักขระพิเศษ เเละตัวเลข`
        ],
        divisionRules: [
            v => !!v || 'กรุณากรอกข้อมูล',
        ],
        topicRules: [
            v => !!v || 'กรุณากรอกข้อมูล',
        ],
        complainDetailRules: [
            v => !!v || 'กรุณากรอกข้อมูล',
        ],
        locationRules: [
            v => !!v || 'กรุณากรอกข้อมูล',
        ],
        fileRules: [
            value => {
            if (!value || value.length === 0) {
                return "กรุณ่เลือกไฟล์";
            }
            if (value.length > 5) {
                return "อัพโหลดไฟล์ได้ไม้เกิน 5 ไฟล์";
            }
            const allowedTypes = ["image/png", "image/jpeg", "image/gif", "application/pdf"];
            for (let i = 0; i < value.length; i++) {
                const file = value[i];
                console.log(file);
                if (!allowedTypes.includes(file.type)) {
                return "File type not allowed";
                }
            }
            return true;
            }
        ],
    //     filesRules: [
    //     // v => !!v || 'กรุณากรอกข้อมูล',
    //     v => !!v || "File is required", 
    //     v => (v && v.type.indexOf("image/") !== -1) || "Please upload an image"
    //     // v => v.type == 'image/png' || 'อัพโหลดได้เฉพาะไฟล์ PDF เท่านั้น'
    //     // v => v.type == 'image/png', 'image/jpeg', 'image/gif', 'application/pdf'
      
    // ],
        start_date: new Date().toISOString().substr(0, 10),
        end_date: new Date().toISOString().substr(0, 10),
        
      }),

      mounted(){
        this.getEndThaiDate()
    },

    watch: {
        start_date(){
            this.getEndThaiDate()
        },
        end_date(){

           this.getEndThaiDate()

            
        },
        files(val) {
            this.previousFiles = val
        }  
    },

    methods:{
        getEndThaiDate(){
            if (this.start_date || this.end_date){
                var d_start = new Date(this.start_date);
                var d_end = new Date(this.end_date);
                this.complain_start_date = d_start.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
                this.complain_end_date = d_end.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
                // this.complain_end_date = this.end_date == null ? null : d_end.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });

            }
        },
        remove (index) {
            console.log(index);
            this.files.splice(index, 1)
        },
        fileAdded () {
            if (this.previousFiles.length > 0) {
                this.files.push(...this.previousFiles)
            }
        }
    }
}
</script>

<style>

</style>