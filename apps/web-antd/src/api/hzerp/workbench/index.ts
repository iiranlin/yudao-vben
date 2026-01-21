import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace WorkbenchApi {
  /** 信息 */
  export interface Workbench {
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
  /** 各种状态数量 */
  export interface StatusCount {
    pendingReview: number;  //待审核
    reviewed: number;       //已审核
    pending: number;        //待处理
  }
}

/** 查询各种状态数量 */
export function getStatusCount() {
  return requestClient.get<WorkbenchApi.StatusCount>('/erp/purchase-order/status-count');
}

/** 查询列表 */
export function getWorkbenchPage(params: PageParam) {
  return requestClient.get<PageResult<WorkbenchApi.Workbench>>(
    '/ledger/pending-approval/select',
    { params },
  );
}
/** 通过 */
export function updateWorkbenchStatus(id: number, status: number) {
  return requestClient.put('/erp/purchase-order/update-status', null, {
    params: { id, status },
  });
}

/** 查询角色（精简)列表 */
export function getSimpleRoleList() {
  return requestClient.get<WorkbenchApi.Workbench[]>('/system/role/simple-list');
}

/** 查询角色详情 */
export function getRole(id: number) {
  return requestClient.get<WorkbenchApi.Workbench>(`/system/role/get?id=${id}`);
}

/** 新增角色 */
export function createRole(data: WorkbenchApi.Workbench) {
  return requestClient.post('/system/role/create', data);
}

/** 修改角色 */
export function updateRole(data: WorkbenchApi.Workbench) {
  return requestClient.put('/system/role/update', data);
}

/** 删除角色 */
export function deleteRole(id: number) {
  return requestClient.delete(`/system/role/delete?id=${id}`);
}

/** 批量删除角色 */
export function deleteRoleList(ids: number[]) {
  return requestClient.delete(`/system/role/delete-list?ids=${ids.join(',')}`);
}

/** 导出角色 */
export function exportRole(params: any) {
  return requestClient.download('/system/role/export-excel', {
    params,
  });
}
