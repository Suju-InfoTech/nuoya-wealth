import { defineStore } from "pinia";
import type { AuthState } from "@/stores/interface";
import { getAuthMenuListApi } from "@/api/module/login";
import { getFlatMenuList, getShowMenuList } from "@/utils";
import { useUserStore } from "@/stores/modules/user";

/**
 * 优化点：
 * - 明确函数职责，拆分解析/转换逻辑
 * - 避免直接修改 API 返回对象，使用不可变赋值
 * - 增加容错与日志，便于排查
 */

const parseFlag = (flag: any): boolean => {
  if (typeof flag === "boolean") return flag;
  if (typeof flag === "number") return flag === 1;
  if (typeof flag === "string") {
    const v = flag.trim().toLowerCase();
    return v === "true" || v === "1" || v === "y" || v === "yes";
  }
  return false;
};

const toKey = (v: any) => String(v ?? "").trim().toLowerCase();

const parsePermissionList = (raw: any): any[] => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const dedupeSamePathChild = (list: any[]): any[] => {
  if (!Array.isArray(list)) return [];
  return list.map(item => {
    const copy: any = { ...item };
    if (Array.isArray(copy.children) && copy.children.length) {
      // filter out children that have same path as parent, and recurse
      copy.children = copy.children
        .filter((c: any) => c?.path !== copy?.path)
        .map((c: any) => dedupeSamePathChild([c])[0]);
    }
    return copy;
  });
};

export const useAuthStore = defineStore("hetong-auth", {

  state: (): AuthState => ({
    authMenuList: [],
    routeName: "",
    isExport: false,
    isShowRoleList: false,
    isEmailExport: false
  }),
  getters: {
    authMenuListGet: state => state.authMenuList,
    showMenuListGet: state => getShowMenuList(state.authMenuList),
    flatMenuListGet: state => getFlatMenuList(state.authMenuList)
  },
  actions: {
    async getAuthMenuList() {
    try {
      const userStore = useUserStore();
      const userInfo = (userStore.userInfo || {}) as any;
      // Normalize API response shapes: support { ResultSet1 }, { data }, or direct array/result
      const res: any = await getAuthMenuListApi({ UserId: userInfo?.ID });
      const ResultSet1 = res?.ResultSet1 ?? res?.data ?? res ?? [];

        // 解析后端返回（可能是字符串或数组）
        const raw = typeof ResultSet1 === 'string' ? (ResultSet1 ? JSON.parse(ResultSet1) : []) : (ResultSet1 || []);
        const list = Array.isArray(raw) ? raw : [];

        // 简单 icon 映射，可按需扩展
        const iconMap: Record<string, string> = {
          '/email': 'Message',
          '/task': 'List',
          '/rule': 'Setting',
          '/dictionary': 'Notebook',
          '/perm': 'User',
          '/role': 'User'
        };

        const buildName = (path: string) => (path ? path.replace(/^\//, '') : '');

        const mapped = list.map((it: any) => {
          const path = it.Path ?? it.path ?? ''
          const component = it.Component ?? it.component ?? ''
          const title = it.GroupName ?? it.GroupNameCn ?? it.GroupNameEn ?? it.name ?? ''
          const pub = it.PubFlag ?? it.PubFlag === undefined ? it.PubFlag : 'true'
          // PubFlag 表示是否发布/可见，true -> isHide = false
          const isVisible = (String(pub).toLowerCase() === 'true' || pub === true || pub === 1)
          // activeMenu heuristics: 如果是 xxxDetail -> activeMenu = /xxx

          let activeMenu: string | undefined
          if (/Detail$/.test(path)) activeMenu = path.replace(/Detail$/, '')
          if(title=="任务导出") { this.isExport = parseFlag(it.IsButton) }
          if(title=="角色列表") { this.isShowRoleList = parseFlag(it.IsButton) }
          if(title=="邮件导出") {this.isEmailExport=parseFlag(it.IsButton)}
          // 另一种情况：若 Component 包含 "/edit" 且 there's a base route with same prefix, set activeMenu by removing "Edit" suffix of name
          return {
            path,
            name: buildName(path),
            component,
            meta: {
              title,
              isHide: parseFlag(it.IsHide) || !isVisible,
              isButton: parseFlag(it.IsButton),
              icon: iconMap[path] ?? undefined,
              ...(activeMenu ? { activeMenu } : {})
            },
            children: []
          }
        })
        
        this.authMenuList = mapped as any;
      } catch (error) {
        console.error('[auth] getAuthMenuList failed:', error);
        this.authMenuList = [];
      }
    },
    resetAuthMenuList() {
      this.authMenuList = [];
    },
    async setRouteName(name: string) {
      this.routeName = name;
    }
  }
},);