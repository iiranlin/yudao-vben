<template>
  <div class="react-bridge-container">
    <iframe
      ref="iframeRef"
      :src="iframeSrc"
      frameborder="0"
      class="react-iframe"
      @load="onIframeLoad"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useAccessStore, useUserStore } from '@vben/stores';

const route = useRoute();
const router = useRouter();
const iframeRef = ref<HTMLIFrameElement>();
const accessStore = useAccessStore();
const userStore = useUserStore();

// 从路由 meta 中获取 frameSrc，优先使用环境变量
const iframeSrc = computed(() => {
  const frameSrc = route.meta.frameSrc as string;
  if (frameSrc) {
    return frameSrc;
  }
  // 降级到环境变量
  return import.meta.env.VITE_REACT_APP_URL || 'http://localhost:8001';
});

// iframe 加载完成回调
const onIframeLoad = () => {
  console.log('[ReactBridge] React 应用已加载');
  // 主动发送初始数据
  setTimeout(() => {
    sendMessageToReact({
      type: 'init',
      data: {
        token: accessStore.accessToken,
        refreshToken: accessStore.refreshToken,
        userInfo: userStore.userInfo,
        permissions: accessStore.accessCodes,
      },
    });
  }, 100);
};

// 向 React 应用发送消息
const sendMessageToReact = (message: any) => {
  if (iframeRef.value?.contentWindow) {
    try {
      const origin = new URL(iframeSrc.value).origin;
      iframeRef.value.contentWindow.postMessage(
        { source: 'vben-app', ...message },
        origin,
      );
      console.log('[ReactBridge] 发送消息到 React:', message);
    } catch (error) {
      console.error('[ReactBridge] 发送消息失败:', error);
    }
  }
};

// 处理 React 应用消息
const handleReactMessage = (event: MessageEvent) => {
  // 验证来源
  try {
    const iframeOrigin = new URL(iframeSrc.value).origin;
    if (event.origin !== iframeOrigin) {
      return;
    }
  } catch {
    return;
  }

  const message = event.data;
  if (message.source !== 'react-app') {
    return;
  }

  console.log('[ReactBridge] 收到 React 消息:', message);

  switch (message.type) {
    case 'ready':
      // React 应用准备就绪
      console.log('[ReactBridge] React 应用准备就绪');
      onIframeLoad();
      break;
    case 'token':
      // React 请求 token
      sendMessageToReact({
        type: 'token',
        data: {
          token: accessStore.accessToken,
          refreshToken: accessStore.refreshToken,
        },
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
    case 'navigate': {
      // React 请求路由导航
      const { path, query } = message.data;
      router.push({ path, query });
      break;
    }
    case 'logout':
      // React 请求退出登录
      // TODO: 调用主应用的退出登录逻辑
      console.warn('[ReactBridge] React 请求退出登录');
      break;
    default:
      console.warn('[ReactBridge] 未知消息类型:', message.type);
  }
};

onMounted(() => {
  window.addEventListener('message', handleReactMessage);
  console.log('[ReactBridge] 组件已挂载，iframe 地址:', iframeSrc.value);
});

onUnmounted(() => {
  window.removeEventListener('message', handleReactMessage);
  console.log('[ReactBridge] 组件已卸载');
});
</script>

<style scoped>
.react-bridge-container {
  position: relative;
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
