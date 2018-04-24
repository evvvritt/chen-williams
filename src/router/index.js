import Vue from 'vue'
import Router from 'vue-router'
import Category from '@/components/Category'
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
    }
  ]
})
