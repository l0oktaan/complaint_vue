<template>
    <div class="page-layout">
        <v-app-bar app class="navbar">
            <v-container>
                <v-row>
                    <v-spacer />
                    <div class="head-menu">
                        <router-link class="mr-3" to="/">หน้าหลัก</router-link>
                        <!-- <v-btn text  @click="login">หน้าหลัก</v-btn> -->
                        <router-link class="mr-3" to="/user/contact">ติดต่อเรา</router-link>
                        <router-link to="/user/login">เข้าสู่ระบบ</router-link>
                        <!-- <v-btn text  @click="login">เข้าสู่ระบบ</v-btn> -->
                    </div>
                   
                </v-row>
            </v-container>
        </v-app-bar>
        <v-main class="box-main">
            <router-view></router-view>
        </v-main>
        <v-footer class="footer-main">
            <v-container>
                <p>กรมบัญชีกลาง ถนนพระรามที่ 6 แขวงพญาไท เขตพญาไท กรุงเทพฯ 10400</p>
                <p>Call Center 0-2270-6400</p>
                <p>หมายเลขโทรศัพท์กลาง 0-2127-7000 </p>
            </v-container>
        </v-footer>
        <!-- <v-footer class="footer-main"> -->
               
        <!-- </v-footer> -->
    </div>
  

</template>
  
<script>
  export default {
  components: { },
    data: () => ({}),
  }
</script>
<style scoped>
    .page-layout{
        height: 100%;
    }
    .navbar {
        background-color: #FFF!important;
        box-shadow: 0 0 10px rgb(0 0 0 / 10%)!important;
    }
    .navbar .v-toolbar__content{
        height: 64px;
        background: white;
        border-bottom: 3px solid #3333;
    }
    .box-main{
        height: 100%;
    }

    .head-menu a {
        text-decoration: none;
        background: transparent;
        color: #003366;
    }
    .head-menu a:hover {
        color: #fcc200;
    }
    .router-link-exact-active{
        border-bottom: 2px solid ;
        color: #fcc200!important;
    }

    .footer-main{
        background: #003366!important;
        padding-bottom: 16px;
        padding-top: 16px;
        /* position: absolute;
        width: 100%;
        bottom: 0; */
        /* padding: 16px 0; */
    }
    .footer-main p {
       color: white;
        text-align: left;
        /* margin-bottom: 4px; */
    }
   
</style>