<template>
  <article class="wrapper">
        <div class="title">
            <Back></Back>
            <h1 class="specificClientName" v-if="selectedUser">{{selectedUser.name}}</h1>
        </div>
      <section v-if="!selectedUser">
          <h1>This user doesn't exist.</h1>
          <p>Maybe it got deleted.</p>
      </section>
      <section v-else-if="selectedUser && userProjects.length > 0">

        <div class="card neo-up">
            <h3>Email:</h3> 
            <a :href="'mailto:' + selectedUser.email">{{selectedUser.email}}</a>
            
            <h3>Phone:</h3> 
            <a :href="'tel:' + selectedUser.phone">{{selectedUser.phone}}</a> <br>

            <button class="secondary" @click="openDeleteClient">Delete client</button>
        </div>

        <h2>Projects</h2>
        <div class="card neo-up" v-for="(project, index) of userProjects" :key="index">
            <h3>{{project.projectName}}</h3>

            <progressBar :showSteps="true" :maxValue="calculateProgress(project, true)" :progress="calculateProgress(project, false)"></progressBar>

            <button class="primary" @click="$router.push(`/projects/${project.projectId}`)">Open project</button>
        </div>

      </section>

      <section v-else>
        
        <div class="card neo-up">
            <h3>Email:</h3> 
            <a :href="'mailto:' + selectedUser.email">{{selectedUser.email}}</a>
            
            <h3>Phone:</h3> 
            <a :href="'tel:' + selectedUser.phone">{{selectedUser.phone}}</a> <br>
            <button class="secondary" @click="openDeleteClient">Delete client</button>

        </div>

        <h2>Projects</h2>

        <h3>There are no projects with this client</h3>
        <button class="primary" @click="$router.push('/projects')">Create a project</button>

      </section>

              <Modal v-show="modalVisible">
            <div class="modalHeader" slot="modalHeader"><h3>Deleting Client</h3></div>
            <div class="modalBody" slot="modalBody">
                <p>Are you sure you want to delete {{selectedUser.name}}'s profile?</p>
            </div>
            <div class="modalFooter" slot="modalFooter">
                <button class="primary" @click="deleteProfile(currentUserId)">Delete</button>
                <button class="secondary" @click="cancel">Cancel</button>
            </div>
        </Modal>
  </article>
</template>

<script>
import Back from '../components/back';
import Modal from '../components/Modal';
import progressBar from '../components/progressBar'
//import MainButton from '../components/Button';
const fb = require('../firebaseConfig');
export default {
    components: {
        Back, 
        Modal,
        progressBar
        //MainButton
    },
    data() {
        return {
            modalVisible: false
        }
    },

    computed: {
        currentUserId: function() {
            return this.$route.params.userId
        },
        selectedUser: function() {
            let allUsers = this.$store.getters.getClients;
            let client = allUsers.find(user => user.id == this.currentUserId);
            if (client == undefined) {
                return {
                    name: 'Deleted user',
                    email:'deleted',
                    phone: '00000000'
                }
            } else {
                return client
            }
        },
        userProjects: function() {
            let allProjects = this.$store.getters.getProjects;
            if(allProjects != undefined) {
                return allProjects.filter(project => project.projectClient == this.currentUserId)
            } else {
                return undefined
            }
        },
        success: function() {
            return this.$store.getters.getSuccess
        }
    },
    watch: {
            success: function(newVal) {
                if(newVal) {
                    setTimeout(() => {

                        this.$store.dispatch('setSuccess', false);
                        this.modalVisible = false;
                        this.$router.replace('/clients');
                    },10)
                }
            }
    },
    methods: {
        openDeleteClient: function() {
            this.modalVisible = true
        },
        cancel: function() {
            this.modalVisible = false
        },
        deleteProfile: function(uid) {
            this.$store.dispatch('setSmallLoader', true);
            fb.functions.deleteDocument('users', uid);
        },
        calculateProgress: function(project, returnTotal) {
            let stepsObject = {
                total: 0,
                done: 0
            };

           for(let phase of project.projectPhases) {
               for (let step of phase.steps) {
                   stepsObject.total++;

                   if(step.isDone) {
                       stepsObject.done++
                   }
               }
           }
           return returnTotal == true ? stepsObject.total : stepsObject.done
        
        }
    }
}
</script>

<style lang="scss">

</style>