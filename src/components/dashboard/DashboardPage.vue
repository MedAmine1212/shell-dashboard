<template>
    <div>
        <my-sidebar></my-sidebar>

        <div class="main-dashboard">
        <router-view name="second"></router-view>
        </div>
    </div>
</template>

<script>
    import DashboardSideBar from "./../sidebar/DashboardSidebar";
    export default {
        name: 'DashboardPage',

        components: {
            'my-sidebar': DashboardSideBar
        },
    }
</script>