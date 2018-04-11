<template lang="pug">
nav.p2
  router-link.btn(:to="{hash: 'info'}") Get 10% coupon
</template>

<script>
export default {
  name: 'CouponBtn'
}
</script>
