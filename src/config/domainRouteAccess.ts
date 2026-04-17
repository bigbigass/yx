export type DomainRouteAccessMode = 'allow-all' | 'allow-only';

export interface DomainRouteAccessRule {
  /**
   * 规则名称，仅用于区分配置
   */
  name: string;
  /**
   * 完整 origin，例如 https://ai.ccnetcore.com
   */
  origins?: string[];
  /**
   * host，包含端口，例如 localhost:17001
   */
  hosts?: string[];
  /**
   * hostname，不包含端口，例如 yxai.chat
   */
  hostnames?: string[];
  /**
   * allow-all: 当前域名下不限制路由
   * allow-only: 当前域名下仅允许 allowedRoutes 中的路由
   */
  mode: DomainRouteAccessMode;
  /**
   * 允许访问的路由，支持静态路径、:id 形式动态路径和 * 通配
   */
  allowedRoutes?: string[];
  /**
   * 当前域名下前端内部“首页”路径，用于页面内跳转
   */
  homePath?: string;
  homeUrl?: string;
}

export interface DomainRouteAccessConfig {
  /**
   * 未命中任何规则时的默认模式
   */
  defaultMode: DomainRouteAccessMode;
  /**
   * defaultMode 为 allow-only 时生效
   */
  defaultAllowedRoutes?: string[];
  /**
   * 未命中任何规则时的默认首页
   */
  defaultHomePath: string;
  defaultHomeUrl?: string;
  /**
   * 域名访问规则
   */
  rules: DomainRouteAccessRule[];
}

interface CurrentLocationLike {
  origin?: string;
  host?: string;
  hostname?: string;
}

const INTERNAL_ALLOWED_ROUTES = ['/404'];

/**
 * 域名访问控制配置
 *
 * 可按实际部署域名继续扩展：
 * 1. 主站域名使用 allow-all
 * 2. 专用域名使用 allow-only，并配置 allowedRoutes
 */
export const DOMAIN_ROUTE_ACCESS_CONFIG: DomainRouteAccessConfig = {
  defaultMode: 'allow-only',
  defaultAllowedRoutes: ['/pay-result'],
  defaultHomePath: '/pay-result',
  rules: [
    {
      name: 'main-site',
      hostnames: ['yxai.chat'],
      mode: 'allow-all',
      homePath: '/',
    },
    // {
    //   name: 'local-dev',
    //   hosts: ['localhost:17001'],
    //   mode: 'allow-only',
    //   allowedRoutes: ['/pay-result'],
    //   homePath: '/pay-result',
    //   homeUrl: 'https://yxai.chat/',
    //
    // },
    {
      name: 'local-dev',
      hosts: ['localhost:17001'],
      mode: 'allow-all',
      homePath: '/',
    },
    // {
    //   name: 'payment-callback-site',
    //   hostnames: ['ai.ccnetcore.com'],
    //   mode: 'allow-all',
    //   homePath: '/',
    // },

    {
      name: 'payment-callback-site',
      hostnames: ['ai.ccnetcore.com'],
      mode: 'allow-only',
      allowedRoutes: ['/pay-result'],
      homePath: '/pay-result',
      homeUrl: 'https://yxai.chat/',
    },
  ],
};

function normalizeText(value?: string) {
  return (value || '').trim().toLowerCase();
}

function normalizePath(path: string) {
  if (!path) {
    return '/';
  }

  if (path === '/') {
    return '/';
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return normalizedPath.replace(/\/+$/, '') || '/';
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function isRoutePatternMatch(pattern: string, path: string) {
  const normalizedPattern = normalizePath(pattern);
  const normalizedPath = normalizePath(path);

  if (normalizedPattern === '*') {
    return true;
  }

  const segments = normalizedPattern.split('/').filter(Boolean);
  const regexSource = segments.length === 0
    ? '^/$'
    : `^/${segments.map((segment) => {
      if (segment === '*') {
        return '.*';
      }

      if (segment.startsWith(':')) {
        return '[^/]+';
      }

      return escapeRegExp(segment);
    }).join('/')}$`;

  return new RegExp(regexSource, 'i').test(normalizedPath);
}

function isRuleMatched(rule: DomainRouteAccessRule, currentLocation: CurrentLocationLike) {
  const currentOrigin = normalizeText(currentLocation.origin);
  const currentHost = normalizeText(currentLocation.host);
  const currentHostname = normalizeText(currentLocation.hostname);

  const matchOrigin = rule.origins?.some(origin => normalizeText(origin) === currentOrigin);
  const matchHost = rule.hosts?.some(host => normalizeText(host) === currentHost);
  const matchHostname = rule.hostnames?.some(hostname => normalizeText(hostname) === currentHostname);

  return Boolean(matchOrigin || matchHost || matchHostname);
}

function getMatchedDomainRouteRule(currentLocation: CurrentLocationLike = window.location) {
  return DOMAIN_ROUTE_ACCESS_CONFIG.rules.find(rule => isRuleMatched(rule, currentLocation));
}

function isAllowedByMode(mode: DomainRouteAccessMode, allowedRoutes: string[] | undefined, path: string) {
  if (INTERNAL_ALLOWED_ROUTES.some(allowedPath => isRoutePatternMatch(allowedPath, path))) {
    return true;
  }

  if (mode === 'allow-all') {
    return true;
  }

  return (allowedRoutes || []).some(allowedPath => isRoutePatternMatch(allowedPath, path));
}

export function isDomainRouteAccessible(path: string, currentLocation: CurrentLocationLike = window.location) {
  const matchedRule = getMatchedDomainRouteRule(currentLocation);

  if (!matchedRule) {
    return isAllowedByMode(
      DOMAIN_ROUTE_ACCESS_CONFIG.defaultMode,
      DOMAIN_ROUTE_ACCESS_CONFIG.defaultAllowedRoutes,
      path,
    );
  }

  return isAllowedByMode(matchedRule.mode, matchedRule.allowedRoutes, path);
}

export function getDomainHomePath(currentLocation: CurrentLocationLike = window.location) {
  const matchedRule = getMatchedDomainRouteRule(currentLocation);
  return matchedRule?.homePath || DOMAIN_ROUTE_ACCESS_CONFIG.defaultHomePath;
}

export function getDomainHomeTarget(currentLocation: CurrentLocationLike = window.location) {
  const matchedRule = getMatchedDomainRouteRule(currentLocation);
  return matchedRule?.homeUrl
    || matchedRule?.homePath
    || DOMAIN_ROUTE_ACCESS_CONFIG.defaultHomeUrl
    || DOMAIN_ROUTE_ACCESS_CONFIG.defaultHomePath;
}
