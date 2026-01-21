<script lang="ts" setup>
  import type { VxeTableGridOptions } from '#/adapter/vxe-table';
  import type { ToDealApi } from '#/api/hzerp/pendingTasks/toDeal/index.ts';
  import type { ReceiptAccountApi } from '#/api/hzerp/receiptAccout';
  import { ref } from 'vue';
  import { confirm, DocAlert, Page, useVbenModal } from '@vben/common-ui';
  import { DICT_TYPE } from '@vben/constants';
  import { getDictLabel } from '@vben/hooks';
  import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';
  import { Card, message } from 'ant-design-vue';
  import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
  import {
    getReceiptAccountPage
  } from '#/api/hzerp/receiptAccout';
  import { $t } from '#/locales';

  import { reimAccountGridFormSchema,reimAccountGridColumns } from './data';
  import AccountForm from "#/views/hzerp/receiptAccount/modules/account-form.vue";

  /** 打开记账modal*/
  const [FormModal, formModalApi] = useVbenModal({
    connectedComponent: AccountForm,
    destroyOnClose: true,
  });

  /** 创建 */
  function handleCreate() {
    formModalApi.setData(null).open();
  }
  /** 刷新表格 */
  function handleRefresh() {
    gridApi.query();
  }
  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      schema: reimAccountGridFormSchema(),
    },
    gridOptions:{
      columns: reimAccountGridColumns(),
      height: 'auto',
      keepSource: true,
      proxyConfig: {
        ajax: {
          query: async ({ page }, formValues) => {
            return await getReceiptAccountPage({
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
    }} as VxeTableGridOptions<ReceiptAccountApi.ReceiptAccount>
  );
</script>

<template>
  <Page auto-content-height>

    <!--详情组件-->
    <FormModal />

    <Grid>
      <template #actions="{ row }">
        <TableAction
          :actions="[
                 {
                  label: '记账',
                  type: 'link',
                  icon: ACTION_ICON.EDIT,
                  auth: ['hzerp:receiptAccount:accountView'],
                  onClick:handleCreate
                },
              ]"
        />
      </template>
    </Grid>
  </Page>
</template>
