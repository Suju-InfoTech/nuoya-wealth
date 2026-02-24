import { ElMessage } from "element-plus";


/**
 * @description 使用递归扁平化菜单，方便添加动态路由
 * @param {Array} menuList 菜单列表
 * @returns {Array}
 */
export function getFlatMenuList(menuList: Menu.MenuOptions[]): Menu.MenuOptions[] {
  let newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList));
  return newMenuList.flatMap(item => [item, ...(item.children ? getFlatMenuList(item.children) : [])]);
}


/**
 * @description 使用递归过滤出需要渲染在左侧菜单的列表 (需剔除 isHide == true 的菜单)
 * @param {Array} menuList 菜单列表
 * @returns {Array}
 * */
export function getShowMenuList(menuList: Menu.MenuOptions[]) {
  let newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList));
  return newMenuList.filter(item => {
    item.children?.length && (item.children = getShowMenuList(item.children));
    return !item.meta?.isHide;
  });
}



export const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const formatTime = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  const second = String(date.getSeconds()).padStart(2, '0')
  return `${hour}:${minute}:${second}`
}

// 允许为空的字段（只写叶子节点名即可）
const ALLOW_EMPTY = new Set([
  'Remark',
  'TaskTitle',
  'BatchNum',
  'ProductName',
  'PNnum',
  'TaskRemark'
]);

// 中文映射
const CN_KEY: Record<string, string> = {
  condModels: '规则条件',
  operModels: '操作'
};

/**
 * 校验：仅检查 condModels / operModels
 *  1. exceptCondModels 整体跳过
 *  2. operModels 下若 OperationName == 0，则 Task 内全部字段免检
 * 返回 { valid: true } 或 { valid: false, key: '规则条件' | '操作' }
 */
export function validateNoEmpty(form: any): { valid: boolean; key?: string } {
  for (const arrKey of ['condModels', 'operModels'] as const) {
    const list = form[arrKey] ?? [];
    for (let i = 0; i < list.length; i++) {
      const item = list[i];

      // 如果是操作项且 OperationName == 0，直接跳过 Task 校验
      if (arrKey === 'operModels' && item.OperationName == 0) continue;

      const hasEmpty = (obj: any): boolean => {
        for (const [k, v] of Object.entries(obj)) {
          if (v && typeof v === 'object' && !Array.isArray(v)) {
            if (hasEmpty(v)) return true;
          } else {
            const isEmpty = v === '' || v === null || v === undefined ||
                            (typeof v === 'string' && v.trim() === '');
            if (isEmpty && !ALLOW_EMPTY.has(k)) return true;
          }
        }
        return false;
      };
      if (hasEmpty(item)) {
        return { valid: false, key: CN_KEY[arrKey] };
      }
    }
  }
  return { valid: true };
}


/**
 * @description 生成默认日期范围：当天00:00:00到当前时间
 * @returns {string[]} 默认日期范围数组
 */
export const getDefaultDateRange = () => {
  const now = new Date();
  // 开始时间：昨天17:31:00
  const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 17, 31, 0);
  // 结束时间：当天17:30:00
  const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 30, 59);
  
  // 格式化时间为YYYY-MM-DD HH:mm:ss
  const formatDateTime = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };
  
  return [formatDateTime(startTime), formatDateTime(endTime)];
};

/***
 * ArrayBuffer转字符串
 */

export function arrayBufferToString(buffer: ArrayBuffer): boolean | string {
  // ArrayBuffer转字符串
  const text = new TextDecoder('utf-8').decode(buffer);
  // 判断是否为JSON
  if (text.trim().startsWith('{')) {
    try {
      const obj = JSON.parse(text);
      if (obj && (obj.success === false || obj.success === 'false' || obj.success === 0 || obj.success === '0')) {
        ElMessage.error(obj.message || obj.msg || '导出失败');
        return false;
      }
    } catch (e) {
      // 解析失败，说明不是json，继续下载
    }
  }
  return true;
}