import http from '@/api'

/**
 * 获取数据字典列表
 */
export const getDictionaryListApi = () => {
  return http.get('/api/v1/Dictionary/GetList')
}

/**
 * 上传Excel数据
 */
export const importDictionaryExcelApi = (data: FormData) => {
  return http.post('/api/v1/Dictionary/ImportExcel', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 导出字典数据到Excel
 */
export const exportDictionaryExcelApi = (params: { typeId: number }) => {
  return http.get('/api/v1/Dictionary/ExportExcel', params, {
    responseType: 'arraybuffer'
  })
}


