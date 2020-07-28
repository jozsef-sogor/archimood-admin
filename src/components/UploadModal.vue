<template>
<article>
  <Modal>
      <div slot="modalHeader" class="modalHeader">
          <h3>Uploading files for {{projectName}}</h3>
          <h4>{{stepName}}</h4>
      </div>

      <div slot="modalBody" class="modalBody">
          <div id="uploadBox" @dragover.prevent @drop.prevent="addFile">
              <h3>Drag files or click here to upload</h3>
              <input type="file" multiple @change="addFileClick($event.target.files)"/>
          </div>
              <ul class="fileList" v-show="files.length > 0">
                  <li v-for="file in files" :key="file.name">
                      {{ file.name }} {{ Math.floor(file.size/100000) }}MB
                      <progressBar :showSteps="false" :maxValue="100" :progress="uploadProgress[deleteWhiteSpaces(file.name)]"></progressBar>
                      <button class="secondary" @click="removeFile(file)">Remove</button>
                  </li>
              </ul>
      </div>

      <div slot="modalFooter" class="modalFooter">
            <MainButton :disabled="files.length == 0" :primaryButton="true" :onClick="uploadFiles">Upload</MainButton>
            <button class="secondary" @click="$emit('uploadModalClose')">Cancel</button>
      </div>
  </Modal>


  </article>
</template>

<script>
import Modal from './Modal.vue';
import MainButton from './Button.vue';
import progressBar from './progressBar'
//import { functions } from '../firebaseConfig';
const fb = require('../firebaseConfig.js');

export default {
components: {
    Modal,
    MainButton,
    progressBar
},
data() {
    return {
        files: [],
        uploadProgress: {},
        updatedProject: {}
    }
},
props: {
    currentProject: {
        type: Object,
        required: true
    },
    projectId: {
        type: String,
        required: true
    },
    projectName: {
        type: String,
        required: true
    },
    projectPhase: {
        type: Number,
        required: false
    },
    projectStep: {
        type: Number,
        required: false
    },
    stepName: {
        type: String,
        required: false
    }
},
methods: {
    deleteWhiteSpaces(string) {
        return string.replace(/\s/g, "")
    },
    addFile(e) {
      const self = this;
        
      let droppedFiles = e.dataTransfer.files;
      console.log(droppedFiles);

      if(!droppedFiles) return;
      // this tip, convert FileList to array, credit: https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
      ([...droppedFiles]).forEach(f => {
        console.log('f ', f);
        //Starting the file upload progress bar counter from 0%
        self.uploadProgress[self.deleteWhiteSpaces(f.name)] = 0;
        self.files.push(f);
      });
    },
    addFileClick(files) {
        console.log(files);
        const self = this;

        ([...files]).forEach(f => {
        console.log('f ', f);
        //Starting the file upload progress bar counter from 0%
        self.uploadProgress[self.deleteWhiteSpaces(f.name)] = 0;
        self.files.push(f);
      });
    },
    removeFile(file){
      this.files = this.files.filter(f => {
        return f != file;
      });      
    },

    uploadFiles() {
        let folder = this.projectId;
        let storageRef = fb.storage.ref();
        const self = this;
        this.$store.dispatch('setSmallLoader', true);

        Promise.all(
            this.files.map(file => self.putStorageItem(file, storageRef.child(`files/${folder}/${self.stepName}${self.files.indexOf(file)}`)))
        )
        .then(function(snapshot) {
            self.currentProject.projectPhases[self.projectPhase].steps[self.projectStep].files = [];
            let paths = self.currentProject.projectPhases[self.projectPhase].steps[self.projectStep].files;
            //paths = [];


            console.log(`All success`, snapshot);
            for (let file of snapshot) {
                let type = ''; //We'll store the file type here so it's easy to access down the line
                //let result = ''; //Results are storeg here to display in UI
                if(file.state === 'success') {
                    type = file.task.metadata_.contentType;
                    storageRef.child(file.ref.fullPath).getDownloadURL()
                    .then(function(url) {
                        console.log(url, type);
                        //Creating an object to store the url and file type in db
                        let fileObject = {
                            type: type,
                            downloadUrl: url
                        }
                        //psuhing the fielObject to the array to upload
                        paths.push(fileObject);
                    })

                }
            }
 
        })
        .then( function() {
            fb.functions.setDocumentData('projects', self.projectId, self.currentProject);
            console.log(self.currentProject);
            self.updatedProject = self.currentProject;
            self.files = [];
        })
        .then(function() {
            console.log('emit ');
            self.$emit('filesUploaded', self.updatedProject.projectPhases[self.projectPhase].steps[self.projectStep].files);
        })
        .catch(function(error) {
            console.log(`Some upload: `, error.message)
        })

    },

    putStorageItem(file, path) {
        let fileUpload = path.put(file);
        const self = this;

        fileUpload.on('state_changed', function(snapshot) {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            let name = self.deleteWhiteSpaces(file.name);

            self.uploadProgress[name] = parseFloat(progress);
            console.log(`Uploading ${name} is ${progress} % done`);

        }.bind(this))

        return fileUpload

.catch(function(error) {
            console.log('Failed upload: ', file, error.message)
        })
    }

}
}
</script>

<style lang="scss">
#uploadBox {
    border: 2px dashed black;
    width: 100%;
    height: 100px;
}
.fileList {
    padding: 0;
    text-align: center;
    li {
        list-style-type: none;
    }
}
</style>