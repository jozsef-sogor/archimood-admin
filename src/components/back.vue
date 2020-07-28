<template>
  <i @click="$router.go(-1)" class="backButton material-icons">keyboard_arrow_left</i>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
 .backButton {
     cursor: pointer;
     font-size: 2rem;
     padding: 1rem .5rem;
 }
</style>