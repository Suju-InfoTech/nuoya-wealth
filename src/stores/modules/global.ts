import { defineStore } from 'pinia';
import { ref } from 'vue'
import type { GlobalState } from '@/stores/interface';
import piniaPersistConfig from "@/stores/helper/persist";

export const useGlobalStore = defineStore('nuoya-global', {
  state: (): GlobalState => ({
    isCollapse: false
  }),
  getters: {},
  actions: {
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    setCollapse(val: boolean) {
      this.isCollapse = val
    },
  },
  persist: piniaPersistConfig("nuoya-global")
});

