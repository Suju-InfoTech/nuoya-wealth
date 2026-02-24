<template>
    <header class="header">
        <div class="header-left">
            <img src="@/assets/ark-logo.png" alt="ARK Logo" class="logo" />

        </div>
        <div class="header-center">
            <span class="system-title">邮件任务管理系统</span>
        </div>
        <div class="header-right">
            <span class="time">
                <i class="icon-clock"></i>
                {{ currentTime }}
            </span>
            <span class="username">{{ userStore.userInfo.UserName }}</span>
            <el-dropdown>
                <span class="avatar-wrapper">
                    <img src="@/assets/avatar.png" alt="avatar" class="avatar" />
                </span>
                <template #dropdown>
                    <!-- <el-dropdown-menu>
                        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu> -->
                </template>
            </el-dropdown>
        </div>
    </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from "@/stores/modules/user";
import { LOGIN_URL } from "@/config";
import { ElMessageBox } from "element-plus";
import { logoutApi } from "@/api/module/login";
const userStore = useUserStore();
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const router = useRouter();
const logout = () => {
    ElMessageBox.confirm("您是否确认退出登录?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
    }).then(async () => {
        // 使用store中的logout方法，会自动处理定时器和清理工作
        // 关闭当前标签页
        window.parent.close();
    });
}



const currentTime = ref('')

function updateTime() {
    const now = new Date()
    const yyyy = now.getFullYear()
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const dd = String(now.getDate()).padStart(2, '0')
    const hh = String(now.getHours()).padStart(2, '0')
    const min = String(now.getMinutes()).padStart(2, '0')
    const sec = String(now.getSeconds()).padStart(2, '0')
    currentTime.value = `${yyyy}-${mm}-${dd} ${hh}:${min}:${sec}`
}

onMounted(() => {
    updateTime()
    setInterval(updateTime, 1000)
})
</script>

<style scoped>
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
    background: #fff;
    border-bottom: 1px solid #f0f0f0;
    padding: 10px 24px;
    box-sizing: border-box;
}

.header-left {
    display: flex;
    align-items: center;
}

.logo {
    height: 32px;
    margin-right: 8px;
}

.brand {
    font-family: 'Georgia', serif;
    color: #c9a86a;
    font-size: 28px;
    font-weight: bold;
}

.header-center {
    flex: 1;
    text-align: center;
}

.system-title {
    font-size: 18px;
    font-weight: bold;
    color: #001133;
    letter-spacing: 2px;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 16px;
}

.time {
    color: #666;
    font-size: 14px;
    display: flex;
    align-items: center;
}

.icon-clock {
    margin-right: 4px;
    font-size: 16px;
}

.username {
    font-size: 14px;
    color: #333;
}

.avatar-wrapper {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #f56c6c;
}
</style>