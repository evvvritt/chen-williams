'use strict'
const _str = str => '"' + str + '"'
const d = process.env.PRIMARY_DOMAIN || 'https://www.cckw.us'
const p = process.env.PRISMIC || 'https://cckwus.cdn.prismic.io/api/v2'
const c = process.env.CLOUDINARY || 'https://res.cloudinary.com/dkh08saaw'
const sD = process.env.SHOPIFY_DOMAIN || 'chen-williams.myshopify.com'
const sT = process.env.SHOPIFY_TOKEN || '277a343d590f32670f02b39fcfb5c74c'
const ga = process.env.GOOGLE_ANALYTICS_ID || 'UA-15145462-4' // dev id

module.exports = {
  NODE_ENV: '"production"',
  PRIMARY_DOMAIN: _str(d),
  PRISMIC: _str(p),
  CLOUDINARY: _str(c),
  SHOPIFY_DOMAIN: _str(sD),
  SHOPIFY_TOKEN: _str(sT),
  GOOGLE_ANALYTICS_ID: _str(ga)
}
