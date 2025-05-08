<template>
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
</template>

<script>
export default {
    data:() => ({
        url: '',
        opacity: 1,
        absolute: false,
        overlayImg: false,
    }),
    methods:{
        showFile(file_type, file_name){
            if(file_type == 'application/pdf'){
                this.urlPdfFiles('UrlFilesAnnounce', file_name)
            }else{
                this.urlFiles('UrlFilesAnnounce', file_name)
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

            });
        },
        async urlFiles(url,file_name){
        
        let path = await `/api/get/${url}?filename=${file_name}`
        
        let res = await axios.get(`${path}`)

        this.url = await res.data

        this.overlayImg = await !this.overlayImg 
        },
    }
}
</script>

<style>

</style>