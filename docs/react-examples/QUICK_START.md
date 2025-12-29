# React 项目快速开始

本文档提供快速接入指南，帮助您快速将 React + umi + Ant Design Pro 项目接入到 Vben Admin 系统。

## 📦 前置准备

### 1. 确认项目结构

确保您的 React 项目具备以下结构：

```
react-project/
├── src/
│   ├── pages/           # 页面
│   ├── components/      # 组件
│   ├── utils/           # 工具函数
│   │   ├── vbenBridge.ts   # 👈 需要创建
│   │   └── permission.ts   # 👈 需要创建
│   ├── app.tsx          # 👈 需要修改
│   └── ...
├── .umirc.ts           # 👈 需要修改
└── package.json
```

### 2. 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

---

## 🚀 快速接入（5 步）

### 步骤 1: 复制桥接文件

从文档示例中复制以下文件到您的 React 项目：

1. **复制 vbenBridge.ts**  
   位置：`docs/react-examples/vbenBridge.ts` → `src/utils/vbenBridge.ts`

2. **复制 permission.ts**  
   位置：`docs/react-examples/permission.ts` → `src/utils/permission.ts`

### 步骤 2: 修改 umi 配置

编辑 `.umirc.ts` 或 `config/config.ts`：

```typescript
import { defineConfig } from 'umi';

export default defineConfig({
  // 关闭 Ant Design Pro 布局（使用主应用布局)
  layout: false,

  // 开发服务器端口
  devServer: {
    port: 8001,
    // ⚠️ 重要：允许跨域
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },

  // CSS Modules（避免样式冲突）
  cssModules: {
    generateScopedName: 'react-[name]__[local]___[hash:base64:5]',
  },

  // 其他配置...
});
```

### 步骤 3: 修改 app.tsx

在 `src/app.tsx` 中添加 Vben 桥接初始化：

```typescript
import { useEffect } from 'react';
import { vbenBridge } from '@/utils/vbenBridge';
import { initPermissions } from '@/utils/permission';

export function rootContainer(container: any) {
  const WrappedContainer = () => {
    useEffect(() => {
      // 监听主应用消息
      vbenBridge.on('init', (data) => {
        // 保存 token
        if (data.token) {
          localStorage.setItem('token', data.token);
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
    }, []);

    return container;
  };

  return <WrappedContainer />;
}
```

### 步骤 4: 启动 React 项目

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

确保项目运行在 `http://localhost:8001`

### 步骤 5: 在主应用中配置菜单

在 Vben Admin 的后端管理系统中添加菜单：

**系统管理 → 菜单管理 → 新增菜单**

```json
{
  "name": "React应用",
  "path": "/react-app",
  "component": "react/index",
  "icon": "ant-design:react-outlined",
  "meta": {
    "title": "React应用",
    "frameSrc": "http://localhost:8001"
  },
  "permissions": ["react:app:view"]
}
```

---

## ✅ 验证接入

### 1. 检查通信

在浏览器控制台查看日志：

```
[VbenBridge] 初始化完成，主应用地址: http://localhost:5666
[VbenBridge] 已通知主应用 React 准备就绪
[App] 收到初始化数据: { token: "...", userInfo: {...}, permissions: [...] }
```

### 2. 检查权限

在 React 组件中测试权限：

```tsx
import { hasPermission } from '@/utils/permission';

export default function TestPage() {
  console.log('权限列表:', localStorage.getItem('permissions'));
  console.log('是否有权限:', hasPermission('react:app:view'));

  return <div>权限测试</div>;
}
```

### 3. 检查 Token

测试 API 请求是否携带 token：

```typescript
import axios from 'axios';

const request = axios.create({
  baseURL: 'http://127.0.0.1:48080/admin-api',
});

request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 测试请求
request.get('/system/user/profile').then((res) => {
  console.log('用户信息:', res.data);
});
```

---

## 🎯 常见使用场景

### 场景 1: 按钮权限控制

```tsx
import { hasPermission } from '@/utils/permission';
import { Button } from 'antd';

export default function UserList() {
  return (
    <div>
      {hasPermission('react:user:create') && (
        <Button type="primary">新建用户</Button>
      )}

      {hasPermission('react:user:delete') && <Button danger>删除</Button>}
    </div>
  );
}
```

### 场景 2: 路由跳转到主应用

```tsx
import { vbenBridge } from '@/utils/vbenBridge';
import { Button } from 'antd';

export default function SomePage() {
  const handleNavigate = () => {
    // 跳转到主应用的某个页面
    vbenBridge.navigate('/system/user');
  };

  return <Button onClick={handleNavigate}>跳转到用户管理</Button>;
}
```

### 场景 3: 退出登录

```tsx
import { vbenBridge } from '@/utils/vbenBridge';
import { Button } from 'antd';

export default function Header() {
  const handleLogout = () => {
    vbenBridge.logout();
  };

  return <Button onClick={handleLogout}>退出登录</Button>;
}
```

---

## 📚 更多资源

- [完整接入指南](./react-integration-guide.md)
- [权限使用示例](./react-examples/PermissionExample.tsx)
- [umi 配置示例](./react-examples/.umirc.example.ts)

---

## ❓ 常见问题

### Q1: iframe 无法加载？

**A:** 检查以下几点：

1. React 项目是否运行在 `http://localhost:8001`
2. 菜单配置中的 `frameSrc` 是否正确
3. 浏览器控制台是否有跨域错误

### Q2: 收不到主应用消息？

**A:** 检查：

1. `vbenBridge.ts` 中的 `mainAppOrigin` 是否正确
2. 浏览器控制台是否有安全策略错误
3. 是否正确初始化了 `rootContainer`

### Q3: 权限判断不生效？

**A:** 检查：

1. 是否调用了 `initPermissions()`
2. localStorage 中是否有 `permissions` 数据
3. 权限标识是否与后端配置一致

### Q4: 样式冲突？

**A:** 确保配置了 CSS Modules：

```typescript
cssModules: {
  generateScopedName: 'react-[name]__[local]___[hash:base64:5]',
}
```

---

## 🎉 接入完成

恭喜！您已成功将 React 项目接入到 Vben Admin 系统。

现在您可以：

- ✅ 在主应用中访问 React 模块
- ✅ 统一管理菜单和权限
- ✅ 共享用户登录状态
- ✅ 独立开发和部署 React 应用
