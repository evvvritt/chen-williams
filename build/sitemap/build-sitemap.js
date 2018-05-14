const SitemapGenerator = require('sitemap-generator')
const config = require('../../config/prod.env')
const Prismic = require('prismic-javascript')
const rmvDblQts = str => str.replace(/['"]+/g, '')
const PrismicAPIUrl = rmvDblQts(config.PRISMIC)
const PrimaryDomain = rmvDblQts(config.PRIMARY_DOMAIN)
 
// create generator
const generator = SitemapGenerator(PrimaryDomain, {
  stripQuerystring: false,
  filepath: './root/sitemap.xml'
})

// based on routes in src/router/index.js
// generator.queueURL('/collections')

// Dynamic urls
// will only add if allowed by live robots.txt file !
Prismic.getApi(PrismicAPIUrl).then(function (api) {
  return api.query(
    Prismic.Predicates.any('document.type', ['site', 'category']),
    { pageSize: 100, fetchLinks: ['category.title', 'partners.title'] }
  )
}).then((response) => {
  const docs = response.results || []
  const cats = []
  // loop through docs
  docs.forEach(doc => {
    // site doc
    if (doc.type === 'site') {
      const nav = doc.data && doc.data.nav
      // loop through nav items
      if (nav && nav.length > 0) {
        nav.forEach(item => {
          const data = item.primary
          if (data) {
            const slug = data.category_link && data.category_link.type && data.category_link.type === 'category' && data.category_link.uid
            if (slug !== undefined) {
              cats.push(slug)
              generator.queueURL('/' + slug)
            }
          }
        })
      }
    }
    // category
    // excluding since pagination isn't setup (limit 100)
    // trusting google crawls 'objects' automatically after including categories
    /*
    } else if (doc.type === 'category') {
      const objs = doc.data && doc.data.objects
      // add objects
      if (objs && objs.length > 0) {
        objs.forEach(obj => {
          const slug = obj.primary && obj.primary.object && obj.primary.object.uid
          if (slug !== undefined) generator.queueURL('/item/' + slug)
        })
      }
    }
    */
  })
}).catch((err) => {
  console.log('Error getting Docs: ', err)
})

// register event listeners
generator.on('done', () => {
  // sitemaps created
})

generator.on('add', (url) => {
  console.log(url)
})
 
// start the crawler
generator.start()