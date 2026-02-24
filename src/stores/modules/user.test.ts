import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from './user'

describe('User Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default state', () => {
    const store = useUserStore()
    expect(store.token).toBe('')
    expect(store.userInfo).toEqual({})
  })

  it('should set token', () => {
    const store = useUserStore()
    const testToken = 'test-token-123'
    
    store.setToken(testToken)
    expect(store.token).toBe(testToken)
  })

  it('should set user info', () => {
    const store = useUserStore()
    const userInfo = {
      UserName: 'testuser',
      Role: 'admin',
      Token: 'token123',
      DisplayName: 'Test User',
      ID: 1
    }
    
    store.setUserInfo(userInfo)
    expect(store.userInfo).toEqual(userInfo)
  })

  it('should update user info partially', () => {
    const store = useUserStore()
    const initialInfo = {
      UserName: 'testuser',
      Role: 'admin',
      Token: 'token123',
      DisplayName: 'Test User',
      ID: 1
    }
    
    store.setUserInfo(initialInfo)
    store.updateUserInfo({ DisplayName: 'Updated Name' })
    
    expect(store.userInfo.DisplayName).toBe('Updated Name')
    expect(store.userInfo.UserName).toBe('testuser')
    expect(store.userInfo.Role).toBe('admin')
  })

  it('should logout and clear user data', () => {
    const store = useUserStore()
    store.setToken('test-token')
    store.setUserInfo({
      UserName: 'testuser',
      Role: 'admin',
      Token: 'token123',
      DisplayName: 'Test User',
      ID: 1
    })
    
    store.logout()
    
    expect(store.token).toBe('')
    expect(store.userInfo).toEqual({
      UserName: '',
      Role: '',
      Token: '',
      DisplayName: '',
      ID: 0
    })
  })

  it('should stop login check timer', () => {
    const store = useUserStore()
    store.stopLoginCheck()
    expect(store.loginCheckTimer).toBeNull()
  })
})
