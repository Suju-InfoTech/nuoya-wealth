import http from "@/api";

/*
*
* @name 获取角色列表
* */
export const getRoleListApi = (params) => {
  return http.get("/api/v1/Dropdown/GetRole",params);
}


/**
*
* @name 获取角色列表（分页）
* */
export const getRoleListPageApi = (params) => {
  return http.post("/api/v1/Role/GetRoleList",params);
}


/** 
*
* @name 启用禁用角色
* */

export const enableOrDisableRoleApi = (params) => {
  return http.post("/api/v1/Role/EnableDisenable",params);
}


/**
*
* @name 删除角色
* */
export const deleteRoleApi = (params) => {
  return http.get("/api/v1/Role/GetDelete",params);
}
