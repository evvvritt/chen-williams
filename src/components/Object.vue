<template lang="pug">
  article.is-overlay
    background
    header
      nav.nav
        ul.cw-grid
          li.cw-grid__item
            router-link(to="/")
              img(src='../assets/logo.svg')
          li.cw-grid__item
            router-link(:to="closeTo")
              radio-btn
            router-link(:to="closeTo").nav__link Close
    main-content
</template>

<script>
import Background from '@/components/DotGrid'
import MainContent from '@/components/MainBody'
import RadioBtn from '@/components/RadioBtn'
export default {
  name: 'Object',
  components: {
    Background,
    MainContent,
    RadioBtn
  },
  data () {
    return {

    }
  },
  computed: {
    closeTo () {
      return this.$route.meta.closeTo ? {name: this.$route.meta.closeTo} : '/'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../style/variables';

article{
  position: fixed;
  width:100%;
  height:100%;
  z-index: $z-overlay;
  background:$white;
  padding:$gutter;

  header{
    position: absolute;
    top:0; left:0;
    width:100%;
  }
}
</style>