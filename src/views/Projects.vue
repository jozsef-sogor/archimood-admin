<template>
   <article class="wrapper">
       <div class="title">
            <h1>Projects</h1>
            <mainButton :primaryButton='true' :onClick='toggleModal' v-show="!modalVisible">
                + Create project
            </mainButton>
      </div>
      

      <section id="projects" v-if="projects.length > 0">
          <div class="card neo-up" v-for="(project, index) of projects" :key=index>
              <h2>{{ project.projectName }}</h2>
              <h3>{{getClientName(project.projectClient)}}</h3>
          <button class="primary" @click='$router.push(`/projects/${project.projectId}`)'>Open project</button>

          </div>
      </section>

      <section v-else>
          <h2>No projects to show</h2>
      </section>

        
        <modal v-show="modalVisible">
            <div slot="modalHeader" class="modalHeader">
                <h2>Create new project</h2>
            </div>
            <div slot="modalBody" class="modalBody">
                <select name="" id="clientSelect" v-model="projectClient">
                    <option v-for="client of clients" :key="client.id" :value="client.id">
                        {{ client.name }}
                    </option>
                </select>
                <input type="text" class="bubble neo-up" placeholder="Project name" v-model="newProjectName"><br>

                <div v-for="(phase, phaseIndex) of newProject" :key="phaseIndex" class="projectPhase">
                    
                    <div class="bubble neo-down">

                        <input class="phaseName" type="text" placeholder="Phase name" v-model="phase.phaseName"><br>
                        <input class="phasePrice" type="number" placeholder="Phase price" v-model="phase.phasePrice"> HUF<br>
                        <button class="secondary removePhase" @click="removePhase(phaseIndex)">Remove phase</button>

                    </div>
                    <div :class="step.isDone ? 'neo-up bubble projectStep' : 'neo-down bubble projectStep'" v-for="(step, index) of phase.steps" :key="index">
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

                        <button class="secondary removeStep" @click="removeStep(phaseIndex, index)">Remove step</button>

                    </div>
                    <button class="primary stepButton" @click='addStep(phaseIndex)'>Add step</button>

                    <!-- <input class="phaseName" type="text" placeholder="Phase name" v-model="newProject[index]"><br>
                    <input class="phaseStep" type="text" placeholder="Phase step" v-model="newProject[index].value"><br> -->
                </div>
                <mainButton :primaryButton='true' class="phaseButton" :onClick='addPhase'>Add phase</mainButton>
            </div>
            <div slot="modalFooter" class="modalFooter">
                <mainButton :primaryButton='true' :onClick='saveProject'>Save</mainButton>
                <mainButton :primaryButton='false' :onClick='cancelProject'>Cancel</mainButton>

            </div>
        </modal>

   </article>
</template>

<script>

import mainButton from '../components/Button';
import modal from '../components/Modal';
const fb = require('../firebaseConfig.js');

//import {general} from '../assets/mixins/general';
   export default {
      name: 'Projects',
      components: {
          mainButton,
          modal
      },
      data() {
        return {
            modalVisible: false,
            newProject: [
                {phaseName: '', 
                    phasePrice: 0,
                    isDownloadable: false,
                    isPaid: false,
                    isDone: false,
                    steps:[
                        {
                            stepName: '',
                            isDone: false,
                            isDownloadable: false
                        },
                    ]

                }
            ],
            newProjectName: '',
            projectClient: ''
          }
      },
      computed: {
          projects: function() {
              let projects = this.$store.getters.getProjects
              return projects.sort()
          },
          clients: function() {
              return this.$store.getters.getClients
          }
      },
      methods: {
        toggleModal: function () {
            console.log('fghjkl;');
			this.modalVisible = !this.modalVisible;
        },
        addPhase: function() {
            let newPhase = {
                phaseName: '',
                phasePrice: 0,
                isDownloadable: false,
                paid: false,
                done: false,
                steps: []
    
            };
            this.newProject.push(newPhase);
        },
        removePhase: function(phaseIndex) {
            this.newProject.splice(phaseIndex, 1)
        },
        addStep: function(index) {
            const step = {
                stepName: '',
                file: '',
                isDownloadable: false,
                isDone: false,
            };
            this.newProject[index].steps.push(step)
        },
        removeStep: function(phaseIndex, index){
            //let step = this.newProject[phaseIndex].steps[index];
            this.newProject[phaseIndex].steps.splice(index, 1);
        },
        cancelProject: function() {
          this.newProject = [];
          this.modalVisible = false;
       },
        saveProject: function() {
          let uid = this.projectClient;
          let projectName = this.newProjectName;
          let projectObject = this.newProject;

          let project = {
              projectClient: uid,
              projectName: projectName,
              projectPhases: projectObject
          };
            console.log(fb);
          fb.functions.setDocumentDataWithAutoId('projects', project);
       },
       getClientName: function(uid) {
           return this.clients.find(client => client.id == uid).name
       }
      }
   }
</script>

<style lang="scss">
@import "../assets/css/variables.scss";

.projectPhase {
    margin: 2rem auto 3rem;
    .projectStep {
        width: 75%;
        margin: 1rem auto;
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


</style>