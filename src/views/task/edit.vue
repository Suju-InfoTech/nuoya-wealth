<template>
  <div class="task-detail-page">
    <el-card>
      <template #header>
        <div class="header-row">
          <span class="title">清单详情</span>
          <div class="version-status">
            <!-- <span>版本号：{{form.task.TaskNumber}}</span> -->
            <el-radio-group v-model="form.task.Flag">
              <el-radio value="0" border :disabled="form.task.Flag !== '0'">未确认</el-radio>
              <el-radio value="1" border :disabled="form.task.Flag !== '1'">已确认</el-radio>
              <el-radio value="3" border :disabled="form.task.Flag !== '3'"> 已导出</el-radio>
            </el-radio-group>
          </div>
        </div>
      </template>
      <el-row>
        <el-col :span="18">
          <el-collapse expand-icon-position="left" :active-name="activeName" v-model="activeName">

            <el-collapse-item title="详情" name="1" icon="Plus">
              <template #icon="{ isActive }">
                <el-icon v-if="!isActive" size="22" color="#1976d2">
                  <Plus />
                </el-icon>
                <el-icon v-else size="22" color="#1976d2">
                  <Minus />
                </el-icon>
              </template>
              <div class="detail-form-container">
                <el-form :model="form.task" label-width="120px" class="detail-form" label-position="left"
                  require-asterisk-position="right" :rule="formRules" ref="formRef">
                  <el-row :gutter="16">
                    <el-col :span="12">
                      <el-form-item label="任务名称" required prop="TaskTitle">
                        <el-input v-model="form.task.TaskTitle" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="16">
                    <el-col :span="12">
                      <el-form-item label="产品名称" prop="ProductName" required>
                        <el-select v-model="form.task.ProductName" filterable placeholder="请选择" @change="getAdminNos">
                          <el-option v-for="item in prodNameOptions" :key="item.TypeId" :label="item.TypeName"
                            :value="item.TypeName" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="16">
                    <el-col :span="12">
                      <el-form-item label="管理人批次" prop="BatchNum" required>
                        <el-select v-model="form.task.BatchNum" filterable placeholder="请选择">
                          <el-option v-for="item in getAdminNosOptions" :key="item.BatchNum" :label="item.BatchNum"
                            :value="item.BatchNum" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="16">
                    <el-col :span="12">
                      <el-form-item label="PN号" prop="PNnum">
                        <el-input v-model="form.task.PNnum" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="16">
                    <el-col :span="12">
                      <el-form-item label="产品类型" prop="ProductType" required>
                        <el-select v-model="form.task.ProductType" filterable placeholder="请选择" @change="getBussTypes">
                          <el-option v-for="item in prodTypeOptions" :key="item.TypeId" :label="item.TypeName"
                            :value="item.TypeName" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="16">
                    <el-col :span="12">
                      <el-form-item label="业务类型" prop="BusinessType" required>
                        <el-select v-model="form.task.BusinessType" filterable placeholder="请选择">
                          <el-option v-for="item in bussTypeOptions" :key="item.BussinessType"
                            :label="item.BussinessType" :value="item.BussinessType" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="16">
                    <el-col :span="12">
                      <el-form-item label="标签">
                        <el-select v-model="form.task.Tags" filterable multiple placeholder="请选择" prop="Tags">
                          <el-option v-for="value in assignFormTagOptions" :key="value" :label="value" :value="value" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="16">
                    <el-col :span="12">
                      <el-form-item label="Maker/处理人" prop="Maker">
                        <el-input v-model="form.task.Maker" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="16">
                    <el-col :span="12">
                      <el-form-item label="备注" prop="TaskRemark">
                        <el-input type="textarea" v-model="form.task.TaskRemark" :rows="3" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
            </el-collapse-item>
            <el-collapse-item name="3" icon="Plus" title="更新日志" v-if="TaskId">
              <template #icon="{ isActive }">
                <el-icon v-if="!isActive" size="22" color="#1976d2">
                  <Plus />
                </el-icon>
                <el-icon v-else size="22" color="#1976d2">
                  <Minus />
                </el-icon>
              </template>
              <div class="log-form-container">
                <el-form label-width="120px" class="log-form" label-position="left">
                  <el-form-item label="更新日志">
                    <el-input type="textarea" v-model="logContent" :rows="2" />
                  </el-form-item>
                </el-form>
              </div>
            </el-collapse-item>
            <el-collapse-item title="更新记录" name="4" icon="Plus" v-if="TaskId">
              <template #icon="{ isActive }">
                <el-icon v-if="!isActive" size="22" color="#1976d2">
                  <Plus />
                </el-icon>
                <el-icon v-else size="22" color="#1976d2">
                  <Minus />
                </el-icon>
              </template>
              <div class="record-form-container">
                <div class="record-header">
                  <div>更新记录</div>
                </div>
                <div class="record-form-table">
                  <el-table :data="form.Loglist" style="width: 100%; margin-bottom: 16px" border>
                    <el-table-column prop="CreateUser" label="更新人" width="120" />
                    <el-table-column prop="CreateTime" label="更新时间" width="180" />
                    <el-table-column prop="OperateNotes" label="更新日志" />
                    <el-table-column prop="Status" label="更新后状态" width="180">
                      <template #default="scope">
                        {{ formatChangeFlag(scope.row.Status) }}
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-col>
        <el-col :span="6">
          <el-collapse expand-icon-position="left" :active-name="relatedEmailactiveName"
            v-model="relatedEmailactiveName" accordion>
            <el-collapse-item title="关联邮件信息" :name="item.ID" icon="Plus" v-for="item in form.Emaillist" :key="item.ID">
              <template #icon="{ isActive }">
                <el-icon v-if="!isActive" size="22" color="#1976d2">
                  <Plus />
                </el-icon>
                <el-icon v-else size="22" color="#1976d2">
                  <Minus />
                </el-icon>
              </template>
              <div class="detail-form-container">
                <el-form :model="item" label-width="120px" class="detail-form" label-position="left"
                  require-asterisk-position="right">
                  <el-row :gutter="16">
                    <el-col>
                      <el-form-item label="流水号" prop="SerialNumber">
                        <el-input v-model="item.SerialNumber" disabled />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="16">
                    <el-col>
                      <el-form-item label="电邮收到日期" prop="ReceivedTime">
                        <el-input v-model="item.ReceivedTime" disabled />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="16">
                    <el-col>
                      <el-form-item label="电邮发送人" prop="SendUser">
                        <el-input v-model="item.SendUser" disabled />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="16">
                    <el-col>
                      <el-form-item label="电邮标题" prop="EmailSubject">
                        <el-input v-model="item.EmailSubject" disabled />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="16">
                    <el-col>
                      <el-form-item label="电邮分发人">
                        <el-input v-model="item.distributor" disabled />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="16">
                    <el-col>
                      <el-form-item label="标签">
                        <el-input v-model="item.Tags" disabled />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="16">
                    <el-col>
                      <el-form-item label="命中规则">
                        <el-input v-model="item.Rules" disabled />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="16">
                    <el-col>
                      <el-form-item label="邮件正文" prop="EmailBody">
                        <el-input type="textarea" v-model="item.EmailBody" :rows="8" disabled />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-row>

      <div class="action-row">
        <el-button type="primary" plain @click="handleConfirm" v-if="TaskId">确认</el-button>
        <el-button type="primary" plain @click="handleSave">保存</el-button>
        <el-button type="primary" plain @click="handleCopy" v-if="TaskId">复制</el-button>
        <el-button type="danger" plain @click="handleDeleteTask" v-if="TaskId">删除</el-button>
        <el-button @click="handleBack" type="warning" plain>返回</el-button>
      </div>
    </el-card>

    <el-dialog title="复制任务" width="470px" :close-on-click-modal="false" v-model="copyEmailDialog" center>
      <div style="padding: 20px;">
        <el-form :model="copyEmail" class="query-form" :inline="true">
          <el-form-item label="数量" prop="Number">
            <el-input v-model="copyEmail.Number" type="number" min="1" max="99" style="width: 320px" />
          </el-form-item>
        </el-form>

      </div>
      <template #footer>
        <el-button type="primary" @click="handleCopyEmail">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/modules/user";
import { getEmailReceivedTagDropdownApi } from "@/api/module/email";
import {
  addTaskApi,
  getTaskDetailsApi,
  confirmTaskApi,
  saveTaskApi,
  getProdTypeApi, getBussTypesApi, showTaskDetailApi, copyTaskApi, deleteTaskApi
} from "@/api/module/task";
import { getProdNamesApi, getAdminNosApi } from "@/api/module/email";

import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter();
const userStore = useUserStore();

const formatChangeFlag = (flag: string) => {
  switch (flag) {
    case '0':
      return '未确认'
    case '1':
      return '已确认'
    case '3':
      return '已导出'
    case '9':
      return '软删除'
    default:
      return flag
  }
}

const handleBack = () => {
  let query = router.currentRoute.value.query
  router.push({ name: "task", query });
};
const copyEmailDialog = ref(false)
const copyEmail = ref({
  Number: 1,
})
const assignFormTagOptions = ref([]);

const formStatus = ref("statusPending");
const activeName = ref("1");

const form = ref({
  task: {
    BatchNum: "",
    BusinessType: "",
    ChangeFlag: "",
    CheckTime: "",
    Checker: "",
    CreateTime: "",
    CreateUser: "",
    ID: 0,
    MakeTime: "",
    Maker: userStore.userInfo.UserName,
    Tags: '' as any | Array<string>,
    PNnum: "",
    Logs: '' as any,
    ProductName: "",
    ProductType: "",
    TaskNumber: "",
    TaskRemark: "",
    TaskTitle: "",
    UpdateTime: "",
    UpdateUser: "",
    Flag: '',
  },
  Loglist: [],
  Emaillist: [] as any[],
});

const formRules = computed(() => {
  if (form.value.task.ProductType === '私募') {
    return {
      ProductName: [{ required: true, message: '请输入产品名称', trigger: ['change'] }],
      ProductType: [{ required: true, message: '请选择产品类型', trigger: ['change'] }],
      BusinessType: [{ required: true, message: '请选择业务类型', trigger: ['change'] }],
      BatchNum: [{ required: true, message: '请输入管理人批次', trigger: ['change'] }],
      TaskTitle: [{ required: true, message: '请输入任务标题', trigger: ['change'] }]
    }
  }
  // 非私募时只校验任务标题（可按需要再补其他）
  return {
    TaskTitle: [{ required: true, message: '请输入任务标题', trigger: ['change'] }],
    ProductName: [{ required: true, message: '请输入产品名称', trigger: ['change'] }],
    ProductType: [{ required: true, message: '请选择产品类型', trigger: ['change'] }],
    BusinessType: [{ required: true, message: '请选择业务类型', trigger: ['change'] }],
    BatchNum: [{ required: true, message: '请输入管理人批次', trigger: ['change'] }],
  }
})
// const formRules = ref({
//   task: {
//     TaskTitle: [{ required: true, message: '请输入任务标题', trigger: 'blur' }],
//     ProductName: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
//     BatchNum: [{ required: true, message: '请输入批次号', trigger: 'blur' }],
//     BusinessType: [{ required: true, message: '请选择业务类型', trigger: 'change' }],
//     ProductType: [{ required: true, message: '请选择产品类型', trigger: 'change' }],
//     Maker: [{ required: true, message: '请输入制单人', trigger: 'blur' }],
//     Tags: [{ required: true, message: '请选择标签', trigger: 'change' }],

//   },
// })

const formRef = ref()

const relatedEmailactiveName = ref("");

const logContent = ref("");


const getTageDropdownList = async () => {
  const { ResultFlag, ResultSet } = await getEmailReceivedTagDropdownApi();
  if (ResultFlag == "0") {
    assignFormTagOptions.value = JSON.parse(ResultSet);
  }
};


const handleCopy = () => {

  copyEmailDialog.value = true

}

const handleCopyEmail = async () => {
  if (copyEmail.value.Number > 99) {
    ElMessage.warning('最多复制99条')
    return
  }
  const res = await copyTaskApi({
    ID: TaskId.value,
    copyCount: copyEmail.value.Number,
    User: userStore.userInfo.UserName
  })
  if (res.ResultFlag == '0') {
    ElMessage.success('复制成功')
    copyEmailDialog.value = false
    handleBack()
  } else {
    ElMessage.error(res.ResultSet)
  }
}

const handleDeleteTask = () => {

  ElMessageBox.confirm('确定删除选中的任务吗？', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    // 确认删除
    const res = await deleteTaskApi({
      ID: TaskId.value,
    })
    if (res.ResultFlag == '0') {
      ElMessage.success('删除成功')
      handleBack()
    } else {
      ElMessage.error(res.ResultSet)
    }
  }).catch(() => {
    // 取消删除
  })
}

const handleConfirm = async () => {
  let valid = await formRef.value.validate()
  if (!valid) return
  let taskId = router.currentRoute.value.query.id;
  form.value.task.Tags = form.value.task.Tags.join(";");
  const res = await confirmTaskApi({
    taskId: Number(taskId),
    ...form.value.task,
    TaskRemark: form.value.task.TaskRemark,
    Logs: logContent.value,
    CreateUser: userStore.userInfo.UserName,
    Flag: "1"
  })
  if (res.ResultFlag == '0') {
    ElMessage.success('确认成功')
    handleBack();
  } else {
    ElMessage.error(res.ResultSet)
  }
}

const handleSave = async () => {
  const valid = await formRef.value.validate();
  if (!valid) {
    return; // 验证失败，不执行后续操作
  }
  if (router.currentRoute.value.query.id) {
    let taskId = router.currentRoute.value.query.id;
    form.value.task.Tags = form.value.task.Tags.length > 0 ? form.value.task.Tags.join(";") : '';
    const res = await saveTaskApi({
      taskId: Number(taskId),
      ...form.value.task,
      TaskRemark: form.value.task.TaskRemark,
      Logs: logContent.value,
      CreateUser: userStore.userInfo.UserName,
      Flag: "0"
    });
    if (res.ResultFlag == "0") {
      ElMessage.success("保存成功");
      handleBack();
    } else {
      ElMessage.error(res.ResultSet);
    }

  } else {
    form.value.task.Tags = form.value.task.Tags.length > 0 ? form.value.task.Tags.join(";") : '';
    const { ResultFlag, ResultSet } = await addTaskApi(form.value.task);
    if (ResultFlag == "0") {
      ElMessage.success("保存成功");
      handleBack();
    } else {
      ElMessage.error(ResultSet);
    }
  }
};

const getTaskDetails = async () => {
  const id = router.currentRoute.value.query.id;
  const { ResultFlag, ResultSet } = await getTaskDetailsApi({ ID: id });
  console.log(JSON.parse(ResultSet));
  if (ResultFlag == "0") {
    form.value = JSON.parse(ResultSet);
    form.value.task.Tags = form.value.task?.Tags.split(";");
    relatedEmailactiveName.value = form.value?.Emaillist?.length > 0 ? form.value.Emaillist[0].ID : ''
    logContent.value = form.value.task?.Logs || ''
    setTimeout(() => {
      if (form.value.task.ProductType) getBussTypes();
      if (form.value.task.ProductName) getAdminNos();
    }, 500)
  }


};

const TaskId = ref("" as any);

const prodTypeOptions = ref([] as any[])
const bussTypeOptions = ref([] as any[])
const prodNameOptions = ref([] as any[])
const getAdminNosOptions = ref([] as any[])
/**
 * @name 获取产品类型
 */
const getProdType = async () => {
  const { ResultFlag, ResultSet } = await getProdTypeApi()
  if (ResultFlag == '0') {
    prodTypeOptions.value = JSON.parse(ResultSet);
    form.value.task.ProductType = prodTypeOptions.value.length > 0 ? prodTypeOptions.value[0].TypeName : ''
    getBussTypes()
  } else { 
    ElMessage.error(ResultSet)
  }
}

/**
 * @name 根据产品类型下拉框获取业务类型下拉框
 */
const getBussTypes = async () => {
  let prodTypeId = ''
  prodTypeOptions.value.forEach((item: any) => {
    if (item.TypeName == form.value.task.ProductType) {
      prodTypeId = item.TypeId
    }
  })
  if (!prodTypeId) {
    return
  }
  const { ResultFlag, ResultSet } = await getBussTypesApi({
    ProdTypeId: prodTypeId,
  })
  if (ResultFlag == '0') {
    bussTypeOptions.value = JSON.parse(ResultSet)
  } else {
    ElMessage.error(ResultSet)
  }

}

/**
 * @name 获取产品名称下拉框
 */
const getProdNames = async () => {
  const { ResultFlag, ResultSet } = await getProdNamesApi()
  if (ResultFlag == '0') {
    prodNameOptions.value = JSON.parse(ResultSet)
  } else {
    ElMessage.error(ResultSet)
  }

}

/**
 * @name 根据产品名称获取管理员批次和产品代码
 */
const getAdminNos = async () => {
  let prodTypeId = ''
  prodNameOptions.value.forEach((item: any) => {
    if (item.TypeName == form.value.task.ProductName) {
      prodTypeId = item.TypeId
    }
  })
  if (!prodTypeId) {
    return
  }
  const { ResultFlag, ResultSet } = await getAdminNosApi({ ProdNameId: prodTypeId })
  if (ResultFlag == '0') {
    getAdminNosOptions.value = JSON.parse(ResultSet)
  } else {
    ElMessage.error(ResultSet)
  }
}

const showTaskDetail = async () => {
  const TaskNumber = router.currentRoute.value.query.TaskNumber;
  const { ResultFlag, ResultSet } = await showTaskDetailApi({ TaskNumber: TaskNumber });
  if (ResultFlag == "0") {
    form.value = JSON.parse(ResultSet);
    form.value.task.Tags = ResultSet.task?.Tags.split(";");
    relatedEmailactiveName.value = form.value?.Emaillist?.length > 0 ? form.value.Emaillist[0].ID : ''
    logContent.value = form.value.task?.Logs || ''
    setTimeout(() => {
      if (form.value.task.ProductType) getBussTypes();
      if (form.value.task.ProductName) getAdminNos();
    }, 1000)
  }

}

onMounted(() => {
  const id = router.currentRoute.value.query.id;
  const TaskNumber = router.currentRoute.value.query.TaskNumber;
  getProdType()
  getProdNames()
  if (id) {
    TaskId.value = id;
    getTaskDetails();
  }
  if (TaskNumber) {
    TaskId.value = TaskNumber;
    showTaskDetail();
  }

  getTageDropdownList();

});
</script>

<style scoped lang="scss">
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.detail-form-container,
.log-form-container,
.record-form-container {
  padding: 0 16px;
  margin: 0 10px;
  border-left: 2px solid #d2d2d2;
}

.record-form-container {
  display: flex;

  .record-header {
    width: 120px;
  }

  .record-form-table {
    flex: 1;
  }
}

.title {
  font-size: 16px;
  font-weight: bold;
}

.version-status {
  display: flex;
  align-items: center;
  gap: 18px;
}

.section-bar {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #1976d2;
}

.section-title {
  font-size: 15px;
  font-weight: bold;
  margin: 18px 0 12px 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.detail-form,
.log-form {
  margin-bottom: 0;
}

.status-row {
  display: flex;
  align-items: center;
  gap: 24px;
  margin: 18px 0 12px 0;
}

.action-row {
  display: flex;
  justify-content: flex-start;
  gap: 16px;
  margin-top: 24px;
  margin-left: 150px;
}

.el-button {
  min-width: 102px;
}
</style>
