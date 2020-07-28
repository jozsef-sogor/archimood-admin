<template>
   <div class="wrapper">
       <div class="title">
      <h1>Files</h1>
      </div>

      <h2>Feature coming soon</h2>
   </div>
</template>

<script>
const fb = require('../firebaseConfig')
   export default {
      name: 'Files',
      mounted() {
         this.getFiles('files')
      },
      methods: {
         getFiles: function(child) {
            // Create a reference under which you want to list
            let listRef = fb.storage.ref().child(child);

            // Find all the prefixes and items.
            listRef.listAll().then(function(res) {
            res.prefixes.forEach(function(folderRef) {
               // All the prefixes under listRef.
            console.log("prefixes: ", folderRef)
            });
            res.items.forEach(function(itemRef) {
               // All the items under listRef.
               console.log(itemRef)
            });
            }).catch(function(error) {
            console.log(error)
            });
         }
      }
   }
</script>