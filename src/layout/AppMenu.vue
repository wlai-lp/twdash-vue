<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Home',
        items: [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' },
            { label: 'Export Dashboard', icon: 'pi pi-fw pi-home', to: '/export' },
        ]
    },
    {
        label: 'By category',
        items: [
            { label: 'Agent', icon: 'pi pi-fw pi-users', to: '/uikit/formlayout' },
            { label: 'Conversation', icon: 'pi pi-fw pi-comments', to: '/uikit/input' },
            { label: 'Language', icon: 'pi pi-fw pi-flag', to: '/uikit/floatlabel' },
            { label: 'Time', icon: 'pi pi-fw pi-calendar-plus', to: '/uikit/invalidstate' },            
        ]
    },
    {
        label: 'Favorite',
        items: [
            { label: 'Reports', icon: 'pi pi-fw pi-star-fill', to: '/blocks', badge: 'NEW' },
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
        
    </ul>
</template>

<style lang="scss" scoped></style>
