<script lang="ts" setup>
  import type { VxeTableGridOptions } from '#/adapter/vxe-table';
  import type { ReceiptApi } from '#/api/hzerp/receipt';
  import { ref } from 'vue';

  import { confirm, DocAlert, Page, useVbenModal } from '@vben/common-ui';
  import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

  import { message } from 'ant-design-vue';

  import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
  import {
    deleteRole,
    deleteRoleList,
    exportRole,
    getRolePage,
  } from '#/api/system/role';
  import {getReceiptPage} from '#/api/hzerp/receipt'
  import { $t } from '#/locales';

  import { reimGridFormSchema, reimGridColumns } from './data';
  import { useRouter } from 'vue-router'

  // 获取路由实例
  const router = useRouter()

  /** 流程查看 */
 /* const [ProgessViewModal, ProgessViewModalApi] = useVbenModal({
    connectedComponent: ProgessView,
    destroyOnClose: true,
  });

  function handleDetail(row: ReceiptApi.Receipt) {
    ProgessViewModalApi.setData(row).open();
  }*/

  /** 刷新表格 */
  function handleRefresh() {
    gridApi.query();
  }

  /** 导出表格 */
 /* async function handleExport() {
    const data = await exportRole(await gridApi.formApi.getValues());
    downloadFileFromBlobPart({ fileName: '角色.xls', source: data });
  }*/

  /** 创建报销 */
  function handleADD() {
    router.push({name: 'reimburseadd'})
  }

  /** 编辑报销 */
  function handleEdit(row: ReceiptApi.Receipt) {
    router.push({name: 'reimburseadd'})
  }

  /** 删除报销 */
  async function handleDelete(row: ReceiptApi.Receipt) {
    const hideLoading = message.loading({
      content: $t('ui.actionMessage.deleting', [row.name]),
      duration: 0,
    });
    try {
      await deleteRole(row.id!);
      message.success($t('ui.actionMessage.deleteSuccess', [row.name]));
      handleRefresh();
    } finally {
      hideLoading();
    }
  }


  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      schema: reimGridFormSchema(),
    },
    gridOptions: {
      columns: reimGridColumns(),
      height: 'auto',
      keepSource: true,
      proxyConfig: {
        ajax: {
          query: async ({ page }, formValues) => {
            return await getReceiptPage({
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
    } as VxeTableGridOptions<ReceiptApi.Receipt>,
    gridEvents: {
   /*   checkboxAll: handleRowCheckboxChange,
      checkboxChange: handleRowCheckboxChange,*/
    },
  });
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="报销列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: '新增报销',
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['hzerp:receipt:reimburse:create'],
              onClick: handleADD,
            },
            {
              label: '修改',
              type: 'primary',
              icon: ACTION_ICON.EDIT,
              auth: ['hzerp:receipt:reimburse:edit'],
              onClick: handleEdit,
            },
            {
              label: '提交审核',
              type: 'primary',
              icon: ACTION_ICON.AUDIT,
              auth: ['hzerp:receipt:reimburse:submit'],
              // onClick: handleExport,
            },
            {
              label: '撤回',
              type: 'primary',
              icon: ACTION_ICON.FILTER,
              auth: ['hzerp:receipt:reimburse:revoke'],
              // onClick: handleExport,
            },
            {
              label: $t('删除'),
              type: 'primary',
              danger: true,
              icon: ACTION_ICON.DELETE,
              auth: ['hzerp:receipt:reimburse:delete'],
              onClick: handleDelete,
            },
          ]"
        />
      </template>
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
                  label: '流程查看',
                  type: 'link',
                  icon: ACTION_ICON.VIEW,
                  auth: ['hzerp:workbench:progressView'],
                  // onClick:handleDetail.bind(null, row)
                },
          ]"
        />
      </template>
    </Grid>
  </Page>
</template>
