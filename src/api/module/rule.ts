import http from "@/api";


/**
* @name 获取规则列表（分页）
* */
export const getRuleListPageApi = (params) => {
  return http.post("/api/v1/Rule/GetRuleList",params);
}

/**
* @name 获取邮箱清单
* */
export const getGraphEmailListApi = () => {
  return http.post("/api/v1/Graph/GetGraphEmailList");
}

/**
* @name 新增修改GraphEmail
* */
export const graphEmailManApi = (params) => {
  return http.post("/api/v1/Graph/GraphEmailMan",params);
}


/**
* @name 保存GraphKey
* */
export const graphKeyManApi = (params) => {
  return http.post("/api/v1/Graph/GraphKeyMan",params);
}


/**
* @name 验证 GraphKey
* */
export const checkGraphKeyApi = (params) => {
  return http.post("/api/v1/Graph/CheckGraphKey",params);
}


/**
* @name 获取规则列表
* */
export const getRuleListApi = (params) => {
  return http.get("/api/v1/Rule/GetRuleList",params);
}


/**
* @name 添加/修改 规则
* */
export const ruleManApi = (data) => {
  return http.post("/api/v1/Rule/RuleMan",data);
}

/**
* @name 验证规则条件
* */
export const checkConditionApi = (params) => {
  return http.get("/api/v1/Rule/CheckCondition",params);
}

/**
* @name 复制规则
* */
export const copyRuleApi = (params) => {
  return http.post("/api/v1/Rule/CopyRule",params);
}
/**
* @name 启用/禁用规则
* */
export const enableDisenableApi = (params) => {
  return http.get("/api/v1/Rule/EnableDisenable",params);
}
/**
* @name 删除规则
* */
export const deleteRuleApi = (params) => {
  return http.get("/api/v1/Rule/GetDelete",params);
}

/**
* @name 邮件自动接收设置
* */
export const receiveEmailApi = (params) => {
  return http.post("/api/v1/Rule/ReceiveEmail",params);
}

/**
 * @name 启用/禁用邮箱
 */
export const enableDisenableEmailApi = (params) => {
  return http.post("/api/v1/Graph/EnableDisEnable",params);
}

/**
 * @name 删除邮箱
 */
export const deleteEmailApi = (params) => {
  return http.get("/api/v1/Graph/GetDelete",params);
}


/**
 * @name 规则排序
 */
export const sortRuleApi = (params) => {
  return http.get("/api/v1/Rule/SortRule",params);
}

/**
 * @name 获取规则详情
 */

export const getRuleDetailsApi = (params) => {
  return http.get("/api/v1/Rule/GetDetails",params);
}

/**
 * @name 获取邮箱接收规则
 */
export const getReceiveEmailApi = (params) => {
  return http.get("/api/v1/Rule/GetReceiveEmail",params);
}

/**
 * 
 * @name 运行规则
 */
export const runRuleApi = (params) => {
  return http.get("/api/v1/Rule/RunRule",params);
}
