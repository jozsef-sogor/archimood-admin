<template>
  <p @click="$router.go(-1)">Back</p>
</template>

<script>
export default {

}
</script>

<style>
 p {
     cursor: pointer;
     padding: .5rem;
 }
</style>