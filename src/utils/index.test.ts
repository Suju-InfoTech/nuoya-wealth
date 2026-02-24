import { describe, it, expect } from 'vitest'
import { 
  getFlatMenuList, 
  getShowMenuList, 
  formatDate, 
  formatTime,
  validateNoEmpty,
  getDefaultDateRange,
  arrayBufferToString
} from './index'

describe('Utils Functions', () => {
  describe('getFlatMenuList', () => {
    it('should flatten menu list correctly', () => {
      const menuList = [
        {
          path: '/home',
          name: 'home',
          children: [
            { path: '/home/sub1', name: 'sub1' },
            { path: '/home/sub2', name: 'sub2' }
          ]
        }
      ] as Menu.MenuOptions[]

      const result = getFlatMenuList(menuList)
      expect(result).toHaveLength(3)
      expect(result[0].path).toBe('/home')
      expect(result[1].path).toBe('/home/sub1')
    })

    it('should handle empty menu list', () => {
      const result = getFlatMenuList([])
      expect(result).toHaveLength(0)
    })
  })

  describe('getShowMenuList', () => {
    it('should filter out hidden menus', () => {
      const menuList = [
        { path: '/visible', name: 'visible', meta: { isHide: false } },
        { path: '/hidden', name: 'hidden', meta: { isHide: true } }
      ] as Menu.MenuOptions[]

      const result = getShowMenuList(menuList)
      expect(result).toHaveLength(1)
      expect(result[0].path).toBe('/visible')
    })
  })

  describe('formatDate', () => {
    it('should format date string correctly', () => {
      const date = '2024-01-15T10:30:00'
      const result = formatDate(date)
      expect(result).toBe('2024-01-15')
    })

    it('should return empty string for invalid date', () => {
      expect(formatDate('')).toBe('')
    })
  })

  describe('formatTime', () => {
    it('should format time string correctly', () => {
      const date = '2024-01-15T10:30:45'
      const result = formatTime(date)
      expect(result).toBe('10:30:45')
    })

    it('should return empty string for empty input', () => {
      expect(formatTime('')).toBe('')
    })
  })

  describe('validateNoEmpty', () => {
    it('should validate form with all fields filled', () => {
      const form = {
        condModels: [
          { field: 'name', value: 'test' }
        ],
        operModels: [
          { OperationName: 1, field: 'action' }
        ]
      }
      const result = validateNoEmpty(form)
      expect(result.valid).toBe(true)
    })

    it('should detect empty fields in condModels', () => {
      const form = {
        condModels: [
          { field: '', value: 'test' }
        ],
        operModels: []
      }
      const result = validateNoEmpty(form)
      expect(result.valid).toBe(false)
      expect(result.key).toBe('规则条件')
    })

    it('should skip validation when OperationName is 0', () => {
      const form = {
        condModels: [],
        operModels: [
          { OperationName: 0, field: '' }
        ]
      }
      const result = validateNoEmpty(form)
      expect(result.valid).toBe(true)
    })
  })

  describe('getDefaultDateRange', () => {
    it('should return date range array', () => {
      const result = getDefaultDateRange()
      expect(result).toHaveLength(2)
      expect(result[0]).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
      expect(result[1]).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
    })
  })

  describe('arrayBufferToString', () => {
    it('should return true for non-JSON buffer', () => {
      const buffer = new TextEncoder().encode('plain text')
      const result = arrayBufferToString(buffer.buffer)
      expect(result).toBe(true)
    })

    it('should handle success JSON', () => {
      const buffer = new TextEncoder().encode('{"success": true}')
      const result = arrayBufferToString(buffer.buffer)
      expect(result).toBe(true)
    })
  })
})
