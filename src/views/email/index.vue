<template>
  <div class="main-content">
    <div class="top-bar">
      <div class="tabs-container">
        <div class="tabs-scroll" ref="tabsScrollRef">
          <div class="email-tabs" role="tablist">
            <div class="email-tab" v-for="(email, idx) in emailTabs" :key="email.ID"
              :class="{ active: activeTab === email.ID }" draggable="true" @dragstart="onDragStart($event, idx)"
              @dragover.prevent="onDragOver($event, idx)" @drop.prevent="onDrop($event, idx)"
              @click="changeTab(email.ID, email)" role="tab" :aria-selected="activeTab === email.ID">
              {{ email.Email }}
              <!-- <el-badge class="mark" :value="email.total" /> -->
              <el-badge v-if="email.UnprocessedCount && email.UnprocessedCount > 0" class="mark" :value="email.UnprocessedCount"  />
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：固定操作区 -->
      <div class="header-row">
        <el-button type="primary" plain style="margin-left: 10px;" @click="onExport"
          v-if="authStore.isEmailExport">导出</el-button>
        <el-button type="primary" plain style="margin-left: 10px;" @click="onAssociateTask">关联任务</el-button>
        <span>收取时间：</span>
        <el-select v-model="queryForm.timeRange" style="width: 120px;">
          <el-option label="1天" value="1天" />
          <el-option label="7天" value="7天" />
          <el-option label="15天" value="15天" />
        </el-select>
        <el-button type="primary" plain style="margin-left: 10px;" @click="onManualCollection">手工收取</el-button>
      </div>
    </div>

    <!-- 隐藏 element-plus 自带头部，保留 el-tabs 管理内容切换 -->
    <el-tabs type="border-card" v-model="activeTab" class="with-hidden-header">
      <el-tab-pane v-for="email in emailTabs" :key="email.ID" :label="email.Email" :name="email.ID">

        <div class="query-row">
          <el-form :model="email.query" :inline="true" class="query-form" style="width: 100%;">
            <el-row class="query-row" style="width: 100%;" :gutter="20">
              <el-col :span="6">
                <el-form-item label="文件夹" prop="Folder" style="width: 100%;">
                  <el-select v-model="email.query.Folder" multiple collapse-tags
      collapse-tags-tooltip clearable placeholder="请选择" style="width: 100%;">
                    <el-option v-for="value in email.folderList" :key="value" :label="value" :value="value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="关键字" prop="title" style="width: 100%;" :label-width="69">
                  <el-input v-model="email.query.title" clearable style="width: 100%;" placeholder="流水号/邮件标题" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="开始日期" prop="sTime" style="width: 100%;">
                  <el-date-picker v-model="email.query.sTime" placeholder="请输入开始日期" type="datetime"
                    value-format="YYYY-MM-DD HH:mm:ss" clearable style="width: 100%;"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="结束日期" prop="eTime" style="width: 100%;">
                  <el-date-picker v-model="email.query.eTime" placeholder="请输入结束日期" type="datetime"
                    value-format="YYYY-MM-DD HH:mm:ss" clearable style="width: 100%;"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="query-row" style="width: 100%;" :gutter="20">
              <el-col :span="6">
                <el-form-item label="发件人" prop="sender" style="width: 100%;">
                  <el-input v-model="email.query.sender" clearable style="width: 100%;" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="标签查询" prop="tag" style="width: 100%;">
                  <el-select v-model="email.query.tag" clearable placeholder="请选择" style="width: 100%;">
                    <el-option v-for="value in assignFormTagOptions" :key="value" :label="value" :value="value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="邮件状态" prop="status" style="width: 100%;">
                  <el-select v-model="email.query.status" clearable placeholder="请选择" style="width: 100%;">
                    <el-option v-for="value in emailStatusOptions" :key="value.value" :label="value.label"
                      :value="value.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4" :offset="2">
                <el-button type="primary" plain @click="onSearch(email)">查询 </el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <!-- 邮件列表表格 -->
        <el-table :data="email.listData" style="width: 100%; margin-top: 10px; height:calc(100vh - 355px)" border
          :header-cell-style="{ background: '#ece9e2', color: '#333', fontWeight: 'bold', textAlign: 'center' }"
          :cell-style="{ textAlign: 'center', padding: '8px 0' }" @selection-change="handleSelectionChange"
          @sort-change="handleSortChange">
          <el-table-column type="selection" width="55" fixed="left" />
          <el-table-column type="index" label="序号" width="55" fixed="left" />
          <el-table-column prop="EmailFolder" label="文件夹" width="100" fixed="left" />
          <el-table-column prop="SerialNumber" label="流水号" width="140" fixed="left" sortable>
            <template #default="scope">
              <el-link type="primary" @click="handleClick(scope.row.ID)">{{ scope.row.SerialNumber }}</el-link>
            </template>
          </el-table-column>

          <el-table-column prop="ReceivedTime" label="电邮收到时间" width="160" sortable />
          <el-table-column prop="Email" label="电邮发送人" width="140" sortable />
          <el-table-column prop="EmailSubject" label="邮件标题" width="330" sortable>
            <template #default="scope">
              <el-popover placement="top-start" :width="330" trigger="hover" :content="scope.row.EmailSubject">
                <template #reference>
                  <el-text :line-clamp="2" style="text-align: left;">
                    {{ scope.row.EmailSubject }}
                  </el-text>
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="Tags" label="标签" width="120" sortable />
          <el-table-column prop="AttachCount" label="附件数量" width="120" sortable />
          <el-table-column prop="EmailStatus" label="状态" width="100">
            <template #default="scope">
              <el-tag
                :type="scope.row.EmailStatus === '0' ? 'success' : (scope.row.EmailStatus === '2' ? 'info' : 'danger')">{{
                  scope.row.EmailStatus === '0' ? '未处理' : (scope.row.EmailStatus === '2' ? '无需处理' : '已处理') }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="EmailRemark" label="备注" width="100" />
          <el-table-column prop="Rules" label="命中规则" width="180"  />
          <el-table-column prop="UpdateTime" label="更新时间" width="180" />

          <el-table-column prop="TaskCount" label="关联任务数量" min-width="150" fixed="right">
            <template #default="scope">
              <el-badge :value="scope.row.TaskCount" class="item" type="primary" :offset="[2, 8]">
                <el-button type="primary" plain size="small" @click="handleClick(scope.row.ID)">查看任务</el-button>
              </el-badge>

            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination">
          <el-pagination background layout="sizes,prev, pager, next,total" :total="email.total"
            v-model:page-size="email.pageSize" style="margin-top: 20px;" :page-sizes="[20, 50, 100, 200]"
            v-model:current-page="email.pageNum" @change="(pageNum, pageSize) => {
              email.pageNum = pageNum
              email.pageSize = pageSize
              getEmailReceivedList(email.ID, email)
            }" />
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog title="关联任务" v-model="dialogVisible" width="25%">
      <el-form :model="form" label-width="auto" :inline="true">
        <el-form-item label="任务流水号：">
          <el-input v-model="form.receivedIds" placeholder="请输入任务流水号" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearchTask">查询任务</el-button>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer" style="display: flex; justify-content: center; gap: 10px;">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onBindTask">确 定</el-button>
          <el-button type="primary" @click="onCreateTask">新建任务</el-button>
        </span>
      </template>
    </el-dialog>


    <el-drawer v-model="drawer" title="I am the title" :with-header="false">
      <el-form :model="taskFormDetail" label-width="120px" class="detail-form" label-position="left"
        require-asterisk-position="right" ref="taskFormDetailRef">
        <el-row>
          <el-col>
            <el-form-item label="任务名称" required prop="TaskTitle">
              <el-input v-model="taskFormDetail.TaskTitle" :disabled="!createTask" />
            </el-form-item>
          </el-col>

        </el-row>
        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item label="产品名称" required prop="ProductName">
              <el-select v-model="taskFormDetail.ProductName" filterable placeholder="请选择" @change="getAdminNos"
                :disabled="!createTask">
                <el-option v-for="item in prodNameOptions" :key="item.TypeId" :label="item.TypeName"
                  :value="item.TypeName" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item label="管理人批次" required prop="BatchNum">
              <el-select v-model="taskFormDetail.BatchNum" filterable placeholder="请选择" :disabled="!createTask">
                <el-option v-for="item in getAdminNosOptions" :key="item.BatchNum" :label="item.BatchNum"
                  :value="item.BatchNum" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item label="PN号" required prop="PNnum">
              <el-input v-model="taskFormDetail.PNnum" :disabled="!createTask" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item label="产品类型" required prop="ProductType">
              <el-select v-model="taskFormDetail.ProductType" filterable placeholder="请选择" :disabled="!createTask"
                @change="getBussTypes">
                <el-option v-for="item in prodTypeOptions" :key="item.TypeId" :label="item.TypeName"
                  :value="item.TypeName" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item label="业务类型" required prop="BusinessType">
              <el-select v-model="taskFormDetail.BusinessType" filterable placeholder="请选择" :disabled="!createTask">
                <el-option v-for="item in bussTypeOptions" :key="item.BussinessType" :label="item.BussinessType"
                  :value="item.BussinessType" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item label="标签">
              <el-select v-model="taskFormDetail.Tags" filterable multiple placeholder="请选择" prop="Tags"
                :disabled="!createTask">
                <el-option v-for="value in assignFormTagOptions" :key="value" :label="value" :value="value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item label="Maker/处理人" required prop="Maker" :disabled="!createTask">
              <el-input v-model="taskFormDetail.Maker" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item label="备注" prop="TaskRemark">
              <el-input type="textarea" v-model="taskFormDetail.TaskRemark" :rows="3" :disabled="!createTask" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer v-if="createTask">
        <div class="flex justify-center gap-2" style="display: flex; justify-content: center;">
          <el-button type="primary" @click="handleAssignSubmit">确定</el-button>
          <el-button @click="drawer = false">取消</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { useTabsStore } from '@/stores/modules/tabs'
import { useUserStore } from '@/stores/modules/user'
import { getProdTypeApi, getBussTypesApi, addTaskApi } from "@/api/module/task";
import { getEmailReceivedBindTasksApi, getFolderDropdownApi, showTaskApi, getProdNamesApi, getAdminNosApi, getEmailReceivedListApi, getEmailListApi, getEmailReceivedDeleteApi, getEmailReceivedManualCollectionApi, getEmailReceivedTagDropdownApi, getEmailReceivedExportExcelApi, getUnprocessedCountApi } from '@/api/module/email'
import { exportFile } from '@/utils/downloadFile'
import { useAuthStore } from '@/stores/modules/auth'
import { getDefaultDateRange } from '@/utils/index'
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const tabsStore = useTabsStore()
const userStore = useUserStore()
// 使用 store 中的 tabs 顺序
const emailTabs = computed(() => tabsStore.emailTabs)
const activeTab = ref(emailTabs.value[0]?.ID ?? null)
const drawer = ref(false)
const taskFormDetailRef = ref()

// 保证当 store 中 tabs 改变时 activeTab 有效（例如首个被移走时）
watch(emailTabs, (newTabs) => {
  nextTick(updateScrollState)
})

const onBindTask = async () => {
  let isBindTask = false
  emailMultiSelect.value[activeTab.value].forEach((item: any) => {
    if (item.TaskCount > 0) {
      isBindTask = true
    }
  })
  if (isBindTask) {
    ElMessageBox.confirm('选择的邮件有已绑定的任务，是否需要取消当前操作？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      let { ResultFlag: rf, ResultSet: rs } = await getEmailReceivedBindTasksApi({
        receivedIds: emailMultiSelect.value[activeTab.value].map(row => row.ID),
        taskId: form.value.receivedIds,
        User: userStore.userInfo.UserName,
      })
      if (rf == '0') {
        ElMessage.success('绑定成功')
        dialogVisible.value = false
        form.value.receivedIds = ''
        drawer.value = false
      } else {
        ElMessage.error(rs)
      }
    }).catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消操作',
      })
    })
  } else {
    let { ResultFlag: rf, ResultSet: rs } = await getEmailReceivedBindTasksApi({
      receivedIds: emailMultiSelect.value[activeTab.value].map(row => row.ID),
      taskId: form.value.receivedIds,
      User: userStore.userInfo.UserName,
    })
    if (rf == '0') {
      ElMessage.success('绑定成功')
      dialogVisible.value = false
      form.value.receivedIds = ''
      drawer.value = false
    } else {
      ElMessage.error(rs)
    }
  }

}

const changeTab = async (tabId: number, email: any) => {
  activeTab.value = tabId
  await getFolderDropdown(tabId)
  getEmailReceivedList(tabId, email)
}

const handleSortChange = (sort: any) => {

  let email = tabsStore.emailTabs.find((t) => t.ID === activeTab.value)
  if (!email) return
  email.query.Field = sort.prop ?? ''
  email.query.Sort = sort.order === 'ascending' ? 'asc' : 'desc'
  activeTab.value = email.ID ?? ''
  getEmailReceivedList(activeTab.value, email)
}

const assignFormTagOptions = ref([]);
const getEmailTagDropdown = async () => {
  const { ResultFlag, ResultSet } = await getEmailReceivedTagDropdownApi()
  if (ResultFlag == '0') {
    assignFormTagOptions.value = JSON.parse(ResultSet)
  }
}

const emailStatusOptions = ref([
  { label: '未处理', value: '0' },
  { label: '已处理', value: '1' },
  { label: '无需处理', value: '2' },
])

const taskFormDetail = ref({
  TaskTitle: "",
  ProductType: "",
  ProductName: "",
  BusinessType: "",
  BatchNum: "",
  PNnum: "",
  Tags: '' as string | Array<string>,
  Maker: "",
  TaskRemark: "",
  CreateUser: userStore.userInfo.UserName
})

const onExport = async () => {
  const email = tabsStore.emailTabs.find((t) => t.ID === activeTab.value)
  if (!email) {
    ElMessage.error('未选择邮箱或邮箱数据不可用')
    return
  }
  const res = await getEmailReceivedExportExcelApi({
    ID: email.ID,
    subject: email.query?.title ?? '',
    sender: email.query?.sender ?? '',
    sTime: email.query?.sTime || '',
    eTime: email.query?.eTime || '',
    tag: email.query?.tag ?? '',
    status: email.query?.status ?? '',
    Folder: email.query?.Folder?.join(',') ?? '',
  })
  exportFile(res, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", `邮件清单_${Date.now()}.xlsx`);
}

onMounted(async () => {
  getEmailTagDropdown()
  getProdNames()
  getProdType()
  
  let query = { ...route.query }
  console.log(query)
  // 返回时参数自动填充到查询参数中。

  const queryActiveTab = route.query.activeTab as string
  if (queryActiveTab && !isNaN(Number(queryActiveTab))) {
    activeTab.value = Number(queryActiveTab)
  }

  // 先加载邮箱列表
  await getEmailTab()
  
  // 再恢复查询条件
  if (Object.keys(query).length > 0) {
    const { id, emailId, ...restQuery } = query
    console.log(restQuery)
    const emailId_ = emailId ? Number(emailId) : activeTab.value
    if (emailId_) {
      const restQueryObj: any = {}
      // 遍历 restQuery，只保留非 id 和 emailId 的字段
      Object.keys(restQuery).forEach(key => {
        if (key !== 'id' && key !== 'emailId') {
          restQueryObj[key] = restQuery[key]
        }
      })
      if (Object.keys(restQueryObj).length > 0) {
        tabsStore.setTabQuery(emailId_, restQueryObj, false)
        // 恢复查询条件后，重新加载列表
        const email = tabsStore.emailTabs.find(t => t.ID === emailId_)
        if (email) {
          await getEmailReceivedList(emailId_, email)
        }
      }
    }
  }
})

const getEmailReceivedList = async (tabId: number, email: any) => {
  let { ResultFlag: rf, ResultSet: rs, ResultTotal: rt } = await getEmailReceivedListApi({
    EmailId: tabId,
    keyword: email.query.title ?? '',
    Folder: email.query?.Folder?.join(',') ?? '',
    sender: email.query.sender ?? '',
    sTime: email.query.sTime || '',
    eTime: email.query.eTime || '',
    tag: email.query.tag ?? '',
    pageNum: email.pageNum ?? 1,
    pageSize: email.pageSize ?? 20,
    Field: email.query.Field,
    Sort: email.query.Sort,
    status: email.query.status ?? '',
  })
  if (rf !== '0') {
    ElMessage.error(rs || '获取邮箱列表失败')
    return
  }
  const list = Array.isArray(rs) ? rs : (JSON.parse(rs || '[]') || [])

  // 获取未处理邮件数
  let unprocessedCount = email.UnprocessedCount ?? 0
  try {
    const { ResultFlag: countFlag, ResultSet: countData } = await getUnprocessedCountApi({
      sTime: email.query.sTime || '',
      eTime: email.query.eTime || ''
    })
    if (countFlag === '0' && countData) {
      const unprocessedList = Array.isArray(countData) ? countData : JSON.parse(countData || '[]')
      const item = unprocessedList.find((u: any) => u.EmailID === tabId)
      if (item) {
        unprocessedCount = item.UnprocessedCount
      }
    }
  } catch (err) {
    console.warn('获取未处理邮件数失败:', err)
  }

  tabsStore.setTabData(tabId, { listData: list, total: Number(rt) || 0, pageNum: email.pageNum || 1, pageSize: email.pageSize || 20, UnprocessedCount: unprocessedCount })

}


// 获取 tabs 并为每个 tab 拉取对应列表数据（并写入 store）
const getEmailTab = async () => {
  try {
    let { ResultFlag, ResultSet } = await getEmailListApi()
    if (ResultFlag !== '0') {
      ElMessage.error(ResultSet || '获取邮箱列表失败')
      return
    }

    const fetched = Array.isArray(ResultSet) ? ResultSet : (JSON.parse(ResultSet || '[]') || [])
    const stored = tabsStore.emailTabs || []
    let merged: any[] = []

    if (stored && stored.length > 0) {
      const fetchedMap = new Map<number, any>()
      fetched.forEach((f: any) => fetchedMap.set(f.ID, f))
      stored.forEach((s: any) => {
        const f = fetchedMap.get(s.ID)
        if (f) {
          const preserved = { ...f }
          const local = stored.find(t => t.ID === s.ID) as any || {}
          preserved.pageNum = local?.pageNum ?? preserved.pageNum ?? 1
          preserved.pageSize = local?.pageSize ?? preserved.pageSize ?? 10
          preserved.total = local?.total ?? preserved.total ?? 0
          preserved.listData = local?.listData ?? preserved.listData ?? []
          // 直接用本地 query
          preserved.query = local?.query ?? preserved.query
          merged.push(preserved)
          fetchedMap.delete(s.ID)
        }
      })
      for (const v of fetchedMap.values()) {
        merged.push({
          ...v,
          pageNum: v.pageNum ?? 1,
          pageSize: v.pageSize ?? 10,
          total: v.total ?? 0,
          query: v.query ?? { title: '', sTime: getDefaultDateRange()[0], eTime: getDefaultDateRange()[1], sender: '', tag: '', status: '', Field: '', Sort: '', Folder: [] },
          listData: v.listData ?? []
        })
      }
    } else {
      merged = fetched.map((v: any) => ({
        ...v,
        pageNum: v.pageNum ?? 1,
        pageSize: v.pageSize ?? 10,
        total: v.total ?? 0,
        query: v.query ?? { title: '', sTime: getDefaultDateRange()[0], eTime: getDefaultDateRange()[1], sender: '', tag: '', status: '', Field: '', Sort: '', Folder: [] },
        listData: v.listData ?? []
      }))
    }

    // 获取所有邮箱的未处理邮件数
    try {
      const { ResultFlag: countFlag, ResultSet: countData } = await getUnprocessedCountApi({
        sTime: getDefaultDateRange()[0],
        eTime: getDefaultDateRange()[1]
      })
      console.log('未处理邮件数接口返回:', { countFlag, countData })
      if (countFlag === '0' && countData) {
        const unprocessedList = Array.isArray(countData) ? countData : JSON.parse(countData || '[]')
        const countMap = new Map<number, number>()
        unprocessedList.forEach((item: any) => {
          countMap.set(item.EmailID, item.UnprocessedCount)
        })
        // 为每个 tab 添加对应的 UnprocessedCount
        merged = merged.map((tab: any) => ({
          ...tab,
          UnprocessedCount: countMap.get(tab.ID) ?? 0
        }))
      }
    } catch (err) {
      console.warn('获取未处理邮件数失败:', err)
    }

    tabsStore.setTabs(merged)

    // 先获取文件夹，再绑定 query.Folder
    const currentTab = tabsStore.emailTabs.find(t => t.ID === activeTab.value) ?? tabsStore.emailTabs[0]
    if (currentTab) {
      await getFolderDropdown(currentTab.ID)
      await getEmailReceivedList(currentTab.ID, currentTab)
      activeTab.value = currentTab.ID
    } else {
      activeTab.value = 0
    }
  } catch (err) {
    console.error('getEmailTab 错误', err)
    ElMessage.error('获取邮箱列表失败')
  }
}


const getFolderDropdown = async (emailId: number) => {
  const { ResultFlag, ResultSet } = await getFolderDropdownApi({ emailID: emailId })
  if (ResultFlag === '0') {
    const folderList = JSON.parse(ResultSet || '[]')
    const email = tabsStore.emailTabs.find((t) => t.ID === emailId)
    if (email) {
      email.folderList = folderList
      // 确保 query 对象存在
      if (!email.query) {
        email.query = { title: '', sTime: getDefaultDateRange()[0], eTime: getDefaultDateRange()[1], sender: '', tag: '', status: '', Field: '', Sort: '', Folder: [] }
      }
      // 回填 query.Folder，只保留 folderList 中存在的值
      if (email.query.Folder) {
        email.query.Folder = email.query.Folder.filter((f: string) => folderList.includes(f))
      } else {
        email.query.Folder = []
      }
    }
  }
}


const emailMultiSelect = ref({})

const form = ref({
  receivedIds: '',
  taskId: 0
})

const onManualCollection = async () => {
  try {
    const { ResultFlag, ResultSet } = await getEmailReceivedManualCollectionApi({ EmailID: activeTab.value, User: userStore.userInfo?.UserName || '' })
    if (ResultFlag === '0') {
      ElMessage.success(ResultSet)
      // 刷新当前 tab 数据
      getEmailReceivedList(activeTab.value, {
        ...tabsStore.emailTabs.find((t) => t.ID === activeTab.value) ?? {},
        pageNum: 1,
        pageSize: 10,
      })
    } else {
      ElMessage.error(ResultSet || '手工收取失败')
    }
  } catch (err) {
    console.error('手工收取失败', err)
    ElMessage.error('手工收取失败')
  }
}

const dialogVisible = ref(false)

// 拖拽索引缓存
let dragIndex = -1
function onDragStart(e: DragEvent, idx: number) {
  dragIndex = idx
  e.dataTransfer?.setData('text/plain', String(idx))
  e.dataTransfer!.effectAllowed = 'move'
}
function onDragOver(e: DragEvent, idx: number) {
  e.preventDefault()
}
function onDrop(e: DragEvent, idx: number) {
  const from = dragIndex >= 0 ? dragIndex : Number(e.dataTransfer?.getData('text/plain') || -1)
  const to = idx
  if (from >= 0 && to >= 0 && from !== to) {
    tabsStore.moveTab(from, to)
  }
  dragIndex = -1
}

// 处理点击事件
function handleClick(id: string) {
  let email = tabsStore.emailTabs.find((t) => t.ID === activeTab.value) ?? {query: {}}
  console.log(email)
  router.push({ name: 'emailDetail', query: { id, emailId: activeTab.value, ...email.query } })
}
const createTask = ref(false)
const onCreateTask = () => {
  taskFormDetail.value = {
    TaskTitle: '',
    ProductType: '',
    ProductName: '',
    BusinessType: '',
    BatchNum: '',
    PNnum: '',
    Tags: [],
    Maker: '',
    TaskRemark: '',
    CreateUser: userStore.userInfo?.UserName || ''
  }
  drawer.value = true
  createTask.value = true
}


const handleAssignSubmit = async () => {
  // 校验表单
  if (!taskFormDetailRef.value.validate()) {
    ElMessage.error('请填写完整信息')
    return
  }

  taskFormDetail.value.Tags = typeof taskFormDetail.value.Tags === 'string' ? taskFormDetail.value.Tags : taskFormDetail.value.Tags.join(';')

  const { ResultFlag, ResultSet, ResultSet1 } = await addTaskApi(taskFormDetail.value)
  if (ResultFlag === '0') {
    ElMessage.success("新增任务成功")
    drawer.value = false
    createTask.value = false
    form.value.receivedIds = ResultSet1
    taskFormDetail.value = {
      TaskTitle: '',
      ProductType: '',
      ProductName: '',
      BusinessType: '',
      BatchNum: '',
      PNnum: '',
      Tags: [],
      Maker: '',
      TaskRemark: '',
      CreateUser: userStore.userInfo?.UserName || ''
    }
  } else {
    ElMessage.error(ResultSet || '新增任务失败')
  }

}

// 查询任务
const onSearchTask = async () => {
  try {
    const { ResultFlag, ResultSet } = await showTaskApi({ Num: form.value.receivedIds })
    if (ResultFlag === '0') {

      taskFormDetail.value = JSON.parse(ResultSet || '{}')
      drawer.value = true
    } else {
      ElMessage.error(ResultSet || '查询任务失败')
    }
  } catch (err) {
    console.error('查询任务失败', err)
    ElMessage.error('查询任务失败')
  }
}

// 关联任务
function onAssociateTask() {
  console.log('关联任务')
  if (Object.keys(emailMultiSelect.value).length == 0 || !emailMultiSelect.value[activeTab.value] || emailMultiSelect.value[activeTab.value].length == 0) {
    ElMessage.error('请选择任务')
    return
  }
  form.value.taskId = emailMultiSelect.value[activeTab.value].map((item: any) => item.id).join(';')
  dialogVisible.value = true
}

// 处理选择变化事件
function handleSelectionChange(selection: any) {
  emailMultiSelect.value[activeTab.value] = selection
}

const queryForm = ref({
  timeRange: '1天'
})

const handleDelete = async (id: number) => {
  ElMessageBox.confirm('确定删除选中的邮件吗？', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const { ResultFlag, ResultSet } = await getEmailReceivedDeleteApi({ ID: id })
      if (ResultFlag === '0') {
        ElMessage.success('删除成功')
        // 刷新当前 tab 数据
        let email = tabsStore.emailTabs.find((t) => t.ID === activeTab.value) ?? { pageNum: 1, pageSize: 10 }

        getEmailReceivedList(activeTab.value, {
          ...email,
          pageNum: email.pageNum,
          pageSize: email.pageSize
        })
      } else {
        ElMessage.error(ResultSet || '删除失败')
      }
    } catch (err) {
      console.error('删除任务失败', err)
      ElMessage.error('删除任务失败')
    }
  })
}

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
    prodTypeOptions.value = JSON.parse(ResultSet)
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
    if (item.TypeName == taskFormDetail.value.ProductType) {
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
    if (item.TypeName == taskFormDetail.value.ProductName) {
      prodTypeId = item.TypeId
    }
  })

  const { ResultFlag, ResultSet } = await getAdminNosApi({
    ProdNameId: prodTypeId
  })
  if (ResultFlag == '0') {
    getAdminNosOptions.value = JSON.parse(ResultSet)
  } else {
    ElMessage.error(ResultSet)
  }
}

const tabsScrollRef = ref<HTMLElement>()
const tabsScrollLeft = ref(0)
const tabsScrollMax = ref(0)
const showScrollButtons = computed(() => tabsScrollMax.value > 0)
const updateScrollState = () => {
  if (tabsScrollRef.value) {
    tabsScrollLeft.value = tabsScrollRef.value.scrollLeft
    tabsScrollMax.value = tabsScrollRef.value.scrollWidth - tabsScrollRef.value.clientWidth
  }
}

const activeTabIndex = computed(() => emailTabs.value.findIndex(t => t.ID === activeTab.value))

function switchTab(direction: 'left' | 'right') {
  const currentIndex = activeTabIndex.value
  let newIndex = currentIndex

  if (direction === 'left') {
    newIndex = Math.max(0, currentIndex - 1)
  } else {
    newIndex = Math.min(emailTabs.value.length - 1, currentIndex + 1)
  }

  if (newIndex !== currentIndex) {
    const newTab = emailTabs.value[newIndex]
    changeTab(newTab.ID, newTab)
    // 切换后滚动到新标签可见
    nextTick(() => {
      const tabElement = document.querySelector(`[data-tab-id="${newTab.ID}"]`) as HTMLElement
      if (tabElement) {
        tabElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    })
  }
}

function onSearch(email: any) {
  // 查询逻辑
  email.pageNum = 1
  getEmailReceivedList(email.ID, email)
}
</script>

<style scoped lang="scss">
.main-content {
  padding: 24px;
  background: #fff;
  position: relative;
}

/* 顶部操作区：flex 布局，左侧滚动标签，右侧固定操作区 */
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  gap: 16px;
}

/* 左侧标签容器：滚动 + 左右按钮 */
.tabs-container {
  flex: 1;
  display: flex;
  align-items: center;
  min-width: 0;
  /* 允许收缩 */
}

.tabs-scroll {
  flex: 1;
  overflow-x: auto;
  scrollbar-width: thin;
  /* Firefox */
  scrollbar-color: #ccc transparent;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
  }
}

.email-tabs {
  display: flex;
  gap: 8px;
  white-space: nowrap;
  min-width: max-content;
  /* 防止收缩 */
}

.email-tab {
  padding: 8px 12px;
  white-space: nowrap;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  background: #f7f7f7;
  cursor: grab;
  user-select: none;
}

.email-tab:active {
  cursor: grabbing;
}

.email-tab.active {
  background: #fff;
  border-bottom: 2px solid #c99b5e;
  color: #1976d2;
  font-weight: bold;
}

.scroll-btn {
  flex-shrink: 0;
  padding: 8px;
  border-radius: 4px;
}

/* 右侧固定操作区 */
.header-row {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 10px;

  .el-button {
    min-width: 102px;
  }
}

/* 隐藏 element-plus 自带的 tabs header */
.with-hidden-header :deep(.el-tabs__header) {
  display: none;
}

/* 原有样式保持不变 */
.el-dialog {
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}

.query-row {
  .el-button {
    min-width: 102px;
  }
}

.email-tabs {
  display: flex;
  margin-bottom: 12px;
}

.email-tab {
  padding: 10px;
  width: auto;
  white-space: nowrap;
  border: 1px solid #dcdcdc;
  border-radius: 4px 4px 0 0;
  background: #f7f7f7;
  cursor: pointer;
  font-weight: bold;
}

.email-tab.active {
  background: #fff;
  border-bottom: 2px solid #c99b5e;
  color: #1976d2;
}

.header-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.query-row {
  background-color: #ece9e2;
}

.query-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px;

  .el-form-item {
    margin-bottom: 0;

    :deep(.el-form-item__label) {
      font-weight: bolder !important;
    }


  }
}



.pagination {
  display: flex;
  justify-content: center;
}
</style>