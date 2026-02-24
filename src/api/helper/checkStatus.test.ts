import { describe, it, expect, vi } from 'vitest'
import { checkStatus } from './checkStatus'
import { ElMessage } from 'element-plus'

// Mock ElMessage
vi.mock('element-plus', () => ({
  ElMessage: {
    error: vi.fn()
  }
}))

describe('checkStatus', () => {
  it('should show correct message for 400 status', () => {
    checkStatus(400)
    expect(ElMessage.error).toHaveBeenCalledWith('请求失败！请您稍后重试')
  })

  it('should show correct message for 401 status', () => {
    checkStatus(401)
    expect(ElMessage.error).toHaveBeenCalledWith('登录失效！请您重新登录')
  })

  it('should show correct message for 403 status', () => {
    checkStatus(403)
    expect(ElMessage.error).toHaveBeenCalledWith('当前账号无权限访问！')
  })

  it('should show correct message for 404 status', () => {
    checkStatus(404)
    expect(ElMessage.error).toHaveBeenCalledWith('你所访问的资源不存在！')
  })

  it('should show correct message for 500 status', () => {
    checkStatus(500)
    expect(ElMessage.error).toHaveBeenCalledWith('服务异常！')
  })

  it('should show default message for unknown status', () => {
    checkStatus(999)
    expect(ElMessage.error).toHaveBeenCalledWith('请求失败！')
  })
})
