import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index.js'


// user
import LayoutView from "../views/users/LayoutView.vue"
import MainView from "../views/users/MainView.vue"
import ContactView from "../views/users/ContactView.vue"
import UserLoginView from '../views/users/LoginView.vue'
import EditProfile from '../views/users/EditProfile.vue'
import ForgotPasswordView from '../views/users/ForgotPassword.vue'
import ResetPasswordView from '../views/users/ResetPassword.vue'
import ComplainView from '../views/users/complain/ComplainView.vue'
import FollowView from '../views/users/complain/FollowView.vue'
import ComplainDetail from '../views/users/complain/ComplainDetail.vue'


// backoffice
import LoginView from '../views/backoffice/LoginView.vue'
import BackofficeComplaint from "../views/backoffice/complaint/ComplaintView.vue"
import ReceiveComplain from "../views/backoffice/complaint/ReceiveComplain.vue"
import SearchView from "../views/backoffice/search/SearchView.vue"
import PersonnelView from '../views/backoffice/personnel/UserViews.vue'
import PersonnelForm from '../views/backoffice/personnel/UserForm.vue'
import PersonnelFormEdit from '../views/backoffice/personnel/UserForm.vue'

import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'




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
          next('/user/login')
      }
    },

    children: [
      {
        path: '/user/report/complain',
        name: 'complain',
        component: ComplainView,
      },
      {
        path: '/user/complain/detail/:id',
        name: 'complain-detail',
        component: ComplainDetail,
      },
      {
        path: '/user/complain',
        name: 'complain-follow',
        component: FollowView,
      },
     
      {
        path: '/user/profile',
        name: 'profile',
        component: EditProfile,
      },

      {
        path: '/backoffice/complaint',
        name: 'complaint',
        component: BackofficeComplaint,  
      },

      {
        path: '/backoffice/search',
        name: 'search',
        component: SearchView,
        
      },

      {
        path: '/backoffice/receive_complaint',
        name: 'receive',
        component: ReceiveComplain,
        
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
        path: '',
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
