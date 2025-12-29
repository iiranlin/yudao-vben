# React 项目接入文档思路

本目录包含将 React + umi + Ant Design Pro 项目接入到 yudao-ui-admin-vben 系统的完整文档和示例代码。

## 📚 文档列表

### 核心文档

1. **[快速开始](./react-examples/QUICK_START.md)** ⭐️ 推荐首先阅读  
   快速接入指南,5 步完成接入

2. **[完整接入指南](./react-integration-guide.md)**  
   详细的接入方案、配置说明和最佳实践

### 示例代码

在 `react-examples/` 目录下:

- **vbenBridge.ts** - Vben 主应用通信桥接工具
- **permission.ts** - 权限判断工具
- **app.tsx** - React 项目入口文件示例
- **PermissionExample.tsx** - 权限使用示例
- **.umirc.example.ts** - umi 配置文件示例

## 🚀 快速开始

### 1. Vue 主应用配置

主应用已经准备好以下文件:

- ✅ `/apps/web-antd/src/components/ReactBridge.vue` - iframe 通信组件
- ✅ `/apps/web-antd/src/views/react/index.vue` - React 应用视图页面
- ✅ `.env.development` - 开发环境配置（React 应用地址）
- ✅ `.env.production` - 生产环境配置（React 应用地址）

### 2. React 项目配置

需要在您的 React 项目中完成以下操作:

#### Step 1: 复制工具文件

```bash
# 复制桥接工具
cp docs/react-examples/vbenBridge.ts <your-react-project>/src/utils/

# 复制权限工具
cp docs/react-examples/permission.ts <your-react-project>/src/utils/
```

#### Step 2: 修改配置文件

参考 `react-examples/.umirc.example.ts` 修改您的 `.umirc.ts`:

```typescript
export default defineConfig({
  layout: false, // 关闭 Ant Design Pro 布局
  devServer: {
    port: 8001,
    headers: {
      'Access-Control-Allow-Origin': '*', // 允许跨域
    },
  },
});
```

#### Step 3: 修改 app.tsx

参考 `react-examples/app.tsx` 添加 Vben 桥接初始化代码

#### Step 4: 启动项目

```bash
cd <your-react-project>
npm run dev  # 确保运行在 http://localhost:8001
```

### 3. 后端菜单配置

在后端系统管理中添加菜单:

```json
{
  "name": "React应用",
  "path": "/react-app",
  "component": "react/index",
  "icon": "ant-design:react-outlined",
  "meta": {
    "frameSrc": "http://localhost:8001"
  },
  "permissions": ["react:app:view"]
}
```

### 4. 访问测试

1. 启动 Vue 主应用: `pnpm dev`
2. 启动 React 应用: `npm run dev`
3. 访问主应用并查看 React 模块菜单

## 🎯 核心功能

### ✅ 已实现

- [x] iframe 嵌入 React 应用
- [x] 主应用与 React 应用通信（postMessage）
- [x] Token 共享和自动更新
- [x] 用户信息共享
- [x] 权限列表同步
- [x] 权限判断工具
- [x] 路由导航通信
- [x] 环境变量配置
- [x] 完整文档和示例

### 📋 架构说明

```
┌─────────────────────────────────────────────────┐
│  Vue 主应用 (yudao-ui-admin-vben)              │
│  - 菜单管理                                     │
│  - 权限管理                                     │
│  - 用户登录                                     │
│  - 布局框架                                     │
│  │                                              │
│  ├─ ReactBridge.vue (通信组件)                │
│  │  ↓↑ postMessage                           │
│  └────────────────────────────┐               │
│        iframe                │               │
│        ┌────────────────────────────────────┐│
│        │ React 应用                         ││
│        │ - vbenBridge.ts (通信工具)        ││
│        │ - permission.ts (权限判断)        ││
│        │ - 业务页面                         ││
│        └────────────────────────────────────┘│
└─────────────────────────────────────────────────┘
```

## 📖 使用示例

### 权限判断

```tsx
import { hasPermission } from '@/utils/permission';

export default function UserList() {
  return (
    <div>
      {hasPermission('react:user:create') && (
        <Button type="primary">新建</Button>
      )}
    </div>
  );
}
```

### 路由导航

```tsx
import { vbenBridge } from '@/utils/vbenBridge';

// 跳转到主应用页面
vbenBridge.navigate('/system/user');
```

### 退出登录

```tsx
import { vbenBridge } from '@/utils/vbenBridge';

// 通知主应用退出登录
vbenBridge.logout();
```

## 🔧 配置说明

### 环境变量

**开发环境** (`.env.development`):

```bash
VITE_REACT_APP_URL=http://localhost:8001
```

**生产环境** (`.env.production`):

```bash
VITE_REACT_APP_URL=https://react.yourdomain.com
```

### 菜单配置

菜单中的 `frameSrc` 会覆盖环境变量中的地址:

```json
{
  "meta": {
    "frameSrc": "http://localhost:8001/custom-path"
  }
}
```

## 📝 注意事项

1. **跨域问题**: React 项目必须配置 CORS 允许主应用访问
2. **端口冲突**: 确保 React 应用运行在 8001 端口
3. **样式隔离**: 使用 CSS Modules 避免样式冲突
4. **权限同步**: 权限标识必须与后端配置一致
5. **通信安全**: postMessage 会验证来源,确保安全

## 🚀 部署建议

### 开发环境

- Vue 主应用: `http://localhost:5666`
- React 应用: `http://localhost:8001`

### 生产环境

**方案一: 独立部署**

- Vue 主应用: `https://admin.yourdomain.com`
- React 应用: `https://react.yourdomain.com`

**方案二: 同域部署（推荐）**

- Vue 主应用: `https://admin.yourdomain.com`
- React 应用: `https://admin.yourdomain.com/react`

## ❓ 常见问题

详见 [快速开始文档](./react-examples/QUICK_START.md#常见问题)

## 📞 技术支持

- [Vben Admin 文档](https://doc.vben.pro/)
- [umi 文档](https://umijs.org/)
- [Ant Design Pro 文档](https://pro.ant.design/)

---

**最后更新**: 2025-12-29
