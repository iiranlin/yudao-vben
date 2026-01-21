import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import {
  CommonStatusEnum,
  DICT_TYPE,
  SystemDataScopeEnum,
} from '@vben/constants';
import { getDictOptions } from '@vben/hooks';

import { z } from '#/adapter/form';
import { getRangePickerDefaultProps } from '#/utils';


/** 待办事项：公用的列表搜索表单 */
export function commonGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'id',
      label: '单据id',
      component: 'Input',
      componentProps: {
        placeholder: '请输入单据id',
        allowClear: true,
      },
    },
    {
      fieldName: 'code',
      label: '单据类型',
      component: 'Input',
      componentProps: {
        placeholder: '请输入单据类型',
        allowClear: true,
      },
    },
    {
      fieldName: 'blongPro',
      label: '归属项目',
      component: 'Select',
      componentProps: {
        placeholder: '请选择归属项目',
        allowClear: true,
        options: getDictOptions(DICT_TYPE.HZERP_BELONGING_PROJECT_NAME, 'number'),
      },
    },
    {
      fieldName: 'status',
      label: '提交人',
      component: 'Select',
      componentProps: {
        placeholder: '请输入提交人',
        allowClear: true,
      },
    },
    {
      fieldName: 'createTime',
      label: '提交时间',
      component: 'RangePicker',
      componentProps: {
        placeholder: ['开始日期', '结束日期'],
        allowClear: true,
      },
    },
  ];
}

/** 待审核列表的字段 */
export function toReviewGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'index',
      title: '序号',
      minWidth: 60,
    },
    {
      field: 'id',
      title: '单据id',
      minWidth: 60,
    },
    {
      field: 'name',
      title: '单据类型',
      minWidth: 100,
    },
    {
      field: 'type',
      title: '单据类别',
      minWidth: 100,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.SYSTEM_ROLE_TYPE },
      },
    },
    {
      field: 'code',
      title: '事由',
      minWidth: 200,
    },
    {
      field: 'sort',
      title: '归属公司',
      minWidth: 100,
    },
    {
      field: 'remark',
      title: '归属项目',
      minWidth: 100,
    },
    {
      field: 'status',
      title: '提交人',
      minWidth: 100,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.COMMON_STATUS },
      },
    },
    {
      field: 'createTime',
      title: '提交时间',
      minWidth: 100,
      formatter: 'formatDateTime',
    },
    {
      title: '操作',
      width: 240,
      slots: { default: 'actions' },
    },
  ];
}

/** 已审核列表的字段 */
export function doneReviewedGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'index',
      title: '序号',
      minWidth: 60,
    },
    {
      field: 'djstatus',
      title: '单据状态',
      minWidth: 100,
    },
    {
      field: 'id',
      title: '单据id',
      minWidth: 60,
    },
    {
      field: 'name',
      title: '单据类型',
      minWidth: 100,
    },
    {
      field: 'type',
      title: '单据类别',
      minWidth: 100,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.SYSTEM_ROLE_TYPE },
      },
    },
    {
      field: 'code',
      title: '事由',
      minWidth: 200,
    },
    {
      field: 'sort',
      title: '归属公司',
      minWidth: 100,
    },
    {
      field: 'remark',
      title: '归属项目',
      minWidth: 100,
    },
    {
      field: 'status',
      title: '提交人',
      minWidth: 100,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.COMMON_STATUS },
      },
    },
    {
      field: 'createTime',
      title: '提交时间',
      minWidth: 100,
      formatter: 'formatDateTime',
    },
    {
      field: 'shTime',
      title: '审核时间',
      minWidth: 100,
      formatter: 'formatDateTime',
    },
    {
      field: 'messae',
      title: '审核意见',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      title: '操作',
      width: 100,
      slots: { default: 'actions' },
    },
  ];
}

/** 待处理列表的字段 */
export function toDealGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'index',
      title: '序号',
      minWidth: 60,
    },
    {
      field: 'id',
      title: '单据id',
      minWidth: 60,
    },
    {
      field: 'name',
      title: '单据类型',
      minWidth: 100,
    },
    {
      field: 'type',
      title: '单据类别',
      minWidth: 100,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.SYSTEM_ROLE_TYPE },
      },
    },
    {
      field: 'code',
      title: '事由',
      minWidth: 200,
    },
    {
      field: 'sort',
      title: '归属公司',
      minWidth: 100,
    },
    {
      field: 'remark',
      title: '归属项目',
      minWidth: 100,
    },
    {
      field: 'status',
      title: '提交人',
      minWidth: 100,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.COMMON_STATUS },
      },
    },
    {
      field: 'createTime',
      title: '提交时间',
      minWidth: 100,
      formatter: 'formatDateTime',
    },
    {
      field: 'shTime',
      title: '审核时间',
      minWidth: 100,
      formatter: 'formatDateTime',
    },
    {
      field: 'shyj',
      title: '审核意见',
      minWidth: 100,
      formatter: 'formatDateTime',
    },
    {
      title: '操作',
      width: 200,
      slots: { default: 'actions' },
    },
  ];
}
