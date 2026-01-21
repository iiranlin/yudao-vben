import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          '/admin-api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/admin-api/, ''),
            // mock代理目标地址
            // target: 'http://192.168.110.233:48080/admin-api',
            target: 'http://120.46.222.240:18017/admin-api',
            ws: true,
          },
        },
      },
    },
  };
});
