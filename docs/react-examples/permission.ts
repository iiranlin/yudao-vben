/**
 * React 项目权限判断工具
 *
 * 使用说明：
 * 1. 在应用入口调用 initPermissions() 初始化权限
 * 2. 在组件中使用 hasPermission() 判断权限
 * 3. 在路由守卫中使用权限判断
 */

let permissionList: string[] = [];

/**
 * 初始化权限列表
 * 从 localStorage 或主应用获取
 */
export const initPermissions = (permissions?: string[]) => {
  if (permissions) {
    permissionList = permissions;
    localStorage.setItem('permissions', JSON.stringify(permissions));
  } else {
    const stored = localStorage.getItem('permissions');
    if (stored) {
      try {
        permissionList = JSON.parse(stored);
      } catch (error) {
        console.error('[Permission] 解析权限列表失败:', error);
        permissionList = [];
      }
    }
  }
  console.log('[Permission] 权限列表已初始化:', permissionList);
};

/**
 * 获取当前权限列表
 */
export const getPermissions = (): string[] => {
  return [...permissionList];
};

/**
 * 判断是否有指定权限
 * @param permission 权限标识，可以是字符串或字符串数组
 * @returns 是否有权限
 */
export const hasPermission = (permission: string | string[]): boolean => {
  // 如果没有传入权限，默认有权限
  if (!permission) {
    return true;
  }

  // 如果权限列表为空，返回 false
  if (permissionList.length === 0) {
    console.warn('[Permission] 权限列表为空');
    return false;
  }

  // 如果是数组，判断是否有任意一个权限
  if (Array.isArray(permission)) {
    return permission.some((p) => permissionList.includes(p));
  }

  // 字符串，判断是否有该权限
  return permissionList.includes(permission);
};

/**
 * 判断是否有任意一个权限
 * @param permissions 权限标识数组
 * @returns 是否有任意一个权限
 */
export const hasAnyPermission = (permissions: string[]): boolean => {
  if (!permissions || permissions.length === 0) {
    return true;
  }

  return permissions.some((p) => permissionList.includes(p));
};

/**
 * 判断是否有所有权限
 * @param permissions 权限标识数组
 * @returns 是否有所有权限
 */
export const hasAllPermissions = (permissions: string[]): boolean => {
  if (!permissions || permissions.length === 0) {
    return true;
  }

  return permissions.every((p) => permissionList.includes(p));
};

/**
 * 清空权限列表
 */
export const clearPermissions = () => {
  permissionList = [];
  localStorage.removeItem('permissions');
  console.log('[Permission] 权限列表已清空');
};

/**
 * React Hook: 使用权限判断
 */
export const usePermission = () => {
  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    permissions: permissionList,
  };
};

export default {
  initPermissions,
  getPermissions,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  clearPermissions,
  usePermission,
};
