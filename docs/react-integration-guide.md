# React + umi + Ant Design Pro 项目接入指南

## 📖 概述

本文档详细说明如何将基于 **React + umi + Ant Design Pro** 的项目接入到当前的 **yudao-ui-admin-vben**（Vue 3）系统中。

## 🎯 接入方案

### 方案选择：iframe 微前端嵌入

**优点：**

- ✅ 实现简单，技术栈完全隔离
- ✅ React 项目可独立开发、部署、升级
- ✅ 当前项目已内置 `IFrameView` 支持
- ✅ 菜单和权限在主应用统一管理
- ✅ 不需要修改主应用核心代码

**缺点：**

- ⚠️ 跨应用通信需要使用 postMessage
- ⚠️ 性能略低于原生集成（通常可忽略）

---

## 📋 实施步骤

### 一、React 项目准备

#### 1.1 部署 React 应用

确保您的 React 项目可以独立访问：

```bash
# 开发环境
npm run dev
# 访问地址：http://localhost:8001

# 生产环境
npm run build
# 部署到服务器，例如：https://react.yourdomain.com
```

#### 1.2 配置 umi 路由（重要）

修改 React 项目的 `.umirc.ts` 或 `config/config.ts`：

```typescript
export default {
  // 其他配置...

  // 配置基础路径（如果嵌入到子路由）
  base: '/react/',
  publicPath: '/react/',

  // 允许跨域通信
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },

  // 去除外层布局（因为主应用已有布局）
  layout: false, // 如果不需要 Ant Design Pro 的布局
};
```

#### 1.3 创建通信桥接文件

在 React 项目中创建 `/src/utils/vbenBridge.ts`：

```typescript
/**
 * Vben Admin 主应用通信桥接
 */

interface VbenMessage {
  type: 'token' | 'userInfo' | 'permissions' | 'navigate' | 'logout';
  data: any;
}

class VbenBridge {
  private mainAppOrigin: string =
    window.location !== window.parent.location
      ? document.referrer.replace(/\/$/, '')
      : window.location.origin;

  /**
   * 向主应用发送消息
   */
  postMessage(message: VbenMessage) {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(
        { source: 'react-app', ...message },
        this.mainAppOrigin,
      );
    }
  }

  /**
   * 监听主应用消息
   */
  onMessage(callback: (message: VbenMessage) => void) {
    window.addEventListener('message', (event) => {
      // 验证来源
      if (event.origin !== this.mainAppOrigin) return;

      const message = event.data;
      if (message.source === 'vben-app') {
        callback(message);
      }
    });
  }

  /**
   * 请求主应用的 token
   */
  requestToken() {
    this.postMessage({ type: 'token', data: null });
  }

  /**
   * 请求主应用的用户信息
   */
  requestUserInfo() {
    this.postMessage({ type: 'userInfo', data: null });
  }

  /**
   * 请求主应用的权限列表
   */
  requestPermissions() {
    this.postMessage({ type: 'permissions', data: null });
  }

  /**
   * 通知主应用导航到指定路由
   */
  navigate(path: string) {
    this.postMessage({ type: 'navigate', data: { path } });
  }

  /**
   * 通知主应用退出登录
   */
  logout() {
    this.postMessage({ type: 'logout', data: null });
  }
}

export const vbenBridge = new VbenBridge();
export default vbenBridge;
```

#### 1.4 在 React 项目中使用

在 `app.tsx` 或入口文件中初始化：

```typescript
// app.tsx
import { vbenBridge } from '@/utils/vbenBridge';
import { useEffect } from 'react';

export function useVbenAuth() {
  useEffect(() => {
    // 监听主应用消息
    vbenBridge.onMessage((message) => {
      switch (message.type) {
        case 'token':
          // 保存 token 到 React 应用的状态管理
          localStorage.setItem('token', message.data.token);
          break;
        case 'userInfo':
          // 保存用户信息
          localStorage.setItem('userInfo', JSON.stringify(message.data));
          break;
        case 'permissions':
          // 保存权限列表
          localStorage.setItem('permissions', JSON.stringify(message.data));
          break;
      }
    });

    // 请求主应用数据
    vbenBridge.requestToken();
    vbenBridge.requestUserInfo();
    vbenBridge.requestPermissions();
  }, []);
}

// 在根组件中使用
export default function App() {
  useVbenAuth();

  return (
    <div>
      {/* 您的 React 应用 */}
    </div>
  );
}
```

---

### 二、Vue 主应用配置

#### 2.1 创建 iframe 通信组件

在 Vue 主应用中创建 `/apps/web-antd/src/components/ReactBridge.vue`：

```vue
<template>
  <div class="react-bridge-container">
    <iframe
      ref="iframeRef"
      :src="src"
      frameborder="0"
      class="react-iframe"
      @load="onIframeLoad"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useAccessStore, useUserStore } from '@vben/stores';
import { useRouter } from 'vue-router';

interface Props {
  src: string;
}

const props = defineProps<Props>();

const iframeRef = ref<HTMLIFrameElement>();
const accessStore = useAccessStore();
const userStore = useUserStore();
const router = useRouter();

// iframe 加载完成
const onIframeLoad = () => {
  console.log('React 应用已加载');
  // 可以在这里主动发送初始数据
  sendMessageToReact({
    type: 'token',
    data: { token: accessStore.accessToken },
  });
};

// 向 React 应用发送消息
const sendMessageToReact = (message: any) => {
  if (iframeRef.value?.contentWindow) {
    const origin = new URL(props.src).origin;
    iframeRef.value.contentWindow.postMessage(
      { source: 'vben-app', ...message },
      origin,
    );
  }
};

// 处理 React 应用消息
const handleReactMessage = (event: MessageEvent) => {
  // 验证来源
  const iframeOrigin = new URL(props.src).origin;
  if (event.origin !== iframeOrigin) return;

  const message = event.data;
  if (message.source !== 'react-app') return;

  switch (message.type) {
    case 'token':
      // React 请求 token
      sendMessageToReact({
        type: 'token',
        data: { token: accessStore.accessToken },
      });
      break;
    case 'userInfo':
      // React 请求用户信息
      sendMessageToReact({
        type: 'userInfo',
        data: userStore.userInfo,
      });
      break;
    case 'permissions':
      // React 请求权限列表
      sendMessageToReact({
        type: 'permissions',
        data: accessStore.accessCodes,
      });
      break;
    case 'navigate':
      // React 请求路由导航
      router.push(message.data.path);
      break;
    case 'logout':
      // React 请求退出登录
      // 调用主应用的退出登录逻辑
      break;
  }
};

onMounted(() => {
  window.addEventListener('message', handleReactMessage);
});

onUnmounted(() => {
  window.removeEventListener('message', handleReactMessage);
});
</script>

<style scoped>
.react-bridge-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.react-iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
```

#### 2.2 创建 React 应用路由页面

创建 `/apps/web-antd/src/views/react/index.vue`：

```vue
<template>
  <Page auto-content-height>
    <ReactBridge :src="reactAppUrl" />
  </Page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Page } from '@vben/common-ui';
import ReactBridge from '#/components/ReactBridge.vue';

// 从路由 meta 中获取 frameSrc
import { useRoute } from 'vue-router';

const route = useRoute();
const reactAppUrl = computed(() => {
  return (route.meta.frameSrc as string) || import.meta.env.VITE_REACT_APP_URL;
});
</script>
```

#### 2.3 配置环境变量

在 `/apps/web-antd/.env.development` 中添加：

```bash
# React 应用地址（开发环境）
VITE_REACT_APP_URL=http://localhost:8001
```

在 `/apps/web-antd/.env.production` 中添加：

```bash
# React 应用地址（生产环境）
VITE_REACT_APP_URL=https://react.yourdomain.com
```

---

### 三、后端菜单配置

#### 3.1 在后端系统菜单管理中添加菜单

通过后端管理系统（系统管理 -> 菜单管理）添加以下菜单配置：

**示例菜单配置：**

```json
{
  "name": "React应用",
  "parentId": 0,
  "path": "/react-app",
  "component": "react/index",
  "type": 1,
  "icon": "ant-design:react-outlined",
  "sort": 100,
  "status": 0,
  "visible": true,
  "meta": {
    "title": "React应用",
    "frameSrc": "http://localhost:8001",
    "hideChildrenInMenu": false
  },
  "permissions": ["react:app:view"]
}
```

**子菜单示例：**

如果您的 React 应用有多个模块，可以添加子菜单：

```json
{
  "name": "用户管理",
  "parentId": 1000, // 上面菜单的 ID
  "path": "/react-app/users",
  "component": "react/index",
  "type": 1,
  "icon": "ant-design:user-outlined",
  "sort": 1,
  "status": 0,
  "visible": true,
  "meta": {
    "title": "用户管理",
    "frameSrc": "http://localhost:8001/users",
    "hideChildrenInMenu": false
  },
  "permissions": ["react:user:view"]
}
```

#### 3.2 权限配置

在后端系统中为相应的角色分配 React 模块的权限：

1. 进入「系统管理」->「角色管理」
2. 编辑需要访问 React 模块的角色
3. 勾选对应的 React 菜单权限
4. 保存

---

### 四、权限控制实现

#### 4.1 React 项目中的权限判断

在 React 项目中创建 `/src/utils/permission.ts`：

```typescript
/**
 * 权限判断工具
 */

let permissionList: string[] = [];

// 从 localStorage 初始化权限（由主应用传入）
export const initPermissions = () => {
  const permissions = localStorage.getItem('permissions');
  if (permissions) {
    permissionList = JSON.parse(permissions);
  }
};

// 判断是否有权限
export const hasPermission = (permission: string | string[]): boolean => {
  if (!permission) return true;

  if (Array.isArray(permission)) {
    return permission.some((p) => permissionList.includes(p));
  }

  return permissionList.includes(permission);
};

// 判断是否有任意一个权限
export const hasAnyPermission = (permissions: string[]): boolean => {
  return permissions.some((p) => permissionList.includes(p));
};

// 判断是否有所有权限
export const hasAllPermissions = (permissions: string[]): boolean => {
  return permissions.every((p) => permissionList.includes(p));
};
```

在组件中使用：

```tsx
import { hasPermission } from '@/utils/permission';

export default function UserList() {
  return (
    <div>
      {hasPermission('react:user:create') && (
        <Button type="primary">新建用户</Button>
      )}

      {hasPermission('react:user:edit') && <Button>编辑</Button>}

      {hasPermission('react:user:delete') && <Button danger>删除</Button>}
    </div>
  );
}
```

#### 4.2 React 路由守卫

在 `app.tsx` 中实现路由守卫：

```typescript
import { history } from 'umi';
import { hasPermission } from '@/utils/permission';

// 路由守卫
export function onRouteChange({ location, routes, action }: any) {
  // 获取当前路由配置
  const route = routes.find((r: any) => r.path === location.pathname);

  // 检查权限
  if (route?.permission && !hasPermission(route.permission)) {
    // 无权限，跳转到 403 页面
    history.push('/403');
  }
}
```

---

## 🔧 常见问题

### Q1: 如何处理 token 过期？

主应用会自动刷新 token，React 应用需要监听 token 更新：

```typescript
vbenBridge.onMessage((message) => {
  if (message.type === 'token') {
    // 更新 token
    localStorage.setItem('token', message.data.token);
    // 更新 axios 请求头
    axios.defaults.headers.common['Authorization'] =
      `Bearer ${message.data.token}`;
  }
});
```

### Q2: 如何在 React 应用中使用主应用的 API？

有两种方式：

**方式一：共享 token，React 独立调用**

```typescript
// React 项目中
import axios from 'axios';

const request = axios.create({
  baseURL: 'https://api.yourdomain.com',
});

request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**方式二：通过主应用代理**

在主应用中暴露 API 给 React：

```typescript
// Vue 主应用
const handleReactMessage = (event: MessageEvent) => {
  if (message.type === 'api-request') {
    const { url, method, data } = message.data;
    // 调用主应用的 API
    request({ url, method, data }).then((response) => {
      sendMessageToReact({
        type: 'api-response',
        data: response,
      });
    });
  }
};
```

### Q3: 样式冲突怎么办？

React 应用使用 CSS Modules 或 CSS-in-JS 方案隔离样式：

```typescript
// umi 配置
export default {
  cssModules: {
    generateScopedName: 'react-[name]__[local]___[hash:base64:5]',
  },
};
```

### Q4: 如何调试 iframe 通信？

在浏览器控制台中：

```javascript
// 监听所有 postMessage
window.addEventListener('message', (e) => {
  console.log('Message received:', e.data);
});
```

---

## 📚 最佳实践

### 1. 统一样式风格

确保 React 应用使用与主应用一致的 Ant Design 主题：

```typescript
// React 项目 app.tsx
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

export default function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#1677ff', // 与主应用保持一致
        },
      }}
    >
      {/* 应用内容 */}
    </ConfigProvider>
  );
}
```

### 2. 错误边界

在 React 应用中添加错误边界：

```typescript
import { Component, ReactNode } from 'react';

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('React App Error:', error, errorInfo);
    // 可以通过 vbenBridge 通知主应用
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

### 3. 性能优化

- 使用 lazy loading 延迟加载 iframe
- 避免频繁的 postMessage 通信
- 使用缓存减少重复请求

---

## 🚀 部署建议

### 开发环境

- Vue 主应用：`http://localhost:5173`
- React 应用：`http://localhost:8001`

### 生产环境

**方案一：独立部署**

- Vue 主应用：`https://admin.yourdomain.com`
- React 应用：`https://react.yourdomain.com`

**方案二：同域部署（推荐）**

- 主应用：`https://admin.yourdomain.com`
- React 应用：`https://admin.yourdomain.com/react`（通过 nginx 反向代理）

Nginx 配置示例：

```nginx
server {
  listen 80;
  server_name admin.yourdomain.com;

  # Vue 主应用
  location / {
    root /var/www/vue-app;
    try_files $uri $uri/ /index.html;
  }

  # React 应用
  location /react {
    alias /var/www/react-app;
    try_files $uri $uri/ /react/index.html;
  }
}
```

---

## ✅ 验证清单

- [ ] React 应用可以独立访问
- [ ] Vue 主应用中菜单配置正确
- [ ] iframe 通信正常（token、userInfo、permissions）
- [ ] 权限控制生效
- [ ] 样式无冲突
- [ ] 生产环境部署成功

---

## 📞 技术支持

如有问题，请参考：

- [Vben Admin 文档](https://doc.vben.pro/)
- [umi 文档](https://umijs.org/)
- [Ant Design Pro 文档](https://pro.ant.design/)
