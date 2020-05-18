<template>
  <p @click="$router.go(-1)" class="backButton">Back</p>
</template>

<script>
export default {

}
</script>

<style>
 .backButton {
     cursor: pointer;
     padding: .5rem;
 }
</style>