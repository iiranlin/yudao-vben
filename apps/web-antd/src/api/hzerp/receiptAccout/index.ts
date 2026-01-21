import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace ReceiptAccountApi{
  export interface ReceiptAccount {
    id?: number;
    hexStatus?: string;
    receiptId?: string;
    receiptType?: string;
    receiptCategory?: string;
    sy?: string;
    gsgs?: string;
    gsxm?: string;
    jzsj?: Date;
    jzPerson?:string;
  }
}
/** 查询列表 */
export function getReceiptAccountPage(params: PageParam) {
  return requestClient.get<PageResult<ReceiptAccountApi.ReceiptAccount>>(
    '/system/user/page',
    { params },
  );
}
/** 查询岗位详情 */
export function getPost(id: number) {
  return requestClient.get<ReceiptAccountApi.ReceiptAccount>(`/system/post/get?id=${id}`);
}

/** 新增岗位 */
export function createPost(data: ReceiptAccountApi.ReceiptAccount) {
  return requestClient.post('/system/post/create', data);
}

/** 修改岗位 */
export function updatePost(data: ReceiptAccountApi.ReceiptAccount) {
  return requestClient.put('/system/post/update', data);
}
