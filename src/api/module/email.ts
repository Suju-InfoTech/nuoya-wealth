import http from '@/api'

/**
 * 获取Tab邮箱清单
 */
export const getEmailListApi = () => {
  return http.get('/api/v1/Dropdown/GetEmailList')
}

/**
 * 根据邮箱ID获取邮件列表
 */
export const getEmailReceivedListApi = (params: {
  EmailId: number;
  keyword: string;
  Folder: string;
  sender: string;
  sTime: string;
  eTime: string;
  tag: string;
  status: string;
  pageNum: number;
  pageSize: number;
  Field: string;
  Sort: string;
}) => {
  return http.post('/api/v1/Received/GetList', params)
}


/**
 * 邮件详情
 */
export const getEmailReceivedDetailsApi = (params: {
  ID: number;
}) => {
  return http.get('/api/v1/Received/GetDetails', params)
}


/**
 * 邮件删除
 */
export const getEmailReceivedDeleteApi = (params: {
  ID: number;
}) => {
  return http.get('/api/v1/Received/GetDelete', params)
}

/**
 * 手工收取邮件
 */
export const getEmailReceivedManualCollectionApi = (params: {
  EmailID: number;
  User: string;
}) => {
  return http.get('/api/v1/Received/ManualCollection', params)
}

/**
 * 修改标签
 */

export const getEmailReceivedUpdateTagApi = (params: {
  ID: number;
  Tags: string;
  UpdateUser: string;
}) => {
  return http.post('/api/v1/Received/UpdateTag', params)
}


/**
 * 获取标签下拉框
 */
export const getEmailReceivedTagDropdownApi = () => {
  return http.get('/api/v1/Dropdown/GetTag')
}


/**
 * 标记为无需处理
 */
export const getEmailReceivedNoDealWithApi = (params: {
  ID: number;
  User: string;
}) => {
  return http.get('/api/v1/Received/NoDealWith', params)
}

/**
 * 导出数据
 */
export const getEmailReceivedExportExcelApi = (params: {
  ID: number;
  subject: string;
  sender: string;
  sTime: string;
  eTime: string;
  tag: string;
  status: string;
  Folder: string;
}) => {
  return http.get('/api/v1/Received/ExportExcel', params, {
    responseType: 'arraybuffer'
  })
}

/**
 * 邮件绑定任务
 */

export const getEmailReceivedBindTasksApi = (params: {
  receivedIds: number[];
  taskId: number|string;
  User: string;
}) => {
  return http.post('/api/v1/Received/BindTasks', params)
}


/**
 * 邮件转任务
 */

export const getEmailReceivedGenerateTaskApi = (params: {
  ReceivedId: number;
  ProductType: string;
  ProductName: string;  
  BusinessType: string;
  BatchNum: string;
  PNnum: string;
  Tags: string| Array<string>;
  Maker: string;
  TaskRemark: string;
  CreateUser: string;
}) => {
  return http.post('/api/v1/Received/GenerateTask', params)
}


//通过任务流水号加载详情 
/**
 * @name 任务详情
 */
export const showTaskApi = (params) => {
  return http.get("/api/v1/Task/ShowTask", params);
}


/**
 * @name 下载邮件附件
 */
export const downloadEmailAttachmentApi = (params) => {
  return http.get("/api/v1/Received/Download", params, {
    responseType: 'arraybuffer'
  });
}

/**
 * @name 产品名称下拉框
 */
export const getProdNamesApi = () => {
  return http.get("/api/v1/Dropdown/GetProdNames");
}

/**
 * @name 根据产品名称获取管理员批次和产品代码
 */
export const getAdminNosApi = (params) => {
  return http.get("/api/v1/Dropdown/GetAdminNos", params);
}


/**
 * @name 文件夹下拉框
 */

export const getFolderDropdownApi = (params: { emailID: number }) => {
  return http.get("/api/v1/Dropdown/GetAllFolders", params);
}

/**
 * @name 获取未处理邮件数量
 */
export const getUnprocessedCountApi = (params: { sTime: string; eTime: string }) => {
  return http.get(`/api/v1/Received/Count?sTime=${params.sTime}&eTime=${params.eTime}`);
}
