<script lang="ts" setup>
import type { WorkbenchApi } from '#/api/hzerp/workbench';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

const formData = ref<WorkbenchApi.Workbench>();

const [Modal, modalApi] = useVbenModal({
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      formData.value = undefined;
      return;
    }
    // 加载数据
    const data = modalApi.getData<WorkbenchApi.Workbench>();
    if (!data || !data.id) {
      return;
    }
    modalApi.lock();
    try {
      formData.value = data;
    } finally {
      modalApi.unlock();
    }
  },
});
</script>

<template>
  <Modal
    title="报销详情"
    class="w-[1280px]"
    :show-cancel-button="false"
    :show-confirm-button="false"
  >

    <div>
      <h5 class="text-foreground text-lg">基本信息</h5>
      <div class="card-box p-5">
        <div class="mt-4">
          <span class="text-foreground text-sm font-medium leading-6">
              当前状态:{{formData.username}}
          </span>
          <span class="text-foreground text-sm font-medium leading-6">
              报销单号:{{formData.username}}
          </span>
        </div>
        <div class="mt-4">
          <span class="text-foreground text-sm font-medium leading-6">
              单据类型:{{formData.username}}
          </span>
          <span class="text-foreground text-sm font-medium leading-6">
              提交时间:{{formData.username}}
          </span>
        </div>
        <div class="mt-4">
          <span class="text-foreground text-sm font-medium leading-6">
              报销人:{{formData.username}}
          </span>
          <span class="text-foreground text-sm font-medium leading-6">
              报销人部门:{{formData.username}}
          </span>
        </div>
        <div class="mt-4">
          <span class="text-foreground text-sm font-medium leading-6">
              归属公司:{{formData.username}}
          </span>
          <span class="text-foreground text-sm font-medium leading-6">
              归属项目:{{formData.username}}
          </span>
        </div>
        <div class="mt-4">
          <span class="text-foreground text-sm font-medium leading-6">
              总金额:{{formData.username}}
          </span>
          <span class="text-foreground text-sm font-medium leading-6">
              报销事由:{{formData.username}}
          </span>
        </div>
      </div>
    </div>
    <div>
      <h5 class="text-foreground text-lg">费用明细</h5>
      <div class="card-box p-5">

        <h5 class="text-foreground text-lg">费用一</h5>
        <div class="card-box p-5">
          
        </div>
      </div>
    </div>
  </Modal>
</template>
