/**
 * umi 配置文件示例
 *
 * 文件位置：React 项目根目录 .umirc.ts 或 config/config.ts
 */

import { defineConfig } from 'umi';

export default defineConfig({
  // ========== 基础配置 ==========

  // 项目名称
  title: 'React 应用',

  // 如果嵌入到子路由，需要配置 base 和 publicPath
  // 例如：React 应用部署在 /react 路径下
  base: '/',
  publicPath: '/',

  // ========== 布局配置 ==========

  // 关闭 Ant Design Pro 的布局（因为主应用已有布局）
  // 如果您希望保留 React 应用自己的布局，可以设置为 true
  layout: false,

  // ========== 路由配置 ==========

  // 路由模式：browser 或 hash
  history: {
    type: 'browser',
  },

  // 路由配置
  routes: [
    {
      path: '/',
      component: '@/layouts/index',
      routes: [
        {
          path: '/',
          component: '@/pages/index',
        },
        {
          path: '/users',
          component: '@/pages/users',
          // 可以在路由上配置权限
          // permission: 'react:user:view',
        },
        {
          path: '/403',
          component: '@/pages/403',
        },
        {
          path: '/404',
          component: '@/pages/404',
        },
      ],
    },
  ],

  // ========== 开发服务器配置 ==========

  devServer: {
    port: 8001, // 开发端口
    // 允许跨域（重要：iframe 通信需要）
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  },

  // ========== 代理配置 ==========

  // 如果需要代理后端 API
  proxy: {
    '/admin-api': {
      target: 'http://127.0.0.1:48080',
      changeOrigin: true,
      // pathRewrite: { '^/admin-api': '' },
    },
  },

  // ========== 样式配置 ==========

  // CSS Modules 配置（避免样式冲突）
  cssModules: {
    generateScopedName: 'react-[name]__[local]___[hash:base64:5]',
  },

  // ========== Ant Design 配置 ==========

  antd: {
    // 使用 Ant Design
    // 可以配置主题
    theme: {
      // 与主应用保持一致的主题色
      '@primary-color': '#1677ff',
    },
  },

  // ========== 构建配置 ==========

  // 输出目录
  outputPath: 'dist',

  // 生产环境构建配置
  chunks: ['vendors', 'umi'],
  chainWebpack(config: any) {
    // 生产环境优化
    config.optimization.splitChunks({
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          name: 'vendors',
        },
        antd: {
          test: /[\\/]node_modules[\\/]antd[\\/]/,
          priority: 20,
          name: 'antd',
        },
      },
    });
  },

  // ========== 其他配置 ==========

  // 国际化配置（可选）
  locale: {
    default: 'zh-CN',
    antd: true,
  },

  // 按需加载
  dynamicImport: {
    loading: '@/components/Loading',
  },

  // 忽略 moment 的 locale 文件，减小打包体积
  ignoreMomentLocale: true,

  // Fast Refresh 配置
  fastRefresh: {},
});
