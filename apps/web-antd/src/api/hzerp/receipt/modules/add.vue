<script lang="ts" setup>

import {useVbenForm} from "#/adapter/form";
import {useFormSchema, useFormSchemaItem} from "#/views/hzerp/receipt/reimburse/data";
import {ref} from "vue";
import type {ReceiptApi} from "#/api/hzerp/receipt";


const emit = defineEmits(['success']);
const formData = ref<ReceiptApi.Receipt>();
const formType = ref(''); // 表单类型：'add' | 'edit' | 'detail'
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



const [ItemForm, itemFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-1/2 ',
    },
    labelWidth: 80,
  },
  wrapperClass: 'grid-cols-2 mt-10',
  layout: 'horizontal',
  schema: useFormSchemaItem(formType.value),
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
  <a-button type="dashed" block @click="addListItem">添加明细</a-button>
  <Form />
  <h5 >报销明细一</h5>
  <div class="card-box p-5">
    <ItemForm/>
  </div>
</template>
