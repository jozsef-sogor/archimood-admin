<template>
    <article class="wrapper">
        
          <div class="title">
              <Back></Back>
              <h1 v-if="selectedProject" class="specificClientName">Project {{selectedProject.projectName}}</h1>
                <button v-if="projectClient" :disabled="!projectChanged" class="primary" @click="updateProject">Save</button>
          </div>

      <section v-if="!selectedProject">
          <h1>This project doesn't exist.</h1>
          <p>Maybe it got deleted.</p>
      </section>


      <section v-else>

        <progressBar :showSteps="true" :maxValue="stepsObject.total" :progress="stepsObject.done"></progressBar>

        <div class="projectClient card" :class="projectClient ? 'neo-up' : 'neo-down'">
            <div v-if="projectClient">
                <h4>{{projectClient.name}}</h4>
                <p>Email: <a :href="'mailto:' + projectClient.email"></a>{{projectClient.email}}</p>
                <p>Phone: <a :href="'tel:' + projectClient.phone"></a>{{projectClient.phone}}</p> <br>
            </div>
            <div v-else>
                <h4>Deleted Client</h4>
            </div>
        </div>

        <div class="projectView">
            <draggable v-model="selectedProject.projectPhases" @start="drag=true" @end="drag=false">
                  <transition-group name="list-complete" tag="div">

            <div v-for="(phase, phaseIndex) of selectedProject.projectPhases" :key="phase.id" :class="phase.isDone ? 'neo-up bubble projectPhase' : 'neo-down bubble projectPhase'" class="list-complete-item">
                    <h3>{{phase.phaseName}}</h3>
                    <input class="phaseName" type="text" placeholder="Phase name" v-model="phase.phaseName"><br>
                    <input class="phasePrice" type="number" placeholder="Phase price" v-model="phase.phasePrice"> HUF<br>

                    <button v-if="projectClient" class="secondary removePhase" @click="removePhase(phaseIndex)">Remove phase</button>
                    

                    <draggable v-model="phase.steps" @start="drag=true" @end="drag=false">
                          <transition-group name="list-complete" tag="div">

                    <div v-for="(step, index) of phase.steps" :key="step.id" :class="step.isDone ? 'neo-up bubble projectStep' : 'neo-down bubble projectStep'" class="list-complete-item">
                        <input class="stepName" type="text" placeholder="Step name" v-model="step.stepName"><br>

                        <div class="stepOptions">
                            <div class="stepCheckbox">
                                <input type="checkbox" id="isDownloadable" v-model="step.isDownloadable">
                                <label for="isDownloadable">Downloadable</label> 
                            </div>

                            <div class="stepCheckbox">
                                <input type="checkbox" id="done" v-model="step.isDone">
                                <label for="done">Done</label>  
                            </div> 
                        </div>

                        <div class="files stepOptions" v-if="step.files.length > 0">
                            
                               <div class="imageContainer" v-for="(file, index) of step.files" :key="index">
                                   <embed class="imageContainerItem" :type="file.type" :src="file.downloadUrl">
                                   <p>{{file.type}}</p>

                                </div> 
                            
                        </div>

                        <button v-if="projectClient" class="primary" @click='openUpload(step.stepName, phaseIndex, index)'>Upload File</button>
                        <button v-if="projectClient" class="secondary removeStep" @click="removeStep(phaseIndex, index)">Remove step</button>

                    </div>
                          </transition-group>
                    </draggable>
                    <button v-if="projectClient" class="primary stepButton" @click='addStep(phaseIndex)'>Add step</button>

                    <!-- <input class="phaseName" type="text" placeholder="Phase name" v-model="newProject[index]"><br>
                    <input class="phaseStep" type="text" placeholder="Phase step" v-model="newProject[index].value"><br> -->
                </div>
                  </transition-group>
            </draggable>
                <mainButton v-if="projectClient" :primaryButton='true' class="phaseButton" :onClick='addPhase'>Add section</mainButton>
        </div>
      </section>
      <loader v-if="smallLoaderVisible" :style="{position: 'fixed !important'}"></loader>
      <uploadModal v-if="uploadModalVisible" :projectId="currentProjectId" :projectName="selectedProject.projectName" :stepName="selectedStepName" :projectPhase="selectedPhase" :projectStep="selectedStep" :currentProject="selectedProject" @filesUploaded="updateProject" @uploadModalClose="uploadModalVisible=false"></uploadModal>
  </article>
</template>

<script>
import Back from '../components/back';
import MainButton from '../components/Button';
import uploadModal from '../components/UploadModal';
import progressBar from '../components/progressBar';
import draggable from 'vuedraggable';
import loader from '../components/smallLoader';

const fb = require('../firebaseConfig.js');

export default {
    components: {
        Back, 
        MainButton,
        uploadModal,
        progressBar,
        draggable,
        loader
    },
    data() {
        return {
            uploadModalVisible: false,
            selectedPhase: null,
            selectedStep: null,
            selectedStepName: '',
            projectChanged: false
        }
    },

    computed: {
        currentProjectId: function() {
            return this.$route.params.projectId
        },
        selectedProject: function() {
            let allProjects = this.$store.getters.getProjects;
            return allProjects.find(project => project.projectId == this.currentProjectId)
        },
        projectClient: function() {
            let allClients = this.$store.getters.getClients;
            if(allClients != undefined) {
                return allClients.find(client => client.id == this.selectedProject.projectClient)
            } else {
                return undefined
            }
        },
        stepsObject: function() {
            let stepsObject = {
                total: 0,
                done: 0
            };

           for(let phase of this.selectedProject.projectPhases) {
               for (let step of phase.steps) {
                   stepsObject.total++;

                   if(step.isDone) {
                       stepsObject.done++
                   }
               }
           }
           return stepsObject
        },
        smallLoaderVisible: function() {
            return this.$store.getters.getSmallLoader
        }
    },
    watch: {
        selectedProject: {
            deep: true,
            handler() {
                this.projectChanged = true
            }
        }
    },
    methods: {
        addPhase: function() {
            let newPhase = {
                phaseName: '',
                phasePrice: 0,
                isDownloadable: false,
                paid: false,
                done: false,
                steps: [],
                id: Math.random()
    
            };
            this.selectedProject.projectPhases.push(newPhase);
        },
        removePhase: function(phaseIndex) {
            this.selectedProject.projectPhases.splice(phaseIndex, 1)
        },
        addStep: function(index) {
            const step = {
                stepName: '',
                files: [],
                isDownloadable: false,
                isDone: false,
                id: Math.random()
            };
            this.selectedProject.projectPhases[index].steps.push(step)
        },
        removeStep: function(phaseIndex, index){
            //let step = this.newProject[phaseIndex].steps[index];
            this.selectedProject.projectPhases[phaseIndex].steps.splice(index, 1);
        },
        openUpload: function(stepName, phase, step) {
            this.selectedPhase = phase;
            this.selectedStep= step;
            this.selectedStepName = stepName;
            this.uploadModalVisible = true;
        },
        updateProject: function() {
            const self = this;
            this.uploadModalVisible = false;
            this.$store.dispatch('setSmallLoader', true);

            fb.functions.setDocumentData('projects', self.currentProjectId, self.selectedProject);

        }
}
}
</script>

<style lang="scss">
@import "../assets/css/variables.scss";
progress[value] {
    transition: 1s;
}
.projectView {
    text-align: center;
    .projectPhase {
        margin: 2rem auto 3rem;
        background-color: $backgroundColor;
        .projectPrice {
            width: 64%;
        }
        .projectStep {
            width: 75%;
            margin: 1rem auto;
            background-color: $backgroundColor;
            .stepOptions {
                display: flex;
                justify-content: space-around;
                align-items: center;
                padding: .5rem;
                label {
                    font-size: .75rem;
                    display: block;
                    margin: auto;
                }
                input {
                    margin: .5rem auto;
                    padding: .25rem;
                    width: 75%;
                    margin: 0 !important;
                    background-color: transparent;
                    color: $ctaColor;
                }
            }
        }

        .phaseButton {
            width: 100% !important;
        }
        .stepButton {
            width: 75%;
        }
    }
}

.imageContainer {
    width: 100%;
    overflow-x: auto;
    .imageContainerItem {
        max-width: 100%;
    }

}

.list-complete-item {
  transition: all .5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  //display: inline-block;
  margin-right: 10px;
}
.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(10px);
}
.list-complete-leave-active {
  position: absolute;
}
</style>