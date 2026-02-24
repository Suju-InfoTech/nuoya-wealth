import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Captcha from './index.vue'

describe('Captcha Component', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(Captcha, {
      props: {
        length: 4,
        width: 100,
        height: 38
      }
    })
  })

  it('should render canvas element', () => {
    const canvas = wrapper.find('canvas')
    expect(canvas.exists()).toBe(true)
  })

  it('should have correct canvas dimensions', () => {
    const canvas = wrapper.find('canvas')
    expect(canvas.attributes('width')).toBe('100')
    expect(canvas.attributes('height')).toBe('38')
  })

  it('should accept custom width and height props', () => {
    const customWrapper = mount(Captcha, {
      props: {
        width: 150,
        height: 50
      }
    })

    const canvas = customWrapper.find('canvas')
    expect(canvas.attributes('width')).toBe('150')
    expect(canvas.attributes('height')).toBe('50')
  })

  it('should accept custom length prop', () => {
    const customWrapper = mount(Captcha, {
      props: {
        length: 6
      }
    })

    expect(customWrapper.props('length')).toBe(6)
  })

  it('should have default props', () => {
    const defaultWrapper = mount(Captcha)
    
    expect(defaultWrapper.props('length')).toBe(4)
    expect(defaultWrapper.props('width')).toBe(100)
    expect(defaultWrapper.props('height')).toBe(38)
  })

  it('should have captcha container with click handler', () => {
    const container = wrapper.find('.captcha')
    expect(container.exists()).toBe(true)
    expect(container.attributes('title')).toBe('点击更换')
  })

  it('should trigger refresh on click', async () => {
    const container = wrapper.find('.captcha')
    await container.trigger('click')
    
    // Verify canvas still exists after click
    expect(wrapper.find('canvas').exists()).toBe(true)
  })

  it('should have canvas reference', () => {
    const canvas = wrapper.find('canvas')
    expect(canvas.element).toBeInstanceOf(HTMLCanvasElement)
  })

  it('should render with correct structure', () => {
    expect(wrapper.find('.captcha').exists()).toBe(true)
    expect(wrapper.find('canvas').exists()).toBe(true)
  })
})
