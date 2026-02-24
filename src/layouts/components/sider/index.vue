<template>
    <el-menu
        class="sider"
        :default-active="activeMenu"
        :router="false"
        :unique-opened="false"
        active-text-color="#409EFF"
        text-color="#222"
    >
        <SubMenu :menu-list="menuList"></SubMenu>
    </el-menu>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/modules/auth'
import { computed } from 'vue'


const route = useRoute()
const authStore = useAuthStore();
const menuList = computed(() => authStore.showMenuListGet);
const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path) as string);
</script>

<style scoped>
.sider {
    padding-top: 20px;
    height: 100vh;
    background: #fff;
    box-sizing: border-box;
    border-right: 1px solid #eee;
}
.label {
    margin-left: 10px;
    font-size: 15px;
}
</style>
