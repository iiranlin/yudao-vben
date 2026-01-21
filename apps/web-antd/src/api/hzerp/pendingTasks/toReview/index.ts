import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace ToReviewApi {
  /** 已审核信息 */
  export interface ToReview {
    id?: number;
    username: string;
    nickname: string;
    deptId: number;
    postIds: string[];
    email: string;
    mobile: string;
    sex: number;
    avatar: string;
    loginIp: string;
    status: number;
    remark: string;
    createTime?: Date;
  }
}

/** 查询列表 */
export function getToReviewPage(params: PageParam) {
  return requestClient.get<PageResult<ToReviewApi.ToReview>>(
    '/system/user/page',
    { params },
  );
}
/** 通过 */
export function updateToReviewStatus(id: number, status: number) {
  return requestClient.put('/erp/purchase-order/update-status', null, {
    params: { id, status },
  });
}

/** 查询角色详情 */
export function getRole(id: number) {
  return requestClient.get<ToReviewApi.ToReview>(`/system/role/get?id=${id}`);
}
/** 导出角色 */
export function exportRole(params: any) {
  return requestClient.download('/system/role/export-excel', {
    params,
  });
}
