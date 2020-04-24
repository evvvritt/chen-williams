import Vue from 'vue'
import Router from 'vue-router'
import Category from '@/components/Category'
import Product from '@/components/Product'
const _Object = () => import('@/components/Object')

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home'
    },
    {
      path: '/products',
      redirect: '/'
    },
    {
      path: '/products/:handle',
      name: 'Product',
      component: Product,
      props: true
    },
    {
      path: '/:catSlug/partners',
      name: 'Partners',
      component: Category
    },
    {
      path: '/:catSlug',
      name: 'Category',
      component: Category,
      props: true,
      children: [
        {
          path: '/item/:slug',
          name: 'CategoryObject',
          component: _Object,
          props: true,
          meta: {
            isOverlay: true
          }
        }
      ]
    },
    {
      path: '*',
      name: '404',
      redirect: '/'
    }
  ]
})
