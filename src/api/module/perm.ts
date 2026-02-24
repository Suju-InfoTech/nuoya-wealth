import http from "@/api";

/*
*
* @name 获取用户列表
* 
*
* */


export const getUserListApi = (params) => {
  return http.post(`/api/v1/User/GetUserList`, params);
}

/*
*
* @name 新增或编辑用户
* 
*
* */

export const addOrUpdateUserApi = (params) => {
  return http.post(`/api/v1/User/AccountRoleMan`, params);
}

/*
*
* @name 删除用户
* 
*
* */

export const deleteUserApi = (params) => {
  return http.get(`/api/v1/User/GetDelete`, params);
}

/*
*
* @name 获取用户详情
* 
*
* */

export const getUserDetailApi = (params) => {
  return http.get(`/api/v1/User/GetDetails`, params);
}


/**
*
* @name 启用禁用用户
* 
*
* */

export const enableOrDisableUserApi = (params) => {
  return http.post(`/api/v1/User/EnableDisEnable`, params);
}
