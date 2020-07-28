<template>
<div class="notificationContainer">
    <transition-group name="list-complete" tag="div">
        <div 
        v-for="notification in notifications" 
        :key="notification.id" 
        @click="closeNotification(notification)"
        @touchmove="closeNotification(notification)"
        class="notification list-complete-item">
            <div class="colorBand" :class="notification.type"></div>
            <p>{{notification.data}}</p>
        </div>
    </transition-group>
  </div>
</template>

<script>
export default {
    computed: {
        notifications: function() {
            return this.$store.getters.getNotification
        }
    },
    methods: {
        closeNotification: function(data) {
            this.$store.dispatch('setRemoveNotification', data)
        }
    }

}
</script>

<style lang="scss" scoped>
@import '../assets/css/variables.scss';

    .notificationContainer {
        max-width: 85%;
        height: auto;
        position: fixed;
        top: 5rem;
        right: 0;
        z-index: 99;
        .notification{
            width: 100%;
            padding: .5rem 1.5rem;
            height: auto;
            margin-bottom: .75rem;
            background-color: white;
            position: relative;
            box-shadow: $boxShadow;
            .colorBand {
                position: absolute;
                height: 100%;
                width: 5px;
                top: 0;
                left: 0;
            }
            .error {
                background-color: red;
            }
            .success {
                background-color: $ctaColor;
            }
        }
    }

.list-complete-item {
  transition: all .5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  margin-right: 10px;
}
.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(100%);
}
.list-complete-leave-active {
  position: absolute;
  transform: translateX(100%);
}
</style>