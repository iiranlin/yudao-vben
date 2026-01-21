<script lang="ts" setup>
  import type { VxeTableGridOptions } from '#/adapter/vxe-table';
  import type { ToDealApi } from '#/api/hzerp/pendingTasks/toDeal/index.ts';
  import { ref } from 'vue';
  import { confirm, DocAlert, Page, useVbenModal } from '@vben/common-ui';
  import { DICT_TYPE } from '@vben/constants';
  import { getDictLabel } from '@vben/hooks';
  import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';
  import { Card, message } from 'ant-design-vue';
  import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
  import {
    getToDealPage,updateToDealStatus
  } from '#/api/hzerp/pendingTasks/toDeal/index.ts';
  import { $t } from '#/locales';

  import { commonGridFormSchema,toDealGridColumns } from '../data';

  /** 审批/反审批操作 */
  async function handlePass(
    row: ToDealApi.ToDeal,
    status: number,
  ) {
    const hideLoading = message.loading({
      // content: `确定要通过${row.id}吗？`,
      content: `确定${status === 20 ? '通过' : '驳回'}该单据吗？`,
      duration: 0,
    });
    try {
      await updateToDealStatus(row.id!, status);
      // message.success(`${row.id}通过成功`);
      message.success(`${status === 20 ? '通过' : '驳回'}成功`);
      handleRefresh();
    } finally {
      hideLoading();
    }
  }
  /** 刷新表格 */
  function handleRefresh() {
    gridApi.query();
  }
  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      schema: commonGridFormSchema(),
    },
    gridOptions:{
      columns: toDealGridColumns(),
      height: 'auto',
      keepSource: true,
      proxyConfig: {
        ajax: {
          query: async ({ page }, formValues) => {
            return await getToDealPage({
              pageNo: page.currentPage,
              pageSize: page.pageSize,
              ...formValues,
            });
          },
        },
      },
      rowConfig: {
        keyField: 'id',
        isHover: true,
      },
      toolbarConfig: {
        refresh: true,
        search: true,
      },
    }} as VxeTableGridOptions<ToDealApi.ToDeal>
  );
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #actions="{ row }">
        <TableAction
          :actions="[
                {
                  label: '修改',
                  type: 'link',
                  danger: true,
                  icon: ACTION_ICON.EDIT,
                  auth: ['hzerp:doneReviewed:edit'],
                  /*popConfirm: {
                    title: `确定要驳回${row.id}吗？`,
                    confirm: handlePass.bind(null, row, row.status === 10 ? 20 : 10),
                  },*/
                },
                 {
                  label: '流程查看',
                  type: 'link',
                  icon: ACTION_ICON.VIEW,
                  auth: ['hzerp:workbench:progressView']
                },
              ]"
        />
      </template>
    </Grid>
  </Page>
</template>
