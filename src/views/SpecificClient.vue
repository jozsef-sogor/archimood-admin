<template>
  <article class="wrapper">
      <section v-if="!selectedUser">
          <h1>This user doesn't exist.</h1>
          <p>Maybe it got deleted.</p>
          <p>todo: put in go back button</p>
      </section>
      <section v-else>
        <h1>{{ currentUserId }}</h1>
        <h2>{{selectedUser.name}}</h2>
      </section>
  </article>
</template>

<script>
export default {
    data() {
        return {

        }
    },

    computed: {
        currentUserId: function() {
            return this.$route.params.userId
        },
        selectedUser: function() {
            let allUsers = this.$store.getters.getClients;
            return allUsers.find(user => user.id == this.currentUserId)
        }
    },
}
</script>

<style>

</style>