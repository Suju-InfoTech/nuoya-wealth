<template>
  <template v-for="subItem in menuList" :key="subItem.path">
    <el-sub-menu v-if="subItem.children?.length" :index="subItem.path">
      <template #title>
        <template v-if="isCollapse">
          <el-tooltip effect="dark" :content="subItem.meta.title" placement="right">
            <div class="title-inner">
              <el-icon v-if="subItem.meta.icon">
                <component :is="subItem.meta.icon"></component>
              </el-icon>
              <span v-else class="sle">{{ subItem.meta.title }}</span>
            </div>
          </el-tooltip>
        </template>
        <template v-else>
          <el-icon v-if="subItem.meta.icon">
            <component :is="subItem.meta.icon"></component>
          </el-icon>
          <span class="sle">{{ subItem.meta.title }}</span>
        </template>
      </template>
      <SubMenu :menu-list="subItem.children" />
    </el-sub-menu>

    <el-menu-item v-else :index="subItem.path" @click="handleClickMenu(subItem)">
      <template v-if="isCollapse">
        <el-tooltip effect="dark" :content="subItem.meta.title" placement="right">
          <div class="title-inner">
            <el-icon v-if="subItem.meta.icon">
              <component :is="subItem.meta.icon"></component>
            </el-icon>
            <span v-else class="sle">{{ subItem.meta.title }}</span>
          </div>
        </el-tooltip>
      </template>
      <template v-else>
        <el-icon v-if="subItem.meta.icon">
          <component :is="subItem.meta.icon"></component>
        </el-icon>
        <span class="sle">{{ subItem.meta.title }}</span>
      </template>
    </el-menu-item>
  </template>
</template>


<script setup lang="ts" name="SubMenu">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalStore } from '@/stores/modules/global'

defineProps<{ menuList: Menu.MenuOptions[] }>()

const router = useRouter()
const global = useGlobalStore()
const isCollapse = computed(() => global.isCollapse)

const handleClickMenu = (subItem: Menu.MenuOptions) => {
  if (subItem.meta.isLink) return window.open(subItem.meta.isLink, '_blank')
  router.push(subItem.path)
}
</script>

<style lang="scss">
.el-sub-menu .el-sub-menu__title:hover {
  color: var(--el-menu-hover-text-color) !important;
  background-color: transparent !important;
}

.el-menu--collapse {
  .is-active {
    .el-sub-menu__title {
      color: #ffffff !important;
      background-color: var(--el-color-primary) !important;
    }
  }
}

.el-menu-item {
  &:hover {
    color: var(--el-menu-hover-text-color);
  }

  &.is-active {
    color: var(--el-menu-active-color) !important;
    background-color: var(--el-menu-active-bg-color) !important;

    &::before {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 4px;
      content: "";
      background-color: var(--el-color-primary);
    }
  }
}

.vertical,
.classic,
.transverse {
  .el-menu-item {
    &.is-active {
      &::before {
        left: 0;
      }
    }
  }
}

.columns {
  .el-menu-item {
    &.is-active {
      &::before {
        right: 0;
      }
    }
  }
}

/* 隐藏折叠菜单下的文字，保证布局 */
.title-inner {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 当折叠时隐藏文字（.sle 仅在非折叠时显示，模板里已控制） */
.sle {
  white-space: nowrap;
}
</style>
