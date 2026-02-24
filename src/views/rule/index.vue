<template>
  <el-card class="rule-card">
    <template #header>
      <div class="rule-header">
        <div class="rule-title">
          规则列表
        </div>
        <div class="rule-actions">
          <!-- <el-button type="primary" plain @click="handleAddRule">新建规则</el-button> -->
        </div>
      </div>

    </template>
    <el-table :data="tableData" style="width: 100%;" border
      :header-cell-style="{ background: '#ece9e2', color: '#333', fontWeight: 'bold', textAlign: 'center' }"
      :cell-style="{ textAlign: 'center', padding: '8px 0' }">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="Email" label="公司邮箱" min-width="220">
        <template #default="scope">
          <span v-if="scope.row.Email != 'button'">{{ scope.row.Email }}</span>
          <span v-else>
            <el-button type="primary" plain size="small" @click="handleAddEmail">添加邮箱</el-button>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="graphKey" label="Graph Key" width="120">
        <template #default="scope">
          <el-button v-if="scope.row.Email != 'button'" type="primary" plain size="small"
            @click="handleAddGraphKey(scope.row)">修改</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="rule" label="规则" width="120">
        <template #default="scope">
          <el-button v-if="scope.row.Email != 'button'" type="primary" plain size="small"
            @click="handleAddRule(scope.row)">规则</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="ChangeFlag" label="是否启用" width="150">
        <template #default="scope">
          <el-switch v-if="scope.row.Email != 'button'" v-model="scope.row.ChangeFlag" class="ml-2" inline-prompt
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" active-text="启用" inactive-text="禁用"
            :before-change="() => handleChange(scope.row)" :loading="onSaleLoading" active-value="0" inactive-value="1" />
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="260">
        <template #default="scope">
          <el-button v-if="scope.row.Email != 'button'" type="danger" plain size="small"
            @click="handleDeleteEmail(scope.row)">删除邮箱</el-button>
        </template>

      </el-table-column>
    </el-table>



    <!-- 添加邮箱弹窗 -->
    <el-dialog v-model="addDialogVisible" title="添加邮箱" width="660px" :close-on-click-modal="false">
      <el-form :rules="EmailRules" ref="addFormRef" label-width="100px" :model="addUserEmail" label-position="left"
        require-asterisk-position="right">
        <el-form-item label="邮箱地址" prop="Email">
          <el-input v-model="addUserEmail.Email" placeholder="请输入邮箱" disabled></el-input>
        </el-form-item>
        <el-form-item label="Tenant ID" prop="TenantID">
          <el-input v-model="addUserEmail.TenantID" placeholder="请输入Tenant ID"></el-input>
        </el-form-item>
        <el-form-item label="Key" prop="GraphKey">
          <el-input v-model="addUserEmail.GraphKey" placeholder="请输入Key"></el-input>
        </el-form-item>
        <el-form-item label="Secret" prop="GraphSecret">
          <el-input v-model="addUserEmail.GraphSecret" type="password" show-password placeholder="请输入Secret"></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <div style="display: flex; justify-content: center;">
          <el-button type="primary" @click="handleConfirmAddEmail">保存</el-button>
          <el-button type="primary" @click="handleCheckGraphKey">验证</el-button>
          <el-button @click="addDialogVisible = false">返回</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="addRuleUser" title="添加邮箱" width="660px" :close-on-click-modal="false">
      <el-form :rules="ruleUserRules" ref="addRuleUserRef" label-width="100px" :model="ruleUser" label-position="left"
        require-asterisk-position="right">
        <el-form-item label="邮箱地址" prop="Email">
          <el-input v-model="ruleUser.Email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <el-button type="primary" @click="handleConfirmAddRuleUser">保存</el-button>
          <el-button @click="addRuleUser = false">返回</el-button>
        </div>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'
import type { FormInstance, FormRules } from 'element-plus'
const router = useRouter()
import { getGraphEmailListApi, deleteEmailApi, graphEmailManApi, graphKeyManApi, checkGraphKeyApi, enableDisenableEmailApi } from '@/api/module/rule'
import { ElMessage, ElMessageBox } from 'element-plus'
const userStore = useUserStore();
const addDialogVisible = ref(false)
const addRuleUser = ref(false)
const addRuleUserRef = ref()
const addFormRef = ref()
interface RuleUser {
  Email: string,
  ID: number,
  UpdateUser: string
}
const ruleUser = ref<RuleUser>({
  Email: '',
  ID: 0,
  UpdateUser: userStore.userInfo.UserName
})

const ruleUserRules = ref<FormRules>({
  Email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
})
/**
 * @name 确认添加邮箱
 * */
const handleConfirmAddRuleUser = async () => {
  const valid = await addRuleUserRef.value.validate()
  if (!valid) {
    return
  }
  const { ResultFlag, ResultSet } = await graphEmailManApi(ruleUser.value)
  if (ResultFlag === '0') {
    ElMessage.success(ResultSet || '添加成功')
    addRuleUser.value = false
    getGraphEmailList()
  } else {
    ElMessage.error(ResultSet || '添加失败')
  }
}

const addUserEmail = ref({
  Email: '',
  EmailId: 0,
  TenantID: '',
  GraphKey: '',
  GraphSecret: '',
  UpdateUser: userStore.userInfo.UserName,
})

const EmailRules = ref<FormRules>(
  {
  Email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  TenantID: [
    { required: true, message: '请输入Tenant ID', trigger: 'blur' }
  ],
  GraphKey: [
    { required: true, message: '请输入Key', trigger: 'blur' }
  ],
  GraphSecret: [
    { required: true, message: '请输入Secret', trigger: 'blur' }
  ]
})

/**
 * @name 给Graph邮箱添加GraphKey
 * */

const handleConfirmAddEmail = async () => {
  const valid = await addFormRef.value.validate()
  if (!valid) {
    return
  }
  const { ResultFlag, ResultSet } = await graphKeyManApi(addUserEmail.value)
  if (ResultFlag === '0') {
    ElMessage.success(ResultSet || '保存成功')
    addDialogVisible.value = false
    getGraphEmailList()
  } else {
    ElMessage.error(ResultSet || '保存失败')
  }
}
/**
 * @name 验证 GraphKey
 * */
const handleCheckGraphKey = async () => {
  const valid = await addFormRef.value.validate()
  if (!valid) {
    return
  }
  const { ResultFlag, ResultSet } = await checkGraphKeyApi(addUserEmail.value)
  if (ResultFlag === '0') {
    ElMessage.success('验证成功')
  } else {
    ElMessage.error(ResultSet || '验证失败')
  }
}

/**
 * @name 启用/禁用邮箱
 * */
const onSaleLoading = ref(false)

const handleChange = (row: any): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    onSaleLoading.value = true
    try {
      const { ResultFlag, ResultSet } = await enableDisenableEmailApi({ IsUse: row.ChangeFlag == '0' ? '1' : '0', IDs: [row.ID], UpdateUser: userStore.userInfo.UserName })
      if (ResultFlag === '0') {
        ElMessage.success( '操作成功')
        getGraphEmailList()
        resolve(true);
      } else {
        ElMessage.error(ResultSet || '操作失败')
        reject(false);
      }
    } catch (error) {
      reject(false);
    } finally {
      onSaleLoading.value = false;
    }
  })
}




/**
 * @name 删除邮箱
 * */
const handleDeleteEmail = async (row) => {
  ElMessageBox.confirm('确定删除邮箱 ' + row.Email + ' 吗？', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const { ResultFlag, ResultSet } = await deleteEmailApi({ EmailID: row.ID, User: userStore.userInfo.UserName })
    if (ResultFlag === '0') {
      ElMessage.success('删除成功')
      getGraphEmailList()
    } else {
      ElMessage.error(ResultSet || '删除失败')
    }
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消删除'
    });
  });
}

const total = ref(0)
const tableData = ref([] as any[])
const commonUserEmail = ref({
  Email: 'button',
  graphKey: '',
  rule: '',
  ID: 0
})

const handleAddGraphKey = (row) => {
  addDialogVisible.value = true
  addUserEmail.value = {
    Email: row.Email,
    EmailId: row.ID,
    TenantID: row.TenantID,
    GraphKey: row.GraphKey,
    GraphSecret: row.GraphSecret,
    UpdateUser: userStore.userInfo.UserName,
  }
}

const handleAddEmail = () => {
  addRuleUser.value = true
}

const handleAddRule = (row) => {
  router.push({ name: 'ruleDetail', query: { id: row.ID, email: row.Email } })
}

const getGraphEmailList = async () => {
  const { ResultSet, ResultTotal, ResultFlag } = await getGraphEmailListApi()
  console.log('邮箱清单', ResultSet)
  if (ResultFlag === '0') {
    tableData.value = [...JSON.parse(ResultSet), commonUserEmail.value] 
    total.value = ResultTotal || 0
  } else {
    ElMessage.error(ResultSet || '获取邮箱列表失败')
  }
}

onMounted(() => {
  getGraphEmailList()
})


</script>

<style scoped lang="scss">
.rule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .el-button {
    min-width: 102px;
  }
}

.rule-card {
  background: #fff;
}

.rule-title {
  font-size: 18px;
  font-weight: bold;
}

.rule-actions {
  display: flex;
  gap: 10px;
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