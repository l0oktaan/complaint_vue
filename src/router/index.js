import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index.js'


// user
import LayoutView from "../views/users/LayoutView.vue"
import MainView from "../views/users/main/MainView.vue"
import ContactView from "../views/users/contact/ContactView.vue"
import UserLoginView from '../views/users/LoginView.vue'

import ForgotPasswordView from '../views/users/ForgotPassword.vue'
import ResetPasswordView from '../views/users/ResetPassword.vue'
import ComplainView from '../views/users/complain/ComplainView.vue'
import FollowView from '../views/users/follow/FollowView.vue'
import FollowDetail from '../views/users/follow/FollowDetail.vue'


// backoffice
import LoginView from '../views/backoffice/LoginView.vue'
import ReceiveComplain from "../views/backoffice/receive/ReceiveView.vue"
import ReceiveDetail from "../views/backoffice/receive/ReceiveDetail.vue"
import PersonnelView from '../views/backoffice/personnel/UserViews.vue'
import PersonnelForm from '../views/backoffice/personnel/UserForm.vue'
import PersonnelFormEdit from '../views/backoffice/personnel/UserForm.vue'
import BackofficeFollowView from '../views/backoffice/follow/FollowView.vue'
import BackofficeFollowDetail from '../views/backoffice/follow/FollowDetail.vue'
import ReportView from '../views/backoffice/report/ReportView.vue'

import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'

import EditProfile from '../views/EditProfile.vue'



Vue.use(VueRouter)

const routes = [


  // backoffice
  {
    path: '/backoffice/login',
    name: 'login',
    component: LoginView,
    beforeEnter (to, from, next) {
      store.dispatch('checkLogin')
      if (store.state.user) {         
        next({ name: 'about' })
      } else {
          next()
      }
    },
  },

  // user
  {
    path: '/',
    component: LayoutView,

    children: [
      {
        path: '/',
        name: 'main',
        component: MainView,
      },
      {
        path: '/user/contact',
        name: 'contact',
        component: ContactView,
      },

      {
        path: '/user/login',
        name: 'userLogin',
        component: UserLoginView,
        // beforeEnter (to, from, next) {
        //   store.dispatch('checkLogin')
        //   if (store.state.user) {         
        //     next({ name: 'complaint' })
        //   } else {
        //       next()
        //   }
        // },
      },
    ]
  },

  {
    path: '/user/forgot-password',
    name: 'forgot-password',
    component: ForgotPasswordView,
    
  },
  {
    path: '/user/reset-password',
    name: 'reset-password',
    component: ResetPasswordView,
    
  },

  {
    path: '/',
    component: HomeView,
    beforeEnter (to, from, next) {
      store.dispatch('checkLogin')
      if (store.state.user) {     
          next()          
      } else {
        if(store.state.user == 'user'){
          next('/user/login')
        }else{
          next('/backoffce/login')
        } 
      }
    },

    children: [
      {
        path: '/user/report',
        name: 'complain-report',
        component: ComplainView,
      },
      {
        path: '/user/follow/detail/:id',
        name: 'complain-detail',
        component: FollowDetail,
      },
      {
        path: '/user/follow',
        name: 'complain-follow',
        component: FollowView,
      },
     
      {
        path: '/user/profile',
        name: 'profile',
        component: EditProfile,
      },

      {
        path: '/backoffice/receive',
        name: 'receive',
        component: ReceiveComplain,
        
      },

      {
        path: '/backoffice/receive/detail/:id',
        name: 'receive-detail',
        component: ReceiveDetail,
        
      },

      {
        path: '/backoffice/follow',
        name: 'backoffice-follow',
        component: BackofficeFollowView,
      },

      {
        path: '/backoffice/follow/detail/:id',
        name: 'backoffice-complaindetail',
        component: BackofficeFollowDetail,
      },



      {
        path: '/backoffice/personnel',
        name: 'personnel',
        component: PersonnelView,
        
      },
      {
        path: '/backoffice/personnel/form',
        name: 'personnel_form',
        component: PersonnelForm
      },
      {
        path: '/backoffice/personnel/form/:id',
        name: 'personnel_formedit',
        component: PersonnelFormEdit
      },
      {
        path: '/backoffice/report',
        name: 'report_view',
        component: ReportView
      },

      {
        path: '/user/testPdf',
        name: 'about',
        component: AboutView,
        
      }
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
