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

/** 新增/修改的表单 */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'id',
      component: 'Input',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'name',
      label: '角色名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入角色名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'code',
      label: '角色标识',
      component: 'Input',
      componentProps: {
        placeholder: '请输入角色标识',
      },
      rules: 'required',
    },
    {
      fieldName: 'sort',
      label: '显示顺序',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: '请输入显示顺序',
      },
      rules: 'required',
    },
    {
      fieldName: 'status',
      label: '角色状态',
      component: 'RadioGroup',
      componentProps: {
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
        buttonStyle: 'solid',
        optionType: 'button',
      },
      rules: z.number().default(CommonStatusEnum.ENABLE),
    },
    {
      fieldName: 'remark',
      label: '角色备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入角色备注',
      },
    },
  ];
}

/** 分配数据权限的表单 */
export function useAssignDataPermissionFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'id',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'name',
      label: '角色名称',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'code',
      label: '角色标识',
      componentProps: {
        disabled: true,
      },
    },
    {
      component: 'Select',
      fieldName: 'dataScope',
      label: '权限范围',
      componentProps: {
        options: getDictOptions(DICT_TYPE.SYSTEM_DATA_SCOPE, 'number'),
      },
    },
    {
      fieldName: 'dataScopeDeptIds',
      label: '部门范围',
      component: 'Input',
      formItemClass: 'items-start',
      dependencies: {
        triggerFields: ['dataScope'],
        show: (values) => {
          return values.dataScope === SystemDataScopeEnum.DEPT_CUSTOM;
        },
      },
    },
  ];
}

/** 分配菜单的表单 */
export function useAssignMenuFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'id',
      component: 'Input',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'name',
      label: '角色名称',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'code',
      label: '角色标识',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'menuIds',
      label: '菜单权限',
      component: 'Input',
      formItemClass: 'items-start',
    },
  ];
}

/** 列表的搜索表单 */
export function benchGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: '名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入角色名称',
        allowClear: true,
      },
    },
    {
      fieldName: 'code',
      label: '标识',
      component: 'Input',
      componentProps: {
        placeholder: '请输入角色标识',
        allowClear: true,
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
        placeholder: '请选择角色状态',
        allowClear: true,
      },
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
  ];
}

/** 待审核列表的字段 */
export function pendingReviewGridColumns(): VxeTableGridOptions['columns'] {
  return [
    // { type: 'checkbox', width: 40 },
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
      minWidth: 200,
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
      minWidth: 180,
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
      field: 'index',
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
      minWidth: 200,
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
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'createTime',
      title: '审核时间',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      title: '操作',
      width: 240,
      slots: { default: 'actions' },
    },
  ];
}

/** 待处理列表的字段 */
export function pendingHandleGridColumns(): VxeTableGridOptions['columns'] {
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
      minWidth: 200,
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
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'createTime',
      title: '审核时间',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      title: '操作',
      width: 240,
      slots: { default: 'actions' },
    },
  ];
}
