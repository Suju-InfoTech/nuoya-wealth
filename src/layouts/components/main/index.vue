<template>
    <el-main class="main">
        <router-view v-slot="{ Component }">
            
        </router-view>
    </el-main>
</template>

<script setup>
/* 这里无需引入任何内容，直接作为布局组件使用 */
</script>

<style scoped>
.main {
    padding: 10px;
    min-height: calc(100vh - 70px);
    background: #f1f2f4;
    box-sizing: border-box;
}
</style>