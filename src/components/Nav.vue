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
    transition: .3s;
    a {
        padding: 1rem;
        text-decoration: none;
        color: $textColor;
        transition: .3s;

    }
    .router-link-active {
        text-decoration: underline !important;
        font-weight: $heavyFont;
        position: relative;
        background-color: $textColor;
        //opacity: .5;
        box-shadow: $navShadow;
        color: $backgroundColor;
        &::after {
            content: '';
            position: absolute;
            top: -2px;
            height: 5px;
            left: 0;
            width: 100%;
            transition: .3s;
            background-color: $ctaColor;
        }
    }
}

@media screen and (min-width: 1024px) {
    nav {
        justify-content: flex-start;

        a{
            padding: 1.5rem .25rem;
            width: 100%;
            margin: 2rem auto 0;
            text-align: center;
            &:hover {
            background-color: rgba(0,0,0,0.2);
            text-decoration: underline;
        }
        }
        .router-link-active {
            &::after {
                height: 100%;
                width: 5px;
                top: 0;
                right: -2px;
            }
        }
    }
}
</style>