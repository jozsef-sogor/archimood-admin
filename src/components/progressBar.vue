<template>
<div class="progressContainer">
  <div class="progressBar neo-down">
      <div class="progressLine neo-up" :style="{width: width}"></div>
  </div>
  <p v-if="showSteps"><strong>{{progress}}</strong> out of {{maxValue}} steps are done</p>
  </div>
</template>

<script>
export default {
    props: [
        'maxValue',
        'progress',
        'showSteps'
    ],
    computed: {
        width: function() {
            return this.progress / this.maxValue * 100 + '%'
        }
    }
}
</script>

<style lang="scss" scoped>
    .progressBar{
        width: 80%;
        margin: 1.5rem auto 0;
        padding: .6rem;
        position: relative;
        border-radius: 7px;
        .progressLine {
            padding: .5rem;
            transition: .3s ease-in-out;
            border-radius: 5px;
            background: linear-gradient(102.56deg, #F8F8F8 0%, #DFDFDF 100%), #F8F8F8;
            max-width: calc(100% - 1rem);
        }
    }
    p {
        text-align: center;
        margin-bottom: 2rem;
    }
</style>