export type LayoutType = "vertical" | "classic" | "transverse" | "columns";

export type AssemblySizeType = "large" | "default" | "small";

export type LanguageType = "zh" | "en" | null;

/* GlobalState */
export interface GlobalState {
  
  isCollapse: boolean;
}

/* UserState */
export interface UserState {
  token: string;
  userInfo: any;
}

/* tabsMenuProps */
export interface TabsMenuProps {
  icon: string;
  title: string;
  path: string;
  name: string;
  close: boolean;
  isKeepAlive: boolean;
  isButton: boolean;
}

/* TabsState */
export interface TabsState {
  tabsMenuList: TabsMenuProps[];
}

/* AuthState */
export interface AuthState {
  routeName: string;
  authMenuList: Menu.MenuOptions[];
  isExport: boolean;
  isShowRoleList: boolean;
  isEmailExport: boolean;
}

/* KeepAliveState */
export interface KeepAliveState {
  keepAliveName: string[];
}
