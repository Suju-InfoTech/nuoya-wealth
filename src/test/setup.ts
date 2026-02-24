// Vitest setup file for Vue component tests
import { vi } from 'vitest'

// Mock Element Plus completely to avoid CSS loading
vi.mock('element-plus', () => ({
  ElMessage: { 
    success: vi.fn(), 
    error: vi.fn(), 
    warning: vi.fn(), 
    info: vi.fn() 
  },
  ElButton: {
    name: 'ElButton',
    template: '<button @click="$attrs.onClick"><slot /></button>'
  },
  ElForm: {
    name: 'ElForm',
    template: '<form><slot /></form>'
  },
  ElFormItem: {
    name: 'ElFormItem',
    template: '<div><slot /></div>'
  },
  ElInput: {
    name: 'ElInput',
    template: '<input />'
  },
  ElCheckbox: {
    name: 'ElCheckbox',
    template: '<input type="checkbox" />'
  }
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock image imports
vi.mock('*.png', () => ({ default: 'test-image.png' }))
vi.mock('*.jpg', () => ({ default: 'test-image.jpg' }))
vi.mock('*.svg', () => ({ default: 'test-image.svg' }))

// Mock CSS imports
vi.mock('*.css', () => ({}))
vi.mock('*.scss', () => ({}))
vi.mock('*.sass', () => ({}))
