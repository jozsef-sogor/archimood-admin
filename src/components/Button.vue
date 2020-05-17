<template>
<button 
:class="primaryButton ? 'primary' : 'secondary'"
@click="onClick"
><slot>Slot</slot></button>
    
</template>

<script>
import "../assets/css/_global.scss";

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
button {
    color: $textColor;
}
.primary {
    background-color: $ctaColor;
    border-radius: 5px;
    box-shadow: $boxShadow;
    padding: .5rem;
}
.secondary {
    text-decoration: underline;
}
</style>