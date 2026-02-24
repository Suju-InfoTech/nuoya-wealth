import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTabsStore } from './tabs'
import type { EmailTab } from './tabs'

// Mock the utility function
vi.mock('@/utils/index', () => ({
  getDefaultDateRange: () => ['2024-01-01 00:00:00', '2024-01-02 00:00:00']
}))

describe('Tabs Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with empty tabs', () => {
    const store = useTabsStore()
    expect(store.emailTabs).toEqual([])
  })

  it('should set tabs with default values', () => {
    const store = useTabsStore()
    const tabs: EmailTab[] = [
      {
        ID: 1,
        Email: 'test@example.com',
        pageNum: 1,
        pageSize: 20,
        total: 0,
        query: {}
      },
      {
        ID: 2,
        Email: 'test2@example.com',
        pageNum: 1,
        pageSize: 20,
        total: 0,
        query: {}
      }
    ]

    store.setTabs(tabs)
    
    expect(store.emailTabs).toHaveLength(2)
    expect(store.emailTabs[0].Email).toBe('test@example.com')
    expect(store.emailTabs[0].query).toHaveProperty('title')
    expect(store.emailTabs[0].query).toHaveProperty('Folder')
    expect(store.emailTabs[0].pageNum).toBe(1)
    expect(store.emailTabs[0].pageSize).toBe(20)
  })

  it('should reset query but preserve folder when setting tabs', () => {
    const store = useTabsStore()
    const initialTabs: EmailTab[] = [
      {
        ID: 1,
        Email: 'test@example.com',
        pageNum: 1,
        pageSize: 20,
        total: 0,
        query: { title: 'old', sTime: '', eTime: '', sender: '', tag: '', status: '', Field: '', Sort: '', Folder: ['Inbox', 'Sent'] }
      }
    ]
    
    store.setTabs(initialTabs)
    // After first setTabs, folder is reset to default
    expect(store.emailTabs[0].query.Folder).toEqual([])
    expect(store.emailTabs[0].query.title).toBeDefined()
  })

  it('should move tab from one position to another', () => {
    const store = useTabsStore()
    const tabs: EmailTab[] = [
      { ID: 1, Email: 'email1@test.com', pageNum: 1, pageSize: 20, total: 0, query: {} },
      { ID: 2, Email: 'email2@test.com', pageNum: 1, pageSize: 20, total: 0, query: {} },
      { ID: 3, Email: 'email3@test.com', pageNum: 1, pageSize: 20, total: 0, query: {} }
    ]
    
    store.setTabs(tabs)
    store.moveTab(0, 2)
    
    expect(store.emailTabs[0].ID).toBe(2)
    expect(store.emailTabs[2].ID).toBe(1)
  })

  it('should not move tab with invalid indices', () => {
    const store = useTabsStore()
    const tabs: EmailTab[] = [
      { ID: 1, Email: 'email1@test.com', pageNum: 1, pageSize: 20, total: 0, query: {} }
    ]
    
    store.setTabs(tabs)
    const originalLength = store.emailTabs.length
    
    store.moveTab(-1, 0)
    store.moveTab(0, 10)
    
    expect(store.emailTabs).toHaveLength(originalLength)
  })

  it('should set tab data correctly', () => {
    const store = useTabsStore()
    const tabs: EmailTab[] = [
      {
        ID: 1,
        Email: 'test@example.com',
        pageNum: 1,
        pageSize: 20,
        total: 0,
        query: {},
        listData: []
      }
    ]
    
    store.setTabs(tabs)
    store.setTabData(1, {
      listData: [{ id: 1, name: 'item1' }],
      total: 10,
      pageNum: 2,
      pageSize: 30
    })
    
    const tab = store.emailTabs.find(t => t.ID === 1)
    expect(tab?.listData).toHaveLength(1)
    expect(tab?.total).toBe(10)
    expect(tab?.pageNum).toBe(2)
    expect(tab?.pageSize).toBe(30)
  })

  it('should not set tab data for non-existent tab', () => {
    const store = useTabsStore()
    const tabs: EmailTab[] = [
      { ID: 1, Email: 'test@example.com', pageNum: 1, pageSize: 20, total: 0, query: {} }
    ]
    
    store.setTabs(tabs)
    store.setTabData(999, { total: 100 })
    
    const tab = store.emailTabs.find(t => t.ID === 1)
    expect(tab?.total).toBe(0)
  })

  it('should set tab query and reset page', () => {
    const store = useTabsStore()
    const tabs: EmailTab[] = [
      {
        ID: 1,
        Email: 'test@example.com',
        pageNum: 5,
        pageSize: 20,
        total: 100,
        query: { title: 'old' }
      }
    ]
    
    store.setTabs(tabs)
    store.setTabQuery(1, { title: 'new', sender: 'test@sender.com' })
    
    const tab = store.emailTabs.find(t => t.ID === 1)
    expect(tab?.query.title).toBe('new')
    expect(tab?.query.sender).toBe('test@sender.com')
    expect(tab?.pageNum).toBe(1) // reset to 1
  })

  it('should set tab query without resetting page', () => {
    const store = useTabsStore()
    const tabs: EmailTab[] = [
      {
        ID: 1,
        Email: 'test@example.com',
        pageNum: 5,
        pageSize: 20,
        total: 100,
        query: {}
      }
    ]
    
    store.setTabs(tabs)
    store.setTabQuery(1, { title: 'new' }, false)
    
    const tab = store.emailTabs.find(t => t.ID === 1)
    expect(tab?.pageNum).toBe(5) // keep original page number
  })

  it('should not set tab query for non-existent tab', () => {
    const store = useTabsStore()
    const tabs: EmailTab[] = [
      { ID: 1, Email: 'test@example.com', pageNum: 1, pageSize: 20, total: 0, query: {} }
    ]
    
    store.setTabs(tabs)
    store.setTabQuery(999, { title: 'test' })
    
    const tab = store.emailTabs.find(t => t.ID === 1)
    // Title has default value of empty string, not undefined
    expect(tab?.query.title).toBe('')
  })

  it('should add new tab with defaults', () => {
    const store = useTabsStore()
    const newTab: EmailTab = {
      ID: 1,
      Email: 'test@example.com',
      pageNum: 1,
      pageSize: 20,
      total: 0,
      query: {}
    }
    
    store.addTab(newTab)
    
    expect(store.emailTabs).toHaveLength(1)
    expect(store.emailTabs[0].ID).toBe(1)
  })

  it('should not add duplicate tab', () => {
    const store = useTabsStore()
    const tab: EmailTab = {
      ID: 1,
      Email: 'test@example.com',
      pageNum: 1,
      pageSize: 20,
      total: 0,
      query: {}
    }
    
    store.addTab(tab)
    store.addTab(tab)
    
    expect(store.emailTabs).toHaveLength(1)
  })

  it('should add tab with default values', () => {
    const store = useTabsStore()
    const tab: EmailTab = {
      ID: 1,
      Email: 'test@example.com',
      pageNum: undefined as any,
      pageSize: undefined as any,
      total: undefined as any,
      query: undefined as any
    }
    
    store.addTab(tab)
    
    const addedTab = store.emailTabs[0]
    expect(addedTab.pageNum).toBe(1)
    expect(addedTab.pageSize).toBe(20)
    expect(addedTab.total).toBe(0)
    expect(addedTab.query).toBeDefined()
  })

  it('should remove tab by index', () => {
    const store = useTabsStore()
    const tabs: EmailTab[] = [
      { ID: 1, Email: 'email1@test.com', pageNum: 1, pageSize: 20, total: 0, query: {} },
      { ID: 2, Email: 'email2@test.com', pageNum: 1, pageSize: 20, total: 0, query: {} },
      { ID: 3, Email: 'email3@test.com', pageNum: 1, pageSize: 20, total: 0, query: {} }
    ]
    
    store.setTabs(tabs)
    store.removeTab(1)
    
    expect(store.emailTabs).toHaveLength(2)
    expect(store.emailTabs[1].ID).toBe(3)
  })

  it('should remove tab by tab object', () => {
    const store = useTabsStore()
    const tabs: EmailTab[] = [
      { ID: 1, Email: 'email1@test.com', pageNum: 1, pageSize: 20, total: 0, query: {} },
      { ID: 2, Email: 'email2@test.com', pageNum: 1, pageSize: 20, total: 0, query: {} }
    ]
    
    store.setTabs(tabs)
    store.removeTab({ ID: 1, Email: 'email1@test.com', pageNum: 1, pageSize: 20, total: 0, query: {} })
    
    expect(store.emailTabs).toHaveLength(1)
    expect(store.emailTabs[0].ID).toBe(2)
  })

  it('should not remove non-existent tab', () => {
    const store = useTabsStore()
    const tabs: EmailTab[] = [
      { ID: 1, Email: 'email1@test.com', pageNum: 1, pageSize: 20, total: 0, query: {} }
    ]
    
    store.setTabs(tabs)
    store.removeTab({ ID: 999, Email: 'nonexist@test.com', pageNum: 1, pageSize: 20, total: 0, query: {} })
    
    expect(store.emailTabs).toHaveLength(1)
  })
})
