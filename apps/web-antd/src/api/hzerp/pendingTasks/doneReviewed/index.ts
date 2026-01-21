import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace DoneReviewedApi {
  /** 已审核信息 */
  export interface DoneReviewed {
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
export function getDoneReviewedPage(params: PageParam) {
  return requestClient.get<PageResult<DoneReviewedApi.DoneReviewed>>(
    '/system/user/page',
    { params },
  );
}

/** 查询单据详情 */
export function getRole(id: number) {
  return requestClient.get<DoneReviewedApi.DoneReviewed>(`/system/role/get?id=${id}`);
}
