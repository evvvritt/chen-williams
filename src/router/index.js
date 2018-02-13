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
      name: 'Home'
    },
    {
      path: '/:catSlug',
      name: 'Category',
      component: Category,
      props: true,
      children: [
        {
          path: ':slug',
          name: 'Product',
          component: Object,
          meta: {
            isOverlay: true,
            closeTo: 'Shop'
          }
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
