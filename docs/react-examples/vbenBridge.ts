/**
 * Vben Admin 主应用通信桥接
 *
 * 使用说明：
 * 1. 在 React 项目的入口文件（如 app.tsx）中导入并初始化
 * 2. 监听主应用消息以获取 token、用户信息、权限等
 * 3. 通过桥接方法与主应用通信
 */

interface VbenMessage {
  type: 'init' | 'token' | 'userInfo' | 'permissions' | 'navigate' | 'logout';
  data: any;
}

interface TokenData {
  token: string;
  refreshToken?: string;
}

interface UserInfo {
  id: number | string;
  username: string;
  nickname?: string;
  avatar?: string;
  email?: string;
  mobile?: string;
  [key: string]: any;
}

class VbenBridge {
  private mainAppOrigin: string;
  private listeners: Map<string, Array<(data: any) => void>> = new Map();
  private isReady: boolean = false;

  constructor() {
    // 检测是否在 iframe 中
    const isInIframe = window.location !== window.parent.location;

    if (isInIframe) {
      // 从 referrer 获取主应用地址
      const referrer = document.referrer;
      this.mainAppOrigin = referrer
        ? new URL(referrer).origin
        : window.location.origin;
    } else {
      // 不在 iframe 中，使用当前域名
      this.mainAppOrigin = window.location.origin;
    }

    console.log('[VbenBridge] 初始化完成，主应用地址:', this.mainAppOrigin);

    // 监听主应用消息
    this.setupMessageListener();

    // 通知主应用 React 已准备就绪
    this.notifyReady();
  }

  /**
   * 设置消息监听器
   */
  private setupMessageListener() {
    window.addEventListener('message', (event) => {
      // 验证来源
      if (event.origin !== this.mainAppOrigin) {
        console.warn('[VbenBridge] 收到非法来源消息:', event.origin);
        return;
      }

      const message = event.data;
      if (message.source !== 'vben-app') {
        return;
      }

      console.log('[VbenBridge] 收到主应用消息:', message);

      // 触发对应类型的监听器
      const listeners = this.listeners.get(message.type);
      if (listeners && listeners.length > 0) {
        listeners.forEach((callback) => callback(message.data));
      }
    });
  }

  /**
   * 通知主应用 React 已准备就绪
   */
  private notifyReady() {
    this.postMessage({ type: 'ready', data: null });
    this.isReady = true;
    console.log('[VbenBridge] 已通知主应用 React 准备就绪');
  }

  /**
   * 向主应用发送消息
   */
  private postMessage(message: VbenMessage) {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(
        { source: 'react-app', ...message },
        this.mainAppOrigin,
      );
    }
  }

  /**
   * 监听指定类型的消息
   */
  on(type: string, callback: (data: any) => void) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type)!.push(callback);
  }

  /**
   * 移除消息监听
   */
  off(type: string, callback: (data: any) => void) {
    const listeners = this.listeners.get(type);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * 请求主应用的 token
   */
  requestToken() {
    console.log('[VbenBridge] 请求 token');
    this.postMessage({ type: 'token', data: null });
  }

  /**
   * 请求主应用的用户信息
   */
  requestUserInfo() {
    console.log('[VbenBridge] 请求用户信息');
    this.postMessage({ type: 'userInfo', data: null });
  }

  /**
   * 请求主应用的权限列表
   */
  requestPermissions() {
    console.log('[VbenBridge] 请求权限列表');
    this.postMessage({ type: 'permissions', data: null });
  }

  /**
   * 通知主应用导航到指定路由
   */
  navigate(path: string, query?: Record<string, any>) {
    console.log('[VbenBridge] 导航到:', path, query);
    this.postMessage({
      type: 'navigate',
      data: { path, query },
    });
  }

  /**
   * 通知主应用退出登录
   */
  logout() {
    console.log('[VbenBridge] 请求退出登录');
    this.postMessage({ type: 'logout', data: null });
  }

  /**
   * 检查是否在 iframe 中
   */
  isInIframe(): boolean {
    return window.location !== window.parent.location;
  }

  /**
   * 获取主应用地址
   */
  getMainAppOrigin(): string {
    return this.mainAppOrigin;
  }
}

// 导出单例
export const vbenBridge = new VbenBridge();
export default vbenBridge;

// 同时导出类型
export type { VbenMessage, TokenData, UserInfo };
