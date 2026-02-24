import http from '@/api'

/**
 * @name 获取任务清单
 */

export const getTaskListApi = (params) => {
  return http.post("/api/v1/Task/GetList", params);
}

/**
 * @name 新增任务
 */

export const addTaskApi = (params) => {
  return http.post("/api/v1/Task/TaskMan", params);
}
/**
 * @name 关联邮件
 */

export const bindEmailsApi = (params) => {
  return http.post("/api/v1/Task/BindEmails", params);
}

/**
 * @name 导出数据
 */
export const exportExcelApi = (params) => {
  return http.get("/api/v1/Task/ExportExcel", params,{responseType: 'arraybuffer'});
}

/**
 * @name 复制任务
 */
export const copyTaskApi = (params) => {
  return http.get("/api/v1/Task/Copy", params);
}
/**
 * @name 删除任务
 */
export const deleteTaskApi = (params) => {
  return http.get("/api/v1/Task/GetDelete", params);
}

//通过邮件流水号加载详情 
/**
 * @name 任务详情
 */
export const showEmailApi = (params) => {
  return http.get("/api/v1/Received/ShowEmail", params);
}

//通过邮件流水号加载详情 
/**
 * @name 任务详情
 */
export const showTaskDetailApi = (params) => {
  return http.get("/api/v1/Task/GetDetailsByNum", params);
}


/**
 * @name 加载任务详情
 */
export const getTaskDetailsApi = (params) => {
  return http.get("/api/v1/Task/GetDetails", params);
}


/**
 * @name 确认任务
 */
export const confirmTaskApi = (params) => {
  return http.post("/api/v1/Task/Confirm", params);
}


/**
 * @name 保存任务
 */
export const saveTaskApi = (params) => {
  return http.post("/api/v1/Task/Save", params);
}

/**
 * @name 获取产品类型
 */
export const getProdTypeApi = () => {
  return http.post("/api/v1/Dropdown/GetProdType");
}
/**
 * @name 根据产品类型下拉框获取业务类型下拉框
 */
export const getBussTypesApi = (params) => {
  return http.get("/api/v1/Dropdown/GetBussTypes", params);
}


/**
 * @name 任务导出Excel
 */
export const exportSelDataExcelApi = (params:{IDs:string,User:string}) => {
  return http.get("/api/v1/Task/TickExportExcel", params,{responseType: 'arraybuffer'});
}
