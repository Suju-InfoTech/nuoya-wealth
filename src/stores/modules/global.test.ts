import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGlobalStore } from './global'

describe('Global Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default state', () => {
    const store = useGlobalStore()
    expect(store.isCollapse).toBe(false)
  })

  it('should toggle collapse state', () => {
    const store = useGlobalStore()
    expect(store.isCollapse).toBe(false)
    
    store.toggleCollapse()
    expect(store.isCollapse).toBe(true)
    
    store.toggleCollapse()
    expect(store.isCollapse).toBe(false)
  })

  it('should set collapse state directly', () => {
    const store = useGlobalStore()
    
    store.setCollapse(true)
    expect(store.isCollapse).toBe(true)
    
    store.setCollapse(false)
    expect(store.isCollapse).toBe(false)
  })
})
