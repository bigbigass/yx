import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useNProgress } from '@vueuse/integrations/useNProgress';
import { ElMessage } from 'element-plus';
import { createRouter, createWebHistory } from 'vue-router';
import { ROUTER_WHITE_LIST } from '@/config';
import { isDomainRouteAccessible, isRoutePatternMatch } from '@/config/domainRouteAccess';
import { checkPagePermission } from '@/config/permission';
import { errorRouter, layoutRouter, staticRouter } from '@/routers/modules/staticRouter';
import { useUserStore } from '@/stores';
import { useDesignStore } from '@/stores/modules/design';

const { start, done } = useNProgress(0, {
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.3,
  easing: 'ease',
  speed: 500,
});

const router = createRouter({
  history: createWebHistory(),
  routes: [...layoutRouter, ...staticRouter, ...errorRouter],
  strict: false,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

const preloadedComponents = new Set();

function preloadRouteComponents() {
  const coreRoutes = [
    '/chat/conversation',
    '/chat/image',
    '/chat/video',
    '/chat/agent',
    '/console/user',
    '/model-library',
  ];

  setTimeout(() => {
    coreRoutes.forEach((path) => {
      const route = router.resolve(path);
      if (route.matched.length === 0) {
        return;
      }

      const component = route.matched[route.matched.length - 1].components?.default;
      if (typeof component !== 'function' || preloadedComponents.has(component)) {
        return;
      }

      preloadedComponents.add(component);
      requestIdleCallback?.(() => {
        (component as () => Promise<any>)().catch(() => {});
      }) || setTimeout(() => {
        (component as () => Promise<any>)().catch(() => {});
      }, 100);
    });
  }, 2000);
}

if (typeof window !== 'undefined') {
  window.addEventListener('load', preloadRouteComponents);
}

function isRouteWhitelisted(path: string) {
  return ROUTER_WHITE_LIST.some(whitePath => isRoutePatternMatch(whitePath, path));
}

router.beforeEach(
  async (
    to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext,
  ) => {
    start();

    if (!isDomainRouteAccessible(to.path)) {
      return next({ path: '/404', replace: true });
    }

    document.title = (to.meta.title as string) || (import.meta.env.VITE_WEB_TITLE as string);

    const layout = to.meta?.layout || 'default';
    setTimeout(() => {
      try {
        const designStore = useDesignStore();
        designStore._setLayout(layout);
      }
      catch {
        // Ignore store initialization errors during early navigation.
      }
    }, 0);

    if (isRouteWhitelisted(to.path)) {
      return next();
    }

    let userStore;
    try {
      userStore = useUserStore();
    }
    catch {
      return next();
    }

    if (!userStore.token) {
      userStore.clearUserInfo();
      return next({ path: '/', replace: true });
    }

    const hasPermission = checkPagePermission(to.path);
    if (!hasPermission) {
      ElMessage.warning('您没有权限访问该页面');
      return next({ path: '/403', replace: true });
    }

    next();
  },
);

router.onError((error) => {
  done();
  console.warn('路由错误', error.message);
});

router.afterEach(() => {
  done();
});

export default router;
