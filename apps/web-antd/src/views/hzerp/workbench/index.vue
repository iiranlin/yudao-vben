<script lang="ts" setup>
  import type { VxeTableGridOptions } from '#/adapter/vxe-table';
  import type { WorkbenchApi } from '#/api/hzerp/workbench';

  import { Page,useVbenModal } from '@vben/common-ui';
  import { message } from 'ant-design-vue';
  import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
  import {
    updateWorkbenchStatus,getStatusCount,getWorkbenchPage
  } from '#/api/hzerp/workbench';

  import {
    toReviewGridColumns,
    doneReviewedGridColumns,
    toDealGridColumns,
  } from '../pendingTasks/data';
  import {computed,ref} from "vue";
  import Detail from './modules/detail.vue';


  /** 审批/反审批操作 */
  async function handlePass(
    row: WorkbenchApi.Workbench,
    status: number,
  ) {
    const hideLoading = message.loading({
      // content: `确定要通过${row.id}吗？`,
      content: `确定${status === 20 ? '通过' : '驳回'}该单据吗？`,
      duration: 0,
    });
    try {
      await updateWorkbenchStatus(row.id!, status);
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

  /** 定义查看详情*/
  const [DetailModal, detailModalApi] = useVbenModal({
    connectedComponent: Detail,
    destroyOnClose: true,
  });

  function handleDetail(row: WorkbenchApi.Workbench) {
    detailModalApi.setData(row).open();
  }



  /** 各个状态的数量*/
  const StatusCount = ref<WorkbenchApi.StatusCount>();
  /** 查询状态数量*/
  async function handleQueryStatusCount(){
    StatusCount.value = await getStatusCount();
  }

  // 创建响应式列配置
  const dynamicColumns = ref<VxeTableGridOptions['columns']>(toReviewGridColumns());

  /** 查询 1.待审核  2.已审核   3.待处理*/
  const orderStatus = ref<number>(1);
  function handleStatusRefresh(status: number){
    //删除所有已有的表单
    dynamicColumns.value.splice(0, dynamicColumns.value.length);
    if(status == 1){
      const pendingReviewGridColumnss = toReviewGridColumns();
      pendingReviewGridColumnss.map((items,i) =>{
        dynamicColumns.value.push(items);
      })
    }else if(status == 2){
      const doneReviewedGridColumnss = doneReviewedGridColumns();
      for(let i = 0;i<doneReviewedGridColumnss.length;i++){
        dynamicColumns.value.push(doneReviewedGridColumnss[i]);
      }
    }else if(status == 3){
      const pendingHandleGridColumnss = toDealGridColumns();
      for(let i = 0;i<pendingHandleGridColumnss.length;i++){
        dynamicColumns.value.push(pendingHandleGridColumnss[i]);
      }
    }
    orderStatus.value = status;
    handleRefresh();
  }


  // 计算当前表格配置
  const gridOptions = computed(() => ({
    columns: dynamicColumns.value,
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getWorkbenchPage({
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
  }));


  /** 定义表格*/
  const [Grid, gridApi] = useVbenVxeGrid({
      gridOptions: gridOptions.value as VxeTableGridOptions<WorkbenchApi.Workbench>
    });
</script>

<template>
  <Page auto-content-height>

    <template class="topDiv">
      <div class="div1" @click="handleStatusRefresh(1)">待审核 {{StatusCount?.pendingReview}} </div>
      <div class="div2" @click="handleStatusRefresh(2)">已审核 {{StatusCount?.reviewed}} </div>
      <div class="div3" @click="handleStatusRefresh(3)">待处理 {{StatusCount?.pending}} </div>
    </template>
    <!--详情组件-->
    <DetailModal @success="handleRefresh" />

    <Grid>
      <template #actions="{ row }">
        <TableAction v-if="orderStatus == 1"
          :actions="[
                {
                  label: '通过',
                  type: 'link',
                  icon: ACTION_ICON.AUDIT,
                  auth: ['hzerp:workbench:pass'],
                  popConfirm: {
                    title: `确定要通过${row.id}吗？`,
                    confirm: handlePass.bind(null, row, row.status === 10 ? 20 : 10),
                 },
                },
                {
                  label: '驳回',
                  type: 'link',
                  danger: true,
                  icon: ACTION_ICON.CLOSE,
                  auth: ['hzerp:workbench:reject'],
                  popConfirm: {
                    title: `确定要驳回${row.id}吗？`,
                    confirm: handlePass.bind(null, row, row.status === 10 ? 20 : 10),
                  },
                },
                 {
                  label: '流程查看',
                  type: 'link',
                  icon: ACTION_ICON.VIEW,
                  auth: ['hzerp:workbench:progressView'],
                  onClick:handleDetail.bind(null, row)
                },
              ]"
        />

        <TableAction v-if="orderStatus == 2"
          :actions="[
                 {
                  label: '流程查看',
                  type: 'link',
                  icon: ACTION_ICON.VIEW,
                  auth: ['hzerp:workbench:progressView'],
                  onClick:handleDetail.bind(null, row)
                },
              ]"
        />

        <TableAction v-if="orderStatus == 3"
                     :actions="[
                {
                  label: '修改',
                  type: 'link',
                  danger: true,
                  icon: ACTION_ICON.EDIT,
                  auth: ['hzerp:workbench:update'],
                  // onclick:
                },
                 {
                  label: '流程查看',
                  type: 'link',
                  icon: ACTION_ICON.VIEW,
                  auth: ['hzerp:workbench:progressView'],
                  onClick:handleDetail.bind(null, row)
                },
              ]"
        />
      </template>
    </Grid>
  </Page>
</template>
<style lang="scss" scoped>
  .topDiv{
    display: flex;
    justify-content: space-around;
    div{
      width: 200px;
      height: 80px;
      line-height: 85px;
      text-align: center;
      margin-bottom: 10px;
      font-weight: bold;
    }
    .div1{
      background-color: #ffe1d9;color: #ff7651;cursor: pointer;
    }

    .div2{
      background-color: #e4ddf2;color: #8765c6;cursor: pointer;
    }

    .div3{
      background-color: #c7e8f9;color: #025677;cursor: pointer;
    }
  }
</style>
