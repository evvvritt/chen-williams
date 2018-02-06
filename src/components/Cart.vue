<template lang="pug">
  aside.fixed.overlay.z-overlay.p2
    overlay-header.absolute.top-0.left-0.w-100
    section.pt-2rows
</template>

<script>
import OverlayHeader from '@/components/OverlayHeader'
export default {
  name: 'Cart',
  components: { OverlayHeader }
}
</script>
