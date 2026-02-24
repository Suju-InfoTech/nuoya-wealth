import http from "@/api";
import authMenuList from "@/assets/json/authMenuList.json";
/* 登录接口 */

export const loginApi = (params) => {
  return http.post("/api/v1/Login/GetADLogin", params);
}

export const localloginApi = (params) => {
  return http.post("/api/v1/Login/GetLocalLogin", params);
}
export const getAuthMenuListApi = (params) => {
  return http.get("/api/v1/Login/GetRoleByLogin",params);
  // Mock 数据
   return authMenuList
}


export const logoutApi = () => {
  return http.post("/api/v1/Login/Logout");
}

// 获取当前用户信息
export const getCurrentUserApi = () => {
  return http.get("/api/v1/Login/GetCurrentUser");
}


// 获取用户权限
// http://192.168.100.70:81/api/v1/Login/GetRoleByLogin?UserId=1