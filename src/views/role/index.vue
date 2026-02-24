<template>

  <el-card class="perm-card">

    <template #header>
      <div class="perm-header">
        <div class="perm-title">
          角色列表
        </div>
        <div class="perm-actions">
          <!-- <el-button type="primary" plain @click="handleAddRole">新建角色</el-button> -->
        </div>
      </div>

    </template>
    <el-table :data="tableData" style="width: 100%;" border
      :header-cell-style="{ background: '#ece9e2', color: '#333', fontWeight: 'bold', textAlign: 'center' }"
      :cell-style="{ textAlign: 'center', padding: '8px 0' }">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="RoleName" label="角色名称" width="150" />
      <el-table-column prop="RoleNotes" label="备注" min-width="260" />
      <el-table-column prop="ChangeFlag" label="是否启用" width="150">
        <template #default="scope">
          <el-switch v-model="scope.row.ChangeFlag" class="ml-2" inline-prompt
            active-value="0" inactive-value="1"
            :before-change="()=>handleChange(scope.row)"
            :loading="onSaleLoading"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" active-text="启用" inactive-text="禁用" />
        </template>
      </el-table-column>
      <el-table-column label="操作" >
        <template #default="scope">
          <el-button type="danger" plain size="small" link @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination background layout="prev, pager, next" :total="total" :page-size="searchForm.pageSize" style="margin-top: 20px;" />
    </div>
  </el-card>
  </template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'
const router = useRouter()
const userStore = useUserStore();
import { getRoleListPageApi,enableOrDisableRoleApi,deleteRoleApi } from '@/api/module/role'

const searchForm = ref({
  keyword: '',
  pageNum: 1,
  pageSize: 10
})

const handleAddRole = () => {
  router.push({ path: '/roleDetail' })
}

/**
 *
 * @name 启用禁用角色
 * */
const onSaleLoading = ref(false);
const handleChange = async (row) => {
  return new Promise( async (resolve, reject) => {
    onSaleLoading.value = true;
    try {
      const { ResultFlag,ResultSet } = await enableOrDisableRoleApi({ IDs: [row.ID], IsUse: row.ChangeFlag === '0'? '1' : '0', UpdateUser:userStore.userInfo.UserName })  
      if(ResultFlag == 0){
        ElMessage.success('状态更新成功')
        resolve(true);
        getRole()
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


/**
 *
 * @name 删除角色
 * */
const handleDelete = async (row) => {
  ElMessageBox.confirm('确定删除该角色吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const {ID} = row
    const {ResultFlag} = await deleteRoleApi({ID: ID})
    if (ResultFlag === '0') {
      ElMessage.success('操作成功')
      getRole()
    } else {
      ElMessage.error('操作失败')
    }
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消删除'
    });
  });
}



const tableData = ref([])
const total = ref(0)

const getRole = async () => {
  const {ResultSet,ResultTotal,ResultFlag} = await getRoleListPageApi(searchForm.value)
  console.log('角色列表', ResultSet)
  if (ResultFlag === '0') {
    tableData.value = JSON.parse(ResultSet) || []
    total.value = ResultTotal || 0
  }
}

onMounted(() => {
  getRole()
})


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