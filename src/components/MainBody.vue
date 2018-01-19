<template lang="pug">
  section.main-content
    slot
</template>

<script>
export default {
  name: 'MainBody',
  data () {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
section{
  padding-top: 20%;
  @media (min-width:769px) {
    padding-top: calc(100% / 9 * 2);
  }
  @media (min-width:1441px) {
    padding-top: calc(100% / 12 * 2);
  }
  @media (min-width:1900px) {
    padding-top: calc(100% / 15 * 2);
  }
}
</style>