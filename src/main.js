// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import { RichText } from 'prismic-dom'

Vue.config.productionTip = process.env.NODE_ENV === 'production'
Vue.config.IMG = {
  url: process.env.CLOUDINARY,
  sizes: [320, 480, 640, 1024, 1280, 1536, 1750, 2048, 2389]
}
Vue.config.bkpts = {
  mobile: 768
}

Vue.is = (name) => {
  if (name === 'mobile') return window.innerWidth <= Vue.config.bkpts.mobile
  return false
}

// Cloudinary thumb fetching
Vue.thumbSrc = (src, length, useHeight = false, format = 'jpg') => {
  // return `${Vue.config.IMG.url}/image/fetch/${src}`
  let optimal = 0
  const dpx = window.devicePixelRatio * 0.8 // less density optically ok ?
  length = length * dpx
  const sizes = Vue.config.IMG.sizes
  for (var i = 0; i < sizes.length; i++) {
    if (length <= sizes[i]) {
      optimal = sizes[i]
      break
    }
  }
  const size = optimal === 0 ? sizes[sizes.length - 1] : optimal
  const urlParam = useHeight ? 'h_' + size : 'w_' + size
  return `${Vue.config.IMG.url}/image/fetch/q_auto:best,${urlParam},f_${format}/${src}`
}

// update Meta
Vue.updateMeta = {
  _siteTitle: 'Chen Williams',
  _siteDescription: 'Chen Chen & Kai Williams is a design studio that explores materials and new ways to use them',
  setTitle (pageTitle = '') {
    const title = pageTitle.length > 0 ? pageTitle + ' | ' + this._siteTitle : this._siteTitle
    document.title = title
  },
  setDescription (descrip = '') {
    descrip = descrip.length > 0 ? descrip : this._siteDescription
    const set = (el, txt) => el ? el.setAttribute('content', txt) : false
    const meta = document.querySelector('meta[name="description"]')
    const ogMeta = document.querySelector('meta[property="og:description"]')
    set(meta, descrip)
    set(ogMeta, descrip)
  },
  set (title, descrip) {
    this.setTitle(title)
    this.setDescription(descrip)
  }
}

// Prismic raw Text
Vue.filter('text', function (value) {
  if (!value || !value[0]) return ''
  return value[0].text
})

// Prismic Rich Text
Vue.filter('richtext', function (key) {
  if (!key) return ''
  const html = RichText.asHtml(key, (doc) => {
    // Link Resolving
    if (doc.type === 'info') return '#info'
    if (doc.type === 'category') return '/' + doc.uid
    if (doc.type === 'object') return '/item/' + doc.uid
    if (doc.type === 'partners') return '/shop/partners'
    if (doc.type === 'site') return '/'
    // Fallback
    return '/doc/' + doc.uid
  })
  return html
})

Vue.filter('price', function (str) {
  return str ? '$' + str.replace('.00', '') : ''
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
