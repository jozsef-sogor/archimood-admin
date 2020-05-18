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
@import "../assets/css/variables.scss";

button {
    color: $textColor;
    border: none;
    margin: .75rem;
    display: block;
    margin: .75rem auto;
}
.primary {
    background-color: $ctaColor;
    border-radius: 7px;
    box-shadow: $boxShadow;
    padding: .5rem;
    font-weight: $heavyFont;
    
}
.secondary {
    text-decoration: underline;
    background-color: transparent;
}
</style>