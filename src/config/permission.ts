/**
 * 权限配置文件
 * 用于配置特定页面的访问权限（基于角色）
 */

import { useUserStore } from '@/stores';
import { getUserRoleNames } from '@/utils/user.ts';

/**
 * 权限配置接口
 */
export interface PermissionConfig {
  /** 路由路径 */
  path: string;
  /** 允许访问的角色列表 */
  allowedRoles: string[];
  /** 权限描述 */
  description?: string;
}

/**
 * 页面权限配置列表
 * 在这里配置需要特殊权限控制的页面
 */
export const PAGE_PERMISSIONS: PermissionConfig[] = [
  {
    path: '/admin/modelManage',
    allowedRoles: ['admin'],
    description: '模型管理 - 仅限管理员访问',
  },
  {
    path: '/admin/poolManage',
    allowedRoles: ['admin'],
    description: '号池管理页面 - 仅限管理员访问',
  },
  {
    path: '/admin/poolMonitor',
    allowedRoles: ['admin'],
    description: '系统统计 - 仅限管理员访问',
  },
  {
    path: '/admin/system-statistics',
    allowedRoles: ['admin'],
    description: '公告管理页面 - 仅限管理员访问',
  },
  {
    path: '/admin/announcement',
    allowedRoles: ['admin'],
    description: '公告管理页面 - 仅限管理员访问',
  },
  {
    path: '/admin/message-log',
    allowedRoles: ['admin'],
    description: '使用日志 - 仅限管理员访问',
  },
  {
    path: '/admin',
    allowedRoles: ['admin'],
    description: '系统管理入口 - 仅限管理员访问',
  },
  // 可以在这里继续添加其他需要权限控制的页面
  // {
  //   path: '/console/vip-feature',
  //   allowedRoles: ['意心ai-vip', '意心ai-企业', '管理员'],
  //   description: 'VIP功能页面',
  // },
];

/**
 * 检查用户是否有权限访问指定路径
 * @param path 路由路径
 * @returns 是否有权限
 */
export function checkPagePermission(path: string): boolean {
  // 如果用户名称是cc直接放行
  const userStore = useUserStore();
  // 用户名等于cc直接放行
  if (userStore.userInfo?.user?.userName === 'cc') {
    return true;
  }

  const userRoles = getUserRoleNames();

  // 查找该路径的权限配置
  const permissionConfig = PAGE_PERMISSIONS.find(config => config.path === path);

  // 如果没有配置权限，说明该页面不需要特殊权限，返回true
  if (!permissionConfig) {
    return true;
  }

  // 检查用户的任一角色是否在允许列表中（不区分大小写）
  return userRoles.some(userRole =>
    permissionConfig.allowedRoles.some(
      allowedRole => allowedRole.toLowerCase() === userRole.toLowerCase(),
    ),
  );
}

/**
 * 获取用户无权访问的路由列表
 * @param userRoles 用户角色列表
 * @returns 无权访问的路由路径数组
 */
export function getRestrictedRoutes(userRoles: string[] | undefined): string[] {
  if (!userRoles || userRoles.length === 0) {
    return PAGE_PERMISSIONS.map(config => config.path);
  }

  return PAGE_PERMISSIONS.filter(
    config => !userRoles.some(userRole =>
      config.allowedRoles.some(
        allowedRole => allowedRole.toLowerCase() === userRole.toLowerCase(),
      ),
    ),
  ).map(config => config.path);
}

/**
 * 检查路由是否需要权限控制
 * @param path 路由路径
 * @returns 是否需要权限控制
 */
export function isRestrictedRoute(path: string): boolean {
  return PAGE_PERMISSIONS.some(config => config.path === path);
}

/**
 * 过滤菜单路由，移除用户无权访问的菜单项
 * @param routes 路由配置数组
 * @param userRoles 用户角色列表
 * @returns 过滤后的路由配置数组
 */
export function filterMenuRoutes(routes: any[], userRoles: string[] | undefined): any[] {
  return routes.filter((route) => {
    // 检查当前路由是否有权限
    const hasPermission = checkPagePermission(route.path);

    if (!hasPermission) {
      return false;
    }

    // 如果有子路由，递归过滤
    if (route.children && route.children.length > 0) {
      route.children = filterMenuRoutes(route.children, userRoles);
    }

    return true;
  });
}
