import type { RequestConfig } from 'hook-fetch';
import FingerprintJS from '@fingerprintjs/fingerprintjs'; // 新增指纹库
import { ElMessage } from 'element-plus';
import hookFetch from 'hook-fetch';
import { sseTextDecoderPlugin } from 'hook-fetch/plugins';
import router from '@/routers';
import { useUserStore } from '@/stores';

// 初始化指纹（单例模式）
const fpPromise = FingerprintJS.load();

// 获取浏览器指纹（缓存结果）
async function getFingerprint(): Promise<string> {
  const fp = await fpPromise;
  const { visitorId } = await fp.get();
  return visitorId;
}

// 标准响应格式
interface BaseResponse<T = any> {
  code: number;
  data: T;
  msg: string;
}

declare module 'hook-fetch' {
  interface HookFetchDefaults {
    response: any;
  }
}

export const request = hookFetch.create<BaseResponse>({
  baseURL: import.meta.env.VITE_WEB_BASE_API,
  headers: {
    'Content-Type': 'application/json',
  },
  plugins: [
    sseTextDecoderPlugin({ json: true, prefix: 'data:' }),
    {
      name: 'fingerprint-plugin', // 新增指纹插件
      beforeRequest: async (config) => {
        try {
          const fingerprint = await getFingerprint();
          config.headers = new Headers(config.headers);
          config.headers.set('X-Fingerprint', fingerprint);
        }
        catch (error) {
          console.error('Failed to generate fingerprint:', error);
        }
        return config;
      },
    },
    {
      name: 'adapt-array-response',
      afterResponse: async (response) => {
        if (typeof response.result?.code === 'number') {
          return response;
        }
        return {
          ...response,
          result: {
            code: 200,
            data: response.result,
            msg: 'success',
          },
        };
      },
    },
  ],
});

// JWT插件（保持原有逻辑）
function jwtPlugin(): {
  onError: (error: any) => Promise<void>;
  name: string;
  beforeRequest: (config: any) => Promise<RequestConfig<unknown, unknown, unknown>>;
  afterResponse: (response: any) => Promise<any>;
  beforeStream: (body: any, config: any) => Promise<void>;
} {
  return {
    name: 'jwt',
    beforeRequest: async (config) => {
      // 延迟获取 store，确保 Pinia 已经初始化
      const userStore = useUserStore();
      config.headers = new Headers(config.headers);
      if (userStore.refreshToken) {
        config.headers.set('refresh_token', `${userStore.refreshToken}`);
      }
      if (userStore.token) {
        config.headers.set('authorization', `Bearer ${userStore.token}`);
      }

      return config;
    },

    // 响应后处理
    afterResponse: async (response: any) => {
      // 延迟获取 store，确保 Pinia 已经初始化
      const userStore = useUserStore();
      if (response.response.headers.get('access_token')) {
        userStore.setToken(response.response.headers.get('access_token'), response.response.headers.get('refresh_token'));
      }

      if (response.result?.code === 200)
        return response;

      if (response.result?.code === 403) {
        router.replace({ name: '403' });
        ElMessage.error(response.result?.msg);
        return Promise.reject(response);
      }

      if (response.result?.code === 401) {
        ElMessage.error('登录已过期，请重新登录');
        userStore.logout();
        userStore.openLoginDialog();
      }

      ElMessage.error(response.result?.msg);
      return Promise.reject(response);
    },

    onError: async (error) => {
      // 延迟获取 store，确保 Pinia 已经初始化
      const userStore = useUserStore();
      if (error.status === 403) {
        const data = await (error.response.json());
        const msg = data?.error?.message;
        // 有业务 message 的 403（如"已有套餐"）透传给调用方处理，不弹全局 toast
        // 已经有codingplan的时候，返回了422，单独处理
        if (data?.error?.code === '422') {
          return Promise.reject(data?.error);
        }

        if (msg) {
          return Promise.reject(new Error(msg));
        }
        ElMessage.error(msg || '无权限');
        return Promise.reject(new Error(msg || '无权限'));
      }

      if (error.status === 401) {
        ElMessage.error('登录已过期，请重新登录！');

        // 弹窗提示
        userStore.logout();
        userStore.openLoginDialog();
      }
    },
  };
}

request.use(jwtPlugin());

// 导出方法（保持原有）
export const post = request.post;
export const get = request.get;
export const put = request.put;
export const del = request.delete;
export default request;
