<template>
    <article class="wrapper">
        
          <div class="title">
              <Back></Back>
              <h1 v-if="selectedProject" class="specificClientName">Project {{selectedProject.projectName}}</h1>
          </div>

      <section v-if="!selectedProject">
          <h1>This project doesn't exist.</h1>
          <p>Maybe it got deleted.</p>
          <p>todo: put in go back button</p>
      </section>


      <section v-else>

        <div id="progressBar"></div>

        <div class="projectClient card neo-up">
            <h4>{{projectClient.name}}</h4>
            <p>Email: <a :href="'mailto:' + projectClient.email"></a>{{projectClient.email}}</p>
            <p>Phone: <a :href="'tel:' + projectClient.phone"></a>{{projectClient.phone}}</p> <br>
        </div>

        <div class="projectView">
            <div v-for="(phase, phaseIndex) of selectedProject.projectPhases" :key="phaseIndex" :class="phase.isDone ? 'neo-up bubble projectPhase' : 'neo-down bubble projectPhase'">
                    <h3>{{phase.phaseName}}</h3>
                    <input class="phaseName" type="text" placeholder="Phase name" v-model="phase.phaseName"><br>
                    <input class="phasePrice" type="number" placeholder="Phase price" v-model="phase.phasePrice"> HUF<br>

                    <button class="secondary removePhase" @click="removePhase(phaseIndex)">Remove phase</button>

                    <div v-for="(step, index) of phase.steps" :key="index" :class="step.isDone ? 'neo-up bubble projectStep' : 'neo-down bubble projectStep'">
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
                    <button class="primary stepButton" @click='addStep(index)'>Add step</button>

                    <!-- <input class="phaseName" type="text" placeholder="Phase name" v-model="newProject[index]"><br>
                    <input class="phaseStep" type="text" placeholder="Phase step" v-model="newProject[index].value"><br> -->
                </div>
                <mainButton :primaryButton='true' class="phaseButton" :onClick='addPhase'>Add section</mainButton>
        </div>

      </section>
  </article>
</template>

<script>
import Back from '../components/back';
import MainButton from '../components/Button';
export default {
    components: {
        Back, 
        MainButton
    },
    data() {
        return {

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
                steps: []
    
            };
            this.selectedProject.projectPhases.push(newPhase);
        },
        removePhase: function(phaseIndex) {
            this.selectedProject.projectPhases.splice(phaseIndex, 1)
        },
        addStep: function(index) {
            const step = {
                stepName: '',
                file: '',
                isDownloadable: false,
                isDone: false,
            };
            this.selectedProject.projectPhases[index].steps.push(step)
        },
        removeStep: function(phaseIndex, index){
            //let step = this.newProject[phaseIndex].steps[index];
            this.selectedProject.projectPhases[phaseIndex].steps.splice(index, 1);
        },
}
}
</script>

<style lang="scss">
@import "../assets/css/variables.scss";

.projectView {
    text-align: center;
    .projectPhase {
        margin: 2rem auto 3rem;
        .projectPrice {
            width: 64%;
        }
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
</style>