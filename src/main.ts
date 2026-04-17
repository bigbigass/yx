// 引入ElementPlus所有图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import { createApp, nextTick } from 'vue';
import ElementPlusX from 'vue-element-plus-x';
import App from './App.vue';
import { logBuildInfo } from './config/version';
import router from './routers';
import store from './stores';
import 'element-plus/dist/index.css';
import './styles/index.scss';
import 'virtual:uno.css';
import 'virtual:svg-icons-register';

// 创建 Vue 应用
const app = createApp(App);

// 安装插件
app.use(router);
app.use(store);
app.use(ElementPlusX);

// 注册所有 Element Plus 图标（临时方案，后续迁移到 fontawesome）
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 输出构建信息（使用统一版本配置）
logBuildInfo();

// 挂载 Vue 应用
app.mount('#app');

/**
 * 检查页面是否真正渲染完成
 * 改进策略：
 * 1. 等待多个 requestAnimationFrame 确保浏览器完成绘制
 * 2. 检查关键元素是否存在且有实际内容
 * 3. 检查关键 CSS 是否已应用
 * 4. 给予最小展示时间，避免闪烁
 */
function waitForPageRendered(): Promise<void> {
  return new Promise((resolve) => {
    const minDisplayTime = 800; // 最小展示时间 800ms，避免闪烁
    const maxWaitTime = 8000; // 最大等待时间 8 秒
    const startTime = Date.now();

    const checkRender = () => {
      const elapsed = Date.now() - startTime;
      const appElement = document.getElementById('app');

      // 检查关键条件
      const hasContent = appElement?.children.length > 0;
      const hasVisibleHeight = (appElement?.offsetHeight || 0) > 200;
      const hasRouterView = document.querySelector('.layout-container') !== null
        || document.querySelector('.el-container') !== null
        || document.querySelector('#app > div') !== null;

      const isRendered = hasContent && hasVisibleHeight && hasRouterView;
      const isMinTimeMet = elapsed >= minDisplayTime;
      const isTimeout = elapsed >= maxWaitTime;

      if ((isRendered && isMinTimeMet) || isTimeout) {
        // 再多给一帧时间确保稳定
        requestAnimationFrame(() => {
          requestAnimationFrame(() => resolve());
        });
      }
      else {
        requestAnimationFrame(checkRender);
      }
    };

    // 等待 Vue 更新和浏览器绘制
    nextTick(() => {
      requestAnimationFrame(() => {
        setTimeout(checkRender, 100);
      });
    });
  });
}

// 第一阶段：Vue 应用已挂载
if (typeof window.__hideAppLoader === 'function') {
  window.__hideAppLoader('mounted');
}

// 等待页面真正渲染完成后再通知第二阶段
waitForPageRendered().then(() => {
  if (typeof window.__hideAppLoader === 'function') {
    window.__hideAppLoader('rendered');
  }
});
