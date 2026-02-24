<template>
    <el-card class="perm-card">
        <template #header>
            <div class="perm-header">
                <div class="perm-title">
                    编辑权限
                </div>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
                    <el-form-item label="账户名" prop="UserName">
                        <el-input v-model="form.UserName" placeholder="请输入用户名"></el-input>
                    </el-form-item>
                    <el-form-item label="员工姓名" prop="DisplayName">
                        <el-input v-model="form.DisplayName" placeholder="请输入员工姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="DefaultEmail">
                        <el-input v-model="form.DefaultEmail" placeholder="请输入邮箱"></el-input>
                    </el-form-item>
                    <el-form-item label="角色" prop="roles">
                        <el-select v-model="form.roles" placeholder="请选择角色" multiple>
                            <el-option v-for="item in roleList" :key="item.ID" :label="item.RoleName"
                                :value="String(item.ID)"></el-option>

                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态" prop="isEnabled">
                        <el-radio-group v-model="form.ChangeFlag">
                            <el-radio label="0">启用</el-radio>
                            <el-radio label="1">禁用</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleSubmit">保存</el-button>
                        <el-button type="primary" @click="handleCancel">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>

    </el-card>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from "@/stores/modules/user";

const userStore = useUserStore();
import { getRoleListApi } from '@/api/module/role'
import { addOrUpdateUserApi, getUserDetailApi } from '@/api/module/perm'

const router = useRouter()
const form = ref({
    UserName: '',
    DisplayName: '',
    roles: [],
    ChangeFlag: "0",
    ID: 0,
    DefaultEmail: '',
    UpdateUser: userStore.userInfo.UserName
})

const roleList = ref([])
const roleParams = ref('')
const formRef = ref()

const getRoleList = async () => {
    let { ResultSet } = await getRoleListApi({ keyword: '' })
    roleList.value = JSON.parse(ResultSet) || []
}

const rules = ref({
    UserName: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
    roles: [{ required: true, message: '请选择角色', trigger: 'change' }],
    DefaultEmail: [{ type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }],
})

const handleSubmit = async () => {
    let valid = await formRef.value.validate()
    if (!valid) return
    form.value.DisplayName = form.value.DisplayName || form.value.UserName
    let { ResultSet } = await addOrUpdateUserApi(form.value)
    if (ResultSet) {
        ElMessage.success('保存成功')
        router.push({ path: '/perm' })
    } else {
        ElMessage.error('保存失败')
    }
}

const handleCancel = () => {
    router.push({ path: '/perm' })
}

const getPermDetail = async () => {
    let { ResultSet } = await getUserDetailApi({ ID: router.currentRoute.value.query.ID })
    let userDetail = JSON.parse(ResultSet) || {}
    form.value = {
        UserName: userDetail.UserName || '',
        DisplayName: userDetail.DisplayName || '',
        roles: userDetail.RoleIDs?.split(',') || [],
        ChangeFlag: userDetail.ChangeFlag || "0",
        ID: userDetail.ID || 0,
        DefaultEmail: userDetail.DefaultEmail || '',
        UpdateUser: userStore.userInfo.UserName
    }
    console.log(form.value)
}

onMounted(() => {
    getRoleList()
    if (router.currentRoute.value.query.ID) {
        getPermDetail()
    }
})
</script>

<style scoped>
.perm-card {
    margin: 20px 0;
}

.perm-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.perm-title {
    font-size: 18px;
    font-weight: bold;
}
</style>