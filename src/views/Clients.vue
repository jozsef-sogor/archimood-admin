<template>
   <div class="wrapper clients">
       <div class="title">
      <h1>Clients</h1>
        <mainButton class="floatingButton" :primaryButton='true' :onClick='toggleModal' v-show="!modalVisible">
            + Create client
        </mainButton>
        </div>
      <article v-if="!null" class="card-holder">
      <div class="card neo-up" v-for="(client, index) of clients" :key="index">
          <h2>{{ client.name }}</h2>
          <div class="cardContact">
          <a :href="'tel:' + client.phone"><i class="material-icons-round">phone_iphone</i></a>
          <a :href="'mailto:' + client.mail"><i class="material-icons-round">email</i></a>
          </div>
          <button class="primary" @click='$router.push(`/clients/${client.id}`)'>Open client</button>
      </div>
      </article>

      <article v-else>
          <h2>No clients to show</h2>
      </article>


        <modal v-if="modalVisible">
            <div slot="modalHeader">
                <h2>Create new client</h2>
            </div>

            <div slot="modalBody">
                <form @submit.prevent="createClient" id="createUserForm">
                    <input type="text" placeholder="Name" v-model="creatingClient.name" /><br>
                    <input type="email" placeholder="Email" v-model="creatingClient.email" /><br>
                    <input type="tel" placeholder="Phone: +3612345678" v-model="creatingClient.phone" /><br>

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
                if (allClients != undefined) {
                    return allClients.filter(client => client.isAdmin == false)
                } else {
                    return null
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
                        this.creatingClient = {
                            isAdmin: false
                        };
                        this.modalVisible = false;
                    }, 10)
                }
            }
        },
        mounted() {
            //this.dataCheck()
        },
        methods: {
            createClient: function() {
                this.$store.dispatch('setSmallLoader', true);
                fb.functions.registerUser(this.creatingClient)
            },
            navigate: function(uid) {
                this.$router.push({path: `/clients/${uid}`, params:{id: uid}})
            },
            toggleModal() {
                this.modalVisible = !this.modalVisible;
            },
            dataCheck() {
                if(this.clients == undefined) {
                    fb.functions.initialFetch()
                }
            }
        }
    }
</script>
