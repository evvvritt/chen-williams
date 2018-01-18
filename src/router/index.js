import Vue from 'vue'
import Router from 'vue-router'
import Category from '@/components/Category'
import Object from '@/components/Object'
import Page from '@/components/Page'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/shop'
    },
    {
      path: '/shop',
      name: 'Shop',
      component: Category,
      children: [
        {
          path: ':slug',
          name: 'Product',
          component: Object
        }
      ]
    },
    {
      path: '/shop/partners',
      name: 'Partners',
      component: Category
    },
    {
      path: '/furniture',
      name: 'Furniture',
      component: Category
    },
    {
      path: '/projects',
      name: 'Projects',
      component: Category
    },
    {
      path: '/:slug',
      name: 'Page',
      component: Page
    }
  ]
})
