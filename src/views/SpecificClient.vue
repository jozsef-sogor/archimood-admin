<template>
  <article class="wrapper">
        <div class="title">
            <Back></Back>
            <h1 class="specificClientName" v-if="selectedUser">{{selectedUser.name}}</h1>
        </div>
      <section v-if="!selectedUser">
          <h1>This user doesn't exist.</h1>
          <p>Maybe it got deleted.</p>
          <p>todo: put in go back button</p>
      </section>
      <section v-else-if="selectedUser && userProjects.length > 0">

        <div class="card neo-up">
            <h3>Email:</h3> 
            <a :href="'mailto:' + selectedUser.email">{{selectedUser.email}}</a>
            
            <h3>Phone:</h3> 
            <a :href="'tel:' + selectedUser.phone">{{selectedUser.phone}}</a>
        </div>

        <div class="card neo-up" v-for="(project, index) of userProjects" :key="index">
            <h2>{{project.projectName}}</h2>
        </div>
      </section>

      <section v-else>
        
        <div class="card neo-up">
            <h3>Email:</h3> 
            <a :href="'mailto:' + selectedUser.email">{{selectedUser.email}}</a>
            
            <h3>Phone:</h3> 
            <a :href="'tel:' + selectedUser.phone">{{selectedUser.phone}}</a>
        </div>

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