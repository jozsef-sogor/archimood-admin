<template>
  <article class="wrapper">
      <section v-if="!selectedUser">
          <div class="title">
              <Back></Back>
          </div>
          <h1>This user doesn't exist.</h1>
          <p>Maybe it got deleted.</p>
          <p>todo: put in go back button</p>
      </section>
      <section v-else-if="selectedUser && userProjects.length > 0">
          <div class="title">
              <Back></Back>
              <h1 class="specificClientName">{{selectedUser.name}}</h1>
          </div>
        <p>Email: <a :href="'mailto:' + selectedUser.email">{{selectedUser.email}}</a></p>
        <p>Phone: <a :href="'tel:' + selectedUser.phone">{{selectedUser.phone}}</a></p>
        
        <div class="card neo-up" v-for="(project, index) of userProjects" :key="index">
            <h2>{{project.projectName}}</h2>
        </div>
      </section>

      <section v-else>
          <div class="title">
              <Back></Back>
              <h1 class="specificClientName">{{selectedUser.name}}</h1>
          </div>
        <p>Email: <a :href="'mailto:' + selectedUser.email"></a>{{selectedUser.mail}}</p>
        <p>Phone: <a :href="'tel:' + selectedUser.phone"></a>{{selectedUser.phone}}</p>

        <h3>There are no projects with this client</h3>
        <button class="primary" @click="$router.push('/projects')">Create a project</button>

      </section>
  </article>
</template>

<script>
import Back from '../components/back';
//import MainButton from '../components/Button';
export default {
    components: {
        Back, 
        //MainButton
    },
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
        },
        userProjects: function() {
            let allProjects = this.$store.getters.getProjects;
            if(allProjects != undefined) {
                return allProjects.filter(project => project.projectClient == this.currentUserId)
            } else {
                return undefined
            }
        }
    },
}
</script>

<style lang="scss">

</style>