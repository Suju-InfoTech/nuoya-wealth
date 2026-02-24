/**
 * @description 通用文件下载方法，根据文件路径拼接环境地址并下载
 * @param {string} filePath 形如"Filetemplate/1/来店登记历史数据导入.xlsx"的文件路径
 */
export function downloadFile(filePath: string) {
  if (!filePath) return;
  // 获取文件名
  const fileName = filePath.substring(filePath.lastIndexOf("/") + 1);
  // 拼接完整下载地址
  const baseUrl = import.meta.env.VITE_API_URL;
  // baseUrl始终没有/结尾，只判断filePath
  const url = filePath.startsWith("/") ? baseUrl + filePath : baseUrl + "/" + filePath;

  // 创建a标签下载
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/* 导出文件流 */
export const exportFile = (res, type, filename) => {
  const blob = new Blob([res], {
    type: type
  });
  const a = document.createElement("a");
  const URL = window.URL || window.webkitURL;
  const herf = URL.createObjectURL(blob);
  a.href = herf;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(herf);
};


export const getFileType =(extension) =>{
  const mimeTypes = {
    // 图片
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    webp: 'image/webp',

    // 文档
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',

    // 文本
    txt: 'text/plain',
    csv: 'text/csv',
    json: 'application/json',
    xml: 'application/xml',

    // 音频
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',

    // 视频
    mp4: 'video/mp4',
    avi: 'video/x-msvideo',
    mov: 'video/quicktime',

    // 压缩包
    zip: 'application/zip',
    rar: 'application/vnd.rar',
    '7z': 'application/x-7z-compressed',

    // 默认
    default: 'application/octet-stream'
  };

  const ext = extension.toLowerCase().replace('.', '');
  return mimeTypes[ext] || mimeTypes.default;
}


export const getFileTypeFromFilename =(filename)=> {
  const ext = filename.split('.').pop().toLowerCase();
  return getFileType(ext);
}