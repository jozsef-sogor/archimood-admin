<template>
   <div class="wrapper">
      <h1>Clients</h1>

      <article v-if="this.clients.length > 0">
      <div class="card" v-for="(client, index) of clients" :key="index">
          <h2>{{ client.name }}</h2>
          <button class="primary" @click='$router.push(`/clients/${client.id}`)'>Open client</button>
      </div>
      </article>

      <article v-else>
          <h2>No clients to show</h2>
      </article>

        <mainButton :primaryButton='true' :onClick='toggleModal' v-show="!modalVisible">
             Create client
        </mainButton>


        <modal v-if="modalVisible">
            <div slot="modalHeader">
                <h2>Create new client</h2>
            </div>

            <div slot="modalBody">
                <form @submit.prevent="createClient" id="createUserForm">
                    <input type="text" placeholder="Name" v-model="creatingClient.name" /><br>
                    <input type="email" placeholder="Email" v-model="creatingClient.email" /><br>
                    <input type="tel" placeholder="Phone: +3612345678" v-model="creatingClient.phone" /><br>

                    <input type="password" placeholder="Temporary password" v-model="password" /><br>
                </form>
            </div>

            <div slot="modalFooter">
                <mainButton :primaryButton='true' :onClick='createClient'>
                    Create client
                </mainButton>

                <mainButton :primaryButton='false' :onClick='toggleModal'>
                    Cancel
                </mainButton>
            </div>
        </modal>

   </div>
</template>

<script>
    import mainButton from '../components/Button';
    import modal from '../components/Modal'
    const fb = require('../firebaseConfig.js');


    export default {
      name: 'Clients',
      components: {
          mainButton,
          modal
      },
      data() {
          return {
              modalVisible: false,
              creatingClient: {
                  isAdmin: false
              },
              password: ''
          }
      },
        computed: {
            clients: function() {
                let allClients = this.$store.getters.getClients;

                return allClients.filter(client => client.isAdmin == false)
            }
        },
        methods: {
            createClient: function() {
                console.log('creating new client');
                fb.functions.registerUser(this.creatingClient)
            },
            navigate: function(uid) {
                this.$router.push({path: `/clients/${uid}`, params:{id: uid}})
            },
            toggleModal() {
                this.modalVisible = !this.modalVisible;
            },
        }
    }
</script>