<template>
  <div class="code-list-page">
    <el-card>
      <div class="code-header">
        <span class="code-title">111111111111111111</span>
        <div>
          <el-button type="primary" >添加</el-button>
          <el-button >导入</el-button>
        </div>
      </div>
      <el-table :data="tableData" style="width: 100%; margin-top: 12px;" border>
        <el-table-column prop="code" label="CODE" width="120" />
        <el-table-column prop="name" label="名称" min-width="180" />
        <el-table-column prop="updateTime" label="修改时间" width="160" />
        <el-table-column label="操作" width="260">
          <template #default="scope">
            <el-button-group>
              <el-button type="default" plain size="small">启用</el-button>
              <el-button type="default" plain size="small" disabled>禁用</el-button>
            </el-button-group>
            <el-button type="danger" plain size="small" style="margin-left:8px;">删除</el-button>
            <el-button type="primary" plain size="small" style="margin-left:8px;">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tableData = ref([
  { code: '内容', name: '内容', updateTime: '2025/04/12 12:39' },
  { code: '内容', name: '内容', updateTime: '2025/04/12 12:39' },
  { code: '内容', name: '内容', updateTime: '2025/04/12 12:39' },
  { code: '内容', name: '内容', updateTime: '2025/04/12 12:39' }
])
</script>

<style scoped lang="scss">

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  .el-button {
    min-width: 102px;
  }
}
.code-title {
  font-size: 16px;
  font-weight: bold;
}
</style>