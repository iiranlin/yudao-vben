/**
 * React 项目入口文件示例（app.tsx）
 *
 * 展示如何在 React + umi 项目中集成 Vben 桥接
 */

import { useEffect } from 'react';
import { vbenBridge } from '@/utils/vbenBridge';
import { initPermissions } from '@/utils/permission';

/**
 * 初始化 Vben 通信
 */
export const useVbenAuth = () => {
  useEffect(() => {
    console.log('[App] 初始化 Vben 通信');

    // 监听主应用消息
    vbenBridge.on('init', (data) => {
      console.log('[App] 收到初始化数据:', data);

      // 保存 token
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }

      // 保存用户信息
      if (data.userInfo) {
        localStorage.setItem('userInfo', JSON.stringify(data.userInfo));
      }

      // 初始化权限
      if (data.permissions) {
        initPermissions(data.permissions);
      }
    });

    // 监听 token 更新
    vbenBridge.on('token', (data) => {
      console.log('[App] Token 已更新');
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
    });

    // 监听用户信息更新
    vbenBridge.on('userInfo', (data) => {
      console.log('[App] 用户信息已更新');
      localStorage.setItem('userInfo', JSON.stringify(data));
    });

    // 监听权限更新
    vbenBridge.on('permissions', (data) => {
      console.log('[App] 权限已更新');
      initPermissions(data);
    });

    // 如果在 iframe 中，请求主应用数据
    if (vbenBridge.isInIframe()) {
      console.log('[App] 在 iframe 中，请求主应用数据');
      // 注意：不需要主动请求，主应用会在 iframe 加载后自动发送 init 消息
    }

    return () => {
      // 清理监听器（可选）
    };
  }, []);
};

// ===== umi 配置 =====

/**
 * umi 运行时配置
 */
export const dva = {
  config: {
    onError(e: Error) {
      console.error('[Dva Error]', e);
    },
  },
};

/**
 * 全局初始数据
 */
export async function getInitialState() {
  // 在这里可以初始化全局状态
  const token = localStorage.getItem('token');
  const userInfo = localStorage.getItem('userInfo');

  return {
    token,
    userInfo: userInfo ? JSON.parse(userInfo) : null,
  };
}

/**
 * 路由守卫
 */
export function onRouteChange({ location, routes, action }: any) {
  console.log('[Router] 路由变化:', location.pathname);

  // 这里可以添加路由权限判断
  // 例如：
  // const route = routes.find((r: any) => r.path === location.pathname);
  // if (route?.permission && !hasPermission(route.permission)) {
  //   history.push('/403');
  // }
}

/**
 * 修改路由（可选）
 */
export function patchRoutes({ routes }: any) {
  console.log('[Router] 路由初始化');
}

/**
 * 根组件包装
 */
export function rootContainer(container: any) {
  // 在根组件中使用 Vben 桥接
  const WrappedContainer = () => {
    useVbenAuth();
    return container;
  };

  return <WrappedContainer />;
}
