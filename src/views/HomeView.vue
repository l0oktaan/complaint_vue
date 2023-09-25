<template>
  <v-app id="inspire">
    <v-navigation-drawer 
      class="sidebar"
      v-model="drawer"
      app
    >

      <!-- <v-list-item >
        <v-avatar  size="50">
          <img src="@/assets/images/logo-yellow.png" alt="logo"/>
        </v-avatar>
          <v-list-item-title class="head"> ระบบรับเรื่องร้องเรียนทุจริต </v-list-item-title>
      </v-list-item> -->

      <v-list-item >
        <v-list-item-content class="head-menuhome">
          <div class="logo-cgd mr-2">
            <img src="@/assets/images/logo-yellow.png" alt="logo"/>
          </div>
          <v-list-item-title class="text-head">
            รับเรื่องร้องเรียนทุจริต
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list class="mt-5" dense nav>  
        <router-link 
          v-if="check_roles.roles === 'user'"
          class="d-flex align-center menu-link"
          active-class="activemenu"
          to="/user/follow"
        >
          <v-list-item link>
            <i class="fa-solid fa-eye menu-icon"></i>
            <v-list-item-content>
              <v-list-item-title class="menu-text">
                ติดตามเรื่องร้องเรียน
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>

        <router-link 
          v-if="check_roles.roles === 'user'"
          class="d-flex align-center menu-link"
          active-class="activemenu"
          to="/user/report"
        >
          <v-list-item link>
            <i class="fa-solid fa-comment menu-icon"></i>
            <v-list-item-content>
              <v-list-item-title class="menu-text">
                เเจ้งเรื่องร้องเรียนทุจริต
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>

        <router-link 
          v-if="check_roles.roles === 'admin' || check_roles.roles === 'general'"
          class="d-flex align-center menu-link"
          active-class="activemenu"
          to="/backoffice/receive"
        >
          <v-list-item link>
            <i class="fa-solid fa-magnifying-glass menu-icon"></i>
            <v-list-item-content>
              <v-list-item-title class="menu-text">
                รับเรื่องร้องเรียนทุจริต
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>

        <router-link 
          v-if="check_roles.roles === 'admin' || check_roles.roles === 'general'"
          class="d-flex align-center menu-link"
          active-class="activemenu"
          to="/backoffice/follow"
        >
          <v-list-item link>
            <i class="fa-solid fa-eye menu-icon"></i>
            <v-list-item-content>
              <v-list-item-title class="menu-text">
                รายการที่ต้องดำเนินการ
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>

        <router-link 
          v-if="check_roles.roles === 'admin'"
          class="d-flex align-center menu-link"
          active-class="activemenu"
          to="/backoffice/personnel"
        >
          <v-list-item link>
            <i class="fas fa-users menu-icon"></i>
            <v-list-item-content>
              <v-list-item-title class="menu-text">
                รายการบุคลากร
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>

        <router-link 
          v-if="check_roles.roles === 'admin'"
          class="d-flex align-center menu-link"
          active-class="activemenu"
          to="/backoffice/register"
        >
          <v-list-item link>
            <i class="fa-solid fa-user menu-icon"></i>
            <v-list-item-content>
              <v-list-item-title class="menu-text">
                รายการผู้ร้องเรียน
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>
<!-- 
        <router-link 
          v-if="check_roles.roles === 'admin'"
          class="d-flex align-center menu-link"
          active-class="activemenu"
          to="/backoffice/report"
        >
          <v-list-item link>
            <i class="fa-solid fa-file-export menu-icon"></i>
            <v-list-item-content>
              <v-list-item-title class="menu-text">
                รายงาน
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link> -->
      </v-list>

    </v-navigation-drawer>
      <v-app-bar app class="navbar">
        <div class="style-navbar">
       
        <v-app-bar-nav-icon class="navbar-icon" @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-spacer></v-spacer>

        <!-- <v-menu
          bottom
          min-width="200px"
          rounded
          offset-y
        > -->
        <span class="mr-2 color-primary">{{check_roles.name}} {{ check_roles.lastname }}</span>
        
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">

            <div 
              class="box-user mr-2"
              v-bind="attrs"
              v-on="on"
            >
              <i class="fa-solid fa-circle-user f-24"></i>
            </div>
            <!-- <v-btn icon x-large v-on="on">
              <v-avatar  color="brown" size="36">
                <i class="fa-solid fa-user"></i>
              </v-avatar>
            </v-btn> -->
          </template>

          <v-list>

            <!-- <v-list-item >
              <v-list-item-title>  
                <h3> {{ check_roles.name }} {{ check_roles.lastname }} </h3>
                <p class="text-caption mt-1"> {{ check_roles.email }} </p>
                <v-divider class="my-3"></v-divider>
              </v-list-item-title>
            </v-list-item> -->

            <v-list-item >
              <v-list-item-title>
                <v-btn depressed rounded text @click="editProfile"> โปรไฟล์ </v-btn>
                <v-divider  class="my-3"></v-divider> 
                <!-- <v-btn
                  v-if="check_roles.roles == 'user'"
                  depressed
                  rounded
                  text
                  @click="opensumone()"
                >
                  เปลี่ยนรหัสผ่าน
                </v-btn>
                <v-divider v-if="check_roles.roles != 'user'" class="my-3"></v-divider> -->
              
              </v-list-item-title>
            </v-list-item>

            <v-list-item v-if="check_roles.roles == 'user'">
              <v-list-item-title>
                <!-- <v-btn depressed rounded text @click="editProfile"> แก้ไขโปรไฟล์ </v-btn>
                <v-divider v-if="check_roles.roles == 'user'" class="my-3"></v-divider>  -->
                <v-btn
                  
                  depressed
                  rounded
                  text
                  @click="opensumone()"
                >
                  เปลี่ยนรหัสผ่าน
                </v-btn>
                <v-divider class="my-3"></v-divider>
              
              </v-list-item-title>
            </v-list-item>

            <v-list-item >
              <v-list-item-title>
                <v-btn depressed rounded text @click="logout"> <i class="fa-solid fa-arrow-right-from-bracket mr-1"></i> ออกจากระบบ </v-btn>
              </v-list-item-title>
            </v-list-item>
          </v-list>

          <!-- <v-card>
            <v-list-item-content class="justify-center">
              <div class="mx-auto text-center">
                <h3>{{ check_roles.name }} {{ check_roles.lastname }}</h3>
                <p class="text-caption mt-1">
                  {{ check_roles.email }}
                </p>
                <v-divider class="my-3"></v-divider>

                <v-btn depressed rounded text @click="editProfile"> แก้ไขโปรไฟล์ </v-btn>
                <v-divider v-if="check_roles.roles == 'user'" class="my-3"></v-divider> 
                <v-btn
                  v-if="check_roles.roles == 'user'"
                  depressed
                  rounded
                  text
                  @click="opensumone()"
                >
                  เปลี่ยนรหัสผ่าน
                </v-btn>
                <v-divider v-if="check_roles.roles != 'user'" class="my-3"></v-divider>
              
              </div>
            </v-list-item-content>
          </v-card> -->

        </v-menu>

        <DialogsResetPassword ref="sum" :userId="check_roles.id" />

        <!-- <button @click="logout" id="logout"><i class="fa-solid fa-arrow-right-from-bracket"></i> Logout</button> -->
      </div>
      </v-app-bar>
    <v-main class="main">
      <v-container>
          <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import DialogsResetPassword from '@/components/dialogsResetPassword.vue';
import store from '../store/index.js';
  export default {
    name: "MyHome",
    components: { DialogsResetPassword},
    data: () => ({
        dialog: false,
        drawer: true,
        check_roles: store.getters.user,
    }),
    methods: {
      opensumone () {
        this.$refs.sum.open()
      },
      homeUser(){
        this.$router.push("/user/login");
      },

      async editProfile(){
        if(this.check_roles.roles === 'user'){
          await this.$router.push("/user/profile").catch(()=>{});
        }else{
          this.$router.push({ name: 'personal_detail',  params: { id: this.check_roles.id}})
        }
      },
      async logout() {
          await this.$store.dispatch("logout");
          if (this.check_roles.roles === "user") {
              await this.$router.push("/user/login");
          }
          else {
              await this.$router.push("/backoffice/login");
          }
      }
    },
  
}
</script>
<style>
  .v-application{
    font-family: 'Prompt', sans-serif!important;
  }
  .sidebar{
    background-color: #167dc2!important;
    padding: 0;
  }
  .head-menuhome{
    flex-wrap: inherit!important;
    width: 100%;
  }
  .text-head{
    color: white;
    font-size: 17px!important;
  }
  .logo-cgd{
    max-width: 48px;
    height: 48px;
  }
  .logo-cgd img{
    width: 100%;
  }
  /* .sidebar .head{
    height: 64px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 15px;

  } */
  .navbar{
    background-color: #167dc2!important;
    color: white!important;
  }
  .navbar-icon{
    color: white!important;
  }

  .style-navbar {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
  .main{
    background-color: #eef0f8;
  }
  .activemenu,
  .router-link-exact-active{
    background-color: #003366;
  
  }
  .activemenu:hover,
  .router-link-exact-active:hover{
    background-color: #003366;
  }
  .activemenu .menu-icon,
  .activemenu .menu-text{
    color: white!important;
  }
  .menu-link:hover{
    background-color: #003366;
  }
  .menu-link{
      text-decoration: none;
      border-radius: 4px;
      margin-bottom: 0.5rem;
  }
  .menu-icon {
    width: 20px;
    margin-right: 1rem;
    font-size: 18px;
    color: white;
  }
  .menu-text {
    color: white;
    font-size: 14px!important;
    text-align: left;
    line-height: inherit!important;
    font-weight: 300!important;
  }
  .style-page{
    /* margin: 0 1rem; */
    /* width: 100%;
    max-width: 900px; */
    padding: 1.5rem;
    background-color: white;
    border-radius: 15px;
    /* box-shadow: 0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12)!important; */
  } 
  .style-label{
    text-align: left;
    margin-bottom: 2px!important;
    font-size: 14px;
  }
  .style-label span{
    color: red;
    font-size: 16px;
  }
  .h2{
       text-align: left;
    font-size: 20px;
    font-weight: bold;
  }
  .error_message{
    text-align: left;
    font-size: 12px;
    color: #ff5252;
    margin-top: 4px;
  }

  .btn-cancel{
    border: 1px solid #003366;
    color: #003366;
  }
  .btn-submit{
      border: 1px solid #003366;
      background-color: #003366!important;
      color: white!important;
  }
  .f-24 {
    font-size: 24px;
    cursor: pointer;
  }
  .f-16{
    font-size: 14px;
  }
  /* .v-app-bar.v-app-bar--fixed{
    z-index: 1;
  }
  .v-navigation-drawer--fixed {
    z-index: 1;
} */
</style>
