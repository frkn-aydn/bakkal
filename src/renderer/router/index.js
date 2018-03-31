import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'dashboard-page',
      component: require('@/components/DashboardPage')
    },
    {
      path: '/product-management',
      name: 'product-management-page',
      component: require('@/components/ProductManagementPage')
    },
    {
      path: '/selling',
      name: 'selling-page',
      component: require('@/components/SellingPage')
    },
    {
      path: '/history',
      name: 'history-page',
      component: require('@/components/HistoryPage')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
