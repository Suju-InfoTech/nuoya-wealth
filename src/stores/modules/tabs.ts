import { defineStore } from 'pinia'
import piniaPersistConfig from '@/stores/helper/persist'
import { getDefaultDateRange } from '@/utils/index'

// 邮箱对象类型（增加分页、查询与列表数据字段）
export interface EmailTab {
  ID: number
  Email: string
  TenantID?: string | null
  GraphKey?: string | null
  GraphSecret?: string | null
  UpdateTime?: string
  UpdateUser?: string
  ChangeFlag?: string
  folderList?: any[]
  pageNum: number
  pageSize: number
  total: number
  UnprocessedCount?: number
  query: {
    title?: string
    dateRange?: string | string[]
    sender?: string
    tag?: string
    status?: string
    Field?: string
    Sort?: string
    Folder?: string[]
    [key: string]: any
  }
  listData?: any[]
}

export const useTabsStore = defineStore('nuoya-tabs', {
  state: () => ({
    emailTabs: [] as EmailTab[]
  }),
  actions: {
    moveTab(from: number, to: number) {
      const list = this.emailTabs
      if (from < 0 || to < 0 || from >= list.length || to >= list.length) return
      const [item] = list.splice(from, 1)
      list.splice(to, 0, item)
    },

    // 设置 tabs：保证每个 tab 有默认分页/查询/列表结构；合并已存在本地数据
    setTabs(tabs: EmailTab[]) {
      const currentMap: Record<number, EmailTab> = {};
      (this.emailTabs || []).forEach(t => { currentMap[t.ID] = t })

      const defaultDateRange = getDefaultDateRange()
      const defaultQuery = {
        title: '',
        sTime: defaultDateRange[0],
        eTime: defaultDateRange[1],
        sender: '',
        tag: '',
        status: '',
        Field: '',
        Sort: '',
        Folder: []
      }

      this.emailTabs = tabs.map(t => {
        const stored = currentMap[t.ID]
        const base = { ...t }
        // query 始终使用默认值，只保留 Folder 字段从 stored 中取
        const mergedQuery = {
          ...defaultQuery,
          Folder: stored?.query?.Folder ?? []
        }
        return {
          ...base,
          pageNum: stored?.pageNum ?? base.pageNum ?? 1,
          pageSize: stored?.pageSize ?? base.pageSize ?? 20,
          total: stored?.total ?? base.total ?? 0,
          UnprocessedCount: base.UnprocessedCount ?? stored?.UnprocessedCount ?? 0,
          query: mergedQuery,
          listData: stored?.listData ?? base.listData ?? [],
          folderList: stored?.folderList ?? base.folderList ?? []
        } as EmailTab
      })
    },

    setTabData(id: number, payload: { listData?: any[]; total?: number; pageNum?: number; pageSize?: number; UnprocessedCount?: number }) {
      const idx = this.emailTabs.findIndex(t => t.ID === id)
      if (idx === -1) return
      const tab = this.emailTabs[idx]
      this.emailTabs[idx] = {
        ...tab,
        listData: payload.listData ?? tab.listData ?? [],
        total: payload.total ?? tab.total ?? 0,
        pageNum: payload.pageNum ?? tab.pageNum ?? 1,
        pageSize: payload.pageSize ?? tab.pageSize ?? 20,
        UnprocessedCount: payload.UnprocessedCount ?? tab.UnprocessedCount ?? 0,
      }
    },

    setTabQuery(id: number, query: Partial<EmailTab['query']>, resetPage = true) {
      const idx = this.emailTabs.findIndex(t => t.ID === id)
      if (idx === -1) return
      const tab = this.emailTabs[idx]
      // 确保 tab.query 存在
      if (!tab.query) {
        tab.query = { title: '', sTime: getDefaultDateRange()[0], eTime: getDefaultDateRange()[1], sender: '', tag: '', status: '', Field: '', Sort: '', Folder: [] }
      }
      this.emailTabs[idx] = {
        ...tab,
        query: { ...(tab.query ?? {}), ...query },
        pageNum: resetPage ? 1 : tab.pageNum ?? 1,
        folderList: tab.folderList ?? []
      }
    },

    addTab(tab: EmailTab) {
      if (!this.emailTabs.find(t => t.ID === tab.ID)) {
        const withDefaults = {
          ...tab,
          pageNum: tab.pageNum ?? 1,
          pageSize: tab.pageSize ?? 20,
          total: tab.total ?? 0,
          UnprocessedCount: tab.UnprocessedCount ?? 0,
          query: tab.query ?? { title: '', sTime: getDefaultDateRange()[0], eTime: getDefaultDateRange()[1], sender: '', tag: '', status: '', Field: '', Sort: '', Folder: [] },
          listData: tab.listData ?? [],
          folderList: tab.folderList ?? []
        }
        this.emailTabs.push(withDefaults)
      }
    },

    removeTab(tabOrIndex: EmailTab | number) {
      if (typeof tabOrIndex === 'number') this.emailTabs.splice(tabOrIndex, 1)
      else {
        const idx = this.emailTabs.findIndex(t => t.ID === tabOrIndex.ID)
        if (idx > -1) this.emailTabs.splice(idx, 1)
      }
    }
  },
  // 持久化时仅保留 query.Folder 字段
  persist: {
    ...piniaPersistConfig('nuoya-tabs'),
    serializer: {
      serialize: (state: any) => {
        // 序列化时只保留 query.Folder 字段
        const stateToSave = {
          ...state,
          emailTabs: (state.emailTabs || []).map((t: any) => ({
            ...t,
            query: {
              Folder: t.query?.Folder ?? []
            }
          }))
        }
        return JSON.stringify(stateToSave)
      },
      deserialize: (value: string) => {
        const state = JSON.parse(value)
        const defaultDateRange = getDefaultDateRange()
        // 恢复时保留 Folder,其他字段重置为默认值
        state.emailTabs = (state.emailTabs || []).map((t: any) => ({
          ...t,
          pageSize: t.pageSize === 10 ? 20 : t.pageSize,
          query: {
            title: '',
            sTime: defaultDateRange[0],
            eTime: defaultDateRange[1],
            sender: '',
            tag: '',
            status: '',
            Field: '',
            Sort: '',
            Folder: t.query?.Folder ?? []
          }
        }))
        return state
      }
    }
  }
})

export default useTabsStore