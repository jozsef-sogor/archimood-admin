<template>
  <div class="smallLoaderContainer">
      <div class="loader"></div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
    .smallLoaderContainer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255,255,255,0.5);
    }

.loader {
  margin: 50% auto;
  border: 5px solid #000;
  border-top: 5px solid transparent; 
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>