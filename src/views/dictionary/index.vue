<template>
  <div class="list-page">
    <el-card>
      <template #header>
        <div class="list-header">
          <div class="list-title">字典列表</div>
          <div class="list-actions">
            <!-- <el-button type="primary" plain @click="handleAdd">新建字典</el-button> -->
          </div>

        </div>
      </template>
      <el-table :data="tableData" style="width: 100%; " border
        :header-cell-style="{ background: '#ece9e2', color: '#333', fontWeight: 'bold', textAlign: 'center' }"
        :cell-style="{ textAlign: 'center', padding: '8px 0' }">
        <el-table-column prop="TypeName" label="名称" min-width="180">

        </el-table-column>
        <el-table-column prop="UpdateUser" label="更新人" min-width="180" />
        <el-table-column prop="UpdateTime" label="更新时间" min-width="180" />
        <el-table-column label="操作" min-width="180">
          <template #default="scope">
            <el-button type="primary" plain size="small" @click="handleImport(scope.row)">导入</el-button>
            <el-button type="primary" plain size="small" @click="handleExport(scope.row)">导出</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>


    <el-dialog title="导入字典" v-model="dialogVisible" width="30%">
      <el-upload class="upload-demo" ref="uploadRef" drag :auto-upload="false" accept=".xlsx,.xls,.csv" :on-change="handleFileChange" :limit="1">
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          Drop file here or <em>click to upload</em>
        </div>
      </el-upload>
      <template #footer>
        <div class="dialog-footer" style="text-align: center;">
          <el-button type="primary" plain  @click="handleUpload">上传</el-button>
          <el-button  plain  @click="handleCancel">取消</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { exportFile } from '@/utils/downloadFile'
import { getDictionaryListApi, importDictionaryExcelApi, exportDictionaryExcelApi } from '@/api/module/dictionary'

const router = useRouter()
const userStore = useUserStore()
const uploadRef = ref()
const tableData = ref([])
const total = ref()

const handleAdd = () => {
  router.push({ name: 'dictionaryAdd' })
}

const dialogVisible = ref(false)

const handleImport = (row) => {
  formData.value.set('typeId', row.ID)
  formData.value.set('User', userStore.userInfo.UserName)
  dialogVisible.value = true
}

const getDictionaryList = async () => {
  const { ResultSet, ResultTotal, ResultFlag } = await getDictionaryListApi()
  console.log('字典列表', ResultSet)
  if (ResultFlag === '0') {
    tableData.value = JSON.parse(ResultSet) || []
    total.value = ResultTotal || 0
  } else {
    ElMessage.error(ResultSet || '获取字典列表失败')
  }
}

const handleExport = async (row) => {
  console.log('导出字典')
  const res = await exportDictionaryExcelApi({ typeId: row.ID })
  
  exportFile(res, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", `字典清单_${row.TypeName}_${new Date().getTime()}.xlsx`);
}

const handleUpload = async () => {
  console.log('上传字典')
  const { success, ResultMessage,ResultSet } = await importDictionaryExcelApi(formData.value)
  if (success) {
    ElMessage.success(ResultMessage || '导入字典成功')
    uploadRef.value.clearFiles()
    dialogVisible.value = false
    getDictionaryList()
  } else {
    ElMessage.error(ResultSet || '导入字典失败')
  }
}

const handleCancel = () => {
  uploadRef.value.clearFiles()
  dialogVisible.value = false
}
const formData = ref(new FormData())

const handleFileChange = (file) => {
  formData.value.append('file', file.raw)

}

onMounted(() => {
  getDictionaryList()
})

</script>

<style scoped lang="scss">
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-title {
  font-size: 18px;
  font-weight: bold;
}

.list-actions {
  display: flex;
  gap: 10px;
}
</style>