import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { downloadFile, exportFile, getFileType, getFileTypeFromFilename } from './downloadFile'

describe('Download File Utils', () => {
  describe('getFileType', () => {
    it('should return correct MIME type for common extensions', () => {
      expect(getFileType('jpg')).toBe('image/jpeg')
      expect(getFileType('png')).toBe('image/png')
      expect(getFileType('pdf')).toBe('application/pdf')
      expect(getFileType('xlsx')).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      expect(getFileType('mp3')).toBe('audio/mpeg')
      expect(getFileType('mp4')).toBe('video/mp4')
      expect(getFileType('zip')).toBe('application/zip')
    })

    it('should handle extensions with dot', () => {
      expect(getFileType('.jpg')).toBe('image/jpeg')
      expect(getFileType('.PDF')).toBe('application/pdf')
    })

    it('should return default type for unknown extension', () => {
      expect(getFileType('unknown')).toBe('application/octet-stream')
    })

    it('should be case insensitive', () => {
      expect(getFileType('JPG')).toBe('image/jpeg')
      expect(getFileType('PDF')).toBe('application/pdf')
    })
  })

  describe('getFileTypeFromFilename', () => {
    it('should extract and return correct MIME type from filename', () => {
      expect(getFileTypeFromFilename('document.pdf')).toBe('application/pdf')
      expect(getFileTypeFromFilename('image.png')).toBe('image/png')
      expect(getFileTypeFromFilename('data.xlsx')).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    })

    it('should handle filenames with multiple dots', () => {
      expect(getFileTypeFromFilename('my.file.name.pdf')).toBe('application/pdf')
    })

    it('should handle uppercase extensions', () => {
      expect(getFileTypeFromFilename('FILE.PDF')).toBe('application/pdf')
    })
  })

  describe('downloadFile', () => {
    let createElementSpy: any
    let appendChildSpy: any
    let removeChildSpy: any
    let clickSpy: any

    beforeEach(() => {
      // Mock document.createElement
      clickSpy = vi.fn()
      const mockLink = {
        href: '',
        download: '',
        style: { display: '' },
        click: clickSpy
      }
      createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any)
      appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as any)
      removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as any)
      
      // Mock import.meta.env
      vi.stubGlobal('import.meta', { env: { VITE_API_URL: 'http://example.com' } })
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should create and trigger download link', () => {
      downloadFile('path/to/file.pdf')
      
      expect(createElementSpy).toHaveBeenCalledWith('a')
      expect(appendChildSpy).toHaveBeenCalled()
      expect(clickSpy).toHaveBeenCalled()
      expect(removeChildSpy).toHaveBeenCalled()
    })

    it('should do nothing if filePath is empty', () => {
      downloadFile('')
      expect(createElementSpy).not.toHaveBeenCalled()
    })
  })

  describe('exportFile', () => {
    let createElementSpy: any
    let appendChildSpy: any
    let removeChildSpy: any
    let clickSpy: any
    let createObjectURLSpy: any
    let revokeObjectURLSpy: any

    beforeEach(() => {
      clickSpy = vi.fn()
      const mockLink = {
        href: '',
        download: '',
        click: clickSpy
      }
      createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any)
      appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as any)
      removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as any)
      
      createObjectURLSpy = vi.fn(() => 'blob:url')
      revokeObjectURLSpy = vi.fn()
      global.URL.createObjectURL = createObjectURLSpy
      global.URL.revokeObjectURL = revokeObjectURLSpy
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should export file with correct parameters', () => {
      const data = 'test data'
      const type = 'text/plain'
      const filename = 'test.txt'
      
      exportFile(data, type, filename)
      
      expect(createElementSpy).toHaveBeenCalledWith('a')
      expect(createObjectURLSpy).toHaveBeenCalled()
      expect(clickSpy).toHaveBeenCalled()
      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:url')
    })
  })
})
