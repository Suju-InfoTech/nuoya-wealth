<template>
  <el-card class="task-card">
    <template #header>
      <div class="task-header">
        <div class="task-title">任务列表</div>
        <div class="task-actions">
          <el-button type="primary" plain @click="getTaskList">查询</el-button>
          <el-button type="primary" plain @click="handleCopy">复制</el-button>
          <el-button type="danger" plain @click="handleDeleteTask">删除</el-button>
          <el-button type="primary" @click="handleAddTask" plain>新增</el-button>
          <el-button type="primary" plain @click="handleExport" v-if="authStore.isExport">导出</el-button>
          <el-button type="primary" plain @click="exportPartSelectData" v-if="authStore.isExport">导出选中</el-button>
          <el-button type="primary" @click="handleAddEmail" plain>关联邮件</el-button>
        </div>
      </div>
    </template>


    <el-form :model="form" class="query-form" :inline="true" style="margin-bottom: 10px;" :label-width="100" label-position="left">
      <el-row class="query-row" :gutter="20">
        <el-col :span="5">
          <el-form-item label="流水号" prop="SerNum" style="width: 100%;">
            <el-input v-model="form.SerNum" placeholder="请输入流水号"  style="width: 220px;" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="标题" prop="Title" style="width: 100%;">
            <el-input v-model="form.Title" placeholder="请输入标题"  style="width: 220px;" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="产品类型" prop="ProductType" style="width: 100%;">
            <el-select v-model="form.ProductType" placeholder="请选择产品类型"  @change="()=>{ getBussTypes()}" clearable>
              <el-option v-for="item in prodTypeOptions" :key="item.TypeId" :label="item.TypeName" :value="item.TypeName" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="业务类型" prop="BusinessType" style="width: 100%;" >
            <el-select v-model="form.BusinessType" placeholder="请选择业务类型" clearable >
              <el-option v-for="item in bussTypeOptions" :key="item.BussinessType" :label="item.BussinessType" :value="item.BussinessType" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="标签" prop="tag" style="width: 100%;">
            <el-select v-model="form.tag" placeholder="请选择标签" clearable >
              <el-option v-for="value in assignFormTagOptions" :key="value" :label="value" :value="value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="query-row" :gutter="20">
        
        <el-col :span="5" >
          <el-form-item label="任务开始日期" prop="sTime" >
            <el-date-picker v-model="form.sTime" placeholder="请输入任务开始日期" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="任务结束日期" prop="eTime">
            <el-date-picker v-model="form.eTime" placeholder="请输入任务结束日期" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" clearable   />
          </el-form-item>
        </el-col>
        <el-col :span="5" >
          <el-form-item label="邮件收取时间" prop="yjsTime" >
            <el-date-picker v-model="form.yjsTime" placeholder="请选择邮件收取开始日期" style="width: 232px;" type="datetime" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="5" >
          <el-form-item label="邮件收取时间" prop="yjeTime" >
            <el-date-picker v-model="form.yjeTime" placeholder="请选择邮件收取结束日期" style="width: 232px;" type="datetime" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="状态" prop="status" style="width: 100%;">
            <el-select v-model="form.status" placeholder="请选择状态" clearable >
              <el-option label="未确认" value="0" />
              <el-option label="已确认" value="1" />
              <el-option label="已导出" value="3" />
              <el-option label="已删除" value="9" />
              <el-option label="未删除" value="" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table :data="tableData" style="width: 100%;" border
      :header-cell-style="{ background: '#ebebeb', color: '#333', fontWeight: 'bold', textAlign: 'center' }"
      :cell-style="{ textAlign: 'center', padding: '8px 0' }"
      @selection-change="handleSelectionChange($event)"
      height="calc(100vh - 355px)"
      @sort-change="handleSortChange">
      <el-table-column type="selection" width="40" fixed="left"/>
      <el-table-column type="index" width="60" label="序号" fixed="left"/>
      <el-table-column prop="TaskNumber" label="流水号" width="130" sortable fixed="left">
        <template #default="scope">
          <el-link type="primary" @click="handleEmailDetail(scope.row.ID)">{{ scope.row.TaskNumber }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="ReceivedTime" label="电邮收到时间" width="180" sortable />
      <el-table-column prop="SendUser" label="发件人" width="120" sortable />
      <el-table-column prop="TaskTitle" label="电邮标题" width="330" sortable >
        <template #default="scope">
              <el-popover placement="top-start"  :width="330" trigger="hover"
                :content="scope.row.TaskTitle">
                <template #reference>
                  <el-text  :line-clamp="2" style="text-align: left;">
                    {{ scope.row.TaskTitle }}
                  </el-text>
                </template>
              </el-popover>
            </template>
          </el-table-column>
      <el-table-column prop="TaskTags" label="标签" width="100" sortable />
      <el-table-column prop="ProductName" label="产品名称" min-width="220" sortable />
      <el-table-column prop="BatchNum" label="管理人批次" width="120" sortable />
      <el-table-column prop="PNnum" label="PN号" width="100" sortable />
      <el-table-column prop="ProductType" label="产品类型" width="120" sortable />
      <el-table-column prop="BusinessType" label="业务类型" width="120" sortable />
      <el-table-column prop="Maker" label="Maker/处理人" width="150" sortable />
      <el-table-column prop="Checker" label="导出人" width="150"  />
      <el-table-column prop="CheckTime" label="导出时间" width="150"  />
      <el-table-column prop="ChangeFlag" label="处理状态" width="120"  >
        <template #default="scope">
          
          <el-tag :type="formatChangeType(scope.row.ChangeFlag)">{{ formatChangeFlag(scope.row.ChangeFlag)  }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="Rules" label="命中规则" width="180"  />
      
      <el-table-column prop="UpdateTime" label="更新时间" width="180"  />
      <el-table-column prop="ChangeFlag" label="状态" width="100"  >
        <template #default="scope">
          
          <el-tag :type="formatChangeStatusType(scope.row.ChangeFlag)">{{ formatChangeStatusFlag(scope.row.ChangeFlag)  }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination background layout="sizes,prev, pager, next,total" :total="total" v-model:page-size="form.pageSize"
        style="margin-top: 20px;" @change="handlePageChange" :page-sizes="[20, 50, 100, 200]" />
    </div>
  </el-card>

  <el-dialog v-model="showAddEmailDialog" title="关联邮件" width="520px" :close-on-click-modal="false">
    <div style="padding: 20px;">
      <el-form :model="emailForm" class="query-form" :inline="true">
        <el-form-item label="邮件流水号" prop="emailIds">
          <el-input v-model="emailForm.emailIds" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handlePreviewEmail">预览</el-button>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div style="text-align: center;">
        <el-button type="primary" @click="handleRelatedEmail">确定</el-button>
      </div>
    </template>
  </el-dialog>

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

  <el-drawer v-model="drawer" title="I am the title" :with-header="false">
    <el-form :model="emailFormDetail" label-width="140px" class="detail-form" label-position="left">

      <el-row :gutter="16">
        <el-col :span="24">
          <el-form-item label="邮件标题">
            <el-input v-model="emailFormDetail.EmailSubject" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="24">
          <el-form-item label="发件人">
            <el-input v-model="emailFormDetail.SendUser" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="24">
          <el-form-item label="收件人">
            <el-input v-model="emailFormDetail.toRecipients" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="24">
          <el-form-item label="抄送人">
            <el-input v-model="emailFormDetail.ccRecipients" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="24">
          <el-form-item label="标签">
            <el-select v-model="emailFormDetail.Tags" filterable multiple placeholder="请选择">
              <el-option v-for="value in assignFormTagOptions" :key="value" :label="value" :value="value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="24">
          <el-form-item label="附件">
            <ul class="el-upload-list el-upload-list--text" style="width: 100%;" v-if="emailFormDetail.AttachCount > 0">
              <li class="el-upload-list__item is-success" v-for="(item, index) in emailFormDetail.attachmentList"
                :key="index">
                <div class="el-upload-list__item-info">
                  <a class="el-upload-list__item-name" @click="handleDownloadAttachment(item)">

                    <span class="el-upload-list__item-file-name">{{ item.name }}</span>
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
            <el-input type="textarea" v-model="emailFormDetail.EmailBody" :rows="10" disabled />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-drawer>

</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/user';
import { ElMessage, ElMessageBox } from 'element-plus'
import { getEmailReceivedTagDropdownApi, downloadEmailAttachmentApi } from "@/api/module/email";
import { showEmailApi, getTaskListApi, exportExcelApi,exportSelDataExcelApi, copyTaskApi, deleteTaskApi, getProdTypeApi, getBussTypesApi,bindEmailsApi } from "@/api/module/task";
import { exportFile } from "@/utils/downloadFile";
import { useAuthStore } from '@/stores/modules/auth'
import { getDefaultDateRange ,arrayBufferToString} from '@/utils/index'
console.log(getDefaultDateRange())
const authStore = useAuthStore();
const router = useRouter()
const userStore = useUserStore()
const handleAddTask = () => {
  router.push({ name: 'taskDetail' })
}
const drawer = ref(false)

type attach = {
  name: string;
  size: number;
  type: string;
  url: string;
}

const emailFormDetail = ref({
  SendUser: "",
  EmailSubject: "",
  Tags: [],
  productType: "",
  businessType: "",
  EmailBody: "",
  EmailStatus: "",
  toRecipients: "",
  ccRecipients: "",
  attachlist: [],
  attachmentList: [] as attach[],
  AttachCount: 0,
});

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

const formatChangeType = (flag: string) => {
  switch (flag) {
    case '0':
      return 'success'
    case '1':
      return 'danger'
    case '3':
      return 'info'
    case '9':
      return 'danger'
    default:
      return 'primary'
  }
}

const formatChangeStatusFlag = (flag: string) => {
  switch (flag) {
    case '0':
      return '正常'
    case '1':
      return '正常'
    case '3':
      return '正常'
    case '9':
      return '软删除'
    default:
      return flag
  }
}

const formatChangeStatusType = (flag: string) => {
  switch (flag) {
    case '0':
      return 'success'
    case '1':
      return 'success'
    case '3':
      return 'success'
    case '9':
      return 'danger'
    default:
      return 'primary'
  }
}

const handlePageChange = (pageNum: number,pageSize:number) => {
  form.value.pageNum = pageNum
  form.value.pageSize = pageSize
  getTaskList()
}

const handlePreviewEmail = async () => {
  if (!emailForm.value.emailIds) {
    ElMessage.warning('请先确认邮件流水号！')
    return
  }
  const res = await showEmailApi({
    Num: emailForm.value.emailIds,
  })
  if (res.ResultFlag == '0') {
    console.log(res.ResultSet)
    emailFormDetail.value = JSON.parse(res.ResultSet)
    drawer.value = true
  } else {
    ElMessage.error(res.ResultSet)
  }
}

const handleDeleteTask = () => {
  if (selectedEmails.value.length === 0) {
    ElMessage.warning('请选择要删除的邮件')
    return
  }
  
  ElMessageBox.confirm('确定删除选中的邮件吗？', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    // 确认删除
    const res = await deleteTaskApi({
      ID: selectedEmails.value.map(item => item.ID).join(','),
    })
    if (res.ResultFlag == '0') {
      ElMessage.success('删除成功')
      getTaskList()
    } else {
      ElMessage.error(res.ResultSet)
    }
  }).catch(() => {
    // 取消删除
  })
}

const assignFormTagOptions = ref([]);
const getEmailTagDropdown = async () => {
  const { ResultFlag, ResultSet } = await getEmailReceivedTagDropdownApi()
  if (ResultFlag == '0') {
    assignFormTagOptions.value = JSON.parse(ResultSet)
  }
}

/**
 * @name 导出数据
 */
const handleExport = async () => {
  
  const res = await exportExcelApi({
    SerNum: form.value.SerNum || '',
    Title: form.value.Title || '',
    ProType: form.value.ProductType || '',
    ProName: form.value.ProductName || '',
    BusType: form.value.BusinessType || '',
    sTime: form.value.sTime || '',
    eTime: form.value.eTime || '',
    tag: form.value.tag || '',
    status: form.value.status || '',
    User: userStore.userInfo.UserName,
    yjsTime: form.value.yjsTime || '',
    yjeTime: form.value.yjeTime || ''
  })
    // ArrayBuffer转字符串
  const arrayBuffer = res.data || res.ResultSet || res; // 选择实际返回的二进制数据字段
  if(arrayBufferToString(arrayBuffer)){
    exportFile(arrayBuffer, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", `任务清单_${new Date().getTime()}.xlsx`);
  }
  
  getTaskList()
}

const exportPartSelectData = async () => {
  if(selectedEmails.value.length===0){
    ElMessage.warning('请选择要导出的任务')
    return
  }
  let ids = selectedEmails.value.map(item => item.ID)
  const res = await exportSelDataExcelApi({
    IDs: ids.join(','),
    User: userStore.userInfo.UserName
  })
   // ArrayBuffer转字符串
  const arrayBuffer = res.data || res.ResultSet || res; // 选择实际返回的二进制数据字段
  if(arrayBufferToString(arrayBuffer)){
    exportFile(arrayBuffer, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", `任务清单_${new Date().getTime()}.xlsx`);
  }
  
  getTaskList()
}


/**
 * @name 下载邮件附件
 */
const handleDownloadAttachment = async (item: any) => {
  const { ResultFlag, ResultSet } = await downloadEmailAttachmentApi({ attachId: item.attachId })
  if (ResultFlag == '0') {
    ElMessage.success('下载成功')
  } else {
    ElMessage.error('下载失败')
  }
}



const selectedEmails = ref([] as any[])

const handleSelectionChange = (val: any[]) => {
  selectedEmails.value = val
}
const copyEmailDialog = ref(false)

const copyEmail = ref({
  Number: 1
})

const emailForm = ref({
  emailIds: ''
})

const handleSortChange = (sort: any) => {
  form.value.Field = sort.prop
  form.value.Sort = sort.order === 'ascending' ? 'asc' : 'desc'
  getTaskList()
}

const showAddEmailDialog = ref(false)
const handleAddEmail = () => {
  if (selectedEmails.value.length === 0) {
    ElMessage.warning('请选择要关联的任务')
    return
  }
  showAddEmailDialog.value = true
}

const handleRelatedEmail = async () => {
  if (selectedEmails.value.length === 0) {
    ElMessage.warning('请选择要关联的任务')
    return
  }
  let ids = selectedEmails.value.map(item => item.ID)
  let { ResultFlag, ResultSet } = await bindEmailsApi({
    taskIds: ids,
    receivedId: emailForm.value.emailIds,
    User: userStore.userInfo.UserName
  })
  if (ResultFlag == '0') {
    ElMessage.success('关联成功')
    getTaskList()
  } else {
    ElMessage.error(ResultSet)
  }
  showAddEmailDialog.value = true
}

const handleCopy = () => {
  if (selectedEmails.value.length === 0) {
    ElMessage.warning('请选择要复制的邮件')
    return
  }
  if (selectedEmails.value.length > 1) {
    ElMessage.warning('只能选择一条邮件复制')
    return
  }
  copyEmailDialog.value = true

}

/**
 * @name 复制邮件
 */
const handleCopyEmail = async () => {
  if (copyEmail.value.Number > 99) {
    ElMessage.warning('最多复制99条')
    return
  }
  const res = await copyTaskApi({
    ID: selectedEmails.value[0].ID,
    copyCount: copyEmail.value.Number,
    User: userStore.userInfo.UserName
  })
  if (res.ResultFlag == '0') {
    ElMessage.success('复制成功')
    copyEmailDialog.value = false
    getTaskList()
  } else {
    ElMessage.error(res.ResultSet)
  }
}


const handleEmailDetail = (id: string) => {
  // 返回列表页面时需要保持原来设置的查询参数。
  let query = {
    SerNum: form.value.SerNum || '',
    Title: form.value.Title || '',
    ProductType: form.value.ProductType || '',
    ProductName: form.value.ProductName || '',
    BusinessType: form.value.BusinessType || '',
    sTime: form.value.sTime || '',
    eTime: form.value.eTime || '',
    yjsTime: form.value.yjsTime || '',
    yjeTime: form.value.yjeTime || ''
  }

  router.push({ path: '/taskDetail', query: { id, ...query } })
}

const handleQuery = () => {
  console.log(form.value)
  getTaskList()
}

const STORAGE_KEY = 'task_list_query_form'

const form = ref({
  SerNum: "",
  Title: "",
  ProductType: "",
  ProductName: "",
  BusinessType: "",
  sTime: '',
  eTime: '',
  yjsTime: getDefaultDateRange()[0],
  yjeTime: getDefaultDateRange()[1],
  tag: "",
  status: "",
  Field: "",
  Sort: "",
  pageNum: 1,
  pageSize: 20,
  ChangeFlag: "",
  
} as any)

/**
 * @name 保存查询条件到 localStorage
 */
const saveFormToStorage = () => {
  try {
    const formData = {
      SerNum: form.value.SerNum,
      Title: form.value.Title,
      ProductType: form.value.ProductType,
      ProductName: form.value.ProductName,
      BusinessType: form.value.BusinessType,
      sTime: form.value.sTime,
      eTime: form.value.eTime,
      yjsTime: form.value.yjsTime,
      yjeTime: form.value.yjeTime,
      tag: form.value.tag,
      status: form.value.status,
      pageSize: form.value.pageSize
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
  } catch (e) {
    console.error('保存查询条件失败:', e)
  }
}

/**
 * @name 从 localStorage 恢复查询条件
 */
const loadFormFromStorage = () => {
  try {
    const storageData = sessionStorage.getItem(STORAGE_KEY)
    if (storageData) {
      const parsedData = JSON.parse(storageData)
      form.value = {
        ...form.value,
        ...parsedData
      }
    }
  } catch (e) {
    console.error('加载查询条件失败:', e)
  }
}

/**
 * @name 清除 sessionStorage 中保存的查询条件
 */
const clearFormStorage = () => {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
    form.value = {
      SerNum: "",
      Title: "",
      ProductType: "",
      ProductName: "",
      BusinessType: "",
      sTime: '',
      eTime: '',
      yjsTime: getDefaultDateRange()[0],
      yjeTime: getDefaultDateRange()[1],
      tag: "",
      status: "",
      Field: "",
      Sort: "",
      pageNum: 1,
      pageSize: 20,
      ChangeFlag: "",
    }
  } catch (e) {
    console.error('清除查询条件失败:', e)
  }
}
const EmailReceivedTime = ref([] as any[])
const total = ref(0)


const tableData = ref([] as any[])

const getTaskList = async () => {
  
  const { ResultFlag, ResultSet, ResultTotal } = await getTaskListApi(form.value)
  if (ResultFlag == '0') {
    tableData.value = JSON.parse(ResultSet)
    total.value = ResultTotal
    // 保存查询条件
    saveFormToStorage()
  } else {
    ElMessage.error(ResultSet)
  }
}

const prodTypeOptions = ref([] as any[])
const bussTypeOptions = ref([] as any[])

/**
 * @name 获取产品类型
 */
const getProdType = async () => {
  const { ResultFlag, ResultSet } = await getProdTypeApi()
  if (ResultFlag == '0') {
    prodTypeOptions.value = JSON.parse(ResultSet)
    form.value.ProductType = prodTypeOptions.value.length > 0 ? prodTypeOptions.value[0].TypeName : ''
    getBussTypes()
  } else {
    ElMessage.error(ResultSet)
  }
}

/**
 * @name 根据产品类型下拉框获取业务类型下拉框
 */
const getBussTypes = async () => {
  if (!form.value.ProductType) {
    return
  }
  let prodTypeId = ''
  prodTypeOptions.value.forEach((item: any) => {
    if (item.TypeName == form.value.ProductType) {
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



onMounted(() => {
  // 先从 localStorage 加载保存的查询条件
  loadFormFromStorage()
  
  // 初始化查询参数（路由参数优先级高于 localStorage）
  let query = router.currentRoute.value.query
  if (Object.keys(query).length > 0) {
    form.value = {
      ...form.value,
      ...query
    }
  }
  
  getTaskList()
  getProdType()
  getEmailTagDropdown()
})



</script>

<style scoped lang="scss">
.task-card {
  background: #fff;
}
.query-form {
  gap: 10px;

  .el-form-item {
    margin-bottom: 0;

    :deep(.el-form-item__label) {
      font-weight: bolder !important;
    }
  }
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-title {
  font-size: 18px;
  font-weight: bold;
}

.el-button {
  min-width: 102px;
}

.task-actions {
  display: flex;
  gap: 10px;
}

.pagination {
  display: flex;
  justify-content: center;
}

.el-table .el-link {
  font-weight: bold;
}

.query-row {
  background-color: #ece9e2;
  padding: 10px 5px;

  .el-col {
    .el-form-item {
      margin-bottom: 0;
      margin-right: 8px !important;
    }

  }
}
</style>