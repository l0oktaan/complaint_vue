import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index.js'


// user
import LayoutView from "../views/users/LayoutView.vue"
import MainView from "../views/users/main/MainView.vue"
import ContactView from "../views/users/contact/ContactView.vue"
import UserLoginView from '../views/users/LoginView.vue'
import FollowView from '../views/users/follow/FollowView.vue'
import FollowDetail from '../views/users/follow/FollowDetail.vue'
import ComplainView from '../views/users/complain/ComplainView.vue'
import EditProfile from '../views/EditProfile.vue'

import ForgotPasswordView from '../views/users/ForgotPassword.vue'
import ResetPasswordView from '../views/users/ResetPassword.vue'




// backoffice
import LoginView from '../views/backoffice/LoginView.vue'
import ReceiveComplain from "../views/backoffice/receive/ReceiveView.vue"
import ReceiveDetail from "../views/backoffice/receive/ReceiveDetail.vue"
import BackofficeFollowView from '../views/backoffice/follow/FollowView.vue'
import BackofficeFollowDetail from '../views/backoffice/follow/FollowDetail.vue'
import PersonnelView from '../views/backoffice/personnel/UserViews.vue'
import PersonnelForm from '../views/backoffice/personnel/UserForm.vue'
import PersonnelFormEdit from '../views/backoffice/personnel/UserForm.vue'
import RegisterComplain from '../views/backoffice/register/RegisterViews.vue'
import Registerform from '../views/backoffice/register/RegisterForm.vue'
// import ReportView from '../views/backoffice/report/ReportView.vue'


import HomeView from '../views/HomeView.vue'
import HomeUserView from '../views/HomeView.vue'
import PageNotFound from '../views/NotFound.vue'
// import AboutView from '../views/AboutView.vue'





Vue.use(VueRouter)


const routes = [

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
    path: '/backoffice/login',
    name: 'login',
    component: LoginView
  },
  { 
    path: '/',
    component: HomeView,
    beforeEnter (to, from, next) {
      store.dispatch('checkLogin')
      if (store.state.user && store.state.user.roles !== 'user') {   
        next()    
      }else{
        // next('/backoffice/login')
        next({ name: 'login' })
      }
    },

    children: [
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
        path: '/backoffice/register',
        name: 'register_complain',
        component: RegisterComplain
      },
      {
        path: '/backoffice/register/form/:id',
        name: 'register_form',
        component: Registerform
      },

    ]

  },

  {
    path: '/user/login',
    name: 'userLogin',
    component: UserLoginView
  },

  { 
    path: '/',
    component: HomeUserView,
    beforeEnter (to, from, next) {
      store.dispatch('checkLogin')
      if(store.state.user && store.state.user.roles == 'user'){
        next()      
      }else{
        // console.log('==========');
        // next('/user/login')
        next({ name: 'userLogin' })
      }
    },

    children: [
      {
        path: '/user/profile',
        name: 'profile',
        component: EditProfile,
      },

      {
        path: '/user/follow',
        name: 'complain-follow',
        component: FollowView,
      },
      {
        path: '/user/follow/detail/:id',
        name: 'complain-detail',
        component: FollowDetail,
      },

      {
        path: '/user/report',
        name: 'complain-report',
        component: ComplainView,
      },
    
    ]

  },

  { path: '/:pathMatch(.*)*', component: PageNotFound },

  // {
  //   path: '/:pathMatch(.*)',
  //   redirect: '/page-not-found'
  // },
  // // Define the "Page Not Found" route
  // {
  //   path: '/page-not-found',
  //   component: PageNotFound
  // }

]

// const routes = [


//   // backoffice
//   {
//     path: '/backoffice/login',
//     name: 'login',
//     component: LoginView,
//     beforeEnter (to, from, next) {
//       store.dispatch('checkLogin')
//         if (store.state.user) {    
//           console.log('=========', store.state.user);     
//         next({ name: 'receive' })
//       } else {
//         console.log('1111');     
//           next()
//       }
//     },
//   },

//   // user
//   {
//     path: '/',
//     component: LayoutView,

//     children: [
//       {
//         path: '/',
//         name: 'main',
//         component: MainView,
//       },
//       {
//         path: '/user/contact',
//         name: 'contact',
//         component: ContactView,
//       },

//       {
//         path: '/user/login',
//         name: 'userLogin',
//         component: UserLoginView,
//         // beforeEnter (to, from, next) {
//         //   store.dispatch('checkLogin')
//         //   if (store.state.user) {         
//         //     next({ name: 'complaint' })
//         //   } else {
//         //       next()
//         //   }
//         // },
//       },
//     ]
//   },

//   {
//     path: '/user/forgot-password',
//     name: 'forgot-password',
//     component: ForgotPasswordView,
    
//   },
//   {
//     path: '/user/reset-password',
//     name: 'reset-password',
//     component: ResetPasswordView,
    
//   },

//   {
//     path: '/',
//     component: HomeView,
//     // beforeEnter (to, from, next) {
//     //   store.dispatch('checkLogin')
//     //   if (store.state.user) {   
//     //     console.log('========>','test');  
//     //       next()          
//     //   } else {
//     //     if(store.state.user == 'user'){
//     //       console.log('========>','user');
//     //       next('/user/login')
//     //     }
//     //   }
//     // },


//     // beforeEnter (to, from, next) {
//     //   store.dispatch('checkLogin')
//     //   if (store.state.user == 'user') {     
//     //     console.log('user');
//     //     next('/user/login')
                  
//     // }else if(store.state.user != 'user'){
//     //     console.log('admin');
//     //     next('/backoffice/login')
//     // }else {
//     //     next()  
//     //   }
//     // },
//     children: [
//       {
//         path: '/user/report',
//         name: 'complain-report',
//         component: ComplainView,
//       },
//       {
//         path: '/user/follow/detail/:id',
//         name: 'complain-detail',
//         component: FollowDetail,
//       },
//       {
//         path: '/user/follow',
//         name: 'complain-follow',
//         component: FollowView,
//       },
     
//       {
//         path: '/user/profile',
//         name: 'profile',
//         component: EditProfile,
//       },

//       {
//         path: '/backoffice/receive',
//         name: 'receive',
//         component: ReceiveComplain,
        
//       },

//       {
//         path: '/backoffice/receive/detail/:id',
//         name: 'receive-detail',
//         component: ReceiveDetail,
        
//       },

//       {
//         path: '/backoffice/follow',
//         name: 'backoffice-follow',
//         component: BackofficeFollowView,
//       },

//       {
//         path: '/backoffice/follow/detail/:id',
//         name: 'backoffice-complaindetail',
//         component: BackofficeFollowDetail,
//       },



//       {
//         path: '/backoffice/personnel',
//         name: 'personnel',
//         component: PersonnelView,
        
//       },
//       {
//         path: '/backoffice/personnel/form',
//         name: 'personnel_form',
//         component: PersonnelForm
//       },
//       {
//         path: '/backoffice/personnel/form/:id',
//         name: 'personnel_formedit',
//         component: PersonnelFormEdit
//       },
//       {
//         path: '/backoffice/register',
//         name: 'register_complain',
//         component: RegisterComplain
//       },
//       {
//         path: '/backoffice/register/form/:id',
//         name: 'register_form',
//         component: Registerform
//       },

      
//       {
//         path: '/backoffice/report',
//         name: 'report_view',
//         component: ReportView
//       },

//       {
//         path: '/user/testPdf',
//         name: 'about',
//         component: AboutView,
        
//       }
//     ]
//   },
// ]

const router = new VueRouter({
  mode: 'history',
  // routes: [
  //     // ... other routes ...
  //     // and finally the default route, when none of the above matches:
  //     { path: "*", component: PageNotFound }
  // ]
  // base: process.env.BASE_URL,
  routes
})



export default router
