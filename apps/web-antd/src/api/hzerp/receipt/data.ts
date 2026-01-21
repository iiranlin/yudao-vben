import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import {
  DICT_TYPE,
  SystemDataScopeEnum,
} from '@vben/constants';
import { getDictOptions } from '@vben/hooks';

import { getRangePickerDefaultProps } from '#/utils';

/** 新增/修改的表单 */
export function useFormSchema(formType: string): VbenFormSchema[] {
  return [
    {
      fieldName: 'bxlx',
      label: '报销类型',
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
      },
      rules: 'required'
    },
    {
      fieldName: 'bxgs',
      label: '报销公司',
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
      },
      rules: 'required'
    },
    {
      fieldName: 'gsxm',
      label: '归属项目',
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.HZERP_EXPENCE_TYPE, 'number'),
      },
      rules: 'required'
    },
    {
      fieldName: 'name',
      label: '报销事由',
      component: 'Input',
      componentProps: {
        placeholder: '请输入报销事由',
      },
      rules: 'required'
    },
  ];
}

/** 新增/修改的表单 */
export function useFormSchemaItem(formType: string): VbenFormSchema[] {
  return [
    {
      fieldName: 'bxlx',
      label: '费用类型',
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
      },
      rules: 'required'
    },
    {
      fieldName: 'bxgs',
      label: '发生时间',
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
      },
      rules: 'required'
    },
    {
      fieldName: 'gsxm',
      label: '费用金额',
      component: 'Input',
      componentProps: {
        placeholder: '请输入费用金额',
      },
      rules: 'required'
    },
    {
      fieldName: 'name',
      label: '费用说明',
      component: 'Input',
      componentProps: {
        placeholder: '请输入费用说明',
      },
      rules: 'required'
    },
    {
      fieldName: 'fileUrl',
      label: '附件',
      component: 'FileUpload',
      componentProps: {
        maxNumber: 1,
        maxSize: 10,
        accept: [
          'pdf',
          'doc',
          'docx',
          'xls',
          'xlsx',
          'txt',
          'jpg',
          'jpeg',
          'png',
        ],
        showDescription: formType !== 'detail',
        disabled: formType === 'detail',
      },
      formItemClass: '',
    }
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
export function reimGridFormSchema(): VbenFormSchema[] {
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
      fieldName: 'status',
      label: '单据状态',
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
        placeholder: '请选择单据状态',
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
      label: '提交时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
  ];
}

/** 列表的字段 */
export function reimGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'index',
      title: '序号',
      minWidth: 100,
    },
    { type: 'checkbox', width: 40, title: '选择'},
    {
      field: 'djStatus',
      title: '单据状态',
      minWidth: 200,
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
      title: '提交时间',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      title: '操作',
      width: 240,
      // fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
