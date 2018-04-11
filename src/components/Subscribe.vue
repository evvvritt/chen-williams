<template>
  <form id="mc-embedded-subscribe-form" action="http://chen-williams.us7.list-manage.com/subscribe/post?u=c5bdca666893be0f93b28b913&amp;id=61fd4a23af" method="post" name="mc-embedded-subscribe-form" target="_blank" validate>
    <label for="mce-EMAIL" class="hidden">Email</label>
    <div class="flex items-center">
      <input class="inline-block" id="mce-EMAIL" name="EMAIL" required="" type="email" value="" placeholder="email">
      <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
      <input style="position: fixed; left: -5000px; top: -5000px;" name="b_c5bdca666893be0f93b28b913_61fd4a23af" type="text" value="">
      <input id="mc-embedded-subscribe" class="ml1 pointer" name="subscribe" type="submit" value="Subscribe">
    </div>
  </form>
</template>

<script>
export default {
  name: 'Subscribe'
}
</script>

<style lang="scss" scoped>
input{
  appearance:none;
  &[type="email"]{
    border-style:solid;
    background-color:white;
    border-radius: 10em;
    color:inherit;
    padding:.22em 1em .25em;
    // transform:translateY(.18em);
    &::placeholder{
      color:inherit;
    }
    &:focus{
      outline: none;
      &::placeholder{
        color:transparent;
      }
    }
  }
  &[type="submit"]{
    border:none;
    background:none;
    padding-bottom: .125em;
    border-bottom: 1px solid gray;
  }
}
</style>
