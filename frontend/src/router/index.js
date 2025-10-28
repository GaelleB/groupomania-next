import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import SignupView from '../views/SignupView.vue'
import LoginView from '../views/LoginView.vue'
import ProfileView from '../views/ProfileView.vue'
import AllPosts from '../views/AllPosts.vue'
import PostView from '../views/PostView.vue'
import NewPost from '../views/NewPost.vue'
import ModifyPost from '../views/ModifyPost.vue'

const routes = [ 
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/signup',
    name: 'Signup',
    component: SignupView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  
  {
    path: '/allposts',
    name: 'Allposts',
    component: AllPosts
  },
  {
    path: '/post/:id',
    name: 'Post',
    component: PostView
  },
  
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView
  },
  {
    path: '/postnew',
    name: 'NewPost',
    component: NewPost
  },
  
  {
    path: '/postmodify/:id',
    name: 'ModifyPost',
    component: ModifyPost
  }, 
  ]

const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router