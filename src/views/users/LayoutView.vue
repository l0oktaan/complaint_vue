<template>
    <div class="page-layout">
        <v-app-bar app class="navbar">
            <v-container>
                <v-row class="align-center">
                    
                    <v-avatar  size="56">
                        <img 
                            src="@/assets/images/logo-yellow.png"
                            alt="logo"
                        />
                    </v-avatar>

                  
                    <v-spacer />
                    <div class="head-menu">
                     
                        <v-tooltip bottom color="#1976d2">
                            <template v-slot:activator="{ on, attrs }">
                                <router-link class="mr-5" to="/" >
                                    <span v-bind="attrs" v-on="on" >
                                        <i class="fa-solid fa-house" ></i>
                                    </span>
                                </router-link>
                            </template>
                            <span>Home</span>
                        </v-tooltip>

                        <v-tooltip bottom color="#1976d2">
                            <template v-slot:activator="{ on, attrs }">
                                <router-link class="mr-5" to="/user/contact" >
                                    <span v-bind="attrs" v-on="on">
                                        <i class="fa-solid fa-phone" ></i>
                                    </span>
                                </router-link>
                            </template>
                            <span>Contact</span>
                        </v-tooltip>

                        <v-tooltip bottom color="#1976d2">
                            <template v-slot:activator="{ on, attrs }">
                                <router-link  to="/user/login" >
                                    <span v-bind="attrs" v-on="on">
                                        <i class="fa-solid fa-right-to-bracket"></i>
                                    </span>
                                </router-link>
                            </template>
                            <span>Login</span>
                        </v-tooltip>

                        <!-- <router-link class="mr-3" to="/"><i class="fa-solid fa-house"></i></router-link> -->
                        <!-- <router-link class="mr-3" to="/user/contact"><i class="fa-solid fa-phone" ></i></router-link>
                        <router-link class="mr-3" to="/user/login"><i class="fa-solid fa-right-to-bracket"></i></router-link> -->
                        <!-- <router-link to="/backoffice/login">เจ้าหน้าที่กรมบัญชีกลาง</router-link> -->
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
    }
    .footer-main p {
        color: white;
        text-align: left;
    }
   
</style>