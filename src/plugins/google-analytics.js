/* global ga */

const ID = process.env.GOOGLE_ANALYTICS_ID

const init = function () {
  if (!ID) return false
  // Initialize Google Analytics Tracking
  // https://github.com/googleanalytics/autotrack
  // GA plugin's script generated via npm script (package.json) and loaded in index.html
  window.ga = window.ga || function () { (ga.q = ga.q || []).push(arguments) }; ga.l = +new Date()
  ga('create', ID, 'auto')
  // plugins
  ga('require', 'cleanUrlTracker', {
    trailingSlash: 'remove'
  })
  ga('require', 'urlChangeTracker')
  ga('require', 'outboundLinkTracker')
  ga('require', 'pageVisibilityTracker')
  ga('require', 'maxScrollTracker')
  // save initial page view
  ga('send', 'pageview')
}

module.exports = init
