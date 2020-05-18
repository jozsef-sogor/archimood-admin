<template>
    <section class="modal-wrapper">
        <div class="modal-bg"></div>
        <div class="modal">
            <slot name="modalHeader" class="modalHeader"></slot>
            <slot name="modalBody" class="modalBody"></slot>
            <slot name="modalFooter" class="modalFooter"></slot>
        </div>
    </section>
  
</template>

<script>

export default {

}
</script>

<style lang="scss">
/*
    .modalWrapper {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        .modal-bg {
            position: absolute;
            width: 100%;
            height: 100%;

        }
    } */

    .modalFooter {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: .5rem;
    }
</style>