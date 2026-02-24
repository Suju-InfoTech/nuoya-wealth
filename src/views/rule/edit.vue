<template>
  <div class="rule-edit-page">
    <div class="email-title">
      <div style="line-height: 32px">规则管理邮箱：{{ Eamil }}</div>
      <div>
        <el-button type="primary" @click="handleAcceptEmailDialog" plain>邮件接收设置</el-button>
        <el-button type="warning" @click="handleBackToList" plain>返回上一级</el-button>
      </div>
    </div>
    <div class="section-bar">
      <div style="line-height: 32px">规则管理</div>
      <div>
        <el-button type="primary" plain @click="handleCopyPriority" class="manual-start-btn">复制到</el-button>
        <el-button type="primary" plain @click="handleAddPriority" class="manual-start-btn">新增</el-button>
      </div>
    </div>
    <div style="margin-bottom: 10px; display: flex"></div>
    <div class="queryForm">
      <el-form :inline="true" :model="queryForm">
        <el-form-item label="规则名称" prop="name">
          <el-input v-model="queryForm.name" placeholder="请输入规则名称" style="width: 100%" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="handleSearch" class="manual-start-btn">查询</el-button>
          <el-button type="primary" plain @click="handleResetForm" class="manual-start-btn">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="priorityList" style="width: 100%; margin-bottom: 24px" border
      @selection-change="handleSelectionChange($event)">
      <el-table-column type="selection" width="40" />
      <el-table-column prop="SeqNo" label="优先级" width="80" />
      <el-table-column prop="RuleName" label="字段名称" min-width="180">
        <template #default="scope">
          <el-link type="primary" @click="handleEditField(scope.row.RuleName, scope.row.ID)">{{ scope.row.RuleName
          }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="IsStop" label="是否启用" width="100">
        <template #default="scope">
          <el-switch v-if="scope.row.Email != 'button'" v-model="scope.row.ChangeFlag" class="ml-2" inline-prompt style="
              --el-switch-on-color: #13ce66;
              --el-switch-off-color: #ff4949;
            " active-text="启用" inactive-text="禁用" active-value="0" inactive-value="1" :loading="onSaleLoading"
            :before-change="() => handleChangeFlag(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template #default="scope">
          <el-button type="danger" @click="handleRemovePriority(scope.row)">删除</el-button>
          <el-button type="primary" @click="handleRunPriority(scope.row)">运行</el-button>
          <span v-if="!isSearch" style="margin-left: 10px;">
            <span style="margin-right: 10px" v-if="scope.$index > 0" @click="moveUp(scope.row)"><el-icon color="red">
                <ArrowUpBold />
              </el-icon></span>
            <span style="margin-right: 10px" v-if="scope.$index < priorityList.length - 1"
              @click="moveDown(scope.row)"><el-icon color="red">
                <ArrowDownBold />
              </el-icon></span>
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="UpdateTime" label="更新时间" />
    </el-table>

    <el-dialog v-model="acceptEmailDialog" title="邮件接收到设置" width="860px" :close-on-click-modal="false">
      <div style="padding: 20px">
        <el-form inline style="margin-bottom: 24px" :model="timed" ref="timeForm" :rules="timeRules">
          <el-form-item label="开始日期" prop="startDate">
            <el-date-picker v-model="timed.startDate" value-format="YYYY-MM-DD" type="date" placeholder="开始时间"
              style="width: 140px" />
          </el-form-item>
          <el-form-item label="开始时间" prop="startHour">
            <el-time-picker v-model="timed.startHour" value-format="HH:mm:ss" style="width: 140px" />
          </el-form-item>
          <el-form-item label="间隔时间" prop="intervalHour">
            <el-input v-model="timed.intervalHour" placeholder="小时" style="width: 120px">
              <template #append>分钟</template>
            </el-input>
          </el-form-item>
        </el-form>
        <el-form inline style="margin-bottom: 24px" :model="manual">
          <el-form-item label="开始时间" prop="start">
            <el-date-picker v-model="manual.start" type="date" placeholder="开始时间" style="width: 140px" />
          </el-form-item>
          <el-form-item label="结束时间" prop="end">
            <el-date-picker v-model="manual.end" type="date" placeholder="结束时间" style="width: 140px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain class="manual-start-btn">开始抓取</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" plain class="manual-start-btn" @click="saveAcceptEmail">保存</el-button>
        <el-button plain class="manual-start-btn" @click="handleClose">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog v-model="copyRuleDialog" title="复制邮件规则" width="500px" :close-on-click-modal="false">
      <div style="padding: 20px">
        <el-form inline style="margin-bottom: 24px">
          <el-form-item label="要复制到邮箱" prop="assignFormEmail" style="width: 100%">
            <el-select v-model="assignFormEmail" placeholder="请选择" style="width: 100%">
              <el-option v-for="item in assignFormEmailOptions" :key="item.ID" :label="item.Email" :value="item.ID" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div style="text-align: center;">
          <el-button type="primary" plain class="manual-start-btn" @click="handleSaveCopyPriority">保存</el-button>
          <el-button plain class="manual-start-btn" @click="copyRuleDialog = false, assignFormEmail = ''">取消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="showDialog" title="添加规则" fullscreen :close-on-click-modal="false">
      <el-form :model="form.model" label-width="140px" label-position="right" ref="formEl" :rules="modelRules">
        <el-form-item label="规则名称" prop="RuleName">
          <el-input v-model="form.model.RuleName" />
        </el-form-item>
        <el-form-item label="排序" prop="SeqNo">
          <el-input-number v-model="form.model.SeqNo" :min="1" controls-position="right" />
        </el-form-item>
        <div style="display: flex">
          <div class="sub-title" style="width: 130px; margin-right: 10px">
            规则条件
          </div>
          <div style="flex: 1">
            <el-table :data="form.condModels" border style="margin-bottom: 8px" :header-cell-style="{
              background: '#f4f4f4',
              color: '#333',
              fontWeight: 'bold',
              textAlign: 'center',
            }" :cell-style="{ textAlign: 'center', padding: '8px 0' }">
              <el-table-column prop="RuleField" label="邮件信息">
                <template #default="scope">
                  <el-select v-model="scope.row.RuleField">
                    <el-option v-for="item in emailInfo" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="RuleJudgment" label="判断" width="130">
                <template #default="scope">
                  <el-select v-model="scope.row.RuleJudgment" style="width: 100px">
                    <el-option v-for="item in judgeOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="RuleContent" label="条件">
                <template #default="scope">
                  <el-input v-model="scope.row.RuleContent" type="textarea" />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150">
                <template #default="scope">
                  <el-button type="primary" plain @click="validateCondition(scope.row)" size="small">验证</el-button>
                  <el-button type="danger" plain @click="removeCondition(scope.$index)" size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button type="primary" plain @click="addCondition">新增</el-button>
          </div>
        </div>
        <div style="display: flex; margin-top: 16px">
          <div class="sub-title" style="width: 130px; margin-right: 10px">
            例外条件
          </div>
          <div style="flex: 1">
            <el-table :data="form.exceptCondModels" border style="margin-bottom: 8px" :header-cell-style="{
              background: '#f4f4f4',
              color: '#333',
              fontWeight: 'bold',
              textAlign: 'center',
            }" :cell-style="{ textAlign: 'center', padding: '8px 0' }">
              <el-table-column prop="RuleField" label="邮件信息">
                <template #default="scope">
                  <el-select v-model="scope.row.RuleField">
                    <el-option v-for="item in emailInfo" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="RuleJudgment" label="判断" width="130">
                <template #default="scope">
                  <el-select v-model="scope.row.RuleJudgment" style="width: 100px">
                    <el-option v-for="item in judgeOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="value" label="条件">
                <template #default="scope">
                  <el-input v-model="scope.row.RuleContent" type="textarea"/>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150">
                <template #default="scope">
                  <el-button type="primary" plain @click="validateException(scope.row)" size="small">验证</el-button>
                  <el-button type="danger" plain @click="removeException(scope.$index)" size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button type="primary" plain @click="addException">新增</el-button>
          </div>
        </div>
        <div style="display: flex; margin-top: 16px">
          <div class="sub-title" style="width: 130px; margin-right: 10px">
            操作
          </div>
          <div style="flex: 1">
            <el-table :data="form.operModels" border style="margin-bottom: 8px" :header-cell-style="{
              background: '#f4f4f4',
              color: '#333',
              fontWeight: 'bold',
              textAlign: 'center',
            }" :cell-style="{ textAlign: 'center', padding: '8px 0' }">
              <el-table-column prop="OperationName" label="任务字段" >
                <template #default="scope">
                  <el-select v-model="scope.row.OperationName" @change="handleOperationChange(scope.row, scope.$index)">
                    <el-option v-for="item in optionInfo" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="value" label="值" >
                <template #default="scope">
                  <el-input v-model="scope.row.value" type="textarea" disabled :rows="5" />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150">
                <template #default="scope">
                  <el-button type="primary" plain @click="handleCellClick(scope.row, scope.$index)"
                    size="small">查看</el-button>
                  <el-button type="danger" plain @click="removeAction(scope.$index)" size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button type="primary" plain @click="addAction">新增</el-button>
          </div>
        </div>
        <el-form-item label="匹配该规则后停止" label-width="140px" prop="IsStop">
          <el-checkbox v-model="form.model.IsStop" >匹配该规则后停止</el-checkbox>
        </el-form-item>
        <el-form-item label="备注" prop="Remark">
          <el-input v-model="form.model.Remark" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <el-button type="primary" @click="handleAddRule">保存</el-button>
          <el-button @click="showDialog = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <el-drawer v-model="showAssignDialog" :with-header="false">
      <el-form :model="assignForm" ref="assignFormRef" label-width="120px" label-position="left"
        require-asterisk-position="right" style="padding: 0 30px;" :rules="assignFormRules">
        <el-form-item label="新增任务" prop="TaskTitle">
          <el-input v-model="assignForm.TaskTitle" style="width: 300px;" />
        </el-form-item>
        <el-form-item label="产品名称" prop="ProductName">
          <el-select v-model="assignForm.ProductName" filterable placeholder="请选择" style="width: 300px;" @change="getAdminNos" clearable>
            <el-option v-for="item in prodNameOptions" :key="item.TypeId" :label="item.TypeName"
              :value="item.TypeName" />
          </el-select>
        </el-form-item>
        <el-form-item label="管理人批次" prop="BatchNum"> 
          <el-select v-model="assignForm.BatchNum" filterable placeholder="请选择" style="width: 300px;" clearable>
            <el-option v-for="item in getAdminNosOptions" :key="item.BatchNum" :label="item.BatchNum"
              :value="item.BatchNum" />
          </el-select>
        </el-form-item>
        <el-form-item label="产品类型" prop="ProductType">
          <el-select v-model="assignForm.ProductType" filterable placeholder="请选择" style="width: 300px;" @change="getBussTypes" clearable>
            <el-option v-for="item in prodTypeOptions" :key="item.TypeId" :label="item.TypeName" :value="item.TypeName" />
          </el-select>
        </el-form-item>
        <el-form-item label="业务类型" prop="BusinessType">
          <el-select v-model="assignForm.BusinessType" filterable placeholder="请选择" style="width: 300px;" clearable>
            <el-option v-for="item in bussTypeOptions" :key="item.BussinessType" :label="item.BussinessType"
              :value="item.BussinessType" />
          </el-select>
        </el-form-item>

        <el-form-item label="PN号" prop="PNnum">
          <el-input v-model="assignForm.PNnum" style="width: 300px;" />
        </el-form-item>
        <el-form-item label="任务备注" prop="TaskRemark">
          <el-input type="textarea" v-model="assignForm.TaskRemark" :rows="4" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="flex justify-center gap-2" style="display: flex; justify-content: center;">
          <el-button type="primary" @click="handleAssignSubmit">确定</el-button>
          <el-button @click="showAssignDialog = false">取消</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'
const router = useRouter()
const userStore = useUserStore();
import { ElMessage, ElMessageBox } from 'element-plus'
import { getReceiveEmailApi, getRuleDetailsApi, ruleManApi, runRuleApi, getRuleListApi, receiveEmailApi, copyRuleApi, checkConditionApi, deleteRuleApi, enableDisenableApi, sortRuleApi } from '@/api/module/rule'
import { getEmailListApi, getProdNamesApi, getAdminNosApi } from '@/api/module/email'
import { getProdTypeApi, getBussTypesApi } from "@/api/module/task";
import { validateNoEmpty } from '@/utils/index'
import { de } from 'element-plus/es/locales.mjs';

const EamilID = ref('')
const Eamil = ref('')
const isSearch = ref(false);

interface AssignFormOptios {
  Email: string;
  ID: number;
}

const copyRuleDialog = ref(false);
const assignFormEmailOptions = ref([] as AssignFormOptios[]);
const assignFormEmail = ref('');

const judgeOptions = ref([
  {
    label: '大于',
    value: '0'
  },
  {
    label: '大于等于',
    value: '1'
  },
  {
    label: '小于',
    value: '2'
  },
  {
    label: '小于等于',
    value: '3'
  },
  {
    label: '包含',
    value: '4'
  },
  {
    label: '不包含',
    value: '5'
  },
  {
    label: '等于',
    value: '6'
  },
  {
    label: '不等于',
    value: '7'
  }
])

const emailInfo = ref([
  {
    label: '邮件标题(文本)',
    value: '邮件标题(文本)'
  },
  {
    label: '邮件正文(文本)',
    value: '邮件正文(文本)'
  },
  {
    label: '发件人地址(文本)',
    value: '发件人地址(文本)'
  },
  {
    label: '收件人地址(文本)',
    value: '收件人地址(文本)'
  },
  {
    label: '抄送人地址(文本)',
    value: '抄送人地址(文本)'
  },
  {
    label: '重要性',
    value: '重要性'
  },
  {
    label: '附件(数字)',
    value: '附件(数字)'
  },
  {
    label: '邮件大小(数字，单位KB)',
    value: '邮件大小(数字，单位KB)'
  },
  {
    label: '接收时间(时间)',
    value: '接收时间(时间)'
  },
  {
    label: '邮件标签(数据字典)',
    value: '邮件标签(数据字典)'
  },
])

const optionInfo = ref([
  {
    label: '添加一个任务',
    value: '1'
  },
  {
    label: '无需任务跟踪',
    value: '0'
  }
])
const showAssignDialog = ref(false);



const assignForm = ref({
  ProductName: "",
  BatchNum: "",
  PNnum: "",
  ProductType: "",
  BusinessType: "",
  TaskRemark: "",
  TaskTitle: "",
});
const assignFormRef = ref()

const assignFormRules = ref({
  ProductType: [{ required: true, message: '请选择产品类型', trigger: ['change'] }],
  BusinessType: [{ required: true, message: '请选择业务类型', trigger: ['change'] }],
});

const modelRules = ref({
  RuleName: [{ required: true, message: '请输入规则名称', trigger: ['blur'] }],
  SeqNo: [{ required: true, message: '请输入排序', trigger: ['blur'] }],
})

const selectedEmails = ref([] as any[])

const handleSelectionChange = (val: any[]) => {
  selectedEmails.value = val
}

const queryForm = ref({
  name: ''
})

const handleSearch = () => {
  // 搜索逻辑
  isSearch.value = true
  getRuleList()
}
const handleClose = () => {
  acceptEmailDialog.value = false
  timed.value = {
    startDate: '',
    startHour: '',
    intervalHour: '',
    ID: 0
  }
  manual.value = {
    start: '',
    end: ''
  }
}
const handleResetForm = () => {
  isSearch.value = false
  queryForm.value.name = ''
  getRuleList()
}

// 复制选中的规则优先级
const handleCopyPriority = async () => {
  if (selectedEmails.value.length === 0) {
    ElMessage.warning('请选择要复制的规则')
    return
  }
  copyRuleDialog.value = true

}

const handleSaveCopyPriority = async () => {
  if (assignFormEmail.value.length === 0) {
    ElMessage.warning('请选择要复制到的邮箱')
    return
  }
  const ids = selectedEmails.value.map(item => item.ID)
  const { ResultFlag, ResultSet } = await copyRuleApi({
    RuleIds: ids,
    toEmailId: assignFormEmail.value,
    CreateUser: userStore.userInfo.UserName
  })
  if (ResultFlag === '0') {
    ElMessage.success(ResultSet || '复制成功')
    getRuleList()
  } else {
    ElMessage.error(ResultSet || '复制失败')
  }
}


// 编辑字段名称
const handleEditField = async (field, id) => {
  const { ResultFlag, ResultSet } = await getRuleDetailsApi({ ID: id })

  if (ResultFlag === '0') {
    form.value = JSON.parse(ResultSet)
    form.value.model = form.value.model || {}
    form.value.model.IsStop = form.value.model.IsStop === '1' ? true : false
    for (let i = 0; i < form.value.operModels.length; i++) {
      if (form.value.operModels[i].OperationName === '1') {
        form.value.operModels[i].value = `新增任务：${form.value.operModels[i].Task?.TaskTitle || ''},
产品名称：${form.value.operModels[i].Task?.ProductName || ''},
管理人批次：${form.value.operModels[i].Task?.BatchNum || ''},
产品类型：${form.value.operModels[i].Task?.ProductType || ''},
业务类型：${form.value.operModels[i].Task?.BusinessType || ''},
PN号：${form.value.operModels[i].Task?.PNnum || ''},
任务备注：${form.value.operModels[i].Task?.TaskRemark || ''}`
      }else {
        form.value.operModels[i].value = ''
      }
      
    }

  } else {
    ElMessage.error(ResultSet || '获取规则详情失败')
  }
  showDialog.value = true
}

const handleBackToList = () => {
  router.push({ name: 'rule' })
}
const formEl = ref()

const handleAddRule = async () => {
  // 保存规则逻辑
  const valid = await formEl.value.validate()
  if (!valid) {
    return
  }
  form.value.model.IsStop = form.value.model.IsStop ? '1' : '0'
  for (let i = 0; i < form.value.operModels.length; i++) {
    delete form.value.operModels[i].value;
  }
  const result = validateNoEmpty(form.value);
  if (!result.valid) {
    ElMessage.error(`字段 "${result.key}" 不能为空`);
    return;
  }

  const res = await ruleManApi({ ...form.value })
  if (res.ResultFlag === '0') {
    ElMessage.success('保存成功')
    formEl.value.resetFields()
    showDialog.value = false
    getRuleList()
  } else {
    ElMessage.error(res.ResultSet + '：' + res.ResultSet1 || '保存失败')
  }


}

const acceptEmailDialog = ref(false)
const ruleDetail = ref('')
const handleAcceptEmailDialog = () => {
  if (!EamilID.value) {
    ElMessage.warning('当前无可设置的规则邮箱')
    return
  }
  getReceiveEmail()
  acceptEmailDialog.value = true

}
const timeForm = ref()
const saveAcceptEmail = async () => {
  const valid = await timeForm.value.validate()
  if (!valid) {
    return
  }

  const res = await receiveEmailApi({
    ID: timed.value.ID,
    EmailID: EamilID.value,
    StartTime: timed.value.startDate + ' ' + timed.value.startHour,
    IntervalMinutes: timed.value.intervalHour,
    UpdateUser: userStore.userInfo.UserName,
  })
  if (res.ResultFlag === '0') {
    acceptEmailDialog.value = false
    ElMessage.success(res.ResultSet || '设置成功')
  } else {
    ElMessage.error(res.ResultSet || '设置失败')
  }
}

// 移动规则
const moveUp = async (row) => {
  let res = await sortRuleApi({
    RuleId: row.ID,
    Up: true,
    User: userStore.userInfo.UserName,
  })
  if (res.ResultFlag === '0') {
    ElMessage.success(res.ResultSet || '上移成功')
    getRuleList()
  } else {
    ElMessage.error(res.ResultSet || '上移失败')
  }
}
const moveDown = async (row) => {
  let res = await sortRuleApi({
    RuleId: row.ID,
    Up: false,
    User: userStore.userInfo.UserName,
  })
  if (res.ResultFlag === '0') {
    ElMessage.success(res.ResultSet || '下移成功')
    getRuleList()
  } else {
    ElMessage.error(res.ResultSet || '下移失败')
  }
}

const handleRunPriority = async (row) => {
  let res = await runRuleApi({
    mailbox: Eamil.value,
    RuleID: row.ID,
  })
  if (res.ResultFlag === '0') {
    ElMessage.success(res.ResultSet || '运行成功')
  } else {
    ElMessage.error(res.ResultSet || '运行失败')
  }
}

const handleRemovePriority = (row) => {
  ElMessageBox.confirm('确定删除该规则吗？', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const res = await deleteRuleApi({
      ID: row.ID,
      User: userStore.userInfo.UserName,
    })
    if (res.ResultFlag === '0') {
      ElMessage.success(res.ResultSet || '删除成功')
      getRuleList()
    } else {
      ElMessage.error(res.ResultSet || '删除失败')
    }
  }).catch(() => {
    // 取消删除
  })
}

const handleAssignSubmit = async () => {
  // 分配任务提交逻辑
  const valid = await assignFormRef.value.validate()
  if (!valid) {
    return
  }
  form.value.operModels[optionIndex.value].Task = assignForm.value
  form.value.operModels[optionIndex.value].value = `新增任务：${assignForm.value.TaskTitle},
产品名称：${assignForm.value.ProductName},
管理人批次：${assignForm.value.BatchNum},
产品类型：${assignForm.value.ProductType},
业务类型：${assignForm.value.BusinessType},
PN号：${assignForm.value.PNnum},
任务备注：${assignForm.value.TaskRemark}`
  showAssignDialog.value = false;
}

// 启用/禁用规则
const onSaleLoading = ref(false)
const handleChangeFlag = async (row: any): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    onSaleLoading.value = true
    try {
      const res = await enableDisenableApi({
        ID: row.ID,
        User: userStore.userInfo.UserName
      })
      if (res.ResultFlag === '0') {
        ElMessage.success(res.ResultSet || '操作成功')
        getRuleList()
        resolve(true)
      } else {
        ElMessage.error(res.ResultSet || '操作失败')
        reject(false)
      }
    } catch (error) {
      reject(false)
    } finally {
      onSaleLoading.value = false
    }
  })
}


const optionIndex = ref(-1);
const handleOperationChange = (row, index, OperationForm = {
  ProductName: "",
  BatchNum: "",
  PNnum: "",
  ProductType: prodTypeOptions.value.length > 0 ? prodTypeOptions.value[0].TypeName : "",
  BusinessType: "",
  TaskRemark: "",
  TaskTitle: "",
}) => {
  // 如果有 1 就不能添加 0
  if (form.value.operModels.some(item => item.OperationName === '1')) {
    if (row.OperationName === '0') {
      ElMessage.warning('当前规则已存在分配任务操作，不能添加禁用操作')
      return
    }
  }
  if (row.OperationName === '1') {
    assignForm.value = OperationForm
    optionIndex.value = index;
    showAssignDialog.value = true;
    
  }else {
    form.value.operModels[index].value = ''
  }
  if(assignForm.value.ProductType) getBussTypes();
  if(assignForm.value.ProductName) getAdminNos();
  
}
// 处理单元格点击事件
const handleCellClick = (row, index) => {
  handleOperationChange(row, index, row.Task)
}

const showDialog = ref(false)

interface model {
  EmailID: string;
  ID: string | number;
  RuleName: string;
  SeqNo: string | number;
  IsStop: string | boolean;
  Remark: string;
  CreateUser: string;
}

interface operModels {
  OperationName: string;
  value?: string;
  Task: {
    TaskTitle?: string;
    ProductType?: string;
    ProductName?: string;
    BatchNum?: string;
    PNnum?: string;
    BusinessType?: string;
    TaskRemark?: string;
  } | null;
}

interface Models {
  RuleField: string;
  RuleJudgment: string;
  RuleContent: string;
}

interface formModels {
  condModels: Models[];
  exceptCondModels: Models[];
  operModels: operModels[];
  model: model
}

const form = ref<formModels>({
  condModels: [
    { RuleField: '', RuleJudgment: '', RuleContent: '' },
  ],
  exceptCondModels: [
    { RuleField: '', RuleJudgment: '', RuleContent: '' }
  ],
  operModels: [
    {
      OperationName: '',
      value: '',
      Task: {
        TaskTitle: "",
        ProductType: "",
        ProductName: "",
        BatchNum: "",
        PNnum: "",
        BusinessType: "",
        TaskRemark: ""
      }
    },
  ],
  model: {
    EmailID: EamilID.value,
    ID: 0,
    RuleName: '',
    SeqNo: 1,
    IsStop: true,
    Remark: '',
    CreateUser: userStore.userInfo.UserName
  }
})

// 新增规则优先级
const handleAddPriority = () => {
  if (!EamilID.value) {
    ElMessage.warning('当前无可设置的规则邮箱')
    return
  }
  form.value = {
    condModels: [
      { RuleField: '', RuleJudgment: '', RuleContent: '' },
    ],
    exceptCondModels: [
      { RuleField: '', RuleJudgment: '', RuleContent: '' }
    ],
    operModels: [
      {
        OperationName: '',
        value: '',
        Task: {
          TaskTitle: "",
          ProductType: "",
          ProductName: "",
          BatchNum: "",
          PNnum: "",
          BusinessType: "",
          TaskRemark: ""
        }
      },
    ],
    model: {
      EmailID: EamilID.value,
      ID: 0,
      RuleName: '',
      SeqNo: 1,
      IsStop: true,
      Remark: '',
      CreateUser: userStore.userInfo.UserName
    }
  }
  showDialog.value = true
}

// 新增例外条件
function addException() {
  form.value.exceptCondModels.push({ RuleField: '', RuleJudgment: '', RuleContent: '' })
}
function removeException(idx) {
  form.value.exceptCondModels.splice(idx, 1)

}

function addCondition() {
  form.value.condModels.push({ RuleField: '', RuleJudgment: '', RuleContent: '' })
}
function removeCondition(idx) {
  form.value.condModels.splice(idx, 1)
}
function addAction() {
  form.value.operModels.push({
    OperationName: '',
    value: '',
    Task: {
      TaskTitle: "",
      ProductType: "",
      ProductName: "",
      BatchNum: "",
      PNnum: "",
      BusinessType: "",
      TaskRemark: ""
    }
  })

}
function removeAction(idx) {
  form.value.operModels.splice(idx, 1)
}

const validateCondition = async (condition) => {
  // 验证规则条件逻辑
  if (!condition.RuleContent) {
    ElMessage.warning('请填写完整条件')
    return
  }
  const { ResultFlag, ResultSet } = await checkConditionApi({ Condition: condition.RuleContent })
  if (ResultFlag === '0') {
    ElMessage.success(ResultSet || '验证成功')
  } else {
    ElMessage.error(ResultSet || '验证失败')
  }
}
const validateException = async (exception) => {
  // 验证例外条件逻辑
  if (!exception.RuleContent) {
    ElMessage.warning('请填写完整条件')
    return
  }
  const { ResultFlag, ResultSet } = await checkConditionApi({ Condition: exception.RuleContent })
  if (ResultFlag === '0') {
    ElMessage.success(ResultSet || '验证成功')
  } else {
    ElMessage.error(ResultSet || '验证失败')
  }
}


const priorityList = ref([])

const timed = ref({
  startDate: '',
  startHour: '',
  intervalHour: '',
  ID: 0
})

const timeRules = {
  startDate: [
    { required: true, message: '请选择开始日期', trigger: 'change' }
  ],
  startHour: [
    { required: true, message: '请选择开始时间', trigger: 'change' }
  ],
  intervalHour: [
    { required: true, message: '请输入间隔小时', trigger: 'change' }
  ],
}

const manual = ref({
  start: '',
  end: ''
})


const getRuleList = async () => {
  const { ResultSet, ResultTotal, ResultFlag } = await getRuleListApi({
    emailId: EamilID.value,
    RuleName: queryForm.value.name
  })
  if (ResultFlag === '0') {
    priorityList.value = JSON.parse(ResultSet) || []
  } else {
    ElMessage.error(ResultSet || '获取规则列表失败')
  }
}

const getReceiveEmail = async () => {
  const { ResultSet, ResultTotal, ResultFlag } = await getReceiveEmailApi({
    emailId: EamilID.value
  })
  console.log(ResultSet)
  if (ResultFlag === '0') {
    // Eamil.value = JSON.parse(ResultSet) || ''
    let data = JSON.parse(ResultSet) || {}
    timed.value.startDate = data.StartTime?.split(' ')[0] || ''
    timed.value.startHour = data.StartTime?.split(' ')[1] || ''
    timed.value.intervalHour = data.IntervalMinutes || ''
    timed.value.ID = data.ID || 0
  } else {
    ElMessage.error(ResultSet || '获取邮箱接收规则失败')
  }
}

const getAccountEmail = async () => {
  const { ResultSet, ResultTotal, ResultFlag } = await getEmailListApi()
  if (ResultFlag === '0') {
    assignFormEmailOptions.value = JSON.parse(ResultSet) || []
  } else {
    ElMessage.error(ResultSet || '获取邮箱列表失败')
  }
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
  if(!assignForm.value.ProductType) return;
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
  if(!assignForm.value.ProductName) return;
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
  EamilID.value = router.currentRoute.value.query.id as string || ''
  Eamil.value = router.currentRoute.value.query.email as string || ''
  form.value.model.EmailID = EamilID.value
  getRuleList()
  getReceiveEmail()
  getAccountEmail()
  getProdType()
  getProdNames()
})
</script>

<style scoped lang="scss">
.rule-edit-page {
  padding: 10px 24px 24px 24px;
  background: #fff;
  padding-bottom: 24px;
}

.queryForm {
  background-color: #ece9e2;
  padding: 10px 10px;
  margin-bottom: 15px;

  .el-form {
    .el-form-item {
      margin-bottom: 0px;
    }
  }
}

.email-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
}

.section-bar {
  background: #c99b5e;
  color: #fff;
  font-size: 15px;
  font-weight: bold;
  padding: 6px 16px;
  margin: 24px 0 12px 0;
  border-radius: 2px;
  display: flex;
  justify-content: space-between;

  .el-button {
    min-width: 102px;
  }
}

.manual-start-btn {
  min-width: 102px;
}

.sub-title {
  margin-bottom: 8px;
  margin-top: 8px;
  text-align: right;
}
</style>
