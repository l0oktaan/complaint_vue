<template>
    <div class="page-main">
        <loaderView ref="loader"/>
        <div class="head-topic">
            <v-container>
                <v-row>
                    <span class="head-left">ประกาศ</span>
                </v-row>
            </v-container>
        </div>
        <div class="section-main">
            <v-container >
                <!-- ประชาสัมพันธ์ -->
                <div class="section-information text-left">
                    <h2 class="mb-2"><i class="fa-regular fa-newspaper"></i> ประชาสัมพันธ์</h2>
                    <v-row class="mb-6" no-gutters>
                        <v-col md="6" lg="6" cols="12" 
                            class="h-250"
                            v-for="(item, index) in informationArray" :key="index"
                        >
                            <v-card
                                class="text-left box-information"
                                hover
                            >
                                <v-row class="mb-6" no-gutters>
                                    <v-col md="2" lg="2" cols="12">
                                        <div class="box-date">
                                            <p>{{ getDate(item.start_date)  }}</p>
                                            <p>{{ getMonth(item.start_date)  }}</p>
                                        </div>
                                    </v-col>
                                    <v-col md="10" lg="10" cols="12">
                                        <div>
                                            <v-card-title><div class="text-line">{{ item.announce_title }}</div></v-card-title>
                                            <v-card-subtitle>
                                                <span>ข่าวประชาสัมพันธ์</span>
                                                
                                                &nbsp;<span><i class="fas fa-calendar-alt"></i> {{getThaiDate(item.start_date)}}</span>
                                                &nbsp;<span><i class="far fa-eye"></i> 2000</span>
                                            </v-card-subtitle>
                                            <v-card-text class="px-4 py-0">
                                                <div class="text-line" v-html="item.announce_content"></div>
                                        
                                            </v-card-text>
                                            <v-card-actions class="box-readmore">
                                                <v-btn @click="readMoreClickInformation(item.id)" class="text-none" variant="outlined">อ่านต่อ</v-btn>
                                            </v-card-actions>
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-col>   
                    </v-row>
                </div>

                <!-- ประกาศและนโยบายที่เกี่ยวข้อง -->
                <div class="section-policy text-left">
                    <h2 class="mt-3 mb-2"><i class="fa-solid fa-bullhorn"></i> ประกาศและระเบียบที่เกี่ยวข้อง</h2>
                    <v-row class="mb-6" no-gutters>
                        <v-col md="6" lg="6" cols="12" 
                            class="h-250"
                            v-for="(item, index) in policyArray"
                            :key="index"
                        >
                            <v-card
                                class="text-left box-policy"
                                hover
                            >
                                <div>
                                    <v-card-title><div class="text-line">{{ item.announce_title }}</div></v-card-title>
                                    <v-card-subtitle>
                                        <span><i class="fas fa-calendar-alt"></i> {{getThaiDate(item.start_date)}}</span>
                                        &nbsp;<span><i class="far fa-eye"></i> 2000</span>
                                    </v-card-subtitle>
                                    <v-card-text class="px-4 py-0">
                                        <div class="text-line" v-html="item.announce_content"></div>
                                
                                    </v-card-text>
                                    <v-card-actions class="box-readmore">
                                        <v-btn @click="handleReadMoreClick(item.announce_type ,index)" class="text-none" variant="outlined">อ่านต่อ</v-btn>
                                    </v-card-actions>
                                </div>
                                 
                            </v-card>
                        </v-col>   
                    </v-row>
                </div>

            </v-container>
        </div>
    </div>
  

</template>
  
<script>
import axios  from 'axios'
import moment from 'moment'
import loaderView from '@/components/loaderView.vue'
export default {
  components: { loaderView },
    data: () => ({
        items: {},
        informationArray: [],
        policyArray: [],
        clickCount: 0,
    }),
    mounted(){
        this.getDataAnnounce()
    },
    // created(){
       
    // },
   
    methods: {
        getThaiDate(value){
        if (value){
            var d = new Date(value);
            return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
        }else{
            return "";
        }            
        },
        getDate(value){
            return moment(value).format('DD')
        },
        getMonth(value){
            return moment(value).format('MMM')
        },

        async getDataAnnounce(){
            let path                = await `/api/user/get/dataAnnounce`
            let response            = await axios.get(`${path}`) 
            this.items              = await response.data.data

            await this.items.forEach(item => {
                switch (item.announce_type) {
                    case 'ประชาสัมพันธ์':
                    this.informationArray.push(item);
                    break;
                    case 'ประกาศและระเบียบที่เกี่ยวข้อง':
                    this.policyArray.push(item);
                    break;
                    default:
                }
            
            });
        
            await setTimeout(() => (this.$refs.loader.overlay = false), 300);
        },
        readMoreClickInformation(id){

            this.$router.push({ name: 'main-detail', params: { id: id },})

            // let updatedCount = this.informationArray[index].count + 1;

            // console.log(this.informationArray[index].count);
            console.log(id);


            // this.$set(this.informationArray, index, {
            //     ...this.informationArray[index],
            //     count: this.informationArray[index].count + 1,
            // });
            
        }
        // handleReadMoreClick(type, index) {
        //     // Increment the click count when the "Read More" button is clicked
        //     // this.clickCount++;
           

        //     // this.items.forEach(item => {
        //         switch (type) {
        //             case 'ประชาสัมพันธ์':
        //             const updatedCountInformation = this.informationArray[index].count + 1;

        //             console.log(updatedCountInformation);

        //             // this.$set(this.informationArray, index, {
        //             //     ...this.informationArray[index],
        //             //     count: this.informationArray[index].count + 1,
        //             // });

        //             break;
        //             case 'ประกาศและระเบียบที่เกี่ยวข้อง':
        //             const updatedCountPolicy = this.policyArray[index].count + 1;
        //             console.log(updatedCountPolicy);
        //             // this.$set(this.policyArray, index, {
        //             //     ...this.policyArray[index],
        //             //     count: this.policyArray[index].count + 1,
        //             // });

        //             break;
        //             default:
        //         }
            
           
           
          
            
        //     // Optionally, you can expand the content or perform other actions here
        // },
    },
  }
</script>
<style>
    /* .box-information:hover, .box-information:focus,
    .box-policy:hover, .box-policy:focus {
        box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)!important;
    } */
    .box-information{
        width: 580px;
        height: 230px;
    }
    .box-information,
    .box-policy{
        box-shadow: none!important;
        display: inline-block;
    }
    .box-date{
        margin: 16px;
        background: #bdbdbd;
        text-align: center;
        padding: 8px 0;
        width: 64px;
        
    }
    .box-date p{
        margin-bottom: 0;
    }
    .box-readmore{
        float: right;
        padding: 16px;
    }
    .box-readmore button{
        border: 2px solid blue;
        background: transparent;
        box-shadow: none;
    }
    .text-line{
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    .h-250{
        max-height: 250px;
    }
</style>