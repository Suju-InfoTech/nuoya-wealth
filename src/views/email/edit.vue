<template>
  <el-card class="edit-card">
    <template #header>
      <div class="header-row">
        <div class="title">邮件处理</div>
        <div class="version-status">
          <div class="status-row">
            <el-radio-group v-model="form.EmailStatus">
              <el-radio value="0" border :disabled="form.EmailStatus != '0'">未处理</el-radio>
              <el-radio value="1" border :disabled="form.EmailStatus != '1'">已生成任务</el-radio>
              <el-radio value="2" border :disabled="form.EmailStatus != '2'">无需处理</el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>
    </template>

    <el-row :gutter="16">
      <el-col :span="16">
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
              <el-form :model="form" label-width="140px" class="detail-form" label-position="left">

                <el-row :gutter="16">
                  <el-col :span="12">
                    <el-form-item label="邮件标题">
                      <el-input v-model="form.EmailSubject" disabled />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="16">
                  <el-col :span="12">
                    <el-form-item label="发件人">
                      <el-input v-model="form.Email" disabled />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="16">
                  <el-col :span="12">
                    <el-form-item label="收件人">
                      <el-input v-model="form.toRecipients" disabled />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="16">
                  <el-col :span="12">
                    <el-form-item label="抄送人">
                      <el-input v-model="form.ccRecipients" disabled />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="16">
                  <el-col :span="12">
                    <el-form-item label="标签">
                      <el-select v-model="form.Tags" filterable multiple placeholder="请选择">
                        <el-option v-for="value in assignFormTagOptions" :key="value" :label="value" :value="value" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="16">
                  <el-col :span="12">
                    <el-form-item label="命中规则名称">
                      <el-input v-model="form.Rules" disabled />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="16">
                  <el-col :span="24">
                    <el-form-item label="附件">
                      <ul class="el-upload-list el-upload-list--text" style="width: 100%;"
                        v-if="form.attachlist.length > 0">
                        <li class="el-upload-list__item is-success" v-for="(item, index) in form.attachlist"
                          :key="index">
                          <div class="el-upload-list__item-info">
                            <a class="el-upload-list__item-name" @click="handleDownloadAttachment(item)">
                              <span class="el-upload-list__item-file-name">{{ item.AttachName }}</span>
                            </a>
                          </div>
                        </li>
                      </ul>
                      <div v-else>
                        暂无附件
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="16">
                  <el-col :span="24">
                    <el-form-item label="邮件内容">
                      <div v-html="form.EmailBodyHtml" style="width: 100%; height: 300px; overflow: auto;border: 1px solid #ccc;"></div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </el-collapse-item>
          <el-collapse-item title="更新日志" name="3" icon="Plus">
            <template #icon="{ isActive }">
              <el-icon v-if="!isActive" size="22" color="#1976d2">
                <Plus />
              </el-icon>
              <el-icon v-else size="22" color="#1976d2">
                <Minus />
              </el-icon>
            </template>
            <div class="detail-form-container">
              <el-table :data="form.Loglist" style="width: 100%" border
                :header-cell-style="{ background: '#ece9e2', color: '#333', fontWeight: 'bold', textAlign: 'center' }">
                <el-table-column prop="CreateUser" label="更新人" width="180" />
                <el-table-column prop="OperateTime" label="更新时间" width="180" />
                <el-table-column prop="OperateNotes" label="内容" >
                  <template #default="scope">
                    <div >
                      <el-link type="primary" :underline="false" @click="handlePreviewEmail(scope.row.OperateNotes)">
                        {{ scope.row.OperateNotes }}
                      </el-link>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-col>
      <el-col :span="8">
        <el-collapse expand-icon-position="left" :active-name="rightActiveName" v-model="rightActiveName" accordion>
          <el-collapse-item :name="item.taskId" icon="Plus" v-for="(item, index) in form.Tasklist" :key="index">
            <template #icon="{ isActive }">
              <el-icon v-if="!isActive" size="22" color="#1976d2">
                <Plus />
              </el-icon>
              <el-icon v-else size="22" color="#1976d2">
                <Minus />
              </el-icon>
            </template>
            <template #title>
              关联任务第({{ index + 1 }})个
            </template>
            <div class="detail-form-container">
              <el-form :model="item"  label-width="120px" label-position="left"
                require-asterisk-position="right" style="padding: 0 30px;" >

                <el-form-item label="产品名称" prop="ProductName">
                  <el-select v-model="item.ProductName" filterable placeholder="请选择" 
                    @change="getAdminNos" disabled>
                    <el-option v-for="item in prodNameOptions" :key="item.TypeId" :label="item.TypeName"
                      :value="item.TypeName" />
                  </el-select>
                </el-form-item>
                <el-form-item label="管理人批次" prop="BatchNum">
                  <el-select v-model="item.BatchNum" filterable placeholder="请选择"  disabled>
                    <el-option v-for="item in getAdminNosOptions" :key="item.BatchNum" :label="item.BatchNum"
                      :value="item.BatchNum" />
                  </el-select>
                </el-form-item>
                <el-form-item label="产品类型" prop="ProductType">
                  <el-select v-model="item.ProductType" filterable placeholder="请选择" 
                    @change="getBussTypes" disabled>
                    <el-option v-for="item in prodTypeOptions" :key="item.TypeId" :label="item.TypeName"
                      :value="item.TypeName" />
                  </el-select>
                </el-form-item>
                <el-form-item label="业务类型" prop="BusinessType">
                  <el-select v-model="item.BusinessType" filterable placeholder="请选择"  disabled>
                    <el-option v-for="item in bussTypeOptions" :key="item.BussinessType" :label="item.BussinessType"
                      :value="item.BussinessType" />
                  </el-select>
                </el-form-item>

                <el-form-item label="PN号" prop="PNnum">
                  <el-input v-model="item.PNnum"  disabled />
                </el-form-item>
                <el-form-item label="标签" prop="Tags">
                  <el-select v-model="item.Tags" filterable multiple placeholder="请选择" 
                    disabled>
                    <el-option v-for="value in assignFormTagOptions" :key="value" :label="value" :value="value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="Maker/处理人" prop="Maker">
                  <el-input v-model="item.Maker"  disabled />
                </el-form-item>
                <el-form-item label="备注" prop="TaskRemark">
                  <el-input type="textarea" v-model="item.TaskRemark" :rows="4" disabled />
                </el-form-item>
              </el-form>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>
    <div class="action-row">
      <el-button type="primary" plain @click="handleUpdateTag">保存</el-button>
      <el-button type="primary" @click="showAssignDialog = true" plain> 邮件转任务</el-button>
      <el-button type="primary" plain @click="handleEmailStatusChange('2')"> 标记为无需处理</el-button>
      <el-button @click="handleBackToList">返回</el-button>
    </div>
  </el-card>
  <!-- 分配任务弹窗 -->

  <el-drawer v-model="showAssignDialog" :with-header="false">
    <el-form :model="assignForm" ref="assignFormRef" label-width="120px" label-position="left"
      require-asterisk-position="right" style="padding: 0 30px;" :rules="assignFormRules">

      <el-form-item label="产品名称" prop="ProductName" >
        <el-select v-model="assignForm.ProductName" filterable placeholder="请选择" style="width: 300px;" @change="getAdminNos">
          <el-option v-for="item in prodNameOptions" :key="item.TypeId" :label="item.TypeName" :value="item.TypeName" />
        </el-select>
      </el-form-item>
      <el-form-item label="管理人批次" prop="BatchNum">
        <el-select v-model="assignForm.BatchNum" filterable placeholder="请选择" style="width: 300px;">
          <el-option v-for="item in getAdminNosOptions" :key="item.BatchNum" :label="item.BatchNum"
            :value="item.BatchNum" />
        </el-select>
      </el-form-item>
      <el-form-item label="产品类型" prop="ProductType">
        <el-select v-model="assignForm.ProductType" filterable placeholder="请选择" style="width: 300px;" @change="getBussTypes">
          <el-option v-for="item in prodTypeOptions" :key="item.TypeId" :label="item.TypeName" :value="item.TypeName" />
        </el-select>
      </el-form-item>
      <el-form-item label="业务类型" prop="BusinessType">
        <el-select v-model="assignForm.BusinessType" filterable placeholder="请选择" style="width: 300px;">
          <el-option v-for="item in bussTypeOptions" :key="item.BussinessType" :label="item.BussinessType"
            :value="item.BussinessType" />
        </el-select>
      </el-form-item>

      <el-form-item label="PN号" prop="PNnum">
        <el-input v-model="assignForm.PNnum" style="width: 300px;" />
      </el-form-item>
      <!-- <el-form-item label="标签" prop="Tags">
        <el-select v-model="assignForm.Tags" filterable multiple placeholder="请选择" style="width: 300px;">
          <el-option v-for="value in assignFormTagOptions" :key="value" :label="value" :value="value" />
        </el-select>
      </el-form-item> -->
      <el-form-item label="Maker/处理人" prop="Maker">
        <el-input v-model="assignForm.Maker" style="width: 300px;" />
      </el-form-item>
      <el-form-item label="备注" prop="TaskRemark">
        <el-input type="textarea" v-model="assignForm.TaskRemark" :rows="4" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="flex justify-center gap-2" style="display: flex; justify-content: center;">
        <el-button type="primary" @click="handleAssignSubmit">提交</el-button>
        <el-button @click="handleAssignCancel">取消</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted,computed } from "vue";
import { useRouter,useRoute } from "vue-router";
import { useUserStore } from "@/stores/modules/user";
import { ElMessage } from "element-plus";
const router = useRouter();
const route = useRoute();

const userStore = useUserStore();
import {
  exportFile, getFileType,
  getFileTypeFromFilename
} from "@/utils/downloadFile";
const showAssignDialog = ref(false);
import {
  downloadEmailAttachmentApi, getEmailReceivedDetailsApi,
  getEmailReceivedNoDealWithApi, getEmailReceivedTagDropdownApi,
  getEmailReceivedGenerateTaskApi, getProdNamesApi, getAdminNosApi, getEmailReceivedUpdateTagApi
} from "@/api/module/email";
import { getProdTypeApi, getBussTypesApi } from "@/api/module/task";

const handleBackToList = () => {
  let query = { ...route.query }
  delete query.emailId
  router.push({ name: "email",query: { activeTab: route.query.emailId, ...query } });
};

/**
 * 预览邮件内容
 */
const handlePreviewEmail = (item) => {
  router.push({ name: 'taskDetail', query: { TaskNumber: item } })
}

const handleAssignCancel = () => {
  showAssignDialog.value = false
  assignForm.value = {
    ReceivedId: 0,
    ProductType: "",
    ProductName: "",
    BusinessType: "",
    BatchNum: "",
    PNnum: "",
    Tags: [] as string| Array<string>,
    Maker: userStore.userInfo.UserName,
    TaskRemark: "",
    CreateUser: userStore.userInfo.UserName,
  }
}

const activeName = ref("1");
const rightActiveName = ref("1");

const assignForm = ref({
  ReceivedId: 0,
  ProductType: "",
  ProductName: "",
  BusinessType: "",
  BatchNum: "",
  PNnum: "",
  Tags: [] as string| Array<string>,
  Maker: userStore.userInfo.UserName,
  TaskRemark: "",
  CreateUser: userStore.userInfo.UserName,
});
const assignFormTagOptions = ref([]);
// 如果产品类型为私募，则产品名称、管理人批次、业务类型这3个字段必填。否则这些参数都选填。 

const assignFormRules = computed(() => {
  if (assignForm.value.ProductType == '私募') {
    return {
      ProductName: [{ required: true, message: '请输入产品名称', trigger: ['change'] }],
      ProductType: [{ required: true, message: '请选择产品类型', trigger: ['change'] }],
      BusinessType: [{ required: true, message: '请选择业务类型', trigger: ['change'] }],
      BatchNum: [{ required: true, message: '请输入管理人批次', trigger: ['change'] }],
    }
  }else {
    return {
      ProductName: [{ required: true, message: '请输入产品名称', trigger: ['change'] }],
      ProductType: [{ required: true, message: '请选择产品类型', trigger: ['change'] }],
      BusinessType: [{ required: true, message: '请选择业务类型', trigger: ['change'] }],
      BatchNum: [{ required: true, message: '请输入管理人批次', trigger: ['change'] }],
    }
  }
  
})

const handleUpdateTag = async () => {
  if (!form.value.Tags.length) {
    ElMessage.error('请选择标签')
    return
  }
  let tags = Array.isArray(form.value.Tags) ? form.value.Tags.join(';') : form.value.Tags
  const { ResultFlag, ResultSet } = await getEmailReceivedUpdateTagApi({
    ID: Number(EmailID.value),
    Tags: tags,
    UpdateUser: userStore.userInfo.UserName,
  })
  if (ResultFlag == '0') {
    ElMessage.success('更新标签成功')
    handleBackToList()
  } else {
    ElMessage.error('更新标签失败')
  }
}

const form = ref({
  Email: "",
  EmailSubject: "",
  EmailBodyHtml: "",
  Tags: [] as string| Array<string>,
  productType: "",
  businessType: "",
  EmailBody: "",
  EmailStatus: "",
  toRecipients: "",
  ccRecipients: "",
  attachlist: [] as any[],
  Tasklist: [] as any[],
  Loglist: [] as any[],
  Rules: "",
});

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
/**
 * 获取邮件标签下拉列表
 */
const getEmailTagDropdown = async () => {
  const { ResultFlag, ResultSet } = await getEmailReceivedTagDropdownApi()
  if (ResultFlag == '0') {
    assignFormTagOptions.value = JSON.parse(ResultSet)
  }
}
const assignFormRef = ref()
const handleAssignSubmit = async () => {
  // 分配任务提交逻辑
  let valid = await assignFormRef.value.validate()
  if (!valid) {
    ElMessage.error('请填写完整信息')
    return
  }
  assignForm.value.Tags = Array.isArray(assignForm.value.Tags) ? assignForm.value.Tags.join(';') : assignForm.value.Tags
  const { ResultFlag, ResultSet } = await getEmailReceivedGenerateTaskApi(assignForm.value)
  if (ResultFlag == '0') {
    ElMessage.success('新增任务成功')
    getEmailDetail(EmailID.value)
  } else {
    ElMessage.error('新增任务失败')
  }
  showAssignDialog.value = false;
}

const getEmailDetail = async (id: string) => {
  const { ResultFlag, ResultSet } = await getEmailReceivedDetailsApi({ ID: Number(id) })
  if (ResultFlag == '0') {
    form.value = JSON.parse(ResultSet)
    console.log(form.value)
    form.value.Tags = Array.isArray(form.value.Tags) ? form.value.Tags : form.value.Tags.split(';')
    form.value.attachlist = form.value.attachlist || []
    form.value.Tasklist.forEach((item: any) => {
      item.Tags = item?.Tags?.split(';')
    })
    rightActiveName.value = form.value.Tasklist[0]?.taskId || '1'
  }
  
}

const handleDownloadAttachment = async (item: any) => {
  const res = await downloadEmailAttachmentApi({ attachId: item.ID })
  exportFile(res, getFileType(getFileTypeFromFilename(item.AttachName)), item.AttachName);
}

/**
 * 处理邮件状态改变
 */
const handleEmailStatusChange = async (val: string) => {
  if (val == '2') {
    // 标记为无需处理
    const { ResultFlag, ResultSet } = await getEmailReceivedNoDealWithApi({ ID: Number(EmailID.value), User: userStore.userInfo.UserName })
    if (ResultFlag == '0') {
      ElMessage.success('标记为无需处理成功')
    }
  }
}

const EmailID = ref('')

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
    assignForm.value.ProductType = prodTypeOptions.value.length > 0 ? prodTypeOptions.value[0].TypeName : ''
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
    if (item.TypeName == assignForm.value.ProductType) {
      prodTypeId = item.TypeId
    }
  })
  const { ResultFlag, ResultSet } = await getBussTypesApi({
    ProdTypeId: prodTypeId
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
    if (item.TypeName == assignForm.value.ProductName) {
      prodTypeId = item.TypeId
    }
  })
  const { ResultFlag, ResultSet } = await getAdminNosApi({ ProdNameId: prodTypeId })
  if (ResultFlag == '0') {
    getAdminNosOptions.value = JSON.parse(ResultSet)
  } else {
    ElMessage.error(ResultSet)
  }
}

onMounted(() => {
  getEmailTagDropdown()
  getProdNames()
  getProdType()
  EmailID.value = router.currentRoute.value.query.id as string
  assignForm.value.ReceivedId = Number(EmailID.value)
  getEmailDetail(EmailID.value)
})
</script>

<style scoped lang="scss">
.edit-card {
  min-width: 900px;

  .el-card__body {
    .el-collapse {
      border: unset;

      .el-collapse-item {
        .el-collapse-item__wrap {
          border: unset;
        }
      }

    }
  }
}

.el-button {
  min-width: 102px;
}

.header-row {
  font-size: 18px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.version-status {
  display: flex;
  gap: 12px;
}

.detail-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-row {
  display: flex;
  justify-content: flex-end;
  gap: 24px;
}

.detail-form-container {
  padding: 0 16px;
  margin: 0 10px;
  border-left: 2px solid #d2d2d2;

  .detail-form {
    .el-form-item {
      margin-bottom: 10px;

      .el-form-item__label {
        color: #000;
      }
    }
  }
}


.attachment-row {
  margin: 16px 0 24px 0;
  font-size: 16px;
  color: #1976d2;
  display: flex;
  align-items: center;
  gap: 4px;
}

.attachment-title {
  font-weight: bold;
}

.action-row {
  display: flex;
  justify-content: flex-start;
  gap: 16px;
  margin-top: 24px;
}
</style>
