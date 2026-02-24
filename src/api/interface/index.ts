// 请求响应参数（不包含data）
export interface Result {
  code: string;
  msg: string;
}

// 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
  data?: T;
  resultFlag: T;
  resultMessage: T;
  resultSet: any;
  resultSet1: any;
  resultSet2: any;
  resultSet3: any;
  resultSet4: any;
  resultSet5: any;
  resultSet6: any;
  resultSet7: any;
  resultTotal: T;
  ResultSet: any;
  ResultFlag: T;
  ResultMessage: T;
  ResultSet1: any;
  ResultSet2: any;
  ResultTotal: any;
  success: boolean;
  message: string;
}

// 登录模块
export namespace Login {
  export interface ReqLoginForm {
    username: string;
    password: string;
  }
}
