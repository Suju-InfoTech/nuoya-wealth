<template>
    <el-card class="perm-card">

        <template #header>
            <div class="perm-header">
                <div class="perm-title">
                    编辑角色
                </div>
            </div>

        </template>
        <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
            <el-form-item label="角色编码" prop="account">
                <el-input v-model="form.account" placeholder="请输入角色编码" />
            </el-form-item>
            <el-form-item label="角色名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入角色名称" />
            </el-form-item>
            <el-form-item label="菜单权限" prop="menuIds">
                <el-tree
                    :data="menus"
                    :props="defaultProps"
                    default-expand-all
                    show-checkbox
                    node-key="id"
                    ref="treeRef"
                />
            </el-form-item>
            <el-form-item label="是否启用" prop="isEnabled">
                <el-radio-group v-model="form.isEnabled">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" placeholder="请输入备注" type="textarea"  :rows="4"/>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
import { useRoute } from 'vue-router'
const route = useRoute()
console.log(route,router.getRoutes())
onMounted(() => {
    menus.value = router.getRoutes().filter(route => route.meta?.title&&route.meta?.title!=='登录').map(route => ({
        id: route.path,
        name: route.meta?.title,
        icon: route.meta?.icon,
        children: route.children?.filter(child => child.meta?.title && child.meta?.icon).map(child => ({
            id: child.path,
            name: child.meta?.title,
            icon: child.meta?.icon
        }))
    }))
})
const menus = ref([])
const defaultProps = {
    children: 'children',
    label: 'name'
}
const form = ref({
    account: '',
    name: '',
    isEnabled: '1'
})

const rules = ref({
    account: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
    name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
    isEnabled: [{ required: true, message: '请选择是否启用', trigger: 'change' }],
    menuIds: [{ required: true, message: '请选择菜单权限', trigger: 'change' }]
})

const handleAddRole = () => {
    if (formRef.value.validate()) {
        console.log('表单校验通过')
    }
}

</script>
