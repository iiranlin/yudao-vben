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

/** 列表的搜索表单 */
export function reimAccountGridFormSchema(): VbenFormSchema[] {
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
      fieldName: 'name',
      label: '单据类型',
      component: 'Input',
      componentProps: {
        placeholder: '请输入单据类型',
        allowClear: true,
      },
    },
    {
      fieldName: 'status',
      label: '记账状态',
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
        placeholder: '请选择记账状态',
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
      fieldName: 'createTime',
      label: '记账时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
  ];
}

/** 列表的字段 */
export function reimAccountGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'index',
      title: '序号',
      minWidth: 60,
    },
    {
      field: 'djStatus',
      title: '核销状态',
      minWidth: 150,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.SYSTEM_ROLE_TYPE },
      },
    },
    {
      field: 'id',
      title: '单据id',
      minWidth: 100,
    },
    {
      field: 'type',
      title: '单据类型',
      minWidth: 100,
    },
    {
      field: 'category',
      title: '单据类别',
      minWidth: 100,
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
      field: 'createTime',
      title: '记账时间',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'remarkperson',
      title: '记账人',
      minWidth: 100,
    },
    {
      title: '操作',
      width: 150,
      // fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 新增/修改的表单 */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'accountTime',
      label: '记账时间',
      component: 'DatePicker',
      componentProps: {
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
        placeholder: '请选择记账时间',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入备注',
      },
    },
  ];
}
