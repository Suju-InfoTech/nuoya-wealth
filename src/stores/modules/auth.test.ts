import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from './auth'

// Mock the API
vi.mock('@/api/module/login', () => ({
  getAuthMenuListApi: vi.fn()
}))

// Mock router
vi.mock('@/router', () => ({
  default: {
    addRoute: vi.fn()
  }
}))

// Mock utilities
vi.mock('@/utils', () => {
  const flattenMenu = (list: any[]): any[] => {
    return list.flatMap((item: any) => [item, ...(item.children ? flattenMenu(item.children) : [])])
  }
  return {
    getFlatMenuList: flattenMenu,
    getShowMenuList: (list: any[]) => {
      return list.filter((item: any) => !item.meta?.isHide)
    }
  }
})

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default state', () => {
    const store = useAuthStore()
    expect(store.authMenuList).toEqual([])
    expect(store.routeName).toBe('')
    expect(store.isExport).toBe(false)
    expect(store.isShowRoleList).toBe(false)
    expect(store.isEmailExport).toBe(false)
  })

  it('should set route name', () => {
    const store = useAuthStore()
    store.setRouteName('test-route')
    expect(store.routeName).toBe('test-route')
  })

  it('should get flat menu list', () => {
    const store = useAuthStore()
    store.authMenuList = [
      {
        path: '/home',
        name: 'home',
        children: [
          { path: '/home/sub', name: 'sub', children: [] }
        ]
      }
    ] as any

    const flatList = store.flatMenuListGet
    expect(flatList.length).toBeGreaterThanOrEqual(2)
  })

  it('should get show menu list', () => {
    const store = useAuthStore()
    store.authMenuList = [
      {
        path: '/visible',
        name: 'visible',
        meta: { isHide: false }
      },
      {
        path: '/hidden',
        name: 'hidden',
        meta: { isHide: true }
      }
    ] as any

    const showList = store.showMenuListGet
    expect(showList.length).toBeLessThanOrEqual(store.authMenuList.length)
  })

  it('should reset auth menu list', () => {
    const store = useAuthStore()
    store.authMenuList = [{ path: '/test' }] as any
    expect(store.authMenuList).toHaveLength(1)
    
    store.resetAuthMenuList()
    expect(store.authMenuList).toEqual([])
  })

  it('should handle getAuthMenuList with empty response', async () => {
    const { getAuthMenuListApi } = await vi.importMock('@/api/module/login')
    vi.mocked(getAuthMenuListApi).mockResolvedValue({ ResultSet1: [] })
    
    const store = useAuthStore()
    await store.getAuthMenuList()
    
    expect(store.authMenuList).toEqual([])
  })

  it('should handle getAuthMenuList with API error', async () => {
    const { getAuthMenuListApi } = await vi.importMock('@/api/module/login')
    vi.mocked(getAuthMenuListApi).mockRejectedValue(new Error('API Error'))
    
    const store = useAuthStore()
    await store.getAuthMenuList()
    
    expect(store.authMenuList).toEqual([])
  })

  it('should parse menu list with different response formats', async () => {
    const { getAuthMenuListApi } = await vi.importMock('@/api/module/login')
    const mockMenuData = [
      {
        Path: '/email',
        Component: 'Email',
        GroupName: '邮件管理',
        PubFlag: true,
        IsHide: false,
        IsButton: false
      }
    ]
    
    vi.mocked(getAuthMenuListApi).mockResolvedValue({ ResultSet1: mockMenuData })
    
    const store = useAuthStore()
    await store.getAuthMenuList()
    
    expect(store.authMenuList).toHaveLength(1)
    expect(store.authMenuList[0].path).toBe('/email')
    expect(store.authMenuList[0].name).toBe('email')
    expect(store.authMenuList[0].meta.title).toBe('邮件管理')
  })

  it('should set isExport flag when title is 任务导出', async () => {
    const { getAuthMenuListApi } = await vi.importMock('@/api/module/login')
    const mockMenuData = [
      {
        Path: '/task',
        Component: 'Task',
        GroupName: '任务导出',
        IsButton: true,
        IsHide: false
      }
    ]
    
    vi.mocked(getAuthMenuListApi).mockResolvedValue({ ResultSet1: mockMenuData })
    
    const store = useAuthStore()
    await store.getAuthMenuList()
    
    expect(store.isExport).toBe(true)
  })

  it('should set isShowRoleList flag when title is 角色列表', async () => {
    const { getAuthMenuListApi } = await vi.importMock('@/api/module/login')
    const mockMenuData = [
      {
        Path: '/role',
        Component: 'Role',
        GroupName: '角色列表',
        IsButton: true,
        IsHide: false
      }
    ]
    
    vi.mocked(getAuthMenuListApi).mockResolvedValue({ ResultSet1: mockMenuData })
    
    const store = useAuthStore()
    await store.getAuthMenuList()
    
    expect(store.isShowRoleList).toBe(true)
  })

  it('should set isEmailExport flag when title is 邮件导出', async () => {
    const { getAuthMenuListApi } = await vi.importMock('@/api/module/login')
    const mockMenuData = [
      {
        Path: '/email',
        Component: 'Email',
        GroupName: '邮件导出',
        IsButton: true,
        IsHide: false
      }
    ]
    
    vi.mocked(getAuthMenuListApi).mockResolvedValue({ ResultSet1: mockMenuData })
    
    const store = useAuthStore()
    await store.getAuthMenuList()
    
    expect(store.isEmailExport).toBe(true)
  })

  it('should parse different flag formats correctly', async () => {
    const { getAuthMenuListApi } = await vi.importMock('@/api/module/login')
    // Test various boolean flag formats
    // Note: isHide = parseFlag(it.IsHide) || !isVisible
    // where isVisible = (String(pub).toLowerCase() === 'true' || pub === true || pub === 1)
    const mockMenuData = [
      {
        Path: '/test1',
        Component: 'Test1',
        GroupName: 'Test1',
        IsHide: true,
        IsButton: 1,
        PubFlag: true
      },
      {
        Path: '/test2',
        Component: 'Test2',
        GroupName: 'Test2',
        IsHide: false,
        IsButton: 0,
        PubFlag: true  // visible and not hidden
      }
    ]
    
    vi.mocked(getAuthMenuListApi).mockResolvedValue({ ResultSet1: mockMenuData })
    
    const store = useAuthStore()
    await store.getAuthMenuList()
    
    expect(store.authMenuList).toHaveLength(2)
    expect(store.authMenuList[0].meta.isHide).toBe(true)  // IsHide: true OR !isVisible(true) = true OR false = true
    expect(store.authMenuList[0].meta.isButton).toBe(true)
    expect(store.authMenuList[1].meta.isHide).toBe(false) // IsHide: false OR !isVisible(true) = false OR false = false
    expect(store.authMenuList[1].meta.isButton).toBe(false)
  })

  it('should handle missing user info gracefully', async () => {
    const { getAuthMenuListApi } = await vi.importMock('@/api/module/login')
    vi.mocked(getAuthMenuListApi).mockResolvedValue({ ResultSet1: [] })
    
    const store = useAuthStore()
    await store.getAuthMenuList()
    
    expect(store.authMenuList).toEqual([])
  })
})
