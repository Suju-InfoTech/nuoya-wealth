import { defineStore } from "pinia";
import { UserState } from "@/stores/interface";
import piniaPersistConfig from "@/stores/helper/persist";
import { LOGIN_URL } from "@/config";
import { ElMessage } from "element-plus";
import router from "@/router";
import { logoutApi } from "@/api/module/login";

type UserInfo = {
    UserName: string;
    Role: string;
    Token: string;
    DisplayName: string;
    ID: number;
}

export const useUserStore = defineStore(
    "nuoya-user",
    {
        state: () => {
            return {
                token: "",
                userInfo: {} as UserInfo,
                loginCheckTimer: null
            }
        },
        getters: {},
        actions: {
            // Set Token
            setToken(token: string) {
                this.token = token;
            },
            // Set setUserInfo
            setUserInfo(userInfo: UserState["userInfo"]) {
                this.userInfo = userInfo;
            },
            // 局部更新 userInfo（只改动传入的字段，其他字段原样保留）
            updateUserInfo(partial: Partial<UserState["userInfo"]>) {
                this.userInfo = { ...(this.userInfo as any), ...(partial as any) } as any;
            },

            // 退出登录
            logout() {
                // 清除定时器
                // 调用退出登录接口
                
                this.token = "";
                this.userInfo = {
                    UserName: "",
                    Role: "",
                    Token: "",
                    DisplayName: "",
                    ID: 0,
                };
            },
            startLoginCheck() {
                // 清除可能存在的旧定时器
                this.stopLoginCheck();

                // 设置30分钟定时器

            },
            // 停止登录状态验证定时器
            stopLoginCheck() {
                if (this.loginCheckTimer) {
                    clearInterval(this.loginCheckTimer);
                    this.loginCheckTimer = null;
                }
            },
        },
        persist: piniaPersistConfig("nuoya-user")
    }
);
