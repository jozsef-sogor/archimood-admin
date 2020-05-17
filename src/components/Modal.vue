<template>
    <section class="modal-wrapper">
        <div class="modal-bg"></div>
        <div class="modal">
            <slot name="modalHeader"></slot>
            <slot name="modalBody"></slot>
            <slot name="modalFooter"></slot>
        </div>
    </section>
  
</template>

<script>

export default {

}
</script>

<style lang="scss">

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
    }
</style>