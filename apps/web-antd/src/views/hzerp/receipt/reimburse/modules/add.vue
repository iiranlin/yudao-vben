<script lang="ts" setup>

import {useVbenForm} from "#/adapter/form";
import {useFormSchema} from "#/views/hzerp/receipt/reimburse/data";
import type {ReceiptApi} from "#/api/hzerp/receipt";
import { Button, Card, message, Space } from 'ant-design-vue';
import type { VbenFormSchema } from '#/adapter/form';
import { computed, h, onMounted, ref, watch } from 'vue';
import { router } from '#/router';
import {createReceipt,updateReceipt} from '#/api/hzerp/receipt'
import { useTabs } from '@vben/hooks';
import { confirm } from '@vben/common-ui';

const emit = defineEmits(['success']);
const formData = ref<ReceiptApi.Receipt>();
const formType = ref('add'); // 表单类型：'add' | 'edit' | 'detail'

const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const { closeCurrentTab } = useTabs();

/** 初始化 */
onMounted(async () => {
  if(formType.value == 'add'){
    addExpenseDetail()
  }
})

// ========== 动态表单组功能开始 ==========
/** 报销明细接口定义 */
interface ExpenseDetail {
  id: string; // 唯一标识
  expenseType?: string; // 费用类型
  occurTime?: number; // 发生时间
  expenseAmount?: number; // 报销金额
  expenseReason?: string; // 报销说明
  attachments?: string[]; // 附件
}

/** 报销明细列表 */
const expenseDetails = ref<ExpenseDetail[]>([]);

/** 添加报销明细 */
function addExpenseDetail() {
  const newDetail: ExpenseDetail = {
    id: `detail_${Date.now()}`,
  };
  expenseDetails.value.push(newDetail);
  // 延迟更新以确保 DOM 已更新
  setTimeout(() => {
    updateFormSchema();
  }, 0);
}


/** 删除报销明细 */
function removeExpenseDetail(id: string) {
  const index = expenseDetails.value.findIndex((item) => item.id === id);
  if (index > -1) {
    expenseDetails.value.splice(index, 1);
    // 延迟更新以确保 DOM 已更新
    setTimeout(() => {
      updateFormSchema();
    }, 0);
  }
}

/** 动态生成表单 schema，包含基础字段和动态明细组 */
function getDynamicFormSchema(): VbenFormSchema[] {
  const baseSchema = useFormSchema();
  const detailSchemas: VbenFormSchema[] = [];

  expenseDetails.value.forEach((detail, index) => {

    // 添加分组标题
    detailSchemas.push({
      fieldName: `detail_header_no_${detail.id}`,
      component: 'Divider',
      componentProps: {
        orientation: 'left',
        orientationMargin: 0,
      },
      renderComponentContent: () => ({
        default: () => [
          h('div', { class: 'flex items-center justify-between w-full' }, [
            h('span', { class: 'text-base font-medium' }, `报销明细${index + 1}`)
          ]),
        ],
      }),
    });

if(index != 0){


    // 添加分组删除按钮
    detailSchemas.push({
      fieldName: `detail_header_de_${detail.id}`,
      component: 'Divider',
      componentProps: {
        orientation: 'left',
        orientationMargin: 0,
      },
      renderComponentContent: () => ({
        default: () => [
          h('div', { class: 'flex items-center justify-between w-full' }, [
            h(
              Button,
              {
                type: 'link',
                danger: true,
                size: 'small',
                onClick: () => removeExpenseDetail(detail.id),
              },
              { default: () => '删除' },
            ),
          ]),
        ],
      }),
    });
}else{
  // 创建空白的进行填充
    detailSchemas.push({
      fieldName: `blankDel_${detail.id}`,
      label: '',
    });
}


    // 报销类型
    detailSchemas.push({
      fieldName: `${detail.id}_expenseType`,
      label: '费用类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        options: [
          { label: '交通费', value: 'traffic' },
          { label: '住宿费', value: 'accommodation' },
          { label: '餐饮费', value: 'meal' },
          { label: '办公费', value: 'office' },
          { label: '其他', value: 'other' },
        ],
      },
      rules: 'required',
    });

    // 发生时间
    detailSchemas.push({
      fieldName: `${detail.id}_occurTime`,
      label: '发生时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择时间',
        showTime: false,
        valueFormat: 'x',
        format: 'YYYY-MM-DD',
        
      },
    });

    // 报销金额
    detailSchemas.push({
      fieldName: `${detail.id}_expenseAmount`,
      label: '费用金额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入',
        min: 0,
        precision: 2,
        addonAfter: '元',
      },
      rules: 'required',
    });

    

    // 费用说明
    detailSchemas.push({
      fieldName: `${detail.id}_expenseReason`,
      label: '费用说明',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入',
        rows: 3,
      },
    });

    // 附件上传
    detailSchemas.push({
      fieldName: `${detail.id}_attachments`,
      label: '附件',
      component: 'Upload',
      componentProps: {
        api: '/upload', // 替换为实际的上传接口
        maxCount: 5,
        maxSize: 10,
        accept: '.pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx',
      },
    });
    // 创建空白的进行填充
    detailSchemas.push({
      fieldName: `blank_${detail.id}`,
      label: '',
    });
  });

  return [...baseSchema, ...detailSchemas];
}

/** 更新表单 schema */
function updateFormSchema() {
  formApi.setState((prev) => ({
    ...prev,
    schema: getDynamicFormSchema(),
  }));
}

/** 提交申请 */
async function onSubmit() {
  // 1.1 表单校验
  const { valid } = await formApi.validate();
  if (!valid) {
    return;
  }


  // 提交表单
  const data = (await formApi.getValues()) as ReceiptApi.Reimbursement;
  

  // ========== 动态表单组：收集报销明细数据 ==========
  const expenseDetailsList: ExpenseDetail[] = [];
  expenseDetails.value.forEach((detail) => {
    expenseDetailsList.push({
      id: detail.id,
      expenseType: data[`${detail.id}_expenseType`],
      expenseAmount: data[`${detail.id}_expenseAmount`],
      occurTime: data[`${detail.id}_occurTime`],
      expenseReason: data[`${detail.id}_expenseReason`],
      attachments: data[`${detail.id}_attachments`],
    });
    // 清理动态字段，避免提交时包含这些临时字段
    delete data[`${detail.id}_expenseType`];
    delete data[`${detail.id}_expenseAmount`];
    delete data[`${detail.id}_occurTime`];
    delete data[`${detail.id}_expenseReason`];
    delete data[`${detail.id}_attachments`];
    delete data[`detail_header_${detail.id}`];
  });
  // 将报销明细添加到提交数据中
  (data as any).expenseDetails = expenseDetailsList;
  // ========== 动态表单组数据收集结束 ==========

  // 格式化开始时间和结束时间的值
  const submitData: ReceiptApi.Reimbursement = {
    ...data,
    startTime: Number(data.startTime),
    endTime: Number(data.endTime),
  };
  try {
    formLoading.value = true;
    await (formData.value?.id
      ? updateReceipt(submitData)
      : createReceipt(submitData));
    // 关闭并提示
    message.success({
      content: $t('ui.actionMessage.operationSuccess'),
      key: 'action_process_msg',
    });
    await router.push({
      name: 'BpmOALeave',
    });
  } finally {
    formLoading.value = false;
  }
}

/** 返回上一页 */
function onBack() {
  confirm({
    content: '确定要返回上一页吗？请先保存您填写的信息！',
    icon: 'warning',
    beforeClose({ isConfirm }) {
      if (isConfirm) {
        closeCurrentTab();
      }
      return Promise.resolve(true);
    },
  });
}





const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-1/2 ',
    },
    labelWidth: 80,
  },
  wrapperClass: 'grid-cols-2 mt-10',
  layout: 'horizontal',
  schema: useFormSchema(formType.value),
  showDefaultActions: false,
  handleValuesChange: (values, changedFields) => {
    // 目的：同步到 item-form 组件，触发整体的价格计算
    if (formData.value && changedFields.includes('discountPercent')) {
      formData.value.discountPercent = values.discountPercent;
    }
  },
});
</script>

<template>
<Page>
  <div class="mx-auto w-[80vw] max-w-[920px]">
    <Card :title="getTitle" class="w-full">
      <template #extra>
        <Button type="dashed" @click="addExpenseDetail">
            <IconifyIcon icon="lucide:plus" />
            添加明细
          </Button>
        <Button type="default" @click="onSubmit">
          <IconifyIcon icon="lucide:arrow-left" /> 提交
        </Button>
        <Button type="default" @click="onBack">
         <IconifyIcon icon="lucide:arrow-left" /> 返回
        </Button>
        </template>
       <Form />
    </Card>
  </div>
</Page>
 
 
</template>
