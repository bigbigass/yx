import type { RouteRecordRaw } from 'vue-router';

// 预加载辅助函数
function preloadComponent(importFn: () => Promise<any>) {
  return () => {
    // 在开发环境下直接返回
    if (import.meta.env.DEV) {
      return importFn();
    }
    // 生产环境下可以添加缓存逻辑
    return importFn();
  };
}

// LayoutRouter[布局路由]
export const layoutRouter: RouteRecordRaw[] = [
  {
    path: '/',
    component: preloadComponent(() => import('@/layouts/index.vue')),
    children: [
      // 将首页重定向逻辑放在这里
      {
        path: '',
        redirect: '/chat/conversation',
      },

      // chat 路由组 - 修正路径和重定向
      {
        path: 'chat',
        name: 'chat',
        component: () => import('@/pages/chat/index.vue'),
        redirect: '/chat/conversation',
        meta: {
          title: 'AI应用',
          icon: 'HomeFilled',
        },
        children: [
          {
            path: 'conversation',
            name: 'chatConversation',
            component: () => import('@/pages/chat/conversation/index.vue'),
            meta: {
              title: '意心Ai-AI对话',
              isDefaultChat: true,
            },
          },
          {
            path: 'conversation/:id',
            name: 'chatConversationWithId',
            component: () => import('@/pages/chat/conversation/index.vue'),
            meta: {
              title: '意心Ai-AI对话',
              isDefaultChat: false,
            },
          },
          {
            path: 'image',
            name: 'chatImage',
            component: () => import('@/pages/chat/image/index.vue'),
            meta: {
              title: '意心Ai-AI图片',
            },
          },
          {
            path: 'video',
            name: 'chatVideo',
            component: () => import('@/pages/chat/video/index.vue'),
            meta: {
              title: '意心Ai-AI视频',
            },
          },
          {
            path: 'agent',
            name: 'monitor',
            component: () => import('@/pages/chat/agent/index.vue'),
            meta: {
              title: '意心Ai-AI智能体',
            },
          },
          {
            path: 'api',
            name: 'chatApi',
            component: () => import('@/pages/chat/api/index.vue'),
            meta: {
              title: '意心Ai-AI接口',
            },
          },
          {
            path: 'yxcode',
            name: 'chatYxcode',
            component: () => import('@/pages/chat/yxcode/index.vue'),
            meta: {
              title: '意心Ai-意心Code',
            },
          },
        ],
      },

      // CodingPlan 秒杀页（未登录可访问）
      {
        path: 'coding-plan',
        name: 'codingPlan',
        component: () => import('@/pages/coding-plan/index.vue'),
        meta: {
          title: '意心Ai-CodingPlan',
          keepAlive: 0,
          isDefaultChat: false,
          layout: 'default',
        },
      },

      // 产品页面
      {
        path: 'products',
        name: 'products',
        component: () => import('@/pages/products/index.vue'),
        meta: {
          title: '意心Ai-产品页面',
          keepAlive: 0,
          isDefaultChat: false,
          layout: 'blankPage',
        },
      },

      // 模型库
      {
        path: 'model-library',
        name: 'modelLibrary',
        component: () => import('@/pages/modelLibrary/index.vue'),
        meta: {
          title: '意心Ai-模型库',
          keepAlive: 0,
          isDefaultChat: false,
          layout: 'default',
        },
      },

      // API密钥用量查询（免登录）
      {
        path: 'apikey-usage',
        name: 'apikeyUsage',
        component: () => import('@/pages/apikey-usage/index.vue'),
        meta: {
          title: '意心Ai-API密钥用量查询',
          keepAlive: 0,
          isDefaultChat: false,
          layout: 'default',
        },
      },

      // 排行榜
      {
        path: 'ranking',
        name: 'ranking',
        component: () => import('@/pages/ranking/index.vue'),
        meta: {
          title: '意心Ai全球大模型实时排行榜（编程）',
          keepAlive: 0,
          isDefaultChat: false,
          layout: 'default',
        },
      },

      // 支付结果
      {
        path: 'pay-result',
        name: 'payResult',
        component: () => import('@/pages/payResult/index.vue'),
        meta: {
          title: '意心Ai-支付结果',
          keepAlive: 0,
          isDefaultChat: false,
          layout: 'default',
        },
      },

      // 活动详情
      {
        path: 'activity/:id',
        name: 'activityDetail',
        component: () => import('@/pages/activity/detail.vue'),
        meta: {
          title: '意心Ai-活动详情',
          isDefaultChat: false,
          layout: 'blankPage',
        },
      },

      // 公告详情
      {
        path: 'announcement/:id',
        name: 'announcementDetail',
        component: () => import('@/pages/announcement/detail.vue'),
        meta: {
          title: '意心Ai-公告详情',
          isDefaultChat: false,
          layout: 'blankPage',
        },
      },

      // 控制台路由组 - 修正路径和重定向
      {
        path: 'console',
        name: 'console',
        component: () => import('@/pages/console/index.vue'),
        redirect: '/console/user',
        meta: {
          title: '意心Ai-控制台',
          icon: 'Setting',
          layout: 'default',
        },
        children: [
          {
            path: 'user',
            name: 'consoleUser',
            component: () => import('@/components/userPersonalCenter/components/UserManagement.vue'),
            meta: {
              title: '意心Ai-用户信息',
            },
          },
          {
            path: 'apikey',
            name: 'consoleApikey',
            component: () => import('@/components/userPersonalCenter/components/APIKeyManagement.vue'),
            meta: {
              title: '意心Ai-API密钥',
            },
          },
          {
            path: 'recharge-log',
            name: 'consoleRechargeLog',
            component: () => import('@/components/userPersonalCenter/components/RechargeLog.vue'),
            meta: {
              title: '意心Ai-充值记录',
            },
          },
          {
            path: 'usage',
            name: 'consoleUsage',
            component: () => import('@/components/userPersonalCenter/components/UsageStatistics.vue'),
            meta: {
              title: '意心Ai-用量统计',
            },
          },
          {
            path: 'premium',
            name: 'consolePremium',
            component: () => import('@/components/userPersonalCenter/components/PremiumService.vue'),
            meta: {
              title: '意心Ai-尊享服务',
            },
          },
          {
            path: 'daily-task',
            name: 'consoleDailyTask',
            component: () => import('@/components/userPersonalCenter/components/DailyTask.vue'),
            meta: {
              title: '意心Ai-每日任务',
            },
          },
          {
            path: 'invite',
            name: 'consoleInvite',
            component: () => import('@/components/userPersonalCenter/components/CardFlipActivity.vue'),
            meta: {
              title: '意心Ai-每周邀请',
            },
          },
          {
            path: 'activation',
            name: 'consoleActivation',
            component: () => import('@/components/userPersonalCenter/components/ActivationCode.vue'),
            meta: {
              title: '意心Ai-激活码兑换',
            },
          },
          {
            path: 'coding-plan',
            name: 'consoleCodingPlan',
            component: () => import('@/components/userPersonalCenter/components/CodingPlanManagement.vue'),
            meta: {
              title: '意心Ai-CodingPlan 套餐',
            },
          },
          {
            path: 'message-log',
            name: 'consoleMessageLog',
            component: () => import('@/components/userPersonalCenter/components/MessageLog.vue'),
            meta: {
              title: '意心Ai-使用日志',
            },
          },
        ],
      },

      // 系统管理路由组（仅管理员可访问）
      {
        path: 'admin',
        name: 'admin',
        component: () => import('@/pages/admin/index.vue'),
        redirect: '/admin/modelManage',
        meta: {
          title: '意心Ai-系统管理',
          icon: 'Tools',
          layout: 'default',
        },
        children: [
          {
            path: 'modelManage',
            name: 'adminModelManage',
            component: () => import('@/pages/admin/modelManage/index.vue'),
            meta: {
              title: '意心Ai-模型管理',
            },
          },
          {
            path: 'poolManage',
            name: 'adminPoolManage',
            component: () => import('@/pages/admin/poolManage/index.vue'),
            meta: {
              title: '意心Ai-号池管理',
            },
          },
          {
            path: 'poolMonitor',
            name: 'adminPoolMonitor',
            component: () => import('@/pages/admin/poolMonitor/index.vue'),
            meta: {
              title: '意心Ai-号池监控',
            },
          },
          {
            path: 'system-statistics',
            name: 'adminSystemStatistics',
            component: () => import('@/pages/admin/system-statistics/index.vue'),
            meta: {
              title: '意心Ai-系统统计',
            },
          },
          {
            path: 'announcement',
            name: 'adminAnnouncement',
            component: () => import('@/pages/admin/announcement/index.vue'),
            meta: {
              title: '意心Ai-公告管理',
            },
          },
          {
            path: 'message-log',
            name: 'adminMessageLog',
            component: () => import('@/pages/admin/message-log/index.vue'),
            meta: {
              title: '意心Ai-使用日志',
            },
          },
        ],
      },
    ],
  },
];
// staticRouter[静态路由]
export const staticRouter: RouteRecordRaw[] = [
  // FontAwesome 测试页面
  {
    path: '/test/fontawesome',
    name: 'testFontAwesome',
    component: () => import('@/pages/test/fontawesome.vue'),
    meta: {
      title: 'FontAwesome图标测试',
    },
  },
];

// errorRouter (错误页面路由)
export const errorRouter = [
  {
    path: '/403',
    name: '403',
    component: () => import('@/pages/error/403.vue'),
    meta: {
      title: '403页面',
      enName: '403 Page', // 英文名称
      icon: 'QuestionFilled', // 菜单图标
      isHide: '1', // 代表路由在菜单中是否隐藏，是否隐藏[0隐藏，1显示]
      isLink: '1', // 是否外链[有值则是外链]
      isKeepAlive: '0', // 是否缓存路由数据[0是，1否]
      isFull: '1', // 是否缓存全屏[0是，1否]
      isAffix: '1', // 是否缓存固定路由[0是，1否]
    },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/pages/error/404.vue'),
    meta: {
      title: '404页面',
      enName: '404 Page', // 英文名称
      icon: 'CircleCloseFilled', // 菜单图标
      isHide: '1', // 代表路由在菜单中是否隐藏，是否隐藏[0隐藏，1显示]
      isLink: '1', // 是否外链[有值则是外链]
      isKeepAlive: '0', // 是否缓存路由数据[0是，1否]
      isFull: '1', // 是否缓存全屏[0是，1否]
      isAffix: '1', // 是否缓存固定路由[0是，1否]
    },
  },
  // 找不到path将跳转404页面
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/pages/error/404.vue'),
  },
];
