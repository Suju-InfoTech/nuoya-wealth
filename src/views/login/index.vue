<template>
  <div class="login-container" v-if="isShowLoginForm">
    <div class="login-bg">
      <img src="@/assets/login-bg.png" alt="背景图" />
    </div>
    <div class="login-form">
      <div class="logo">
        <img src="@/assets/ark-logo.png" alt="ARK Logo" />
      </div>
      <h2 class="title">欢迎使用邮件任务管理系统</h2>
      <div class="subtitle">用户登录页</div>
      <el-form :model="loginForm" class="form" ref="loginFormRef" :rules="loginRules" label-width="0px">
        <el-form-item prop="UserName">
          <el-input v-model="loginForm.UserName" placeholder="用户名："  />
        </el-form-item>
        <el-form-item prop="Password">
          <el-input v-model="loginForm.Password" type="password" placeholder="密码："  show-password/>
        </el-form-item>
        <el-form-item prop="ImgCode">
          <div class="captcha-row">
            <el-input v-model="loginForm.ImgCode" placeholder="验证码：" style="width: 60%;"  />
            <Captcha ref="loginCaptchaRef" :height="40" style="margin-left: 8px" />
          </div>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="loginForm.remember">记住用户名</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn" @click="login(loginFormRef)">登 录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import type { ElForm } from "element-plus";
import { useUserStore } from "@/stores/modules/user";
import { useAuthStore } from "@/stores/modules/auth";
import Captcha from "@/components/Captcha/index.vue";

import { loginApi,localloginApi ,getCurrentUserApi} from "@/api/module/login";

const userStore = useUserStore();
const authStore = useAuthStore();
const router = useRouter();
const loading = ref(false);
const forgotVisible = ref(false);
const loginForm = reactive({
  UserName: "",
  Password: "",
  ImgCode: ""
}) as any;
const loginCaptchaRef = ref<any>();

type FormInstance = InstanceType<typeof ElForm>;
const loginFormRef = ref<FormInstance>();
const loginRules = reactive({
  UserName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  Password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  ImgCode: [
    {
      required: true,
      validator: (_: any, value: string, cb: any) => {
        const real = (loginCaptchaRef.value?.getCode?.() || "").toLowerCase();
        if (!value) return cb(new Error("请输入验证码"));
        if (value.toLowerCase() !== real) return cb(new Error("验证码不正确"));
        cb();
      },
      trigger: "blur"
    }
  ]
});

const login = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async valid => {
    if (!valid) return;
    loading.value = true;
    try {
      let params = Object.assign({}, loginForm);
      delete params.ImgCode;
      if (loginForm.remember) {
        localStorage.setItem("rememberedName", loginForm.UserName);
      } else {
        localStorage.removeItem("rememberedName");
      }
      
      let {ResultFlag,ResultSet,ResultSet1} = await loginApi(params);
      // let {ResultFlag,ResultSet,ResultSet1} = await localloginApi(params);
      if(ResultFlag == 0){
        let ResultSets = JSON.parse(ResultSet);
        ElMessage.success("登录成功");
        userStore.setToken('fakeToken123456');
        userStore.setUserInfo(ResultSets);
        router.push({ path: '/email' });
      }else{
        ElMessage.error(ResultSet);
      }
    } finally {
      loading.value = false;
    }
  });
};

// resetForm
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  loginForm.UserName = "";
  loginForm.Password = "";
  loginForm.ImgCode = "";
  loginCaptchaRef.value?.refresh?.();
};

onMounted(() => {
  // 监听 enter 事件（调用登录）
  document.onkeydown = (e: KeyboardEvent) => {
    if (e.code === "Enter" || e.code === "enter" || e.code === "NumpadEnter") {
      if (loading.value) return;
      login(loginFormRef.value);
    }
  };
  // 检查是否有记住的用户名
  const rememberedName = localStorage.getItem("rememberedName");
  if (rememberedName) {
    loginForm.UserName = rememberedName;
    loginForm.remember = true;
  }
  checkLoginStatus();
});

const isShowLoginForm = ref(false);

const checkLoginStatus = () => {
  getCurrentUserApi().then(res => {
    if(res.ResultFlag == 0){
      let ResultSets = JSON.parse(res.ResultSet);
      userStore.setUserInfo(ResultSets);
      userStore.setToken('fakeToken123456');
      router.push({ path: '/email' });
    }else{
      ElMessage.error(res.ResultSet || "登录过期，请重新登录");
      isShowLoginForm.value = true;
    }
  }).catch(() => {
    isShowLoginForm.value = true;
  });
}

onBeforeUnmount(() => {
  document.onkeydown = null;
});
</script>

<style scoped>
.login-container {
  display: flex;
  height: 100vh;
}
.login-bg {
  width: 60%;
  height: 100%;
  overflow: hidden;
}
.login-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.login-form {
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
}
.logo img {
  height: 60px;
  margin-bottom: 10px;
}
.title {
  font-size: 22px;
  color: #333;
  font-weight: bold;
  margin-bottom: 6px;
  text-align: center;
}
.subtitle {
  font-size: 14px;
  color: #888;
  margin-bottom: 30px;
  text-align: center;
}
.form {
  width: 320px;
}
.captcha-row {
  display: flex;
  align-items: center;
}
.captcha-img {
  height: 32px;
  margin-left: 10px;
  border-radius: 4px;
  border: 1px solid #eee;
}
.login-btn {
  width: 100%;
  font-size: 16px;
  height: 38px;
}
</style>