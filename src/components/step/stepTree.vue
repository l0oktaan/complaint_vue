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
                        hide-details="auto"
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
                        hide-details="auto"
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
                        hide-details="auto"
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
                        hide-details="auto"
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
                        hide-details="auto"
                    ></v-text-field>
                </v-col>
            </v-row>

            <v-row>
                <v-col>
                    <p class="style-label"><span>*</span>ช่วงวัน - เวลาเกิดเหตุ : ตั้งแต่ </p>
                    <v-dialog
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
                            hide-details="auto"
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
                    </v-dialog>
                </v-col>
                
                <v-col>
                    <p class="style-label"><span>*</span>ถึง : </p>
                    <v-dialog
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
                                hide-details="auto"
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
                    </v-dialog>
                </v-col>
            </v-row>

            <v-row>
                <v-col>
                    <p class="style-label"><span>*</span>รายละเอียดเรื่องร้องเรียน : </p>
                    <v-textarea
                        outlined
                        label="รายละเอียดเรื่องร้องเรียน"
                        v-model="complain_detail"
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
                    <p class="style-label"><span>*</span>upload file : </p>
                    <v-file-input v-model="files" 
                        small-chips 
                        :show-size="1000"
                        :accept="acceptTypes"
                        :rules="fileRules"
                        outlined
                        placeholder="Select your files"
                        multiple 
                        clearable 
                        label="Add files"
                        single-line
                        hide-details="auto"
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
        complain_start_date: null,
        complain_end_date: null,
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
        locationRules: [
            v => !!v || 'กรุณากรอกข้อมูล',
        ],
        fileRules: [
            value => {
            if (!value || value.length === 0) {
                return "Please select at least one file";
            }
            if (value.length > 5) {
                return "Maximum 5 files allowed";
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

      created(){
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