<template>
  <div id="app">
    <router-view />
    <Navigation v-if="isAuth"></Navigation>
    <notification></notification>
  </div>
</template>
<script>
import Navigation from './components/Nav';
import notification from './components/notification'
const fb = require('./firebaseConfig');
export default {
  name: 'app',
  components: {
    'Navigation': Navigation,
    'notification': notification
  },
  computed: {
    isAuth: function() {
      return this.$store.getters.getAuthenticated
    }
  },
  created: function() {
    //this.dataCheck();
  },
  methods: {
    dataCheck: function() {
      if(!this.$store.getters.getDataFetched) {
        fb.functions.initialFetch()
      }
    }
  }
}
</script>
<style lang="scss">
  nav {
    width: 100vw;
    height: auto;
    position: fixed;
    bottom: 0;
    left: 0;
  }
  .wrapper {
    margin-bottom: 5rem;
  }

    @media screen and (min-width: 1024px) {
    nav {
      width: auto;
      max-width: 75px;
      height: 100%;
      flex-direction: column;
    }
    .wrapper {
      margin-bottom: auto;
      margin-left: 100px;
    }
}
</style>
