<template>
   <div class="wrapper">
       <div class="title">
            <h1>Settings</h1>
       </div>

    <div class="big-card neo-up">

        <h3>Name</h3>
        <p>{{currentUser.name}}</p>

        <h3>Email</h3>
        <p>{{currentUser.email}}</p>

        <h3>Phone</h3>
        <p>{{currentUser.phone}}</p>

        <MainButton :primaryButton='true' :onClick='toggleModal'>Edit profile</MainButton>
    </div>
    <MainButton :primaryButton='false' :onClick='logout'>Logout</MainButton>

        <modal v-show="modalVisible">
            <div slot="modalHeader" class="modalHeader">
                <h2>Edit profile</h2>
            </div>

            <div slot="modalBody" class="modalBody">
                <h4 class="callback-message"> {{ message }} </h4>
                <input id="name" type="text" placeholder="Name" v-model="currentUser.name">
                <input id="email" type="text" placeholder="Email" v-model="currentUser.email">
                <input id="phone" type="tel" placeholder="Phone" v-model="currentUser.phone">
            </div>

            <div slot="modalFooter" class="modalFooter">
                <MainButton :primaryButton='true' :onClick='updateUser'>Save</MainButton>
                <MainButton :primaryButton='false' :onClick='cancelUpdate'>Cancel</MainButton>
            </div> 
        </modal>
   </div>
</template>

<script>
//import { currentUser } from '../firebaseConfig'
import MainButton from '../components/Button';
import modal from '../components/Modal';
const fb = require('../firebaseConfig');
   export default {
      name: 'Settings',
      components: {
          MainButton,
          modal
      },
      data() {
          return{
              modalVisible: false,
              ownProfile: this.$store.getters.getCurrentUser,
              message: ''
          }
      },
      computed: {
          currentUser: function() {
              return this.$store.getters.getCurrentUser
          }
      },
      methods: {
          updateUser: function() {
              const ref = fb.db.collection('users').doc(this.currentUser.id);
              let userObj = this.currentUser;
              delete userObj.id;
              //console.log(userObj);

              ref.update(userObj)
              .then(() => {
                  this.message = 'Profile was successfully updated';
                  setTimeout(() => {
                      this.modalVisible = false;
                      this.message = '';
                  }, 1500)
              })
              .catch((error) => {
                  this.message = 'An error occured. Please refresh the page and try again';
                  console.log('Error updated profile: ', error);
              })
          },
          cancelUpdate: function() {
              this.ownProfile = this.currentUser;
              this.modalVisible = false;
          },
          toggleModal: function() {
              this.modalVisible = !this.modalVisible
          },
          logout: function() {
              fb.functions.logOut()
          }
      }
   }
</script>