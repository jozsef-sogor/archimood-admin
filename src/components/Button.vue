<template>
<button 
:class="primaryButton ? 'primary' : 'secondary'"
@click="onClick"
><slot>Slot</slot></button>
    
</template>

<script>
export default {
    name: 'mainButton',
    data() {
        return{
        }
    },
    props: {
        onClick: {
            type: Function,
            required: false
        },
        primaryButton: {
            type: Boolean,
            required: true
        }
    }

}
</script>

<style lang="scss">
.primary {
    color: white;
    background-color: black;
}
</style>