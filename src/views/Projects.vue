<template>
   <article class="wrapper">
      <h1>Projects</h1>
      <div id="progressBar" v-if="projects.length > 0"></div>

      <section id="projects" v-if="projects.length > 0">
          <div class="card" v-for="(project, index) of projects" :key=index>
              <h2>{{ project }}</h2>
          </div>
      </section>

      <section v-else>
          <h2>No projects to show</h2>
      </section>
        <mainButton :primaryButton='true' :onClick='toggleModal' v-show="!modalVisible">
             Create project
        </mainButton>
        
        <modal v-show="modalVisible">
            <div slot="modalHeader">
                <h2>Create new project</h2>
            </div>
            <div slot="modalBody">
                <select name="" id="clientSelect" v-model="projectClient">
                    <option v-for="client of clients" :key="client.id" :value="client.id">
                        {{ client.name }}
                    </option>
                </select>
                <input type="text" placeholder="Project name" v-model="newProjectName"><br>

                <div v-for="(phase, index) of newProject" :key="index" class="projectPhase">
                    <h3>{{phase.phaseName}}</h3>
                    <input class="phaseName" type="text" placeholder="Phase name" v-model="phase.phaseName"><br>
                    <input class="phasePrice" type="number" placeholder="Phase price" v-model="phase.phasePrice"> HUF<br>

                    <div v-for="(step, index) of phase.steps" :key="index">
                        <input class="stepName" type="text" placeholder="Step name" v-model="step.stepName"><br>

                        <input type="checkbox" id="isDownloadable" v-model="step.isDownloadable">
                        <label for="isDownloadable">Is the step downloadable?</label> 

                        <input type="checkbox" id="done" v-model="step.isDone">
                        <label for="done">Is the step done?</label>   
   

                        <p>{{step.isDownloadable}}</p>
                        <p>{{step.done}}</p>
                    </div>
                    <button class="primary" @click='addStep(index)'>Add step</button>

                    <!-- <input class="phaseName" type="text" placeholder="Phase name" v-model="newProject[index]"><br>
                    <input class="phaseStep" type="text" placeholder="Phase step" v-model="newProject[index].value"><br> -->
                </div>
                <mainButton :primaryButton='true' :onClick='addPhase'>Add section</mainButton>
            </div>
            <div slot="modalFooter">
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
        addStep: function(index) {
            const step = {
                stepName: '',
                file: '',
                isDownloadable: false,
                isDone: false,
            };
            this.newProject[index].steps.push(step)
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
       } 
      }
   }
</script>