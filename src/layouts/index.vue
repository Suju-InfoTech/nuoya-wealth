<template>
  <el-container class="main-layout">
    <el-aside
      ref="asideRef"
      :width="asideWidth"
      class="aside-wrap"
      @mouseenter="onAsideEnter"
      @mouseleave="onAsideLeave"
      @mousemove="onAsideMove"
    >
      <div class="sider-scroll">
        <el-scrollbar style="height:100%;">
          <Sider :collapsed="isCollapse" />
        </el-scrollbar>
      </div>

      <!-- 固定在侧栏右侧，跟随鼠标垂直位置显示的收起/展开按钮 -->
      <div
        class="sider-top"
        v-show="showCollapseBtn"
        :style="{ top: btnTop, right: btnRight }"
        @click.stop="toggleCollapse"
        :title="isCollapse ? '展开' : '收起'"
      >
        <el-button class="collapse-btn"  circle>
          <el-icon v-if="!isCollapse"><DArrowLeft /></el-icon>
          <el-icon v-else><DArrowRight /></el-icon>
        </el-button>
      </div>
    </el-aside>

    <el-container direction="vertical" style="min-height:100vh">
      <Header />
      <Main />
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import Sider from './components/sider/index.vue'
import Header from './components/header/index.vue'
import Main from './components/Main/index.vue'

import { useGlobalStore } from '@/stores/modules/global'

const store = useGlobalStore()

const minWidth = 90
const fullWidth = 170

const isCollapse = computed(() => store.isCollapse)
let asideWidth = computed(() => `${isCollapse.value ? minWidth : fullWidth}px`)

function toggleCollapse() {
  store.toggleCollapse()
}

// 新增：鼠标跟随显示按钮逻辑
const asideRef = ref<any>(null)
const showCollapseBtn = ref(false)
// btnTop 使用 px 字符串，默认为居中
const btnTop = ref('50%')
// 把按钮稍微显示在侧栏外侧
const btnRight = '-12px'

function onAsideEnter() {
  showCollapseBtn.value = true
}
function onAsideLeave() {
  showCollapseBtn.value = false
}
function onAsideMove(e: MouseEvent) {
  // asideRef 可能是 DOM 元素，也可能是组件实例（组件实例上有 $el）
  const raw = asideRef.value as any
  const asideEl = raw?.$el ?? raw
  if (!asideEl || typeof asideEl.getBoundingClientRect !== 'function') return
  const rect = asideEl.getBoundingClientRect()
  // 计算相对于 aside 的 top，减去按钮半高以让鼠标位于按钮中间
  const btnHalf = 18 // 估算按钮高度的一半
  let top = e.clientY - rect.top - btnHalf
  // clamp 范围，避免超出侧栏
  const maxTop = rect.height - btnHalf * 2
  if (top < 8) top = 8
  if (top > maxTop) top = maxTop
  btnTop.value = `${top}px`
}
</script>

<style scoped lang="scss">
.main-layout {
  background: #fff;
  box-sizing: border-box;
  height: 100%;
}

/* 过渡效果 */
.el-aside {
  transition: width 0.22s ease;
  overflow: visible; /* 允许按钮显示在外侧 */
  position: relative;
}

/* 保证最小宽度可用（element 会按 width 设置） */
.aside-wrap {
  min-width: 90px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 收起/展开按钮：相对于侧栏定位，默认隐藏，仅在 hover 时显示，跟随鼠标垂直位置 */
.sider-top {
  position: absolute;
  /* top 动态通过行内样式设置 */
  /* right 动态通过行内样式设置（负值时显示在侧栏外侧） */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2px;
  background: transparent;
  z-index: 30;
  pointer-events: auto;
  transition: opacity 0.18s ease, transform 0.12s ease;
  opacity: 0;
  transform: translateX(6px);
}
/* v-show 切换时用 opacity 控制显隐 */
.sider-top[v-cloak], .sider-top[style*="display: none"] {
  opacity: 0 !important;
}
.sider-top[style] {
  /* when shown, set opacity via v-show (handled by Vue) - ensure visible */
  opacity: 1;
  transform: translateX(0);
}

.collapse-btn {
  padding: 4px;
  height: 36px;
  line-height: 36px;
  border-radius: 4px;
}

/* 滚动区域占剩余空间 */
.sider-scroll {
  flex: 1;
  min-width: 0;
}
</style>