import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace ReceiptApi{
  export interface Receipt {
    id?: number;
    bxlx: string;
    bxgs: string;
    gsxm: string;
    bxsy: string;
  }
}

/** 创建报销申请 */
export async function createReceipt(data: ReceiptApi.Receipt) {
  return requestClient.post('/bpm/oa/leave/create', data);
}

/** 更新报销申请 */
export async function updateReceipt(data: ReceiptApi.Receipt) {
  return requestClient.post('/bpm/oa/leave/update', data);
}


/** 查询报销申请分页 */
export function getReceiptPage(params: PageParam) {
  return requestClient.get<PageResult<ReceiptApi.Receipt>>(
    '/system/user/page',
    { params },
  );
}
