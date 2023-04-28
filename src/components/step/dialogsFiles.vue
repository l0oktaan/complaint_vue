<template>
    <div>
        <v-dialog v-model="dialog" max-width="500">
            <v-toolbar color="#167dc2" dark>
                <v-toolbar-title>{{title}}</v-toolbar-title>
            </v-toolbar>

            <v-list class="pt-2"  subheader two-line>
                <div v-if="files.length">
                <v-list-item
                    v-for="step_file in files"
                    :key="step_file.id"
                    >
                    <v-list-item-content class="text-left">
                    <v-list-item-title >{{ step_file.file_original }}</v-list-item-title>
                    </v-list-item-content>

                    <v-list-item-action>
                    <div class="btn-files" v-if="step_file.file_type == 'application/pdf'" @click="urlPdfFiles(path_name,step_file.file_name)"><i class="fa-solid fa-file"></i></div>
                    <div class="btn-files" v-else @click="urlFiles(path_name,step_file.file_name)"><i class="fa-solid fa-image"></i></div>
                    </v-list-item-action>
                </v-list-item>
                </div>
                <h2 v-else>ไม่มีข้อมูล</h2>
            </v-list> 
          
            
        </v-dialog>

        <!-- โชว์รูป -->
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
export default {
    props : ['title', 'files', 'path_name'],
    data : () => ({
        overlayImg: false,
        opacity: 1,
        absolute: false,
        dialog: false,
        url: '',
    }),
  
    methods: {
        open() {
        this.dialog = true 
        },
        async urlPdfFiles(path_name ,file_name){
            axios({
                url: `/api/get/pdf/${path_name}`,
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
        async urlFiles(path_name ,file_name){    
            let path = await `/api/get/${path_name}?filename=${file_name}`
            
            let res = await axios.get(`${path}`)

            this.url = await res.data

            this.overlayImg = await !this.overlayImg 
        },
    }
}
</script>

<style>

</style>