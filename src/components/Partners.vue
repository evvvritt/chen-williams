<template lang="pug">
  section.mbl-block.flex.flex-wrap.fades(:class="{'opacity-0': loading}")
    template(v-if="partners && partners.body")
      article.bg-gray.relative.pointer(v-for="partner in partners.body")
        //- sizer
        .pb-100
        //- content
        a.radio-btn-label.overlay.absolute(:href="partner.primary.link.url", target="_blank", rel="noopener")
          header.z2.absolute.top-0.left-0
            h1.hidden {{partner.primary.name | text}}
            template(v-if="partner.primary.logo.url")
              img.block.p1(:src="partner.primary.logo.url", :alt="partner.primary.logo.alt || 'Logo'")
          div.z1.absolute.top-0.left-0.pt-2rows.w-100
            .p1(v-html="$options.filters.richtext(partner.primary.description)")
          figure.z0.overlay.absolute.bg-cover.fades(:style="'background-image:url(' + thumb(partner.primary.background_image.url) + ')'")
            img.hidden(:src="thumb(partner.primary.background_image.url)", :alt="partner.primary.background_image.alt || 'Accent Image'")
        radio-btn(fill="white")
</template>

<script>
import Vue from 'vue'
import RadioBtn from '@/components/RadioBtn'
export default {
  name: 'Partners',
  components: { RadioBtn },
  computed: {
    partners () {
      return this.$store.state.partners
    }
  },
  data () {
    return {
      loading: true
    }
  },
  methods: {
    thumb (src) {
      if (!src) return ''
      const length = Vue.is('mobile') ? window.innerWidth : window.innerWidth / 4
      return Vue.thumbSrc(src, length)
    }
  },
  created () {
    this.$store.dispatch('getPartners').then(() => {
      this.loading = false
    })
  }
}
</script>

<style lang="scss" scoped>
@import '../style/variables';

header{
  width:25%;
  img{
    width:75%;
    box-sizing:content-box;
  }
}

// background
figure{
  opacity:.5;
  mix-blend-mode:multiply;
  .no-touchevents & { opacity:0 }
  .no-touchevents article:hover & { opacity: 1 }
}

@include grid9 {
  $width: calc(100%/9 * 3);
  header{ width:$width; }
  article{
    flex:0 0 $width;
  }
}
@include grid12 {
  $width: calc(100%/12 * 3);
  header{ width:$width; }
  article{
    flex:0 0 $width;
  }
}
@include grid15 {
  $width: calc(100%/15 * 3);
  header{ width:$width; }
  article{
    flex:0 0 $width;
  }
}
</style>
