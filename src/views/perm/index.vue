<template>

  <el-card class="perm-card">

    <template #header>
      <div class="perm-header">
        <div class="perm-title">
          人员列表
        </div>
        <div class="perm-actions">
          <el-button type="primary" plain @click="handleEditRole">新建</el-button>
          <el-button type="primary" plain @click="handleAddRole" v-if="authStore.isShowRoleList">角色列表</el-button>
        </div>
      </div>

    </template>
    <el-table :data="userList.data" style="width: 100%;" border
      :header-cell-style="{ background: '#ece9e2', color: '#333', fontWeight: 'bold', textAlign: 'center' }"
      :cell-style="{ textAlign: 'center', padding: '8px 0' }">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="UserName" label="账号名" />
      <el-table-column prop="DisplayName" label="员工姓名" width="150" />
      <el-table-column prop="DefaultEmail" label="邮箱" min-width="220">
        <template #default="scope">
          <span>{{ scope.row.DefaultEmail }}</span>
          <el-link  icon="el-icon-edit" size="small"></el-link>
        </template>
      </el-table-column>
      <el-table-column prop="RoleName" label="角色" width="150" />
      <el-table-column prop="ChangeFlag" label="是否启用" width="150">
        <template #default="scope">
          <el-switch v-model="scope.row.ChangeFlag" class="ml-2" inline-prompt
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" active-text="启用" inactive-text="禁用"
            :before-change="()=>handleChange(scope.row)"
            active-value="0"
            inactive-value="1"
            :loading="onSaleLoading"
            />
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="260">
        <template #default="scope">
          <el-button   size="small" @click="handleEditRole(scope.row)">编辑</el-button>
          <el-button type="danger"  size="small" @click="handleDelete(scope.row)" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination background layout="prev, pager, next" :total="userList.total" :page-size="userParam.pageSize"
        style="margin-top: 20px;" @current-change="handlePageChange"  />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
import {useUserStore} from '@/stores/modules/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/modules/auth'
const authStore = useAuthStore();

import { getUserListApi, deleteUserApi, getUserDetailApi, enableOrDisableUserApi } from '@/api/module/perm'
const userStore = useUserStore();
const userList = reactive({
  data: [],
  total: 0,
})

const userParam = reactive({
  pageSize: 10,
  pageNum: 1,
  keyword: ''
})

const handlePageChange = (pageNum: number) => {
  userParam.pageNum = pageNum
  getPerm()
}



const getPerm = async () => {
  const { ResultTotal, ResultSet } = await getUserListApi(userParam)
  
  userList.data = JSON.parse(ResultSet) || []
  console.log(userList.data)
  userList.total = ResultTotal || 0
}

const handleDelete = async (row) => {
  ElMessageBox.confirm('确定删除用户 ' + row.UserName + ' 吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    const { ResultSet } = await deleteUserApi({ ID: row.ID })
    if(ResultSet){
      ElMessage.success('删除成功')
      getPerm()
    }else{
      ElMessage.error('删除失败')
    }
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消删除',
    });
  });
}

onMounted(() => {
  getPerm()
})


const handleAddRole = () => {
  router.push({ path: '/role' })
}

const handleEditRole = (row) => {
  router.push({ path: '/permDetail', query: { ID: row.ID } })
}

/* 单独-启用禁用 */
const onSaleLoading = ref(false);
const handleChange = (row:any):Promise<boolean> => {
  return new Promise( async (resolve, reject) => {
    onSaleLoading.value = true;
    try {
      const { ResultFlag,ResultSet } = await enableOrDisableUserApi({ IDs: [row.ID], IsUse: row.ChangeFlag === '0'? '1' : '0', UpdateUser:userStore.userInfo.UserName })  
      if(ResultFlag == 0){
        ElMessage.success('状态更新成功')
        resolve(true);
        getPerm()
      }else{
        ElMessage.error('状态更新失败')
        resolve(false);
      }
    } catch (error) {
      ElMessage.error('状态更新失败')
      resolve(false);
    } finally {
      onSaleLoading.value = false;
    }
  })
}

</script>

<style scoped>
.perm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.perm-card {
  background: #fff;
}

.perm-title {
  font-size: 18px;
  font-weight: bold;
}

.perm-actions {
  display: flex;
  gap: 10px;
}

.pagination {
  display: flex;
  justify-content: center;
}

.add-row {
  margin-top: 12px;
  display: flex;
  justify-content: flex-start;
}

.el-table .el-button {
  margin-right: 8px;
}

.el-table .el-button:last-child {
  margin-right: 0;
}
</style>