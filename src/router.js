import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import(/* webpackChunkName: "index" */ './views/Index.vue')
      
    },
    {
      path: '/seting',
      name: 'seting',
      component: () => import(/* webpackChunkName: "seting" */ './views/Seting.vue')

      
    },
    {
      path: '/topics-list',
      name: 'topics-list',
      component: () => import(/* webpackChunkName: "topics-list" */ './views/TopicsList.vue')

      
    },
    {
      path: '/edit/:id',
      name: 'edit',
      component: () => import(/* webpackChunkName: "edit" */ './views/Edit.vue')
      
    },
    {
      path: '/new-app/',
      name: 'new-app',
      component: () => import(/* webpackChunkName: "addapp" */ './views/AddApp.vue')
      
    }
  ]
})
