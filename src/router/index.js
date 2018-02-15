import Vue from 'vue'
import Router from 'vue-router'
import Category from '@/components/Category'
import Object from '@/components/Object'

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
          name: 'CategoryObject',
          component: Object,
          meta: {
            isOverlay: true
          }
        }
      ]
    },
    {
      path: '/:catSlug/partners',
      name: 'Partners',
      component: Category
    }
  ]
})
