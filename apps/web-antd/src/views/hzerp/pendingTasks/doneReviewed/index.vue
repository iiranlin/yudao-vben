<script lang="ts" setup>
  import type { VxeTableGridOptions } from '#/adapter/vxe-table';
  import type { DoneReviewedApi } from '#/api/hzerp/pendingTasks/doneReviewed';
  import { ref } from 'vue';
  import { confirm, DocAlert, Page, useVbenModal } from '@vben/common-ui';
  import { DICT_TYPE } from '@vben/constants';
  import { getDictLabel } from '@vben/hooks';
  import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';
  import { Card, message } from 'ant-design-vue';
  import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
  import {
    getDoneReviewedPage
  } from '#/api/hzerp/pendingTasks/doneReviewed/index.ts';
  import { $t } from '#/locales';

  import { commonGridFormSchema, doneReviewedGridColumns} from '../data';

  /** 刷新表格 */
  function handleRefresh() {
    gridApi.query();
  }
  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      schema: commonGridFormSchema(),
    },
    gridOptions:{
      columns: doneReviewedGridColumns(),
      height: 'auto',
      keepSource: true,
      proxyConfig: {
        ajax: {
          query: async ({ page }, formValues) => {
            return await getDoneReviewedPage({
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
    }} as VxeTableGridOptions<DoneReviewedApi.DoneReviewed>
  );
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #actions="{ row }">
        <TableAction
          :actions="[
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
