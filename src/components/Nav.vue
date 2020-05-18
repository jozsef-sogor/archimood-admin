<template>
  <nav>
    <router-link to="/projects">Projects</router-link>
    <router-link to="/clients">Clients</router-link>
    <router-link to="/files">Files</router-link>
    <router-link to="/settings">Settings</router-link>
  </nav>
</template>

<script>

export default {

}
</script>

<style lang="scss">
@import "../assets/css/variables.scss";

nav{
    background-color: $gradientDark;
    //padding: .5rem;
    display: flex;
    align-items: center;
    justify-content: space-around;
    a {
        padding: 1rem;
        text-decoration: none;
        color: $textColor;
    }
    .router-link-active {
        text-decoration: underline !important;
        font-weight: $heavyFont;
        position: relative;
        background-color: $textColor;
        opacity: .5;
        &::after {
            content: '';
            position: absolute;
            top: -2px;
            height: 3px;
            left: 0;
            width: 100%;
            transition: .3s;
            background-color: $ctaColor;
        }
    }
}
</style>